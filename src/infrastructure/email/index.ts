import { resendEmailService } from "./resend.service";
import type { EmailService } from "./email.service";

export function createEmailService(): EmailService {
  return resendEmailService;
}

export type { EmailService };
