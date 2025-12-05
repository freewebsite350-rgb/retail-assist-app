import { Platform } from '@/lib/meta/types';

interface SendPublicReplyArgs {
  platform: Platform;
  commentId: string;
  message: string;
  pageAccessToken: string;
}

export async function sendPublicReply({ platform, commentId, message, pageAccessToken }: SendPublicReplyArgs) {
  const url = `https://graph.facebook.com/v21.0/${commentId}/comments`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pageAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    throw new Error(`Meta public reply error: ${await res.text()}`);
  }
  return await res.json();
}
