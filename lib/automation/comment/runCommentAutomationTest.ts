import { NormalizedCommentEvent, AutomationRule } from '@/lib/meta/types';
import { isTriggerMatch } from './isTriggerMatch';

interface RunCommentAutomationTestArgs {
  workspaceId: string;
  comment: NormalizedCommentEvent;
  rule: AutomationRule;
  aiAgent?: (input: string) => Promise<string>;
}

export async function runCommentAutomationTest({ workspaceId, comment, rule, aiAgent }: RunCommentAutomationTestArgs) {
  let dmMessage = rule.dm_message_template;
  let status = '';
  let publicReply = null;
  let dmResult = null;
  let inboxEscalation = null;

  if (!isTriggerMatch(comment, rule.trigger_words)) {
    status = 'no-trigger-match';
    return { ok: true, status };
  }

  if (rule.ai_enabled && aiAgent) {
    try {
      dmMessage = await aiAgent(comment.message);
    } catch (e) {
      dmMessage = rule.dm_message_template;
    }
  }

  // Simulate public reply
  publicReply = {
    commentId: comment.commentId,
    message: rule.public_reply_template,
  };
  status = 'public-reply-sent';

  // Simulate DM
  try {
    dmResult = {
      recipientId: comment.senderId,
      message: dmMessage,
    };
    status = 'dm-sent';
  } catch (e) {
    status = 'dm-failed';
    inboxEscalation = {
      commentId: comment.commentId,
      username: comment.senderName || '',
      content: 'User commented but DM failed. Public reply sent.',
    };
    status = 'inbox-escalation';
  }

  return {
    ok: true,
    publicReply,
    dmResult,
    inboxEscalation,
    status,
  };
}
