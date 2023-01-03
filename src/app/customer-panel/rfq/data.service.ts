import { apis } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable()
export class DataService {
    rfqId = -1
    rfq = null
    activeMenu = 'project-details'
    rfqDataStatus = new BehaviorSubject('')
    baseUrl = `${apis.baseUrl}/customer`

    constructor(public http: HttpClient) {
    }

    getDocData(params): Observable<any> {
        const url = `${this.baseUrl}/project-file-list`

        return this.http.post<any>(url,params)
    }
    getSubbidDocData(params): Observable<any> {
        const url = `${this.baseUrl}/subbidding-document-list`

        return this.http.get<any>(url,{params})
    }
    getQtoDocData(params): Observable<any> {
        const url = `${this.baseUrl}/qto-file-list`

        return this.http.post<any>(url,params)
    }

    downloadDocument(projectId: number, docType: any, documentId: number) {
        const url = `${this.baseUrl}/project-document/${projectId}/${docType}/${documentId}`

        return this.http.get<any>(url, { responseType: 'blob' as 'json' })
    }
    downloadSubbidDocument(project_id: number, id: number) {
        const url = `${this.baseUrl}/get-subbidding-document/${project_id}/${id}`

        return this.http.get<any>(url, { responseType: 'blob' as 'json' })
    }
    deleteFile(params: any) {
        const url = `${this.baseUrl}/delete-project-file`

        return this.http.post<any>(url, params)
    }
    deleteSubbidFile(params: any) {
        const url = `${this.baseUrl}/delete-subbidding-document`

        return this.http.post<any>(url, params)
    }

    uploadFile(formData: FormData) {
        const url = `${this.baseUrl}/save-project-file`

        return this.http.post<any>(url, formData)
    }
    uploadSubbidFile(formData: FormData) {
        const url = `${this.baseUrl}/save-subbidding-document`

        return this.http.post<any>(url, formData)
    }
    getCsiDivisionList(): Observable<any> {
        const url = `${apis.baseUrl}/customer/csi-division-list`

        return this.http.get<any>(url)
    }
    // to get csi divisions
    getProjectDivisions(id): Observable<any> {
        const url = `${apis.baseUrl}/public/project-csi-divisions/${id}`

        return this.http.get<any>(url)
    }

    addRFQ(params): Observable<any> {
        const url = `${apis.baseUrl}/customer/rfq-create`

        return this.http.post<any>(url, params)
    }
    getRFQDetails(id): Observable<any> {
        const url = `${apis.baseUrl}/customer/rfq-detail`

        return this.http.get<any>(url, {params: {id}})
    }
    getProjectDetails(id): Observable<any> {
        const url = `${apis.baseUrl}/customer/project-detail`

        return this.http.get<any>(url, {params: {id}})
    }
    updateRFQ(params): Observable<any> {
        const url = `${apis.baseUrl}/customer/update-rfq`

        return this.http.post<any>(url, params)

    }
}
