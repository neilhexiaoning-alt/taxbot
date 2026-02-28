#!/usr/bin/env node
/**
 * 发票查验脚本 - 调用中税网接口开放平台
 *
 * Usage:
 *   node check-invoice.mjs --invoiceCode=XXX --invoiceNo=XXX --invoiceDate=YYYYMMDD
 *                          --invoiceAmount=XXX --checkCode=XXX --invoiceType=XXX
 *
 * Output: JSON result to stdout
 */

import { createCipheriv, createDecipheriv } from "node:crypto";
import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

// ── Configuration ──────────────────────────────────────────────────────────
const BASE_URL = "https://jkpt-test.taxchina.cn";
const APP_ID = "1771033249870";
const API_KEY = "koOYYrFsNwMtwVlv1yKieIug";
const SECRET_KEY = "RIk6k3rtT9y4zV8cVKluyXPvaTvLAmbB";
const AES_KEY = "plateform@000000"; // 16 chars = AES-128

const TOKEN_CACHE_FILE = path.join(os.tmpdir(), "taxbot_invoice_token.json");
const TOKEN_TTL_MS = 3600 * 1000; // 1 hour (conservative)

// ── AES Encryption (AES/ECB/PKCS5Padding → hex → base64) ──────────────────
function encryptData(plainText) {
  const cipher = createCipheriv(
    "aes-128-ecb",
    Buffer.from(AES_KEY, "utf-8"),
    null
  );
  cipher.setAutoPadding(true);
  let encrypted = cipher.update(plainText, "utf-8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  // Step 1: to hex string, Step 2: base64 encode the hex string
  const hexStr = encrypted.toString("hex");
  return Buffer.from(hexStr, "utf-8").toString("base64");
}

function decryptData(encoded) {
  // Step 1: base64 decode to hex string
  const hexStr = Buffer.from(encoded, "base64").toString("utf-8");
  // Step 2: hex to binary buffer
  const encryptedBuf = Buffer.from(hexStr, "hex");
  const decipher = createDecipheriv(
    "aes-128-ecb",
    Buffer.from(AES_KEY, "utf-8"),
    null
  );
  decipher.setAutoPadding(true);
  let decrypted = decipher.update(encryptedBuf);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString("utf-8");
}

// ── HTTP Helper ────────────────────────────────────────────────────────────
function httpRequest(url, body, headers, method = "POST") {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === "https:";
    const lib = isHttps ? https : http;

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method,
      headers: {
        ...headers,
        ...(body != null
          ? { "Content-Length": Buffer.byteLength(body) }
          : {}),
      },
      timeout: 30000,
    };

    if (isHttps) {
      options.rejectUnauthorized = false; // handle expired certs
    }

    const req = lib.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout (30s)"));
    });

    if (body != null) req.write(body);
    req.end();
  });
}

// ── OAuth Token ────────────────────────────────────────────────────────────
async function getTokenFromApi() {
  const formBody = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: API_KEY,
    client_secret: SECRET_KEY,
  }).toString();

  const responseText = await httpRequest(
    `${BASE_URL}/admin/oauth/token`,
    formBody,
    { "Content-Type": "application/x-www-form-urlencoded", AppId: APP_ID }
  );

  let json;
  try {
    json = JSON.parse(responseText);
  } catch {
    throw new Error(`Token response is not valid JSON: ${responseText}`);
  }

  if (!json.access_token) {
    throw new Error(
      `Token request failed: ${JSON.stringify(json)}`
    );
  }
  return { token: json.access_token, expiresIn: json.expires_in || 7200 };
}

async function getToken() {
  // Try cached token first
  try {
    const cached = JSON.parse(fs.readFileSync(TOKEN_CACHE_FILE, "utf-8"));
    if (cached.token && cached.expiresAt > Date.now()) {
      return cached.token;
    }
  } catch {
    // no cache or expired
  }

  const { token, expiresIn } = await getTokenFromApi();

  // Cache token
  try {
    fs.writeFileSync(
      TOKEN_CACHE_FILE,
      JSON.stringify({
        token,
        expiresAt: Date.now() + Math.min(expiresIn * 1000, TOKEN_TTL_MS),
      })
    );
  } catch {
    // non-fatal: caching failure doesn't block verification
  }

  return token;
}

// ── Invoice Check API ──────────────────────────────────────────────────────
async function checkInvoice(params) {
  const token = await getToken();

  const requestBody = {
    checkCode: params.checkCode || "",
    invoiceAmount: params.invoiceAmount || "",
    invoiceCode: params.invoiceCode || "",
    invoiceNo: params.invoiceNo || "",
    invoiceDate: params.invoiceDate || "",
    invoiceType: params.invoiceType || "",
    ruleSource: "2",
  };

  const plainJson = JSON.stringify(requestBody);
  const encrypted = encryptData(plainJson);

  // Debug: output request details
  if (process.env.DEBUG_INVOICE) {
    console.error(JSON.stringify({
      _debug: true,
      step1_tokenEndpoint: `${BASE_URL}/admin/oauth/token`,
      step1_tokenParams: { grant_type: "client_credentials", client_id: API_KEY, client_secret: SECRET_KEY },
      step1_tokenHeaders: { "Content-Type": "application/x-www-form-urlencoded", AppId: APP_ID },
      step1_token: token,
      step2_plainJson: plainJson,
      step2_encrypted: encrypted,
      step3_checkEndpoint: `${BASE_URL}/input/checkInvoice/checkSingle`,
      step3_headers: { "Content-Type": "application/json", AppId: APP_ID, Authorization: `Bearer ${token}` },
      step3_body: { reqStr: encrypted },
    }, null, 2));
  }

  const wrappedBody = JSON.stringify({ reqStr: encrypted });

  const responseText = await httpRequest(
    `${BASE_URL}/input/checkInvoice/checkSingle`,
    wrappedBody,
    {
      "Content-Type": "application/json",
      AppId: APP_ID,
      Authorization: `Bearer ${token}`,
    }
  );

  let result;
  try {
    result = JSON.parse(responseText);
  } catch {
    // Response might be encrypted directly
    try {
      const decrypted = decryptData(responseText.trim());
      result = JSON.parse(decrypted);
    } catch {
      throw new Error(`Cannot parse API response: ${responseText.substring(0, 500)}`);
    }
  }

  // Try to decrypt the data field if it looks like an encrypted string
  if (result.data && typeof result.data === "string") {
    try {
      const decrypted = decryptData(result.data);
      result.data = JSON.parse(decrypted);
    } catch {
      // data might not be encrypted or might be a plain message
    }
  }

  return result;
}

// ── CLI ────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const args = {};
  for (const arg of argv.slice(2)) {
    const match = arg.match(/^--(\w+)=(.*)$/);
    if (match) {
      args[match[1]] = match[2];
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv);

  // invoiceCode can be empty for certain invoice types (全电发票)
  const required = ["invoiceNo", "invoiceDate", "invoiceType"];
  const missing = required.filter((f) => !args[f]);
  if (missing.length > 0) {
    console.log(
      JSON.stringify({
        success: false,
        error: `Missing required fields: ${missing.join(", ")}`,
        hint: "Required: --invoiceNo --invoiceDate --invoiceType. Optional: --invoiceCode --invoiceAmount --checkCode",
      })
    );
    process.exit(1);
  }

  try {
    const result = await checkInvoice(args);
    console.log(JSON.stringify({ success: true, ...result }, null, 2));
  } catch (error) {
    console.log(
      JSON.stringify({
        success: false,
        error: error.message,
      })
    );
    process.exit(1);
  }
}

main();
