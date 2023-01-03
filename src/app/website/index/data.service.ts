import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/public`
    private data = new BehaviorSubject<Array<any>>([{ fetching: true }])
    data$ = this.data.asObservable()

    constructor(public http: HttpClient) {
    }

    getSubscriptionStatus(): Observable<any> {
        const url = `${apis.baseUrl}/customer/subbidding-payment-status`

        return this.http.post<any>(url, {})
    }

    getCompanyImages(): Observable<any> {
        const url = `${this.baseUrl}/company-images-list`

        return this.http.get<any>(url)
    }

}
