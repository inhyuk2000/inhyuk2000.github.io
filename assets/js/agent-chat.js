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
  const badge = root.querySelector("[data-agent-badge]");
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
  let welcomeShown = false;
  let badgeShown = false;
  let badgeTimer = null;

  const WELCOME_TEXT =
    "안녕하세요! 저는 송인혁이에요. 제 경력, 프로젝트, 블로그 등 궁금한 점을 편하게 물어봐 주세요.";

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function clearBadge() {
    if (badgeTimer) {
      window.clearTimeout(badgeTimer);
      badgeTimer = null;
    }
    if (!badge) return;
    badge.hidden = true;
    badge.classList.remove("is-visible");
    badge.style.opacity = "";
    badge.style.transform = "";
    badgeShown = false;
    fab.setAttribute("aria-label", "Open Agent chat");
  }

  function showBadge() {
    if (!badge || badgeShown || welcomeShown || open) return;
    badgeShown = true;
    badge.hidden = false;
    if (prefersReducedMotion()) {
      badge.classList.add("is-visible");
      badge.style.opacity = "1";
      badge.style.transform = "scale(1)";
    } else {
      badge.classList.remove("is-visible");
      void badge.offsetWidth;
      badge.classList.add("is-visible");
    }
    fab.setAttribute("aria-label", "Open Agent chat, 1 unread message");
  }

  function ensureWelcome() {
    if (welcomeShown) return;
    welcomeShown = true;
    clearBadge();
    appendBubble("assistant", WELCOME_TEXT);
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
      ensureWelcome();
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
    // bold **text** / __text__ → weight only (no highlighter in chat)
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/__([^_]+)__/g, "<strong>$1</strong>");
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

  function formatKoreanTime(date) {
    const d = date || new Date();
    const h = d.getHours();
    const m = d.getMinutes();
    const period = h < 12 ? "오전" : "오후";
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return period + " " + h12 + ":" + String(m).padStart(2, "0");
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
    const nowLabel = formatKoreanTime();
    const row = document.createElement("div");
    row.className = `agent-chat__row agent-chat__row--${role} agent-chat__row--enter`;

    const bubble = document.createElement("div");
    bubble.className = `agent-chat__bubble agent-chat__bubble--${role}`;
    if (pending) {
      bubble.classList.add("agent-chat__bubble--pending");
      bubble.appendChild(makeTypingIndicator());
    } else {
      setBubbleContent(bubble, content, { markdown: role === "assistant" });
    }

    const time = document.createElement("time");
    time.className = "agent-chat__msg-time";
    time.dateTime = new Date().toISOString();
    time.textContent = nowLabel;

    if (role === "assistant") {
      const avatarSrc = root.getAttribute("data-agent-avatar") || "";
      const avatar = document.createElement(avatarSrc ? "img" : "span");
      avatar.className = "agent-chat__msg-avatar";
      if (avatarSrc) {
        avatar.src = avatarSrc;
        avatar.alt = "송인혁";
        avatar.width = 34;
        avatar.height = 34;
      } else {
        avatar.setAttribute("aria-hidden", "true");
        avatar.textContent = "IH";
      }

      const body = document.createElement("div");
      body.className = "agent-chat__msg-body";

      const name = document.createElement("p");
      name.className = "agent-chat__msg-name";
      name.textContent = "송인혁";

      const line = document.createElement("div");
      line.className = "agent-chat__msg-line";
      line.appendChild(bubble);
      line.appendChild(time);

      body.appendChild(name);
      body.appendChild(line);
      row.appendChild(avatar);
      row.appendChild(body);
    } else {
      const line = document.createElement("div");
      line.className = "agent-chat__msg-line agent-chat__msg-line--user";
      line.appendChild(time);
      line.appendChild(bubble);
      row.appendChild(line);
    }

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
      const timeEl = thinking.parentElement?.querySelector(".agent-chat__msg-time");
      if (timeEl) {
        const now = new Date();
        timeEl.dateTime = now.toISOString();
        timeEl.textContent = formatKoreanTime(now);
      }
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
      const timeEl = thinking.parentElement?.querySelector(".agent-chat__msg-time");
      if (timeEl) {
        const now = new Date();
        timeEl.dateTime = now.toISOString();
        timeEl.textContent = formatKoreanTime(now);
      }
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

  // Notification badge after 3s; welcome message shows on first open
  badgeTimer = window.setTimeout(showBadge, 3000);
})();
