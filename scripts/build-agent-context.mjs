import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const BODY_LIMIT = 6000;
const TOTAL_SOFT_LIMIT = 120_000;

function walkIndexMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;
    const indexPath = path.join(dir, entry.name, "index.md");
    if (fs.existsSync(indexPath)) {
      results.push({ slug: entry.name, filePath: indexPath });
    }
  }
  return results.sort((a, b) => a.slug.localeCompare(b.slug));
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: raw.trim() };
  }
  const yamlBlock = match[1];
  const body = match[2].trim();
  const frontmatter = {};
  // Lightweight key extraction for common scalar / list fields
  const lines = yamlBlock.split(/\r?\n/);
  let currentListKey = null;
  for (const line of lines) {
    const listItem = line.match(/^\s+-\s+(.*)$/);
    if (listItem && currentListKey) {
      if (!Array.isArray(frontmatter[currentListKey])) {
        frontmatter[currentListKey] = [];
      }
      frontmatter[currentListKey].push(listItem[1].replace(/^["']|["']$/g, ""));
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) {
      currentListKey = null;
      continue;
    }
    const key = kv[1];
    let value = kv[2];
    if (value === "" || value === "|" || value === ">") {
      currentListKey = key;
      frontmatter[key] = frontmatter[key] ?? "";
      continue;
    }
    currentListKey = value === "" ? key : null;
    value = value.replace(/^["']|["']$/g, "");
    frontmatter[key] = value;
  }
  return { frontmatter, body };
}

function stripMarkdownNoise(text) {
  return text
    .replace(/\{\{%[\s\S]*?%\}\}/g, "")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*>\s?\[[^\]]+\]\s*/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function truncate(text, limit) {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit)}\n…[truncated]`;
}

function loadEntry({ slug, filePath }, kind) {
  const raw = fs.readFileSync(filePath, "utf8");
  const { frontmatter, body } = parseFrontmatter(raw);
  const cleanBody = truncate(stripMarkdownNoise(body), BODY_LIMIT);
  return {
    kind,
    slug,
    title: frontmatter.title || slug,
    summary: frontmatter.summary || "",
    date: frontmatter.date || "",
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    status: frontmatter.status || "",
    role: frontmatter.role || "",
    tech_stack: Array.isArray(frontmatter.tech_stack)
      ? frontmatter.tech_stack
      : [],
    body: cleanBody,
  };
}

function main() {
  const authorPath = path.join(root, "data", "authors", "me.yaml");
  const authorYaml = fs.existsSync(authorPath)
    ? fs.readFileSync(authorPath, "utf8")
    : "";

  const blogs = walkIndexMarkdown(path.join(root, "content", "blog")).map((e) =>
    loadEntry(e, "blog"),
  );
  const projects = walkIndexMarkdown(
    path.join(root, "content", "projects"),
  ).map((e) => loadEntry(e, "project"));

  const context = {
    generatedAt: new Date().toISOString(),
    subject: {
      displayName: "In Hyuk (송인혁)",
      authorYaml,
    },
    blogs,
    projects,
  };

  let serialized = JSON.stringify(context, null, 2);
  if (serialized.length > TOTAL_SOFT_LIMIT) {
    // Progressive body shrink if the payload is huge
    for (const item of [...blogs, ...projects]) {
      item.body = truncate(item.body, 2500);
    }
    serialized = JSON.stringify(context, null, 2);
  }

  const outStatic = path.join(root, "static", "agent-context.json");
  const outFunctions = path.join(
    root,
    "netlify",
    "functions",
    "agent-context.json",
  );

  fs.mkdirSync(path.dirname(outStatic), { recursive: true });
  fs.mkdirSync(path.dirname(outFunctions), { recursive: true });
  fs.writeFileSync(outStatic, serialized, "utf8");
  fs.writeFileSync(outFunctions, serialized, "utf8");

  console.log(
    `[agent-context] wrote ${outStatic} and ${outFunctions} (${blogs.length} blogs, ${projects.length} projects, ${serialized.length} bytes)`,
  );
}

main();
