import { ActivatedRoute, Params, Router } from '@angular/router'
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown'
import { ApiService } from '../../../services/api.service'
import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core'
import { ConstantsService } from 'src/app/services/constants.service'
import { DataService } from 'src/app/website/layout/data.service'
import { appURL } from '../../../../environments/environment'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: false, autoClose: true } }]
})
export class HeaderComponent implements OnInit, AfterViewInit {
    isAuthenticated = false
    isCustomer = false
    isQto = false
    isAdmin = false
    isDeo = false
    isCollapsed = true
    tbdUrl = appURL
    carSubscribe: any
    addAuction = false

    constructor(
        public api: ApiService,
        public cs: ConstantsService,
        public router: Router,
        private route: ActivatedRoute,
        public renderer2: Renderer2,
        public ds: DataService,
        public alert: IAlertService,
    ) {
        api.userLoggedInObs.subscribe(m => {
            this.isAuthenticated = m
            if (this.isAuthenticated) {
                this.loginUpdates()
                this.ds.getSubscriptionStatus().subscribe((resp: any) => {
                    if (resp.success == true) {

                        this.addAuction = true
                    }
                })
            }
        })
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

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    setCollapsed() {
        this.isCollapsed = !this.isCollapsed;
    }
    gotoTBD(){
        this.alert.error('Please Subscribe for SubBidding')
        window.location.href = this.tbdUrl+'/subbidding-plans'

    }
}
