import { SubbiddingDocumentsComponent } from './subbidding-documents/subbidding-documents.component';
import { AgmCoreModule } from '@agm/core'
import { apis } from './../../../environments/environment';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DataService } from './data.service'
import { InvitationsComponent } from './invitations/invitations.component'
import { QtoDocumentsComponent } from './qto-documents/qto-documents.component'
import { DocumentsComponent } from './documents/documents.component'
import { PackagesComponent } from './packages/packages.component'
import { ProjectDetailsComponent } from './project-details/project-details.component'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared/shared.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RfqComponent } from './rfq.component'
import { AutocompleteLibModule } from 'angular-ng-autocomplete'

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        ReactiveFormsModule,
        AutocompleteLibModule,
        SharedModule,
        FormsModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: apis.googleApiKey,
            libraries: ['places']
        }),
        RouterModule.forChild([
            {
                path: '',
                component: RfqComponent,
                children: [
                    {
                        path: 'project-details',
                        component: ProjectDetailsComponent
                    },
                    {
                        path: 'packages',
                        component: PackagesComponent
                    },
                    {
                        path: 'documents/:docType',
                        component: DocumentsComponent
                    },
                    {
                        path: 'qto-documents/:docType',
                        component: QtoDocumentsComponent
                    },
                    {
                        path: 'subbidding-documents',
                        component: SubbiddingDocumentsComponent
                    },
                    {
                        path: 'invitations',
                        component: InvitationsComponent
                    }
                ]
            }
        ])
    ],
    declarations: [RfqComponent, InvitationsComponent, QtoDocumentsComponent,SubbiddingDocumentsComponent, DocumentsComponent, PackagesComponent, ProjectDetailsComponent],
    providers: [DataService]
})
export class RfqModule { }
