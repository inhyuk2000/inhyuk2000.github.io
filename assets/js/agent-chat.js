(function () {
  const host = location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1";
  const isGitHubPages = host.endsWith("github.io");
  // Netlify hosts the OpenAI proxy; GitHub Pages is static-only.
  const NETLIFY_API =
    "https://inhyuk-portfolio.netlify.app/.netlify/functions/agent-chat";
  // hugo server cannot serve Netlify Functions — local API runs on :8787 via `pnpm dev`
  const API_URL =
    window.AGENT_CHAT_API_URL ||
    (isLocal
      ? "http://127.0.0.1:8787/.netlify/functions/agent-chat"
      : isGitHubPages
        ? NETLIFY_API
        : "/.netlify/functions/agent-chat");
  const root = document.getElementById("agent-chat-root");
  if (!root) return;

  const fab = root.querySelector("[data-agent-fab]");
  const panel = root.querySelector("[data-agent-panel]");
  const closeBtn = root.querySelector("[data-agent-close]");
  const form = root.querySelector("[data-agent-form]");
  const input = root.querySelector("[data-agent-input]");
  const messagesEl = root.querySelector("[data-agent-messages]");
  const statusEl = root.querySelector("[data-agent-status]");
  const sendBtn = form.querySelector("button[type='submit']");

  /** @type {{role: 'user'|'assistant', content: string}[]} */
  const history = [];
  let open = false;
  let busy = false;
  let closing = false;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function scrollMessagesToEnd() {
    if (!messagesEl) return;
    if (prefersReducedMotion()) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return;
    }
    messagesEl.classList.add("agent-chat__messages--scrolling");
    messagesEl.scrollTo({
      top: messagesEl.scrollHeight,
      behavior: "smooth",
    });
    window.setTimeout(() => {
      messagesEl.classList.remove("agent-chat__messages--scrolling");
    }, 450);
  }

  function setOpen(next) {
    if (next === open || closing) return;

    if (next) {
      open = true;
      root.dataset.open = "true";
      fab.setAttribute("aria-expanded", "true");
      panel.hidden = false;
      panel.classList.remove("agent-chat__panel--out");
      // Restart enter animation
      panel.classList.remove("agent-chat__panel--in");
      void panel.offsetWidth;
      panel.classList.add("agent-chat__panel--in");
      input.focus();
      return;
    }

    open = false;
    root.dataset.open = "false";
    fab.setAttribute("aria-expanded", "false");

    if (prefersReducedMotion()) {
      panel.hidden = true;
      panel.classList.remove("agent-chat__panel--in", "agent-chat__panel--out");
      return;
    }

    closing = true;
    panel.classList.remove("agent-chat__panel--in");
    panel.classList.add("agent-chat__panel--out");

    const finish = () => {
      panel.hidden = true;
      panel.classList.remove("agent-chat__panel--out");
      closing = false;
      panel.removeEventListener("animationend", onEnd);
    };
    const onEnd = (e) => {
      if (e.target !== panel) return;
      finish();
    };
    panel.addEventListener("animationend", onEnd);
    window.setTimeout(finish, 280);
  }

  function setStatus(text) {
    if (!statusEl) return;
    statusEl.textContent = text || "";
  }

  function makeTypingIndicator() {
    const wrap = document.createElement("div");
    wrap.className = "agent-chat__typing";
    wrap.setAttribute("aria-label", "입력 중");
    for (let i = 0; i < 3; i += 1) {
      const dot = document.createElement("span");
      dot.className = "agent-chat__typing-dot";
      wrap.appendChild(dot);
    }
    return wrap;
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /** Lightweight markdown for chat bubbles: bold, italic, inline code, links. */
  function renderChatMarkdown(text) {
    let html = escapeHtml(text);
    // fenced code blocks first
    html = html.replace(/```([\s\S]*?)```/g, (_, code) => {
      return `<pre class="agent-chat__codeblock"><code>${code.trim()}</code></pre>`;
    });
    // inline code
    html = html.replace(
      /`([^`\n]+)`/g,
      '<code class="agent-chat__code">$1</code>',
    );
    // bold **text** / __text__ → blog-style highlighter (high_mark) + strong
    html = html.replace(
      /\*\*([^*]+)\*\*/g,
      '<span class="high-mark"><strong>$1</strong></span>',
    );
    html = html.replace(
      /__([^_]+)__/g,
      '<span class="high-mark"><strong>$1</strong></span>',
    );
    // italic *text* or _text_ (avoid matching inside words for _)
    html = html.replace(/(^|[\s(])\*([^*\n]+)\*(?=$|[\s).,!?])/g, "$1<em>$2</em>");
    html = html.replace(/(^|[\s(])_([^_\n]+)_(?=$|[\s).,!?])/g, "$1<em>$2</em>");
    // links [label](url)
    html = html.replace(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      '<a class="agent-chat__link" href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    );
    return html;
  }

  function setBubbleContent(bubble, content, { markdown = false } = {}) {
    if (markdown) {
      bubble.innerHTML = renderChatMarkdown(content);
    } else {
      bubble.textContent = content;
    }
  }

  function appendBubble(role, content, options = {}) {
    const { pending = false } = options;
    const row = document.createElement("div");
    row.className = `agent-chat__row agent-chat__row--${role} agent-chat__row--enter`;
    const bubble = document.createElement("div");
    bubble.className = `agent-chat__bubble agent-chat__bubble--${role}`;
    if (pending) {
      bubble.classList.add("agent-chat__bubble--pending");
      bubble.appendChild(makeTypingIndicator());
    } else {
      // Assistant replies may include markdown (e.g. **bold**); user stays plain text.
      setBubbleContent(bubble, content, { markdown: role === "assistant" });
    }
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    scrollMessagesToEnd();
    return bubble;
  }

  function setBusy(next) {
    busy = next;
    sendBtn.disabled = next;
    input.disabled = next;
    sendBtn.classList.toggle("agent-chat__send--busy", next);
  }

  async function sendMessage(text) {
    const content = text.trim();
    if (!content || busy) return;

    history.push({ role: "user", content });
    appendBubble("user", content);
    input.value = "";
    setBusy(true);
    setStatus("답변 작성 중…");
    sendBtn.classList.add("agent-chat__send--pulse");

    const thinking = appendBubble("assistant", "", { pending: true });

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(
            isLocal
              ? "로컬 API가 없습니다. 터미널에서 `pnpm dev`로 다시 실행하고 .env에 OPENAI_API_KEY를 넣어주세요."
              : "Agent API를 찾을 수 없습니다. Netlify Functions 배포와 OPENAI_API_KEY 설정을 확인해주세요.",
          );
        }
        throw new Error(data.error || `요청 실패 (${res.status})`);
      }
      const reply = (data.reply || "").trim();
      if (!reply) throw new Error("빈 응답을 받았습니다.");
      history.push({ role: "assistant", content: reply });
      thinking.classList.remove("agent-chat__bubble--pending");
      setBubbleContent(thinking, reply, { markdown: true });
      setStatus("");
    } catch (err) {
      thinking.classList.remove("agent-chat__bubble--pending");
      thinking.classList.add("agent-chat__bubble--error");
      const msg = String(err?.message || "");
      const errorText =
        msg.includes("Failed to fetch") || msg.includes("NetworkError")
          ? isLocal
            ? "로컬 Agent API(127.0.0.1:8787)에 연결할 수 없습니다. `pnpm dev`로 실행 중인지 확인해주세요."
            : "Agent API에 연결할 수 없습니다. Netlify 배포 상태를 확인해주세요."
          : msg ||
            "지금은 답변할 수 없습니다. Netlify에 배포되어 있고 OPENAI_API_KEY가 설정돼 있는지 확인해주세요.";
      setBubbleContent(thinking, errorText, { markdown: false });
      // Keep conversation usable: drop failed user turn from history for retries
      history.pop();
      setStatus("");
    } finally {
      setBusy(false);
      sendBtn.classList.remove("agent-chat__send--pulse");
      scrollMessagesToEnd();
      input.focus();
    }
  }

  fab.addEventListener("click", () => setOpen(!open));
  closeBtn.addEventListener("click", () => setOpen(false));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && open) setOpen(false);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendBtn.classList.add("agent-chat__send--press");
    window.setTimeout(() => {
      sendBtn.classList.remove("agent-chat__send--press");
    }, 180);
    sendMessage(input.value);
  });

  // Welcome message (local only, not sent to API until user chats)
  appendBubble(
    "assistant",
    "안녕하세요! In Hyuk에 대해 궁금한 점(경력, 프로젝트, 블로그 등)을 물어보세요.",
  );
})();
