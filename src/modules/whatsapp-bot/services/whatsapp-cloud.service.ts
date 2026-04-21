import { logger } from "../../../core/logger";

type SendTextMessageArgs = {
  to: string;
  body: string;
};

function getWhatsAppConfig() {
  const phoneNumberId = process.env.WA_PHONE_NUMBER_ID;
  const accessToken = process.env.WA_ACCESS_TOKEN;
  const apiVersion = process.env.WA_API_VERSION ?? "v18.0";

  return { phoneNumberId, accessToken, apiVersion };
}

export async function sendTextMessage({ to, body }: SendTextMessageArgs) {
  const { phoneNumberId, accessToken, apiVersion } = getWhatsAppConfig();

  if (!phoneNumberId || !accessToken) {
    logger.warn(
      "WhatsApp config missing. Set WA_PHONE_NUMBER_ID and WA_ACCESS_TOKEN.",
    );
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    // Send the WhatsApp message to the user.
    const res = await fetch(
      `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body },
        }),
        signal: controller.signal,
      },
    );

    // If the message is not sent, log the error and return.
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      logger.error("Failed to send WhatsApp message", {
        status: res.status,
        statusText: res.statusText,
        responseText: text,
      });
    }
  } catch (error) {
    logger.error("Failed to send WhatsApp message", error);
  } finally {
    clearTimeout(timeout);
  }
}
