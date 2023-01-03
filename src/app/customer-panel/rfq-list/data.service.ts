import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}`
    private data = new BehaviorSubject<Array<any>>([{ fetching: true }])
    data$ = this.data.asObservable()

    constructor(public http: HttpClient) {
    }
    list(): Observable<any> {
        const url = `${apis.baseUrl}/customer/rfq-list`

        return this.http.get<any>(url)
    }
    delete(params): Observable<any> {
        const url = `${this.baseUrl}/customer/delete-rfq`

        return this.http.post<any>(url, params)
    }
}
