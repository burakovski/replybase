(() => {
  const script = document.currentScript;
  if (!script) return;
  const botId = script.getAttribute("data-bot-id");
  const key = script.getAttribute("data-key");
  const origin =
    script.getAttribute("data-origin") ||
    (script.src ? new URL(script.src).origin : window.location.origin);

  if (!botId || !key) {
    console.error("[Replybase] Missing data-bot-id or data-key");
    return;
  }

  const state = {
    open: false,
    loading: false,
    bot: null,
    messages: [],
  };

  async function loadBot() {
    const res = await fetch(
      `${origin}/api/bots/${botId}/public?key=${encodeURIComponent(key)}`,
    );
    if (!res.ok) throw new Error("Widget unavailable");
    const data = await res.json();
    state.bot = data.bot;
  }

  function el(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === "style" && typeof v === "object") Object.assign(node.style, v);
      else if (k.startsWith("on") && typeof v === "function")
        node.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === "text") node.textContent = v;
      else node.setAttribute(k, v);
    });
    children.forEach((c) => node.appendChild(c));
    return node;
  }

  function widgetLocale() {
    const lang = (navigator.language || "ru").toLowerCase();
    return lang.startsWith("en") ? "en" : "ru";
  }

  const copy = {
    en: {
      noAnswer:
        "I can't answer that right now. Please rephrase your question or contact an operator.",
      contactOperator: "Contact operator",
      contactSubject: "Support request from website chat",
      contactSent: "Request marked for the operator.",
    },
    ru: {
      noAnswer:
        "На этот ответ я не смогу вам сейчас ответить. Переформулируйте ваш вопрос или свяжитесь с оператором.",
      contactOperator: "Связаться с оператором",
      contactSubject: "Запрос в поддержку из чата на сайте",
      contactSent: "Запрос передан оператору.",
    },
  };

  function renderMessages(list) {
    list.innerHTML = "";
    const L = copy[widgetLocale()];
    state.messages.forEach((m, idx) => {
      const wrap = el("div", {
        style: {
          alignSelf: m.role === "user" ? "flex-end" : "flex-start",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          maxWidth: "90%",
        },
      });
      wrap.appendChild(
        el("div", {
          style: {
            background: m.role === "user" ? "#0f766e" : "#f1f5f4",
            color: m.role === "user" ? "#fff" : "#0b1f1c",
            padding: "10px 12px",
            borderRadius: "14px",
            fontSize: "14px",
            lineHeight: "1.4",
            whiteSpace: "pre-wrap",
          },
          text: m.text,
        }),
      );
      if (m.contactOperator) {
        wrap.appendChild(
          el("button", {
            type: "button",
            text: L.contactOperator,
            style: {
              alignSelf: "flex-start",
              border: "1px solid #c5d6d1",
              background: "#fff",
              color: "#0f4f43",
              borderRadius: "999px",
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
            },
            onClick: () => {
              let q = "";
              for (let i = idx - 1; i >= 0; i -= 1) {
                if (state.messages[i].role === "user") {
                  q = state.messages[i].text;
                  break;
                }
              }
              const subject = encodeURIComponent(L.contactSubject);
              const body = encodeURIComponent(q || m.text);
              window.location.href = `mailto:?subject=${subject}&body=${body}`;
              state.messages.push({ role: "assistant", text: L.contactSent });
              renderMessages(list);
            },
          }),
        );
      }
      list.appendChild(wrap);
    });
    if (state.loading) {
      const typing = el("div", {
        style: {
          alignSelf: "flex-start",
          background: "#eef5f3",
          color: "#163530",
          borderRadius: "14px",
          padding: "8px 12px",
          minWidth: "2.75rem",
          letterSpacing: "0.08em",
          fontVariantNumeric: "tabular-nums",
        },
        text: ".",
      });
      list.appendChild(typing);
      if (state._typingTimer) window.clearInterval(state._typingTimer);
      const frames = [".", "..", "..."];
      let i = 0;
      state._typingTimer = window.setInterval(() => {
        i = (i + 1) % frames.length;
        typing.textContent = frames[i];
      }, 400);
    } else if (state._typingTimer) {
      window.clearInterval(state._typingTimer);
      state._typingTimer = null;
    }
    list.scrollTop = list.scrollHeight;
  }

  async function send(input, list) {
    const text = input.value.trim();
    if (!text || state.loading) return;
    const locale = widgetLocale();
    const L = copy[locale];
    state.messages.push({ role: "user", text });
    input.value = "";
    state.loading = true;
    renderMessages(list);
    try {
      const res = await fetch(`${origin}/api/bots/${botId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, publicKey: key, locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      const unanswered = !!data.unanswered;
      state.messages.push({
        role: "assistant",
        text: data.answer,
        contactOperator: unanswered,
      });
    } catch (e) {
      state.messages.push({
        role: "assistant",
        text: e.message || "Something went wrong",
      });
    } finally {
      state.loading = false;
      renderMessages(list);
    }
  }

  async function mount() {
    try {
      await loadBot();
    } catch (e) {
      console.error("[Replybase]", e);
      return;
    }

    const color = state.bot.primaryColor || "#0F766E";
    const panel = el("div", {
      style: {
        position: "fixed",
        right: "20px",
        bottom: "84px",
        width: "360px",
        maxWidth: "calc(100vw - 24px)",
        height: "520px",
        maxHeight: "calc(100vh - 120px)",
        background: "#fff",
        border: "1px solid #d7e3e0",
        borderRadius: "18px",
        boxShadow: "0 18px 50px rgba(6, 30, 26, 0.18)",
        display: "none",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: "2147483000",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      },
    });

    const header = el(
      "div",
      {
        style: {
          background: color,
          color: "#fff",
          padding: "14px 16px",
          fontWeight: "600",
        },
        text: state.bot.name,
      },
    );

    const list = el("div", {
      style: {
        flex: "1",
        overflowY: "auto",
        padding: "14px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        background: "#fafcfb",
      },
    });

    state.messages.push({
      role: "assistant",
      text: state.bot.welcomeMessage,
    });
    renderMessages(list);

    const form = el("div", {
      style: {
        display: "flex",
        gap: "8px",
        padding: "12px",
        borderTop: "1px solid #e5eeeb",
      },
    });
    const input = el("input", {
      type: "text",
      placeholder: "Ask a question…",
      style: {
        flex: "1",
        border: "1px solid #cfdad7",
        borderRadius: "10px",
        padding: "10px 12px",
        fontSize: "14px",
        outline: "none",
      },
    });
    const btn = el("button", {
      text: "Send",
      style: {
        background: color,
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        padding: "0 14px",
        cursor: "pointer",
        fontWeight: "600",
      },
      onClick: () => send(input, list),
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") send(input, list);
    });
    form.append(input, btn);

    const footer = el("div", {
      style: {
        fontSize: "11px",
        color: "#6b7c78",
        textAlign: "center",
        padding: "0 12px 10px",
      },
      text: "Powered by Replybase",
    });

    panel.append(header, list, form, footer);

    const launcher = el(
      "button",
      {
        style: {
          position: "fixed",
          right: "20px",
          bottom: "20px",
          width: "56px",
          height: "56px",
          borderRadius: "999px",
          border: "none",
          background: color,
          color: "#fff",
          fontSize: "22px",
          cursor: "pointer",
          boxShadow: "0 10px 28px rgba(6, 30, 26, 0.25)",
          zIndex: "2147483001",
        },
        text: "💬",
        onClick: () => {
          state.open = !state.open;
          panel.style.display = state.open ? "flex" : "none";
        },
      },
    );

    document.body.append(panel, launcher);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
