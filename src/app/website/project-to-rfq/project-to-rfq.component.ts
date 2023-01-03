import { apis } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from './data.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
    selector: 'app-project-to-rfq',
    templateUrl: './project-to-rfq.component.html',
    styleUrls: ['./project-to-rfq.component.css']
})
export class ProjectToRfqComponent implements OnInit {
    projectId: any
    userToken: any
    dataStatus = 'fetching'
    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        private dataService: DataService,
        private router: Router
    ) {
        this.projectId = this.route.snapshot.paramMap.get('P_Id')
        this.userToken = this.route.snapshot.paramMap.get('User_Token')
    }

    ngOnInit() {
        if (this.projectId && this.userToken != null) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            
            localStorage.setItem('token', this.userToken)
            const param = {
                project_id: this.projectId,
            };
            this.dataService.getRfqId(param).subscribe((resp: any) => {

                console.log(resp);
                localStorage.setItem('user', JSON.stringify(resp.data.user))

                this.router.navigate(['../../../customer/rfq/' + resp.data.rfq_id + '/packages'], { relativeTo: this.route })
                this.api.userLoggedInSource.next(true)
                this.dataStatus = 'done'
            })

        }

    }


}
