import { SafeHtmlPipe } from './../../pipes/safe-html.pipe';
import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhyUsComponent } from './why-us.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: WhyUsComponent }
    ])
  ],
  declarations: [WhyUsComponent],
})
export class WhyUsModule { }
