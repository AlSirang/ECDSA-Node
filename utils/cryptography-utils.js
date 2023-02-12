import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, hexToBytes, toHex } from "ethereum-cryptography/utils";
import CryptoJS from "crypto-js";
/**
 * @dev creates keccak256 hash for given `message`
 * @param {string} message is message to hash
 */
export function hashMessage(message) {
  const bytes = utf8ToBytes(message);
  const hash = keccak256(bytes);
  return hash;
}

/**
 * @dev signs the given `msg` with private key and returns signature with recovered bit
 * @param {string} msg is message to sign
 */
export async function signMessage(msg, privateKey) {
  const msgHash = hashMessage(msg);
  return await secp.sign(msgHash, privateKey, {
    recovered: true,
  });
}

/**
 * @dev it returns the public key from signed message using actual `message`, `signature` and `recoveryBit`
 * @param {string} message is message signed
 * @param {string} signature is signature of `message` signed
 * @param {string} recoveryBit is the recovery bit
 */
export function recoverKey(message, signature, recoveryBit) {
  const msgHash = hashMessage(message);

  return secp.recoverPublicKey(msgHash, signature, recoveryBit);
}

/**
 * @dev it creates ethereum address from public key
 * @param {string} publicKey
 */
export const getPublicKeyHex = (privateKey) => {
  const publicKey = secp.getPublicKey(privateKey);
  const pubKeyHash = keccak256(publicKey.slice(1));
  const length = pubKeyHash.length;
  return "0x" + toHex(pubKeyHash.slice(length - 20, length));
};

/**
 * @dev it creates ethereum address from hex private key
 * @param {string} privateKeyHex
 */
export const getPublicKey = (privateKeyHex) => {
  const privateKey = hexToBytes(privateKeyHex);
  return getPublicKeyHex(privateKey);
};
/**
 * @dev it create a random private and public key
 */
export const generateRandomPublicPrivateKey = () => {
  const privateKey = toHex(secp.utils.randomPrivateKey());
  const publicKey = getPublicKey(privateKey);

  return { privateKey, publicKey };
};

/**
 * @dev it encrypts data using crypto.js AES encryption algorithm
 * @param {string} text is text to en
 */
export const encrypText = (text) => {
  // Encrypt
  return CryptoJS.AES.encrypt(
    JSON.stringify(text),
    "thisislonglongandbigsecret"
  ).toString();
};

/**
 * @dev it decrypts ciphertext using crypto.js AES decryption algorithm
 * @param {string} ciphertext is text to en
 */
export const decryptText = (ciphertext) => {
  // Decrypt
  const bytes = CryptoJS.AES.decrypt(ciphertext, "thisislonglongandbigsecret");
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
