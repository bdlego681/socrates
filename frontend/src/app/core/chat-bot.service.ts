import { Injectable } from '@angular/core';

export interface BotResponse {
  text: string;
  action?: 'transfer_to_agent';
  options?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {
  
  private agentConnected = false;

  // Expanded & Weighted Knowledge Base
  // Ordered from most specific to most generic to break ties effectively
  private readonly knowledgeBase = [
    {
      keywords: ['seat', 'user', 'member', 'team', 'login'],
      response: 'Our Starter plan includes up to 2 seats, the Growth plan includes up to 5 seats, and our Enterprise plan offers unlimited seats for your whole organization.'
    },
    {
      keywords: ['sku', 'product', 'inventory', 'capacity', 'limit', 'catalog'],
      response: 'You can manage up to 2,500 SKUs on Starter, 10,000 SKUs on Growth, and Unlimited SKUs on our Enterprise tier.'
    },
    {
      keywords: ['po ', 'purchase order', 'automat', 'generate', 'draft'],
      response: 'Starter includes Basic PO generation. Upgrading to Growth or Enterprise unlocks fully Automated PO generation, instantly drafting orders when inventory hits defined thresholds.'
    },
    {
      keywords: ['trial', 'free test', 'risk-free'],
      response: 'We offer a 30-day free trial on all standard plans so you can experience Socrates risk-free. After 30 days, your selected billing cycle begins.'
    },
    {
      keywords: ['shopify', 'bigcommerce', 'integration', 'sync', 'ecommerce', 'e-commerce'],
      response: 'Socrates seamlessly integrates natively with Shopify and BigCommerce across all of our plans to keep your data perfectly synced.'
    },
    {
      keywords: ['erp', 'netsuite', 'sap', 'custom backend'],
      response: 'Custom ERP connections (like NetSuite and SAP), dedicated account managers, SSO/SAML, and advanced vendor risk analytics are exclusively available on our Enterprise plan.'
    },
    {
      keywords: ['api', 'developer', 'rest endpoint'],
      response: 'REST API Access is available starting on our Growth plan (Rate Limited), with Unlimited API access reserved for Enterprise customers.'
    },
    {
      keywords: ['support', 'customer service', 'helpdesk', 'issue'],
      response: 'Starter includes Standard Email support. Growth upgrades you to Priority Email support, and Enterprise customers receive a Dedicated Account Manager (CSM).'
    },
    {
      keywords: ['faq', 'guide', 'doc', 'setup'],
      response: 'You can find our setup guides, API docs, and full FAQs in our Knowledge Base at support.socrates.com.'
    },
    {
      keywords: ['about', 'mission', 'what is socrates', 'who are'],
      response: 'Socrates is an AI-driven supply chain management platform. We replace bloated legacy software with streamlined, intelligent workflows to empower modern operations teams.'
    },
    {
      // General pricing terms at the bottom to avoid overriding specific feature queries
      keywords: ['price', 'cost', 'pay', 'monthly', 'yearly', 'expensive', 'how much', 'fee', 'plan'],
      response: 'We offer a Starter plan (/mo) and a Growth plan (/mo). You save 20% by paying annually! We also offer custom Enterprise pricing. Would you like to speak to an agent for more details?'
    },
    {
      keywords: ['agent', 'human', 'person', 'speak', 'talk', 'representative', 'real', 'live'],
      response: 'Transferring you to the next available agent...',
      action: 'transfer_to_agent' as const
    }
  ];

  private readonly agentReplies = [
    "I can certainly help with that.",
    "Let me pull up your account details.",
    "Give me just one moment to look into that for you.",
    "Could you provide a bit more context so I can best assist?",
    "Thanks for that information. I'm checking right now."
  ];

  constructor() {}

  public isAgentConnected(): boolean {
    return this.agentConnected;
  }

  public setAgentConnected(status: boolean): void {
    this.agentConnected = status;
  }

  public async getResponse(userMessage: string): Promise<BotResponse> {
    const delay = 1000 + Math.random() * 800;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.evaluateMessage(userMessage.toLowerCase()));
      }, delay);
    });
  }

  private evaluateMessage(input: string): BotResponse {
    if (this.agentConnected) {
      const reply = this.agentReplies[Math.floor(Math.random() * this.agentReplies.length)];
      return { text: reply };
    }

    let bestMatch = null;
    let highestScore = 0;

    for (const entry of this.knowledgeBase) {
      // Score this entry based on how many of its keywords are found in the input
      const score = entry.keywords.reduce((acc, keyword) => {
        return acc + (input.includes(keyword) ? 1 : 0);
      }, 0);

      // We use > so that ties go to the FIRST matched item (which is why specific features are listed first)
      if (score > highestScore) {
        highestScore = score;
        bestMatch = entry;
      }
    }

    if (bestMatch && highestScore > 0) {
      return { 
        text: bestMatch.response, 
        action: bestMatch.action 
      };
    }

    return {
      text: "I am a virtual assistant and am still learning. Would you like me to connect you with a live agent to better answer your question?",
      options: ['Speak to a live agent', 'View FAQs']
    };
  }
}
