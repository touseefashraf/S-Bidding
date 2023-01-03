import { ApiService } from './../../services/api.service';
import { DataService } from './data.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-rfq',
    templateUrl: './rfq.component.html',
    styleUrls: ['./rfq.component.css']
})
export class RfqComponent implements OnInit {
    projectUserId: any;
    loggedinUserId: any;

    constructor(
        private route: ActivatedRoute,
        public dataService: DataService,
        private api: ApiService
    ) {
        this.api.activeTab='rfq'
    }

    ngOnInit() {
        // this.dataService.rfqId = +this.route.snapshot.paramMap.get('rfqId')
        this.route.paramMap.subscribe((params: any) => {
            this.dataService.rfqId = +params.get('rfqId')
            if (this.dataService.rfqId > 0) {
                this.dataService.rfqDataStatus.next('fetching')
                this.dataService.getRFQDetails(this.dataService.rfqId).subscribe((resp: any) => {
                    if (resp.success) {
                        this.dataService.rfq = resp.data
                    } else {
                        console.log('INVALID ID')
                    }
                    this.dataService.rfqDataStatus.next('done')
                    this.loggedinUserId = this.api.user.id
                    this.projectUserId = this.dataService.rfq.project.user_id
                })
            } else {
                this.dataService.rfq = null
                this.dataService.rfqDataStatus.next('done')
                // this.loggedinUserId = this.api.user.id
                // this.projectUserId = this.dataService.rfq.project.user_id
            }
        })
    }

}
