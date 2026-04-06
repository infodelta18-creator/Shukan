import { Email } from "@convex-dev/auth/providers/Email";
import { Resend } from "resend";

export const ResendOTP = Email({
  id: "resend-otp",
  maxAge: 60 * 20, // 20 minutes
  async generateVerificationToken() {
    const code = Array.from(crypto.getRandomValues(new Uint8Array(4)))
      .map((b) => (b % 10).toString())
      .join("");
    return code.padStart(8, "0").slice(0, 8);
  },
  async sendVerificationRequest({ identifier: email, token }) {
    const resend = new Resend(process.env.AUTH_RESEND_KEY);
    const { error } = await resend.emails.send({
      from: "Shukan <noreply@shukan.app>",
      to: [email],
      subject: `Your Shukan login code: ${token}`,
      text: `Your verification code is: ${token}\n\nThis code expires in 20 minutes.`,
    });
    if (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});
