import fs from "node:fs";
import path from "node:path";

const MAX_MESSAGE_CHARS = 2000;
const MAX_HISTORY = 12;
const MODEL = "gpt-4o-mini";

const ALLOWED_ORIGINS = new Set([
  "https://inhyuk2000.github.io",
  "https://inhyuk-portfolio.netlify.app",
  "http://localhost:1313",
  "http://127.0.0.1:1313",
]);

function corsHeaders(event) {
  const origin = event?.headers?.origin || event?.headers?.Origin || "";
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : "https://inhyuk2000.github.io";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function jsonResponse(statusCode, body, event) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders(event),
    },
    body: JSON.stringify(body),
  };
}

function contextCandidates() {
  const roots = [
    process.cwd(),
    process.env.LAMBDA_TASK_ROOT,
    "/var/task",
  ].filter(Boolean);

  const rel = [
    "agent-context.json",
    path.join("netlify", "functions", "agent-context.json"),
    path.join("public", "agent-context.json"),
    path.join("static", "agent-context.json"),
  ];

  const out = [];
  for (const root of roots) {
    for (const r of rel) {
      out.push(path.join(root, r));
    }
  }
  return out;
}

function loadContextFromDisk() {
  for (const filePath of contextCandidates()) {
    try {
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, "utf8");
      }
    } catch {
      // keep looking
    }
  }
  return null;
}

async function loadContext() {
  const fromDisk = loadContextFromDisk();
  if (fromDisk) return fromDisk;

  const base = process.env.URL || process.env.DEPLOY_PRIME_URL || "";
  if (!base) return null;
  try {
    const res = await fetch(new URL("/agent-context.json", base).toString());
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
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
    "Do not use markdown headings (#, ##, ###, ####). Never start a line with #. Structure answers with short sentences or plain labels like \"목적:\" if needed, without hash marks.",
    "",
    "CONTEXT (JSON):",
    contextJson,
  ].join("\n");
}

function normalizeMessages(input) {
  if (!Array.isArray(input)) return null;
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

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders(event),
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" }, event);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return jsonResponse(
      500,
      { error: "OPENAI_API_KEY is not configured on the server." },
      event,
    );
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { error: "Invalid JSON body." }, event);
  }

  const normalized = normalizeMessages(payload.messages);
  if (!normalized || normalized.error) {
    return jsonResponse(
      400,
      { error: normalized?.error || "Invalid messages." },
      event,
    );
  }

  const contextJson = await loadContext();
  if (!contextJson) {
    return jsonResponse(
      500,
      { error: "agent-context.json missing. Run the build-agent-context script." },
      event,
    );
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
      const message =
        data?.error?.message || `OpenAI request failed (${openaiRes.status})`;
      return jsonResponse(502, { error: message }, event);
    }

    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return jsonResponse(502, { error: "Empty response from model." }, event);
    }

    return jsonResponse(200, { reply }, event);
  } catch (err) {
    return jsonResponse(
      500,
      { error: err?.message || "Unexpected server error." },
      event,
    );
  }
}
