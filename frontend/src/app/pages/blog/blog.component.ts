import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Article {
  id: number;
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
  content: string[];
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['../landing/landing.scss'],
  template: `
    <div class="blog-page">
      <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 24px;">
        
        <!-- Hero Section -->
        <section class="blog-hero" style="text-align: center; padding: 120px 0 80px;">
          <div class="eyebrow" style="color: var(--brand-secondary); font-weight: 600; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.1em; font-size: 14px;">
            Company News
          </div>
          <h1 class="hero-title" style="font-size: 56px; line-height: 1.1; margin-bottom: 24px; color: var(--text-primary); font-weight: 700; letter-spacing: -0.02em;">
            Updates from Socrates.
          </h1>
          <p class="hero-subtitle" style="font-size: 20px; color: var(--text-secondary); max-width: 600px; margin: 0 auto; line-height: 1.6;">
            The latest product announcements, company milestones, and insights into the future of automated supply chains.
          </p>
        </section>

        <hr class="section-divider" style="border: none; border-top: 1px solid var(--border); margin: 0 0 80px;">

        <!-- Blog Grid -->
        <div class="blog-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 40px; margin-bottom: 120px;">
          
          @for (article of articles(); track article.id) {
            <article class="blog-card shadow-card" (click)="openArticle(article)">
              <div class="blog-image">
                <img [src]="article.image" [alt]="article.title" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;" class="card-img">
              </div>
              <div class="blog-content">
                <div class="blog-meta">
                  <span class="tag">{{ article.tag }}</span>
                  <span class="date">{{ article.date }}</span>
                </div>
                <h3>{{ article.title }}</h3>
                <p>{{ article.excerpt }}</p>
                <a class="read-more">Read article <span class="material-symbols-outlined" style="font-size: 16px;">arrow_forward</span></a>
              </div>
            </article>
          }

        </div>
      </div>
    </div>

    <!-- Article Reader Modal -->
    @if (selectedArticle()) {
      <div class="article-modal-overlay" (click)="closeArticle()">
        <div class="article-modal-content" (click)="$event.stopPropagation()">
          
          <button class="close-modal-btn" (click)="closeArticle()">
            <span class="material-symbols-outlined">close</span>
          </button>

          <div class="modal-header-image">
            <img [src]="selectedArticle()?.image" [alt]="selectedArticle()?.title">
          </div>

          <div class="modal-body">
            <div class="blog-meta" style="margin-bottom: 16px;">
              <span class="tag">{{ selectedArticle()?.tag }}</span>
              <span class="date">{{ selectedArticle()?.date }}</span>
            </div>
            
            <h2 class="modal-title">{{ selectedArticle()?.title }}</h2>
            
            <div class="modal-text">
              @for (paragraph of selectedArticle()?.content; track $index) {
                <p>{{ paragraph }}</p>
              }
            </div>
          </div>
          
        </div>
      </div>
    }
  `,
  styles: [`
    .shadow-card {
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    
    .blog-card {
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border);
      background: var(--bg-surface);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;
      display: flex;
      flex-direction: column;
    }
    
    .blog-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.1);
    }
    
    .blog-card:hover .read-more {
      color: var(--brand-secondary);
    }
    
    .blog-card:hover .card-img {
      transform: scale(1.05);
    }

    .blog-image {
      height: 220px;
      background: var(--bg-body);
      border-bottom: 1px solid var(--border);
      overflow: hidden;
    }

    .blog-content {
      padding: 32px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .blog-meta {
      font-size: 13px;
      color: var(--text-secondary);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .tag {
      font-weight: 600;
      color: var(--brand-primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 11px;
    }

    .blog-content h3 {
      font-size: 22px;
      margin: 0 0 16px;
      color: var(--text-primary);
      line-height: 1.3;
      font-weight: 700;
    }

    .blog-content p {
      font-size: 15px;
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0 0 24px;
      flex: 1;
    }
    
    .read-more {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
      font-size: 14px;
      color: var(--text-primary);
      text-decoration: none;
      transition: color 0.2s ease;
      margin-top: auto;
    }

    /* Modal Styles */
    .article-modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(10, 15, 30, 0.8);
      z-index: 99999;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      overflow-y: auto;
      padding: 40px 20px;
      backdrop-filter: blur(4px);
      animation: fadeIn 0.2s ease-out;
    }

    .article-modal-content {
      background: var(--bg-surface);
      width: 100%;
      max-width: 800px;
      border-radius: 16px;
      overflow: hidden;
      position: relative;
      box-shadow: 0 24px 48px rgba(0,0,0,0.2);
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      margin-bottom: 60px;
    }

    .close-modal-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(0,0,0,0.5);
      color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      transition: background 0.2s;
    }
    .close-modal-btn:hover {
      background: rgba(0,0,0,0.8);
    }

    .modal-header-image {
      width: 100%;
      height: 340px;
      background: var(--border);
    }
    .modal-header-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .modal-body {
      padding: 48px;
    }

    .modal-title {
      font-size: 40px;
      line-height: 1.2;
      color: var(--text-primary);
      margin: 0 0 32px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .modal-text p {
      font-size: 18px;
      line-height: 1.8;
      color: var(--text-secondary);
      margin: 0 0 24px;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @media (max-width: 768px) {
      .modal-body { padding: 24px; }
      .modal-title { font-size: 32px; }
      .modal-header-image { height: 240px; }
    }
  `]
})
export class BlogComponent {
  
