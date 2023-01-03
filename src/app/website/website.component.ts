import { trigger, transition, style, animate } from '@angular/animations'
import { ApiService } from './../services/api.service'
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router'
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core'
import { WebsiteService } from '../services/website.service';

@Component({
    selector: 'app-website',
    templateUrl: './website.component.html',
    styleUrls: ['./website.component.css'],
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                style({ transform: 'translateX(100%)' }),
                animate('500ms ease-in', style({ transform: 'translateX(0%)' }))
            ]),
            transition(':leave', [
                animate('500ms ease-in', style({ transform: 'translateX(100%)' }))
            ])
        ])
    ]
})
export class WebsiteComponent implements OnInit, OnDestroy, AfterViewInit {
    isLoading: boolean

    constructor(
        private route: Router,
        public api: ApiService,
        public web: WebsiteService
    ) {
    }

    ngOnInit() {
        this.route.events.subscribe((routerEvent: Event) => {
            if (routerEvent instanceof NavigationEnd) {
            }
        })
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
    }
}
