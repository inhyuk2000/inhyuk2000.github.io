/**
 * Local stand-in for Netlify Function `agent-chat`.
 * Used with `hugo server` because Hugo cannot serve /.netlify/functions/*.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const PORT = Number(process.env.AGENT_API_PORT || 8787);
const MODEL = "gpt-4o-mini";
const MAX_MESSAGE_CHARS = 2000;
const MAX_HISTORY = 12;

function loadDotEnv() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function loadContext() {
  const candidates = [
    path.join(root, "netlify", "functions", "agent-context.json"),
    path.join(root, "static", "agent-context.json"),
    path.join(root, "public", "agent-context.json"),
  ];
  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) return fs.readFileSync(filePath, "utf8");
  }
  return null;
}

function buildSystemPrompt(contextJson) {
  return [
    "You are In Hyuk (송인혁). Speak in the first person as me — use 저/저는/제가, never 그/송인혁이/그는.",
    "Answer ONLY from the CONTEXT below about my portfolio, background, projects, and posts.",
    "Prefer Korean. Be concise, accurate, warm, and natural — like I am chatting about myself.",
    "If something is missing from the context, say it in first person, e.g. \"저는 아직 그 정보가 없어요\" or \"저는 아직 회사에서 근무한 경험은 없습니다\" — do NOT say \"정보가 제공되지 않았습니다\" or narrate about me in third person.",
    "Do not invent employers, dates, awards, or project results.",
    "You may summarize my blog posts and projects when asked.",
    "Emphasize sparingly: use markdown bold **like this** for at most 3 truly key phrases in the whole reply (names/roles/project titles). Never bold more than 3 spans. Do not use any highlighter or background-mark styling.",
    "Do not use Hugo shortcodes such as high_mark.",
    "",
    "CONTEXT (JSON):",
    contextJson,
  ].join("\n");
}

function normalizeMessages(input) {
  if (!Array.isArray(input)) return { error: "messages must be an array." };
  const cleaned = [];
  for (const msg of input.slice(-MAX_HISTORY)) {
    if (!msg || typeof msg !== "object") continue;
    const role = msg.role === "assistant" ? "assistant" : "user";
    const content = String(msg.content ?? "").trim();
    if (!content) continue;
    if (content.length > MAX_MESSAGE_CHARS) {
      return { error: `Each message must be <= ${MAX_MESSAGE_CHARS} characters.` };
    }
    cleaned.push({ role, content });
  }
  if (!cleaned.length) return { error: "messages must not be empty." };
  if (cleaned[cleaned.length - 1].role !== "user") {
    return { error: "Last message must be from the user." };
  }
  return { messages: cleaned };
}

function sendJson(res, statusCode, body) {
  const payload = JSON.stringify(body);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function handleChat(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return sendJson(res, 500, {
      error:
        "OPENAI_API_KEY is not configured. Create a .env file with OPENAI_API_KEY=... then restart pnpm dev.",
    });
  }

  let payload;
  try {
    payload = JSON.parse((await readBody(req)) || "{}");
  } catch {
    return sendJson(res, 400, { error: "Invalid JSON body." });
  }

  const normalized = normalizeMessages(payload.messages);
  if (normalized.error) return sendJson(res, 400, { error: normalized.error });

  const contextJson = loadContext();
  if (!contextJson) {
    return sendJson(res, 500, {
      error: "agent-context.json missing. Run: pnpm run agent-context",
    });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.4,
        messages: [
          { role: "system", content: buildSystemPrompt(contextJson) },
          ...normalized.messages,
        ],
      }),
    });
    const data = await openaiRes.json().catch(() => ({}));
    if (!openaiRes.ok) {
      return sendJson(res, 502, {
        error: data?.error?.message || `OpenAI request failed (${openaiRes.status})`,
      });
    }
    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) return sendJson(res, 502, { error: "Empty response from model." });
    return sendJson(res, 200, { reply });
  } catch (err) {
    return sendJson(res, 500, { error: err?.message || "Unexpected server error." });
  }
}

loadDotEnv();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const isChat =
    url.pathname === "/.netlify/functions/agent-chat" ||
    url.pathname === "/agent-chat";

  if (req.method === "OPTIONS" && isChat) {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  if (req.method === "POST" && isChat) {
    return handleChat(req, res);
  }

  if (req.method === "GET" && url.pathname === "/health") {
    return sendJson(res, 200, {
      ok: true,
      hasKey: Boolean(process.env.OPENAI_API_KEY),
      hasContext: Boolean(loadContext()),
    });
  }

  sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[agent-api] http://127.0.0.1:${PORT}/.netlify/functions/agent-chat`);
  if (!process.env.OPENAI_API_KEY) {
    console.warn("[agent-api] OPENAI_API_KEY missing — add it to .env");
  }
  if (!loadContext()) {
    console.warn("[agent-api] agent-context.json missing — run pnpm run agent-context");
  }
});
