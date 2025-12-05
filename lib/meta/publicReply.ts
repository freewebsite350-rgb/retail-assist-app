// lib/meta/publicReply.ts
import { Platform } from './types';

interface SendPublicReplyArgs {
  platform: Platform;
  pageId: string;
  commentId: string;
  message: string;
}

export async function sendPublicReply({ platform, pageId, commentId, message }: SendPublicReplyArgs) {
  const PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN;
  if (!PAGE_ACCESS_TOKEN) throw new Error('Missing PAGE_ACCESS_TOKEN');

  let url = '';
  if (platform === 'facebook' || platform === 'instagram') {
    url = `https://graph.facebook.com/v21.0/${commentId}/comments`;
  } else {
    throw new Error('Unsupported platform');
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Meta public reply error: ${err}`);
  }
  return await res.json();
}
