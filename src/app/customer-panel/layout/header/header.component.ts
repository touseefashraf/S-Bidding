import { ActivatedRoute, Params, Router } from '@angular/router'
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown'
import { ApiService } from '../../../services/api.service'
import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core'
import { ConstantsService } from 'src/app/services/constants.service'
import { DataService } from '../data.service'
import { appURL, tbdUrl } from '../../../../environments/environment'
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: false, autoClose: true } }]
})
export class HeaderComponent implements OnInit, AfterViewInit {
    isAuthenticated = false
    isCustomer = false
    isCollapsed = true
    carSubscribe: any
    addAuction =  false
    tbdUrl = tbdUrl
    token:any = ''

    constructor(
        public api: ApiService,
        public cs: ConstantsService,
        public router: Router,
        private route: ActivatedRoute,
        public renderer2: Renderer2,
        public ds: DataService
    ) {
        api.userLoggedInObs.subscribe(m => {
            this.isAuthenticated = m
            if (this.isAuthenticated) {
                this.ds.getSubscriptionStatus().subscribe((resp: any) => {
                    if (resp.success == true) {

                        this.addAuction = true
                    } 
                    this.token = resp.data
                })
                this.loginUpdates()
            }
        })
    }
    ngOnInit() {
    }

    loginUpdates(): void {
        this.isCustomer = this.api.isCustomer()
    }

    logOut(): void {
        this.api.logOutSession().subscribe((resp: any) => {
            const check = this.api.logOut()
            if (check) {
                location.reload()
            }
        })
    }

    ngAfterViewInit() {
    }

    setCollapsed() {
        this.isCollapsed = !this.isCollapsed;
    }
    gotoTBD(){
        window.open(this.tbdUrl+'/subbidding-plans/'+this.token)
    }
}
