import { customAlphabet } from "nanoid";
import QRCode from "qrcode";

// Custom alphabet for certificate codes (excluding similar looking characters)
const certificateCodeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

// Create a custom nanoid generator for certificate codes
const generateCertificateCode = customAlphabet(certificateCodeAlphabet, 10);

/**
 * Generates a unique certificate code with LV prefix
 * Format: LV-XXXXX-XXXXX (where X is alphanumeric)
 */
export function generateUniqueCertificateCode(): string {
  const code = generateCertificateCode();
  // Split into two parts for better readability
  const part1 = code.slice(0, 5);
  const part2 = code.slice(5);
  return `LV-${part1}-${part2}`;
}

/**
 * Generates a QR code as a data URL for a certificate
 * @param certificateCode The unique certificate code
 * @param verifyUrl The base URL for certificate verification
 */
export async function generateCertificateQRCode(
  certificateCode: string,
  verifyUrl: string
): Promise<string> {
  const verificationUrl = `${verifyUrl}/verify/${certificateCode}`;

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 300,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
}

/**
 * Validates a certificate code format
 * @param code The certificate code to validate
 */
export function validateCertificateCode(code: string): boolean {
  const certificateCodeRegex = /^LV-[A-Z0-9]{5}-[A-Z0-9]{5}$/;
  return certificateCodeRegex.test(code);
}

/**
 * Formats a certificate code for display
 * @param code The certificate code to format
 */
export function formatCertificateCode(code: string): string {
  if (!validateCertificateCode(code)) {
    throw new Error("Invalid certificate code format");
  }
  return code.toUpperCase();
}

/**
 * Extracts the unique part of a certificate code (without LV prefix)
 * @param code The full certificate code
 */
export function extractCertificateCodeUniquePart(code: string): string {
  if (!validateCertificateCode(code)) {
    throw new Error("Invalid certificate code format");
  }
  return code.replace("LV-", "").replace(/-/g, "");
}
