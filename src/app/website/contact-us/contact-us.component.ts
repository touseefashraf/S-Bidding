import { UIHelpers } from './../../helpers/ui-helpers'
import { Router, ActivatedRoute } from '@angular/router'
import { Component, OnInit, Input } from '@angular/core'
import { ApiService } from 'src/app/services/api.service'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { apis } from '../../../environments/environment'

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
    googleCaptcha = ''
    public resolved(captchaResponse: string) {
        this.googleCaptcha = captchaResponse
    }
    siteKey = apis.googleCaptchaSiteKey
    @Input() index: number
    contactUs: FormGroup
    simpleError: string
    dataService: any
    isSubmitted = <boolean>false
    formShow = true
    pageContent: any
    dataStatus = false

    constructor(
        public apiService: ApiService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService

    ) {
        this.apiService.activeTab='contact-us'
        console.log(this.apiService.activeTab);


        this.contactUs = this.fb.group({
            id: new FormControl(null, []),
            name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(255)]),
            contact_no: new FormControl(null, [Validators.required, Validators.maxLength(11)]),
            subject: new FormControl(null, [Validators.required, Validators.maxLength(155)]),
            message: new FormControl(null, [Validators.required, Validators.maxLength(500)])
        })
        const params = {
            route: 'contact-us'
        }
        this.apiService.getPageContent(params).subscribe((resp: any) => {
            if (resp.success === true) {
                this.pageContent = JSON.parse(resp.data.page_data)
                console.log(this.pageContent)
                this.dataStatus = true
            }
        })
    }

    ngOnInit() {
    }

    get g() {
        return this.contactUs.controls
    }
    replaceAll(str, find, replace) {
        var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return str.replace(new RegExp(escapedFind, 'g'), replace);
    }

    save(data: any): boolean {
        if (data.status === 'INVALID' || this.googleCaptcha == '') {
            this.alert.error('Please eneter valid data in all fields and try again')

            return false
        }

        let saveMethod = this.apiService.saveContactUs(data.value)

        saveMethod.subscribe((resp: any) => {
            if (resp.success === false) {
                this.simpleError = resp.errors.general

                return false
            } else {
                this.formShow = false
                data.value.id = resp.data
                this.apiService.saveContactUs(data.value)
                this.isSubmitted = true
            }
        })
    }
}
