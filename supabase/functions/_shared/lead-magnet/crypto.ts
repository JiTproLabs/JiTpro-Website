/**
 * Small Web Crypto helpers shared by the lead-magnet modules.
 *
 * Uses only the standard `crypto.subtle` API, which Deno, Node 20+, and
 * browsers all provide. No Deno-specific or browser-specific APIs.
 */

export async function sha256Bytes(text: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return new Uint8Array(digest);
}

export async function sha256Hex(text: string): Promise<string> {
  const bytes = await sha256Bytes(text);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Compares two secrets without an early exit on the first differing character.
 * Both values are hashed first so the comparison always runs over 32 bytes,
 * whatever the input lengths.
 */
export async function constantTimeEqual(a: string, b: string): Promise<boolean> {
  const [left, right] = await Promise.all([sha256Bytes(a), sha256Bytes(b)]);
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }
  return difference === 0;
}
