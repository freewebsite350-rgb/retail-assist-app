// lib/meta/types.ts

export type Platform = 'facebook' | 'instagram';

export interface NormalizedCommentEvent {
  platform: Platform;
  pageId: string;
  commentId: string;
  postId: string;
  senderId: string;
  senderName?: string;
  message: string;
  isFromPage: boolean;
  raw: any;
}

export interface AutomationRule {
  id: string;
  workspace_id: string;
  trigger_words: string[];
  public_reply_template: string;
  dm_message_template: string;
  ai_enabled: boolean;
  enabled: boolean;
  created_at: string;
}
