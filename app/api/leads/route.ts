import { NextResponse } from "next/server";
import { z } from "zod";
import { saveMarketingLead } from "@/lib/leads-store";

const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Проверьте поля формы", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const result = await saveMarketingLead({
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
    company: data.company || undefined,
    message: data.message || undefined,
    source: "landing",
  });

  return NextResponse.json({
    ok: true,
    id: result.lead.id,
    emailSent: result.email.sent,
    amocrmPushed: result.amocrm.pushed,
  });
}
