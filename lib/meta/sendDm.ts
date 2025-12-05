// lib/meta/sendDm.ts
import { Platform } from './types';

interface SendDmArgs {
  platform: Platform;
  pageId: string;
  recipientId: string;
  message: string;
}

export async function sendDm({ platform, pageId, recipientId, message }: SendDmArgs) {
  // Get page access token from env or DB (for demo, use env)
  const PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN;
  if (!PAGE_ACCESS_TOKEN) throw new Error('Missing PAGE_ACCESS_TOKEN');

  let url = '';
  let body: any = {};
  if (platform === 'facebook') {
    url = `https://graph.facebook.com/v21.0/${recipientId}/messages`;
    body = {
      messaging_type: 'RESPONSE',
      message: { text: message },
    };
  } else if (platform === 'instagram') {
    url = `https://graph.facebook.com/v21.0/${recipientId}/messages`;
    body = {
      messaging_type: 'RESPONSE',
      message: { text: message },
    };
  } else {
    throw new Error('Unsupported platform');
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Meta DM error: ${err}`);
  }
  return await res.json();
}
