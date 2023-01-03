import { IAlertService } from './../../libs/ialert/ialerts.service'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ApiService } from '../../services/api.service'
import { DataService } from './data.service'
import { appURL } from '../../../environments/environment'

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, OnDestroy {
    companyImagesData = []
    lastImageId = 0
    totalImageDataLength = 0
    intervalValue: any
    isAuthenticated = false
    addAuction = false
    tbdUrl = appURL
    constructor(
        public api: ApiService,
        public alert: IAlertService,
        public ds: DataService
    ) {
        this.api.activeTab=''
        api.userLoggedInObs.subscribe(m => {
            this.isAuthenticated = m
            if (this.isAuthenticated) {
                this.ds.getSubscriptionStatus().subscribe((resp: any) => {
                    if (resp.success == true) {

                        this.addAuction = true
                    }
                })
            }
        })
        this.ds.getCompanyImages().subscribe((resp: any) => {
            if (resp.success == true) {
                this.companyImagesData = resp.data
                if (this.companyImagesData.length > 0) {
                    this.lastImageId = this.companyImagesData[this.companyImagesData.length - 1].id
                    this.totalImageDataLength = this.companyImagesData.length
                    let imageIndex = 1
                    let position = 150
                    let scrolledValue = -1
                    this.intervalValue = setInterval(() => {
                        const totalScrolledContent = document.getElementById('images-container').scrollLeft
                        if (totalScrolledContent == scrolledValue) {
                            position = 150
                            document.getElementById('images-container').scrollTo(0, 0)

                            return false
                        } else {
                            scrolledValue = totalScrolledContent
                        }
                        // console.log('hello');

                        document.getElementById('images-container').scrollTo(position, 0)
                        position = position + 150
                        imageIndex = (imageIndex + 1) == this.companyImagesData.length ? 0 : imageIndex + 1
                        const clintTotalWidth = document.getElementById('images-container').clientWidth
                        const contentTotalWidth = document.getElementById('images-container').scrollWidth
                    }, 3000)
                }
            }
        })

    }
    ngOnInit() {
    }
    ngOnDestroy(): void {
        clearInterval(this.intervalValue)
    }
    gotoTBD(){
        window.location.href = this.tbdUrl+'/subbidding-plans'
    }
}
