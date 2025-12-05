import { Platform } from '@/lib/meta/types';

interface SendDmArgs {
  platform: Platform;
  recipientId: string;
  message: string;
  pageAccessToken: string;
}

export async function sendDm({ platform, recipientId, message, pageAccessToken }: SendDmArgs) {
  const url = `https://graph.facebook.com/v21.0/${recipientId}/messages`;
  const body = {
    messaging_type: 'RESPONSE',
    message: { text: message },
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pageAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Meta DM error: ${await res.text()}`);
  }
  return await res.json();
}
