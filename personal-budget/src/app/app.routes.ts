import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { P404Component } from './p404/p404.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent, pathMatch: 'full' },
  { path: 'about', component: AboutComponent }, // about route
  { path: 'login', component: LoginComponent }, // login route
  {path:'contact',component:ContactComponent},
  { path: '**', component: P404Component } // wildcard route for 404
];

