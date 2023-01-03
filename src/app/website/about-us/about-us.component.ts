import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-about-us',
    templateUrl: './about-us.component.html',
    styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

    constructor(
        public apiService: ApiService,
        private route: Router,
    ) {
        this.apiService.activeTab='about-us'
        console.log(this.apiService.activeTab);


     }

    ngOnInit() {
    }

}
