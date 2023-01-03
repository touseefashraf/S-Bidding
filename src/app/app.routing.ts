import { PageNotFoundComponent } from './website/shared/page-not-found/page-not-found.component'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { NoAuthGuard } from './auth/no-auth-guard';

const routes: Routes = [
    {
        path: 'customer',
        loadChildren: () => import('./customer-panel/customer-panel.module')
            .then(mod => mod.CustomerPanelModule)
    },
    {
        path: '',
        loadChildren: () => import('./website/website.module')
            .then(mod => mod.WebsiteModule)
    },

    {
        path: '**',
        component: PageNotFoundComponent,
        data: { message: 'From ROOT' }
    }
]

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
    exports: [RouterModule]
})
export class AppRoutes { }
