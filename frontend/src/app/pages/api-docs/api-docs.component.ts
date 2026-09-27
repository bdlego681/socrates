import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-api-docs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styleUrls: ['../landing/landing.scss', './api-docs.component.css'],
  templateUrl: './api-docs.component.html'
})
export class ApiDocsComponent {}

