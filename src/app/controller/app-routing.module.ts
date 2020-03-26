import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NotFoundComponent} from '../user/static-pages/component/not-found/not-found.component';
import {QuicklinkStrategy} from 'ngx-quicklink';


const routes: Routes = [
  // {path: '', loadChildren: () => import('../user/user.module').then(m => m.UserModule)},
  // {path: 'de', loadChildren: () => import('../user/user.module').then(m => m.UserModule)},
  {path: '', loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule)},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload',
    preloadingStrategy: QuicklinkStrategy
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

export const routingComponents = [NotFoundComponent];
