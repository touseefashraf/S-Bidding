import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'
import { ProjectToRfqComponent } from './project-to-rfq.component';
import { DataService } from '../project-to-rfq/data.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
        { path: '', component:ProjectToRfqComponent }
    ])
  ],
  declarations: [ProjectToRfqComponent],
  providers:[DataService]
})
export class ProjectToRfqModule { }
