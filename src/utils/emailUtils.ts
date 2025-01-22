export function extractCtaLink(emailBody: string): string {
    const regex = /(https:\/\/example\.com\/cta\/[^\s"]+)/;
    const match = emailBody.match(regex);
    return match ? match[0] : "";
  }
  