import { promises as fs } from "fs";
import path from "path";
import nodemailer from "nodemailer";

export type MarketingLead = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source: string;
  createdAt: string;
};

export type SaveLeadResult = {
  lead: MarketingLead;
  email: { sent: boolean; reason?: string };
  amocrm: { pushed: boolean; reason?: string; contactId?: string };
};

const LEADS_FILE = path.join(process.cwd(), ".data", "marketing-leads.json");

async function ensureStore(): Promise<MarketingLead[]> {
  try {
    const raw = await fs.readFile(LEADS_FILE, "utf8");
    const parsed = JSON.parse(raw) as MarketingLead[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function envFlag(name: string): boolean {
  const v = (process.env[name] || "").trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

/**
 * Notify LEADS_NOTIFY_EMAIL via SMTP (same env names as core: SMTP_HOST/PORT/USER/PASSWORD/FROM).
 * If SMTP_HOST is unset — logs and returns sent:false (dev-safe).
 */
export async function notifyLeadByEmail(
  lead: MarketingLead
): Promise<{ sent: boolean; reason?: string }> {
  const to = (process.env.LEADS_NOTIFY_EMAIL || "").trim();
  if (!to) {
    return { sent: false, reason: "LEADS_NOTIFY_EMAIL unset" };
  }

  const host = (process.env.SMTP_HOST || "").trim();
  if (!host) {
    console.info("[leads] email notify skipped (SMTP_HOST unset)", {
      to,
      leadId: lead.id,
    });
    return { sent: false, reason: "SMTP_HOST unset" };
  }

  const port = Number(process.env.SMTP_PORT || 587) || 587;
  const user = (process.env.SMTP_USER || "").trim();
  const pass = (process.env.SMTP_PASSWORD || "").trim();
  const from =
    (process.env.SMTP_FROM || "").trim() ||
    user ||
    "noreply@deskpoint.ru";

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user ? { user, pass } : undefined,
  });

  const subject = `[Deskpoint lead] ${lead.name}${lead.company ? ` · ${lead.company}` : ""}`;
  const text = [
    `Новая заявка с лендинга`,
    ``,
    `Имя: ${lead.name}`,
    `Email: ${lead.email}`,
    `Телефон: ${lead.phone || "—"}`,
    `Компания: ${lead.company || "—"}`,
    `Сообщение: ${lead.message || "—"}`,
    `Источник: ${lead.source}`,
    `ID: ${lead.id}`,
    `Создано: ${lead.createdAt}`,
  ].join("\n");

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    replyTo: lead.email,
  });

  console.info("[leads] email sent", { to, leadId: lead.id });
  return { sent: true };
}

/**
 * Optional: push contact to amoCRM via crm-sync (gap-part-3 live path).
 * Requires LEADS_TO_AMOCRM=true + CRM_SYNC_URL + CRM_SYNC_INTERNAL_SECRET + LEADS_AMO_TEAM_ID.
 */
export async function pushLeadToAmoCrm(
  lead: MarketingLead
): Promise<{ pushed: boolean; reason?: string; contactId?: string }> {
  if (!envFlag("LEADS_TO_AMOCRM")) {
    return { pushed: false, reason: "LEADS_TO_AMOCRM off" };
  }

  const base = (
    process.env.CRM_SYNC_URL ||
    process.env.CRM_SYNC_BASE_URL ||
    "http://127.0.0.1:4900"
  ).replace(/\/$/, "");
  const secret = (process.env.CRM_SYNC_INTERNAL_SECRET || "").trim();
  const teamId = (process.env.LEADS_AMO_TEAM_ID || "").trim();

  if (!secret) {
    return { pushed: false, reason: "CRM_SYNC_INTERNAL_SECRET unset" };
  }
  if (!teamId) {
    return { pushed: false, reason: "LEADS_AMO_TEAM_ID unset" };
  }

  try {
    const res = await fetch(`${base}/v1/crm/${encodeURIComponent(teamId)}/leads`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-internal-secret": secret,
      },
      body: JSON.stringify({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        message: lead.message,
        source: lead.source,
        leadId: lead.id,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    const json = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      contactId?: string;
      error?: { message?: string } | string;
    };
    if (!res.ok) {
      const msg =
        typeof json.error === "string"
          ? json.error
          : json.error?.message || `HTTP ${res.status}`;
      console.warn("[leads] amoCRM push failed", msg);
      return { pushed: false, reason: msg };
    }
    return {
      pushed: true,
      contactId: json.contactId,
    };
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn("[leads] amoCRM push error", reason);
    return { pushed: false, reason };
  }
}

/**
 * Persist lead (file/memory) + email notify + optional amoCRM.
 * Prisma MarketingLead in core remains a future SoT (see TZ_GAPS).
 */
export async function saveMarketingLead(
  input: Omit<MarketingLead, "id" | "createdAt" | "source"> & {
    source?: string;
  }
): Promise<SaveLeadResult> {
  const lead: MarketingLead = {
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email,
    phone: input.phone,
    company: input.company,
    message: input.message,
    source: input.source ?? "landing",
    createdAt: new Date().toISOString(),
  };

  const mode = (process.env.LEADS_STORE || "file").toLowerCase();

  if (mode === "memory") {
    console.info("[leads] memory store", { id: lead.id });
  } else if (mode !== "none") {
    const existing = await ensureStore();
    existing.push(lead);
    await fs.mkdir(path.dirname(LEADS_FILE), { recursive: true });
    await fs.writeFile(LEADS_FILE, JSON.stringify(existing, null, 2), "utf8");
    console.info("[leads] saved to file", { id: lead.id, path: LEADS_FILE });
  }

  const email = await notifyLeadByEmail(lead);
  const amocrm = await pushLeadToAmoCrm(lead);

  return { lead, email, amocrm };
}
