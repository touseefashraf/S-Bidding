import { Component, OnInit } from '@angular/core'
import { ApiService } from 'src/app/services/api.service'

@Component({
    selector: 'app-why-us',
    templateUrl: './why-us.component.html',
    styleUrls: ['./why-us.component.css']
})
export class WhyUsComponent implements OnInit {
    topContent = ''
    bottomContent = ''
    pageContent: any
    dataStatus = false

    constructor(public api: ApiService) {
    }
    ngOnInit() {
        const params = {
            route: 'why-us'
        }
        this.api.getPageContent(params).subscribe((resp: any) => {
            if (resp.success === true) {
                const parsedValue = JSON.parse(resp.data.content)
                if (parsedValue.top_content) {
                    this.topContent = parsedValue.top_content
                }
                if (parsedValue.bottom_content) {
                    this.bottomContent = parsedValue.bottom_content
                }
            }
        })
    }
}
