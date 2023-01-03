import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AboutUsComponent } from './about-us.component'
import { SharedModule } from '../shared/shared.module'
import { RouterModule } from '@angular/router'

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
        { path: '', component: AboutUsComponent }
    ])
  ],
  declarations: [AboutUsComponent]
})
export class AboutUsModule { }
