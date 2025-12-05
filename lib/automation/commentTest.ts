// lib/automation/commentTest.ts
import { NormalizedCommentEvent } from '@/lib/meta/types';
import { createClient } from '@/lib/supabase/server';

interface RunCommentAutomationArgs {
  event: NormalizedCommentEvent;
  platform: 'facebook' | 'instagram';
  raw: any;
}

export async function runCommentAutomationTest({ event, platform, raw }: RunCommentAutomationArgs) {
  if (event.isFromPage) {
    return { ok: true, ignored: true, reason: 'from page itself' };
  }
  const supabase = createClient();
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id, meta_page_id')
    .eq('meta_page_id', event.pageId)
    .single();
  if (!workspace) {
    return { ok: false, ignored: true, reason: 'workspace not found' };
  }
  const { data: rule } = await supabase
    .from('comment_automation_rules')
    .select('*')
    .eq('workspace_id', workspace.id)
    .eq('enabled', true)
    .maybeSingle();
  if (!rule) {
    return { ok: true, ignored: true, reason: 'no automation rule' };
  }
  const text = (event.message || '').toLowerCase();
  const matched =
    !rule.trigger_words ||
    rule.trigger_words.length === 0 ||
    rule.trigger_words.some((w: string) => text.includes(w.toLowerCase()));
  if (!matched) {
    return { ok: true, ignored: true, reason: 'no trigger word match' };
  }
  // Simulate DM and public reply
  return {
    ok: true,
    wouldSendDm: true,
    wouldSendPublicReply: rule.send_public_reply && rule.public_reply_template ? true : false,
    auto_reply_message: rule.auto_reply_message,
    public_reply_template: rule.public_reply_template,
  };
}
