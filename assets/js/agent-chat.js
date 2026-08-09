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

  /** @type {{role: 'user'|'assistant', content: string}[]} */
  const history = [];
  let open = false;
  let busy = false;

  function setOpen(next) {
    open = next;
    root.dataset.open = open ? "true" : "false";
    fab.setAttribute("aria-expanded", open ? "true" : "false");
    panel.hidden = !open;
    if (open) {
      input.focus();
    }
  }

  function setStatus(text) {
    if (!statusEl) return;
    statusEl.textContent = text || "";
  }

  function appendBubble(role, content) {
    const row = document.createElement("div");
    row.className = `agent-chat__row agent-chat__row--${role}`;
    const bubble = document.createElement("div");
    bubble.className = `agent-chat__bubble agent-chat__bubble--${role}`;
    bubble.textContent = content;
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return bubble;
  }

  function setBusy(next) {
    busy = next;
    form.querySelector("button[type='submit']").disabled = next;
    input.disabled = next;
  }

  async function sendMessage(text) {
    const content = text.trim();
    if (!content || busy) return;

    history.push({ role: "user", content });
    appendBubble("user", content);
    input.value = "";
    setBusy(true);
    setStatus("답변 작성 중…");

    const thinking = appendBubble("assistant", "…");
    thinking.classList.add("agent-chat__bubble--pending");

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
      thinking.textContent = reply;
      setStatus("");
    } catch (err) {
      thinking.classList.remove("agent-chat__bubble--pending");
      thinking.classList.add("agent-chat__bubble--error");
      const msg = String(err?.message || "");
      thinking.textContent =
        msg.includes("Failed to fetch") || msg.includes("NetworkError")
          ? isLocal
            ? "로컬 Agent API(127.0.0.1:8787)에 연결할 수 없습니다. `pnpm dev`로 실행 중인지 확인해주세요."
            : "Agent API에 연결할 수 없습니다. Netlify 배포 상태를 확인해주세요."
          : msg ||
            "지금은 답변할 수 없습니다. Netlify에 배포되어 있고 OPENAI_API_KEY가 설정돼 있는지 확인해주세요.";
      // Keep conversation usable: drop failed user turn from history for retries
      history.pop();
      setStatus("");
    } finally {
      setBusy(false);
      messagesEl.scrollTop = messagesEl.scrollHeight;
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
    sendMessage(input.value);
  });

  // Welcome message (local only, not sent to API until user chats)
  appendBubble(
    "assistant",
    "안녕하세요! In Hyuk에 대해 궁금한 점(경력, 프로젝트, 블로그 등)을 물어보세요.",
  );
})();
