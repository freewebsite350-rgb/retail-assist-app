import { createClient } from '@/lib/supabase/server';

interface EscalateToInboxArgs {
  workspaceId: string;
  commentId: string;
  username: string;
  content: string;
}

export async function escalateToInbox({ workspaceId, commentId, username, content }: EscalateToInboxArgs) {
  const supabase = createClient();
  await supabase.from('messages').insert({
    workspace_id: workspaceId,
    user_id: null,
    source: 'comment-fallback',
    content,
    metadata: { comment_id: commentId, username },
  });
}
