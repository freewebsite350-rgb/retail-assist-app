// lib/meta/comment.ts
import { PlatformCommentEvent, NormalizedCommentEvent } from './types';

export function detectCommentEvent(body: any): {
  isComment: boolean;
  platform: 'facebook' | 'instagram' | null;
  data?: NormalizedCommentEvent;
} {
  // Facebook/Instagram webhook event normalization
  try {
    // Facebook Page comment
    if (body.entry && Array.isArray(body.entry)) {
      for (const entry of body.entry) {
        if (entry.changes && Array.isArray(entry.changes)) {
          for (const change of entry.changes) {
            if (change.field === 'feed' && change.value && change.value.item === 'comment') {
              return {
                isComment: true,
                platform: 'facebook',
                data: normalizeFacebookComment(change.value, entry.id),
              };
            }
            // Instagram comment
            if (change.field === 'comments' && change.value && change.value.media) {
              return {
                isComment: true,
                platform: 'instagram',
                data: normalizeInstagramComment(change.value, entry.id),
              };
            }
          }
        }
      }
    }
  } catch (e) {
    // ignore
  }
  return { isComment: false, platform: null };
}

function normalizeFacebookComment(value: any, pageId: string): NormalizedCommentEvent {
  return {
    platform: 'facebook',
    pageId,
    commentId: value.comment_id,
    postId: value.post_id,
    senderId: value.from && value.from.id,
    senderName: value.from && value.from.name,
    message: value.message,
    isFromPage: value.from && value.from.id === pageId,
    raw: value,
  };
}

function normalizeInstagramComment(value: any, igBusinessId: string): NormalizedCommentEvent {
  return {
    platform: 'instagram',
    pageId: igBusinessId,
    commentId: value.comment_id,
    postId: value.media && value.media.id,
    senderId: value.from && value.from.id,
    senderName: value.from && value.from.username,
    message: value.text,
    isFromPage: value.from && value.from.id === igBusinessId,
    raw: value,
  };
}
