import { NormalizedCommentEvent, AutomationRule } from '@/lib/meta/types';
import { isTriggerMatch } from './isTriggerMatch';
import { sendPublicReply } from './sendPublicReply';
import { sendDm } from './sendDm';
import { escalateToInbox } from './escalateToInbox';
import { createServerSupabaseClient } from '@/lib/supabase/server';

interface RunCommentAutomationArgs {
  workspaceId: string;
  comment: NormalizedCommentEvent;
  rule: AutomationRule;
  pageAccessToken: string;
  aiAgent?: (input: string) => Promise<string>;
}

export async function runCommentAutomation({ workspaceId, comment, rule, pageAccessToken, aiAgent }: RunCommentAutomationArgs) {
  const supabase = await createServerSupabaseClient();
  let publicReplyResult = null;
  let dmResult = null;
  let inboxEscalation = null;
  let logStatus = '';
  let dmMessage = rule.dm_message_template;

  // 1. Check trigger match
  if (!isTriggerMatch(comment, rule.trigger_words)) {
    logStatus = 'no-trigger-match';
    await supabase.from('automation_logs').insert({
      workspace_id: workspaceId,
      type: 'comment-to-dm',
      raw_event: comment.raw,
      status: logStatus,
    });
    return { ok: true, status: logStatus };
  }

  // 2. Generate DM message via AI if enabled
  if (rule.ai_enabled && aiAgent) {
    try {
      dmMessage = await aiAgent(comment.message);
    } catch (e) {
      dmMessage = rule.dm_message_template;
    }
  }

  // 3. Send public reply
  try {
    publicReplyResult = await sendPublicReply({
      platform: comment.platform,
      commentId: comment.commentId,
      message: rule.public_reply_template,
      pageAccessToken,
    });
    logStatus = 'public-reply-sent';
    await supabase.from('automation_logs').insert({
      workspace_id: workspaceId,
      type: 'comment-to-dm',
      raw_event: comment.raw,
      status: logStatus,
    });
  } catch (e: any) {
    logStatus = 'public-reply-failed';
    await supabase.from('automation_logs').insert({
      workspace_id: workspaceId,
      type: 'comment-to-dm',
      raw_event: comment.raw,
      status: logStatus,
      error: e.message || String(e),
    });
  }

  // 4. Send DM
  try {
    dmResult = await sendDm({
      platform: comment.platform,
      recipientId: comment.senderId,
      message: dmMessage,
      pageAccessToken,
    });
    logStatus = 'dm-sent';
    await supabase.from('direct_messages').insert({
      workspace_id: workspaceId,
      sender_id: comment.senderId,
      recipient_id: comment.senderId,
      message: dmMessage,
      source: 'comment-automation',
      metadata: { commentId: comment.commentId },
    });
    await supabase.from('automation_logs').insert({
      workspace_id: workspaceId,
      type: 'comment-to-dm',
      raw_event: comment.raw,
      status: logStatus,
    });
  } catch (e: any) {
    logStatus = 'dm-failed';
    await supabase.from('automation_logs').insert({
      workspace_id: workspaceId,
      type: 'comment-to-dm',
      raw_event: comment.raw,
      status: logStatus,
      error: e.message || String(e),
    });
    // 5. Escalate to inbox
    await escalateToInbox({
      workspaceId,
      commentId: comment.commentId,
      username: comment.senderName || '',
      content: 'User commented but DM failed. Public reply sent.',
    });
    inboxEscalation = true;
    await supabase.from('automation_logs').insert({
      workspace_id: workspaceId,
      type: 'comment-to-dm',
      raw_event: comment.raw,
      status: 'inbox-escalation',
    });
  }

  return {
    ok: true,
    publicReplyResult,
    dmResult,
    inboxEscalation,
    status: logStatus,
  };
}
