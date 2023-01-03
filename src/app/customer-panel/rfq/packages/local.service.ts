import { apis } from './../../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'


@Injectable()
export class LocalService {
    private baseUrl = `${apis.baseUrl}`
    constructor(public http: HttpClient) {
    }
    list(params): Observable<any> {
        const url = `${apis.baseUrl}/customer/rfq-pakage-list`

        return this.http.get<any>(url, { params })
    }
    update(params): Observable<any> {
        const url = `${apis.baseUrl}/customer/update-rfq-pakage`

        return this.http.post<any>(url, params)
    }
    add(params): Observable<any> {
        const url = `${apis.baseUrl}/customer/add-rfq-pakage`

        return this.http.post<any>(url, params)
    }
    delete(params): Observable<any> {
        const url = `${this.baseUrl}/customer/delete-rfq-package`

        return this.http.post<any>(url, params)
    }
    deleteDivision(params): Observable<any> {
        const url = `${this.baseUrl}/customer/delete-pakage-division`

        return this.http.post<any>(url, params)
    }
}
