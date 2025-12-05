const assert = require('assert');

function maskApiKey(apiKey, visibleChars = 8) {
  if (!apiKey) return '';
  if (apiKey.length <= visibleChars) return apiKey;
  const visible = apiKey.slice(0, visibleChars);
  const masked = '*'.repeat(apiKey.length - visibleChars);
  return visible + masked;
}

// Tests
(function(){
  const key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const masked = maskApiKey(key, 8);
  assert.strictEqual(masked.length, key.length, 'masked length should match original');
  assert.strictEqual(masked.startsWith(key.slice(0,8)), true, 'visible prefix preserved');
  assert.strictEqual(masked.slice(8).match(/\*/g).length, key.length - 8, 'masked portion is stars');

  // short key
  const short = 'ABC';
  assert.strictEqual(maskApiKey(short, 8), short);

  // empty
  assert.strictEqual(maskApiKey('', 4), '');

  console.log('✔ all basic mask tests passed');
})();
