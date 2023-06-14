import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CoursesComponent } from './components/courses/courses.component';
import { SchedulingComponent } from './components/scheduling/scheduling.component';
import { CamilleComponent } from './components/camille/camille.component';
import { ReneeComponent } from './components/renee/renee.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { LoginGuard } from './shared/guard/login.guard';
import { TokenComponent } from './components/token/token.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pagina-inicial',
    pathMatch: 'full'
  },
  {
    path: 'pagina-inicial',
    component: HomeComponent,
  },
  {
    path: 'cursos',
    component: CoursesComponent,
  },
  {
    path: 'camille',
    component: CamilleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'renee',
    component: ReneeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'pagina-inicial',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