  selectedArticle = signal<Article | null>(null);

  articles = signal<Article[]>([
    {
      id: 1,
      tag: 'Product',
      date: 'Sept 20, 2026',
      title: 'Announcing Automated PO Generation',
      excerpt: 'Socrates now autonomously drafts purchase orders when inventory thresholds are met, saving operations teams hours of manual entry every week.',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
      content: [
        'We are thrilled to announce one of our most requested features: Automated Purchase Order Generation. Available immediately for all Growth and Enterprise tier customers.',
        'Traditionally, procurement teams spend countless hours monitoring inventory dashboards, cross-referencing supplier spreadsheets, and manually drafting POs in legacy systems. This manual process is not just slowâ€”it introduces critical human errors that lead to stockouts or costly over-ordering.',
        'With Socratesâ€™ new automation engine, the system monitors your live SKU velocity. When an item hits its designated reorder threshold, Socrates instantly drafts a precision-calculated Purchase Order. It automatically selects the preferred vendor, calculates the optimal order quantity based on historical lead times, and stages the PO for one-click approval.',
        'This represents a massive step forward in our mission to replace manual data entry with intelligent, autonomous workflows. Log in to your dashboard today to set up your first automated threshold!'
      ]
    },
    {
      id: 2,
      tag: 'Engineering',
      date: 'Aug 14, 2026',
      title: 'Scaling to 10M+ SKU Capacities',
      excerpt: 'How our engineering team rebuilt the Socrates data ingestion engine from the ground up to support high-velocity retail networks across the globe.',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      content: [
        'When we first launched Socrates, our ingestion pipeline was designed for mid-market businesses tracking a few thousand SKUs. But as enterprise retail networks joined the platform, we rapidly outgrew our original architecture.',
        'Handling 10 million distinct SKUs across hundreds of global warehouses requires more than just scaling up database sizes. It requires rethinking how data flows. Our engineering team spent the last quarter entirely rewriting our core ingestion layer using Rust and Kafka to ensure real-time inventory updates without latency spikes.',
        'The result? Socrates can now process over 50,000 inventory state changes per second. Queries that used to take seconds now resolve in under 20 milliseconds, providing massive retail networks with a perfectly real-time view of their global stock.',
        'We believe that enterprise software shouldnâ€™t be slow. It should feel as fast and responsive as your favorite consumer apps, no matter how much data is sitting underneath it.'
      ]
    },
    {
      id: 3,
      tag: 'Industry',
      date: 'July 02, 2026',
      title: 'The Future of Supply Chain AI',
      excerpt: 'We explore the limitations of legacy tools and why Large Language Models and deterministic ML must work together to truly automate procurement operations.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      content: [
        'Artificial Intelligence is completely transforming how we interact with software, but the supply chain industry has been notably slow to adapt. Why? Because when you are dealing with millions of dollars of physical goods, you cannot afford "hallucinations."',
        'At Socrates, we believe the future of supply chain AI isnâ€™t just about putting a chatbot in front of a database. Itâ€™s about merging deterministic Machine Learning (which reliably predicts lead times and demand forecasting using hard math) with Large Language Models (which understand human context and intent).',
        'For example, our predictive engines handle the exact math of when you will run out of stock. But our LLM layer allows a warehouse manager to simply type, "Delay the steel shipment from Vendor X by two weeks and recalculate our safety stock." The system translates that natural language into complex operational commands.',
        'By combining the rigid accuracy of deterministic ML with the fluid interface of generative AI, we are building a procurement OS that is both incredibly powerful and incredibly intuitive.'
      ]
    },
    {
      id: 4,
      tag: 'Company',
      date: 'June 18, 2026',
      title: 'Introducing Vendor Risk Analytics',
      excerpt: 'A deep dive into our newest Enterprise feature that proactively flags vendor instability before it impacts your critical inventory velocity.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      content: [
        'Supply chains are only as strong as their weakest link. Over the past year, we have seen massive disruptions caused by single points of failure in vendor networks. Today, we are launching Vendor Risk Analytics to solve this.',
        'Available to our Enterprise tier, Vendor Risk Analytics actively monitors the health, delivery performance, and geopolitical exposure of your suppliers. Instead of reacting to a delayed shipment, Socrates proactively alerts you when a vendorâ€™s average lead time begins to slip over a 30-day period.',
        'Furthermore, the platform automatically suggests secondary suppliers from your approved network and can dynamically shift PO allocations to mitigate risk before a stockout ever occurs.',
        'We believe procurement teams should play offense, not defense. Vendor Risk Analytics gives you the radar you need to see disruptions coming from miles away.'
      ]
    },
    {
      id: 5,
      tag: 'Partnerships',
      date: 'May 30, 2026',
      title: 'Socrates x Shopify: Native Integration',
      excerpt: 'We\'ve officially launched our native Shopify integration, enabling seamless, bi-directional inventory syncing out of the box.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      content: [
        'For modern e-commerce brands, inventory visibility is everything. If your procurement software doesnâ€™t talk perfectly to your storefront, you risk overselling inventory or sitting on dead stock.',
        'That is why we are so excited to announce our native integration with Shopify. With just a few clicks, you can connect your Shopify storefront to your Socrates workspace.',
        'Socrates will automatically pull your entire SKU catalog, sync historical sales data to build demand forecasts, and push real-time inventory levels back to your store. No complex API setups, no middleware, and no manual CSV uploads required.',
        'This integration is available on all plans today. Log in to your workspace, navigate to the Settings panel, and click "Integrations" to get started!'
      ]
    },
    {
      id: 6,
      tag: 'Company',
      date: 'May 12, 2026',
      title: 'Out of Stealth: Hello World',
      excerpt: 'After a year of building alongside top logistics hubs, Socrates is officially out of stealth. Meet the procurement OS of the future.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      content: [
        'Hello World.',
        'For the last 14 months, we have been building in stealth. We didnâ€™t want to launch just another dashboard. We wanted to launch a fundamental rethink of how procurement software should work.',
        'Working hand-in-hand with operations managers at some of the busiest logistics hubs in the country, we identified the core rot in legacy supply chain software: it is reactive. It waits for you to tell it what to do.',
        'Today, we are thrilled to pull back the curtain on Socrates. We have built an active, intelligent Procurement OS that thinks ahead. It forecasts demand, automates purchasing, monitors vendor health, and provides unparalleled visibility into your physical operations.',
        'We are so grateful to our early design partners, our incredible engineering team, and our investors for believing in this vision. The future of the supply chain is automated, and the future starts today.'
      ]
    }
  ]);

  openArticle(article: Article) {
    this.selectedArticle.set(article);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  }

  closeArticle() {
    this.selectedArticle.set(null);
    // Restore background scrolling
    document.body.style.overflow = '';
  }
}


