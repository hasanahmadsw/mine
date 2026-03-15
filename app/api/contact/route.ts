import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required" },
        { status: 400 },
      );
    }

    const companyMailOptions = {
      from: {
        name: "Hasan Ahmad Contact Form",
        address: process.env.SMTP_FROM as string,
      },
      to: process.env.CONTACT_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #000000; margin: 0;">New Contact Form Submission</h2>
            <p style="color: #64748b; margin-top: 5px;">Received on ${new Date().toLocaleString()}</p>
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
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Subject:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${subject || "Not specified"}</td>
                </tr>
              </table>
            </div>

            <div>
              <h3 style="color: #1e293b; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;">
                Message
              </h3>
              <div style="color: #1e293b; line-height: 1.5; white-space: pre-wrap;">${message}</div>
            </div>
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">
              This is an automated message from your website contact form.
            </p>
            <p style="color: #64748b; font-size: 14px; margin: 4px 0 0 0;">
              Reply directly to this email to respond to ${name}.
            </p>
          </div>
        </div>
      `,
    };

    const customerMailOptions = {
      from: {
        name: "Hasan Ahmad",
        address: process.env.SMTP_FROM as string,
      },
      to: email,
      subject: "Thank you for contacting Hasan Ahmad",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000000;">Thank you for contacting Hasan Ahmad</h2>
          
          <p>Dear ${name},</p>
          
          <p>We have received your message and appreciate you taking the time to write to us. Our team will review your inquiry and get back to you as soon as possible.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Message Details:</h3>
            <p><strong>Subject:</strong> ${subject || "Not specified"}</p>
            <p><strong>Your Message:</strong></p>
            <p style="color: #4b5563;">${message}</p>
          </div>
          
          <p>If you have any immediate questions, you can reach us at:</p>
          <ul style="list-style: none; padding: 0;">
            <li>📞 Phone: +971 50 883 8637</li>
            <li>📧 Email: hsn@blendlab.ae</li>
          </ul>
          
          <p style="color: #6b7280; font-size: 0.875rem; margin-top: 40px;">
            Best regards,<br>
            Hasan Ahmad
          </p>
        </div>
      `,
    };

    await Promise.all([
      transporter.sendMail(companyMailOptions),
      transporter.sendMail(customerMailOptions),
    ]);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
