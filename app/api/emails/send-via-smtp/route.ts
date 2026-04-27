export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

type EmailPayload = {
  to: string
  subject: string
  html: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, html } = body as Partial<EmailPayload>

    if (!to || !subject || !html) {
      return NextResponse.json({ ok: false, error: "Missing required fields: to, subject, or html" }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    // Send email
    const info = await transporter.sendMail({
      from: `"Sweet Car Hire" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    })

    console.log("[v0] Email sent:", info.messageId)

    return NextResponse.json({ ok: true, messageId: info.messageId })
  } catch (error) {
    console.error("[v0] SMTP error:", error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to send email via SMTP",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed. Use POST." }, { status: 405 })
}
