import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RecaptchaModule } from 'ng-recaptcha';
import { AgmCoreModule } from '@agm/core';
import { apis } from 'src/environments/environment';
import { DataService } from './data.service';

@NgModule({
  imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        RecaptchaModule,
        ReactiveFormsModule,
        AgmCoreModule.forRoot({
            apiKey: apis.googleApiKey,
            libraries: ['places']
        }),
    RouterModule.forChild([
        { path: '', component: RegistrationComponent}
    ])
  ],
  declarations: [RegistrationComponent],
  providers:[DataService]
})
export class RegistrationModule { }
