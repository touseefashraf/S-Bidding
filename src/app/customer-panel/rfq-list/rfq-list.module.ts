import { ModalModule } from 'ngx-bootstrap/modal';
import { DataService } from './data.service'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RfqListComponent } from './rfq-list.component'
import { SharedModule } from 'src/app/website/shared/shared.module'

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forRoot(),
    RouterModule.forChild([
        {
            path: '',
            component: RfqListComponent
        }
    ])
  ],
  declarations: [RfqListComponent],
  providers:[DataService]
})
export class RfqListModule { }
