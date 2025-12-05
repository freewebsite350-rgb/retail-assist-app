import { NormalizedCommentEvent } from '@/lib/meta/types';

export function isTriggerMatch(comment: NormalizedCommentEvent, triggerWords: string[]): boolean {
  if (!triggerWords || triggerWords.length === 0) return true;
  const text = (comment.message || '').toLowerCase();
  return triggerWords.some(word => text.includes(word.toLowerCase()));
}
