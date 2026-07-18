import { Resend } from "resend";

import { env } from "@/config/env";
import type { EmailService } from "./email.service";

const resend = new Resend(env.RESEND_API_KEY);

export const resendEmailService: EmailService = {
  async sendEmail(to, subject, html) {
    const { error } = await resend.emails.send({
      from: env.SMTP_FROM,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error("Failed to send email");
    }
  },
};
