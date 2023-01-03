import { CustomerPanelService } from './../services/customer-panel.service';
import { CustomerPanelComponent } from './customer-panel.component';
import { CustomerPanelRoutes } from './customer-panel.routing';
import { LayoutModule } from './layout/layout.module'
import { SharedModule } from './shared/shared.module'
import { NgModule } from '@angular/core'

@NgModule({
    imports: [
        SharedModule,
        LayoutModule,
        CustomerPanelRoutes
    ],
    declarations: [CustomerPanelComponent],
    providers: [
        CustomerPanelService
    ]
})
export class CustomerPanelModule {
}
