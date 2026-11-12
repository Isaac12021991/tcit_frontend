import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostFormComponent } from './components/post-form/post-form.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Inicio | Aplicación de Briefs'
  },
  {
    path: 'posts',
    component: PostListComponent,
    title: 'Listado de Posts | Aplicación de Briefs'
  },
  {
    path: 'posts/new',
    component: PostFormComponent,
    title: 'Nuevo Post | Aplicación de Briefs'
  },
  {
    path: 'posts/:id/edit',
    component: PostFormComponent,
    title: 'Editar Post | Aplicación de Briefs'
  },
  {
    path: '**',
    redirectTo: ''
  }
];

