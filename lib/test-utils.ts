/**
 * Test Setup: Use Mock Clients
 * Import this in your files to enable mock mode
 */

export const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

export function getMockClientIfTestMode() {
  if (isTestMode) {
    console.log('[TEST MODE] Using mock Supabase client');
    return true;
  }
  return false;
}
