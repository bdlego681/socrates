
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { PublicHeaderComponent } from "../public-header/public-header.component";
import { PublicFooterComponent } from "../public-footer/public-footer.component";

@Component({
  selector: "app-public-layout",
  standalone: true,
  imports: [RouterOutlet, PublicHeaderComponent, PublicFooterComponent],
  template: `
    <div class="landing-page">
      <!-- Ambient Global Glows -->
      <div class="global-accent-glow"></div>
      <div class="global-accent-glow-2"></div>
      
      <div class="relative-z" style="display: flex; flex-direction: column; min-height: 100vh;">
        <app-public-header></app-public-header>
        
        <main style="flex: 1; display: flex; flex-direction: column;">
          <router-outlet></router-outlet>
        </main>
        
        <app-public-footer></app-public-footer>
      </div>
    </div>
  `,
  styleUrls: ["../../pages/landing/landing.scss"]
})
export class PublicLayoutComponent {}

