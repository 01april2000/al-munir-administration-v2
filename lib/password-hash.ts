import { scrypt, randomBytes } from "crypto";

// These parameters MUST match better-auth's config exactly
// See: node_modules/better-auth/dist/crypto/password.mjs
const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const SCRYPT_N = 16384;
const SCRYPT_R = 16;
const SCRYPT_P = 1;

/**
 * Generate scrypt key with better-auth compatible parameters
 */
function generateKey(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password.normalize("NFKC"),
      salt,
      KEY_LENGTH,
      {
        N: SCRYPT_N,
        r: SCRYPT_R,
        p: SCRYPT_P,
        maxmem: 128 * SCRYPT_N * SCRYPT_R * 2,
      },
      (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey);
      }
    );
  });
}

/**
 * Hash a password using scrypt (compatible with better-auth)
 * Format: salt:hash (hex encoded)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH).toString("hex");
  const derivedKey = await generateKey(password, salt);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verify a password against a hashed password
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const [salt, storedHash] = hashedPassword.split(":");
  if (!salt || !storedHash) {
    return false;
  }
  const derivedKey = await generateKey(password, salt);
  return derivedKey.toString("hex") === storedHash;
}
