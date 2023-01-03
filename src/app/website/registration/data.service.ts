import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { apis } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class DataService {
    private baseUrl = `${apis.baseUrl}/public`
    private data = new BehaviorSubject<Array<any>>([{ fetching: true }])
    data$ = this.data.asObservable()

    constructor(public http: HttpClient) {
    }

    register(params): Observable<any> {
        const url = `${this.baseUrl}/register`

        return this.http.post<any>(url, params)
    }

    planHolders(): Observable<any> {
        const url = `${this.baseUrl}/plan-holders-list`

        return this.http.get<any>(url)
    }

}
