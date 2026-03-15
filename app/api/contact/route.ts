import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { contactSchema } from "@/lib/validations/contact";
import {
  getClientIp,
  checkRateLimit,
  incrementRateLimit,
} from "@/lib/rate-limit";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { limited, remaining, resetAt } = checkRateLimit(ip);

    if (limited) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
          },
        },
      );
    }

    const body = await request.json();

    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.errors[0];
      const message = firstError?.message ?? "Invalid form data";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { name, email, subject, message } = result.data;

    const gmailUser = process.env.GMAIL_USER;
    if (!gmailUser) {
      console.error("GMAIL_USER is not configured");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 },
      );
    }

    incrementRateLimit(ip);

    const mailOptions = {
      from: {
        name: "Contact Form",
        address: gmailUser,
      },
      to: gmailUser,
      replyTo: email,
      subject: subject
        ? `[Contact] ${subject} - from ${name}`
        : `[Contact] Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #000000; margin: 0;">New Contact Form Submission</h2>
            <p style="color: #64748b; margin-top: 5px;">${new Date().toLocaleString("en-US")}</p>
          </div>

          <div style="background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
            <div style="margin-bottom: 20px;">
              <h3 style="color: #1e293b; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;">
                Contact Information
              </h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; width: 120px;">Name:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 500;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Email:</td>
                  <td style="padding: 8px 0; color: #1e293b;">
                    <a href="mailto:${email}" style="color: #000000; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                ${subject ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Subject:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${subject}</td>
                </tr>
                ` : ""}
              </table>
            </div>

            <div>
              <h3 style="color: #1e293b; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;">
                Message
              </h3>
              <div style="color: #1e293b; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            </div>
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">
              Reply directly to this email to respond to ${name}.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      {
        status: 200,
        headers: {
          "X-RateLimit-Remaining": String(remaining),
        },
      },
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
