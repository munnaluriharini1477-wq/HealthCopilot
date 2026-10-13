/**
 * AI-Powered Personal Health Copilot
 * Symptom Triage & Interactive Clinical Chat Controller
 */

export class SymptomChat {
  constructor(db, aiEngine) {
    this.db = db;
    this.aiEngine = aiEngine;
    this.speechSynth = window.speechSynthesis || null;
    this.isSpeaking = false;
  }

  init() {
    this.bindEvents();
    this.renderHistory();
  }

  bindEvents() {
    const form = document.getElementById("chatForm");
    const input = document.getElementById("chatInput");
    const clearBtn = document.getElementById("clearChatBtn");
    const chipsContainer = document.getElementById("quickPromptChips");

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
          this.sendMessage(text);
          input.value = "";
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (confirm("Clear conversational history?")) {
          this.db.clearChatHistory();
          this.renderHistory();
        }
      });
    }

    if (chipsContainer) {
      chipsContainer.querySelectorAll(".prompt-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          const prompt = chip.getAttribute("data-prompt");
          if (prompt) {
            this.sendMessage(prompt);
          }
        });
      });
    }
  }

  renderHistory() {
    const container = document.getElementById("chatMessages");
    if (!container) return;

    const history = this.db.getChatHistory();
    container.innerHTML = history.map(msg => this.formatMessageHTML(msg)).join("");
    this.bindSpeechButtons(container);
    this.scrollToBottom();
  }

  formatMarkdown(text) {
    if (!text) return "";
    let html = text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") // sanitize
      .replace(/^### (.*$)/gim, '<h4 class="md-h4">$1</h4>')
      .replace(/^#### (.*$)/gim, '<h5 class="md-h5">$1</h5>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/^> (.*$)/gim, '<blockquote class="md-quote">$1</blockquote>')
      .replace(/^\* (.*$)/gim, '<li class="md-li">$1</li>')
      .replace(/^[0-9]\. (.*$)/gim, '<li class="md-li-num">$1</li>')
      .replace(/\n\n/gim, '<p class="md-p"></p>');

    return html;
  }

  formatMessageHTML(msg) {
    const isUser = msg.sender === "user";
    const senderLabel = isUser ? "You" : "Health Copilot";
    const avatar = isUser ? "👤" : "🩺";

    let triageBanner = "";
    if (msg.triageLevel) {
      let badgeClass = "badge-self-care";
      let badgeText = "ROUTINE MONITORING";

      if (msg.triageLevel === "emergency") {
        badgeClass = "badge-emergency";
        badgeText = "🚨 CRITICAL EMERGENCY (CALL 911)";
      } else if (msg.triageLevel === "urgent") {
        badgeClass = "badge-urgent";
        badgeText = "⚠️ URGENT CARE (Same Day)";
      } else if (msg.triageLevel === "routine") {
        badgeClass = "badge-routine";
        badgeText = "📅 SCHEDULE CLINIC VISIT";
      }

      triageBanner = `
        <div class="chat-triage-badge ${badgeClass}">
          <span>${badgeText}</span>
          ${msg.triageLevel === "emergency" ? '<a href="tel:911" class="btn-call-911">📞 Call 911 Now</a>' : ''}
        </div>
      `;
    }

    return `
      <div class="chat-message ${isUser ? 'user-message' : 'assistant-message'}" id="${msg.id}">
        <div class="msg-avatar">${avatar}</div>
        <div class="msg-content-wrapper">
          <div class="msg-header">
            <span class="msg-sender">${senderLabel}</span>
            <span class="msg-time">${msg.timestamp || ''}</span>
          </div>
          ${triageBanner}
          <div class="msg-body">${isUser ? msg.text : this.formatMarkdown(msg.text)}</div>
          ${!isUser ? `
            <div class="msg-actions">
              <button class="btn-tts" data-msg-id="${msg.id}" title="Read aloud">🔊 Listen</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  bindSpeechButtons(container) {
    container.querySelectorAll(".btn-tts").forEach(btn => {
      btn.addEventListener("click", () => {
        const msgId = btn.getAttribute("data-msg-id");
        const history = this.db.getChatHistory();
        const msg = history.find(m => m.id === msgId);
        if (msg && this.speechSynth) {
          if (this.isSpeaking) {
            this.speechSynth.cancel();
            this.isSpeaking = false;
            btn.textContent = "🔊 Listen";
          } else {
            // Strip markdown chars for clean spoken audio
            const cleanText = msg.text.replace(/[#*`_>]/g, "").replace(/\n+/g, ". ");
            const utter = new SpeechSynthesisUtterance(cleanText);
            utter.rate = 1.0;
            utter.pitch = 1.0;
            utter.onend = () => {
              this.isSpeaking = false;
              btn.textContent = "🔊 Listen";
            };
            this.speechSynth.speak(utter);
            this.isSpeaking = true;
            btn.textContent = "⏹ Stop";
          }
        }
      });
    });
  }

  async sendMessage(text) {
    const container = document.getElementById("chatMessages");
    if (!container) return;

    // Save user message
    const userMsg = this.db.saveChatMessage({
      sender: "user",
      text: text
    });

    // Render user message immediately
    const userDiv = document.createElement("div");
    userDiv.innerHTML = this.formatMessageHTML(userMsg);
    container.appendChild(userDiv.firstElementChild);
    this.scrollToBottom();

    // Show typing indicator
    const typingId = "typing_" + Date.now();
    const typingDiv = document.createElement("div");
    typingDiv.className = "chat-message assistant-message typing-indicator-msg";
    typingDiv.id = typingId;
    typingDiv.innerHTML = `
      <div class="msg-avatar">🩺</div>
      <div class="msg-content-wrapper">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    container.appendChild(typingDiv);
    this.scrollToBottom();

    // Process via AI Engine
    try {
      const response = await this.aiEngine.processUserMessage(text);
      // Remove typing indicator
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();

      // Save assistant message
      const assistantMsg = this.db.saveChatMessage({
        sender: "assistant",
        text: response.text,
        triageLevel: response.triageLevel,
        triageBadge: response.triageBadge,
        source: response.source
      });

      // Render assistant message
      const asstDiv = document.createElement("div");
      asstDiv.innerHTML = this.formatMessageHTML(assistantMsg);
      container.appendChild(asstDiv.firstElementChild);
      this.bindSpeechButtons(container);
      this.scrollToBottom();

    } catch (err) {
      console.error("Error in chat processing:", err);
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();
    }
  }

  scrollToBottom() {
    const container = document.getElementById("chatMessages");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}
