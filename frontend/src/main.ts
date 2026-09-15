import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { credentialsInterceptor } from './app/core/auth.service';
bootstrapApplication(AppComponent, { providers: [provideRouter(routes, withComponentInputBinding()), provideHttpClient(withInterceptors([credentialsInterceptor]))] }).catch(console.error);
