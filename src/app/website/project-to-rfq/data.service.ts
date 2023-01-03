import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/public`

    constructor(public http: HttpClient) {
    }

    getRfqId(param): Observable<any> {
        const url = `${apis.baseUrl}/customer/rfq-create-from-project`

        return this.http.post<any>(url, param)
    }


}

