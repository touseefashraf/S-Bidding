import { trigger, transition, style, animate } from '@angular/animations'
import { ApiService } from './../services/api.service'
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router'
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core'
import { CustomerPanelService } from '../services/customer-panel.service';

@Component({
    selector: 'app-customer-panel',
    templateUrl: './customer-panel.component.html',
    styleUrls: ['./customer-panel.component.css'],
})
export class CustomerPanelComponent implements OnInit, OnDestroy, AfterViewInit {
    isLoading: boolean

    constructor(
        private route: Router,
        public api: ApiService,
    ) {
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
    }
}
