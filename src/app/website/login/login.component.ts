import { socialLoginUrls } from 'src/environments/environment'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { ApiService } from '../../services/api.service'
import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { appURL } from '../../../environments/environment'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    tbdUrl = appURL
    loginForm: FormGroup
    loginLoading = false
    state: any = ''
    msg: any = ''

    constructor(
        private api: ApiService,
        private router: Router,
        private fb: FormBuilder,
        public ui: UIHelpers,
        public alert: IAlertService,
        public route: ActivatedRoute,
    ) {
        this.api.activeTab='sign-in'
        this.loginForm = this.fb.group({
            email: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.email]),
            password: new FormControl(null, [Validators.required]),
        })
    }

    get g() {
        return this.loginForm.controls
    }

    ngOnInit() {
        this.msg = history.state.data;
    }

    login(data: any): boolean {
        this.loginLoading = true
        if (data.status === 'INVALID') {
            this.alert.error('Please enter data in all fields and try again.')
            this.loginLoading = false

            return false
        }
        data.value.device_name = 'web'
        data.value.domain = 'sb'
        this.api.login(data.value).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                this.alert.success('Login successfull')
                this.api.doUserRedirects(resp, this.router)
                this.api.userLoggedInSource.next(true)
            }
        })
    }
    goto(url){
        this.router.navigate(['../'+url], { relativeTo: this.route })
    }
    gotoforget(url){
        // this.router.navigate(['../'+url], { relativeTo: this.route })
        window.location.href ='http://tbd.omairusaf.com/'+url

    }
}
