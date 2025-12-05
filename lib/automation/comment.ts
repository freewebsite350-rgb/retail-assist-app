// lib/automation/comment.ts
import { NormalizedCommentEvent, AutomationRule } from '@/lib/meta/types';
import { sendDm } from '@/lib/meta/sendDm';
import { sendPublicReply } from '@/lib/meta/publicReply';
import { createServerSupabaseClient } from '@/lib/supabase/server';

interface RunCommentAutomationArgs {
  event: NormalizedCommentEvent;
  platform: 'facebook' | 'instagram';
  raw: any;
}

export async function runCommentAutomation({ event, platform, raw }: RunCommentAutomationArgs) {
  // 1. Ignore if comment is from the page itself
  if (event.isFromPage) {
    return { ok: true, ignored: true, reason: 'from page itself' };
  }

  // 2. Find workspace by pageId (assume mapping exists)
  const supabase = await createServerSupabaseClient();
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id, meta_page_id')
    .eq('meta_page_id', event.pageId)
    .single();
  if (!workspace) {
    return { ok: false, ignored: true, reason: 'workspace not found' };
  }

  // 3. Get automation rule
  const { data: rule } = await supabase
    .from('comment_automation_rules')
    .select('*')
    .eq('workspace_id', workspace.id)
    .eq('enabled', true)
    .maybeSingle();
  if (!rule) {
    return { ok: true, ignored: true, reason: 'no automation rule' };
  }

  // 4. Check trigger words
  const text = (event.message || '').toLowerCase();
  const matched =
    !rule.trigger_words ||
    rule.trigger_words.length === 0 ||
    rule.trigger_words.some((w: string) => text.includes(w.toLowerCase()));
  if (!matched) {
    return { ok: true, ignored: true, reason: 'no trigger word match' };
  }

  // 5. Send DM
  let dmStatus = 'skipped';
  let publicReplyStatus = 'skipped';
  let error: string | null = null;
  try {
    await sendDm({
      platform,
      pageId: event.pageId,
      recipientId: event.senderId,
      message: rule.auto_reply_message,
    });
    dmStatus = 'sent';
  } catch (e: any) {
    dmStatus = 'error';
    error = e.message || String(e);
  }

  // 6. Optionally send public reply
  if (rule.send_public_reply && rule.public_reply_template) {
    try {
      await sendPublicReply({
        platform,
        pageId: event.pageId,
        commentId: event.commentId,
        message: rule.public_reply_template,
      });
      publicReplyStatus = 'sent';
    } catch (e: any) {
      publicReplyStatus = 'error';
      error = error || e.message || String(e);
    }
  }

  // 7. Log event
  await supabase.from('automation_logs').insert({
    workspace_id: workspace.id,
    type: 'comment-to-dm',
    raw_event: raw,
    status: dmStatus + (publicReplyStatus !== 'skipped' ? `,public:${publicReplyStatus}` : ''),
  });

  return {
    ok: true,
    dmStatus,
    publicReplyStatus,
    error,
  };
}
