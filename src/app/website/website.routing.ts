import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component'
import { WebsiteComponent } from './website.component'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { WebsiteGuard } from '../auth/website-guard'
import { NoAuthGuard } from '../auth/no-auth-guard'

const routes: Routes = [
    {
        path: '',
        component: WebsiteComponent,
        canActivate: [WebsiteGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('./index/index.module')
                    .then(mod => mod.IndexModule)
            },
            {
                path: 'login',
                canActivate: [NoAuthGuard],
                loadChildren: () => import('./login/login.module')
                    .then(mod => mod.LoginModule)
            },
            {
                path: 'registration',
                canActivate: [NoAuthGuard],
                loadChildren: () => import('./registration/registration.module')
                    .then(mod => mod.RegistrationModule)
            },
            {
                path: 'about-us',
                loadChildren: () => import('./about-us/about-us.module')
                    .then(mod => mod.AboutUsModule)
            },
            {
                path: 'contact-us',
                loadChildren: () => import('./contact-us/contact-us.module')
                    .then(mod => mod.ContactUsModule)
            },
            {
                path: 'why-us',
                loadChildren: () => import('./why-us/why-us.module')
                    .then(mod => mod.WhyUsModule)
            },
            {
                path: 'project-to-rfq/:P_Id/:User_Token',
                loadChildren: () => import('./project-to-rfq/project-to-rfq.module')
                    .then(mod => mod.ProjectToRfqModule)
            },
            {
                path: '**',
                component: PageNotFoundComponent,
                data: { message: 'From Website' }
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WebsiteRoutes { }
