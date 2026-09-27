import { Component, signal, ViewChild, ElementRef, AfterViewChecked, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatBotService } from '../../../core/chat-bot.service';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'bot' | 'user' | 'agent';
  timestamp: Date;
}

@Component({
  selector: 'app-live-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating Action Button -->
    <button class="chat-fab" (click)="toggleChat($event)" [class.is-open]="isOpen()">
      @if (!isOpen()) {
        <span class="material-symbols-outlined" style="font-size: 28px;">chat</span>
      } @else {
        <span class="material-symbols-outlined" style="font-size: 28px;">expand_more</span>
      }
    </button>

    <!-- Chat Window -->
    @if (isOpen()) {
      <div class="chat-window shadow-card" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="chat-header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="avatar">
              <span class="material-symbols-outlined" style="font-size: 20px;">support_agent</span>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 16px; font-weight: 700;">Socrates Support</h3>
              <p style="margin: 0; font-size: 12px; opacity: 0.8;">
                {{ chatService.isAgentConnected() ? 'Connected with Sarah' : 'Typically replies in a few minutes' }}
              </p>
            </div>
          </div>
          
          <button class="end-chat-btn" (click)="promptEndChat()">End Chat</button>
        </div>

        <!-- Messages Area -->
        <div class="chat-messages" #messagesContainer>
          @for (msg of messages(); track msg.id) {
            <div class="message-bubble" [ngClass]="msg.sender">
              <p style="margin: 0; font-size: 14px; line-height: 1.4; word-break: break-word; white-space: pre-wrap;">{{ msg.text }}</p>
              <span class="timestamp">{{ msg.timestamp | date:'shortTime' }}</span>
            </div>
          }

          @if (isTyping()) {
            <div class="message-bubble bot typing-indicator">
              <span></span><span></span><span></span>
            </div>
          }
        </div>

        <!-- Action / Input Area -->
        <div class="chat-input-area">
          @if (showOptions() && !chatService.isAgentConnected()) {
            <div class="options-container">
              <button class="chip-btn" (click)="selectOption('View FAQs')">View FAQs</button>
              <button class="chip-btn" (click)="selectOption('Pricing & Plans')">Pricing & Plans</button>
              <button class="chip-btn" (click)="selectOption('Speak to a live agent')">Speak to Agent</button>
            </div>
          }
          
          <form (submit)="sendMessage($event)" style="display: flex; gap: 8px; align-items: flex-end;">
            <textarea [(ngModel)]="userMessage" name="userMessage" placeholder="Type your message..." class="form-control" style="flex: 1; padding: 8px 12px; font-size: 14px; resize: none; min-height: 40px; max-height: 100px; font-family: inherit; line-height: 1.4; overflow-y: auto;" rows="1" [disabled]="isTyping()" (keydown)="handleKeydown($event)"></textarea>
            <button type="submit" class="send-btn" [disabled]="!userMessage.trim() || isTyping()">
              <span class="material-symbols-outlined" style="font-size: 20px;">send</span>
            </button>
          </form>
        </div>

        <!-- End Chat Overlay Prompt -->
        @if (showEndPrompt()) {
          <div class="end-chat-overlay">
            <div class="end-chat-modal">
              <h4 style="margin: 0 0 8px; font-size: 16px; color: var(--text-primary);">End Chat?</h4>
              <p style="margin: 0 0 16px; font-size: 13px; color: var(--text-secondary); line-height: 1.5;">Are you sure you'd like to end this chat? Your conversation history will be cleared.</p>
              <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button class="btn" style="background: white; color: var(--text-primary); border: 1px solid var(--border-strong); padding: 6px 12px; font-size: 13px; border-radius: 6px; font-weight: 600; cursor: pointer;" (click)="showEndPrompt.set(false)">Cancel</button>
                <button class="btn" style="background: #e53e3e; color: white; border: none; padding: 6px 12px; font-size: 13px; border-radius: 6px; font-weight: 600; cursor: pointer;" (click)="hardClose()">End Chat</button>
              </div>
            </div>
          </div>
        }

      </div>
    }
  `,
  styles: [`
    .chat-fab {
      position: fixed;
      bottom: 32px;
      right: 32px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--brand-primary);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(35, 50, 97, 0.3);
      z-index: 9999;
      transition: transform 0.2s, background 0.2s;
    }
    .chat-fab:hover {
      transform: scale(1.05);
      background: var(--brand-secondary);
    }
    .chat-fab.is-open {
      background: var(--text-primary);
    }
    
    .chat-window {
      position: fixed;
      bottom: 110px;
      right: 32px;
      width: 360px;
      height: 520px;
      max-height: calc(100vh - 140px);
      background: var(--bg-surface);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      z-index: 9998;
      border: 1px solid var(--border);
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .shadow-card {
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }

    .chat-header {
      background: var(--brand-primary);
      color: white;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      z-index: 2;
    }
    
    .end-chat-btn {
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.3);
      color: white;
      font-size: 11px;
      font-weight: 600;
      padding: 6px 10px;
      border-radius: 100px;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 4px;
    }
    .end-chat-btn:hover {
      background: rgba(255,255,255,0.25);
    }

    .avatar {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chat-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: var(--bg-body);
      z-index: 1;
    }

    .message-bubble {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 16px;
      position: relative;
    }
    .message-bubble.bot, .message-bubble.agent {
      background: white;
      border: 1px solid var(--border);
      color: var(--text-primary);
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .message-bubble.user {
      background: var(--brand-secondary);
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }

    .timestamp {
      font-size: 10px;
      display: block;
      margin-top: 4px;
      opacity: 0.7;
      text-align: right;
    }

    .chat-input-area {
      padding: 16px;
      background: white;
      border-top: 1px solid var(--border);
      z-index: 2;
    }

    .options-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding-bottom: 12px;
      margin-bottom: 12px;
      border-bottom: 1px solid var(--border-light, #f0f0f0);
    }
    
    .chip-btn {
      background: white;
      border: 1px solid var(--brand-secondary);
      color: var(--brand-secondary);
      padding: 6px 14px;
      border-radius: 100px;
      font-weight: 600;
      font-size: 12px;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    .chip-btn:hover {
      background: var(--brand-secondary);
      color: white;
    }

    .send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--brand-primary);
      color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 16px !important;
    }
    .typing-indicator span {
      width: 6px;
      height: 6px;
      background: var(--text-muted);
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out both;
    }
    .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
    .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
    
    .end-chat-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.6);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease-out;
    }
    
    .end-chat-modal {
      background: var(--bg-surface);
      border-radius: 12px;
      padding: 24px;
      width: 80%;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
  `]
})
export class LiveChatComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  chatService = inject(ChatBotService);

  isOpen = signal(false);
  showEndPrompt = signal(false);
  
  messages = signal<ChatMessage[]>([
    {
      id: 1,
      text: 'Hi there! \uD83D\uDC4B How can we help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  showOptions = signal(true);
  isTyping = signal(false);
  userMessage = '';
  
  private messageIdCounter = 2;

  constructor() {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isOpen()) {
      this.isOpen.set(false);
    }
  }

  toggleChat(event?: Event) {
    event?.stopPropagation();
    this.isOpen.update(v => !v);
  }

  promptEndChat() {
    this.showEndPrompt.set(true);
  }

  hardClose() {
    this.isOpen.set(false);
    this.showEndPrompt.set(false);
    
    // Reset state after UI closes
    setTimeout(() => {
      this.messages.set([
        {
          id: 1,
          text: 'Hi there! \uD83D\uDC4B How can we help you today?',
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      this.chatService.setAgentConnected(false);
      this.showOptions.set(true);
      this.isTyping.set(false);
      this.userMessage = '';
      this.messageIdCounter = 2;
    }, 300);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }

  handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage(e);
    }
  }

  async selectOption(option: string) {
    this.showOptions.set(false);
    this.addMessage(option, 'user');
    await this.processBotResponse(option);
  }

  async sendMessage(e: Event) {
    e.preventDefault();
    const msg = this.userMessage.trim();
    if (!msg) return;
    
    this.addMessage(msg, 'user');
    this.userMessage = '';
    this.showOptions.set(false);
    
    await this.processBotResponse(msg);
  }

  private async processBotResponse(input: string) {
    this.isTyping.set(true);
    
    const response = await this.chatService.getResponse(input);
    
    this.isTyping.set(false);
    
    if (response.action === 'transfer_to_agent') {
      this.addMessage(response.text, 'bot');
      this.isTyping.set(true);
      
      // Simulate connection delay
      setTimeout(() => {
        this.isTyping.set(false);
        this.chatService.setAgentConnected(true);
        this.addMessage('Hi, I am Sarah. How can I help you today?', 'agent');
      }, 2000);
    } else {
      const senderType = this.chatService.isAgentConnected() ? 'agent' : 'bot';
      this.addMessage(response.text, senderType);
      
      if (response.options && response.options.length > 0 && !this.chatService.isAgentConnected()) {
        this.showOptions.set(true); // Bring options back if suggested by bot
      }
    }
  }

  private addMessage(text: string, sender: 'bot' | 'user' | 'agent') {
    this.messages.update(msgs => [
      ...msgs, 
      { id: this.messageIdCounter++, text, sender, timestamp: new Date() }
    ]);
  }
}
