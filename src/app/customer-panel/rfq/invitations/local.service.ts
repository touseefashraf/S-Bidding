import { apis } from './../../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'


@Injectable()
export class LocalService {
    private baseUrl = `${apis .baseUrl}`
    private data = new BehaviorSubject<Array<any>>([{ fetching: true }])
    data$ = this.data.asObservable()

    constructor(public http: HttpClient) {
    }
    list(params): Observable<any> {
        const url = `${apis.baseUrl}/customer/invitation-list`

        return this.http.get<any>(url,{params})
    }
    add(params): Observable<any> {
        const url = `${apis.baseUrl}/customer/add-invitation`

        return this.http.post<any>(url,params)
    }
    delete(params): Observable<any> {
        const url = `${this.baseUrl}/customer/delete-invitation`

        return this.http.post<any>(url, params)
    }
    searchUsers(params): Observable<any> {
        const url = `${this.baseUrl}/customer/customer-list`

        return this.http.get<any>(url, {params: {keyword:params}})
    }

}
