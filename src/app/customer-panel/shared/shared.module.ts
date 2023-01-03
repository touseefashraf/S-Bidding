import { LoaderComponent } from './loader/loader.component'
import { IRatingModule } from 'src/app/libs/irating/irating.module'
import { IAlertsModule } from 'src/app/libs/ialert/ialerts.module'

import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { ResponseComponent } from './response/response.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

@NgModule({
    imports: [
        CommonModule,
        IAlertsModule,
        IRatingModule,
    ],
    declarations: [
        ResponseComponent,
        PageNotFoundComponent,
        LoaderComponent
    ],
    exports: [
        CommonModule, LoaderComponent, ResponseComponent, PageNotFoundComponent,
        IAlertsModule, IRatingModule
    ]
})
export class SharedModule { }
