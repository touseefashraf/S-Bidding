import { Router } from '@angular/router'
import { ConstantsService } from './constants.service'
import { map } from 'rxjs/operators'
import { apis } from '../../environments/environment'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, BehaviorSubject, Subject } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    showLoading = new Subject<boolean>()
    baseUrl: string
    activeTab=''
    searchFilter: any
    userLoggedInSource = new BehaviorSubject(false)
    scrollBottom: boolean
    scrollBottomChange = new Subject<boolean>()
    userImage = new Subject<string>()
    userLoggedInObs = this.userLoggedInSource.asObservable()
    user: any = {
        id: 0,
        user_name: '',
        email: '',
        user_type: '',
        api_token: '',
        balance: 0,
        status: ''
    }
    constructor(
        public http: HttpClient,
        public cs: ConstantsService
    ) {
        this.baseUrl = apis.baseUrl + '/public'
        this.scrollBottom = false
        this.scrollBottomChange.subscribe((value) => {
            this.scrollBottom = value
        })
        if (localStorage.getItem('token')) {
            this.user = JSON.parse(localStorage.getItem('user'))
            this.userLoggedInSource.next(true)
        } else {
            this.userLoggedInSource.next(false)
        }
    }

    toggleScrollBottom(value: boolean): void {
        this.scrollBottomChange.next(value)
    }

    login(params: any): Observable<any> {
        const url = `${this.baseUrl}/login`

        return this.http.post<any>(url, params)
            .pipe(
                map(resp => {
                    if (resp && resp.success && resp.data.token) {
                        localStorage.setItem('token', resp.data.token)
                        localStorage.setItem('user', JSON.stringify(resp.data))
                        this.user = resp.data
                        console.log(this.user)
                        this.userLoggedInSource.next(true)
                    }

                    return resp
                })
            )
    }

    googleLogin(): Observable<any> {
        const url = `${this.baseUrl}/login/${'google'}`

        return this.http.get<any>(url)
            .pipe(
                map(resp => {
                    if (resp && resp.success && resp.data.token) {
                        localStorage.setItem('token', resp.data.token)
                        localStorage.setItem('user', JSON.stringify(resp.data))
                        this.user = resp.data
                        console.log(this.user)
                        this.userLoggedInSource.next(true)
                    }

                    return resp
                })
            )
    }

    logOutSession(): Observable<any> {
        const url = `${this.baseUrl}/logout`

        return this.http.post<any>(url, {})
    }
    companyImageUrl(Id?: number) {
        Id = Id ? Id : -1

        return `${apis.baseUrl}/public/company-image/${Id}`
    }
    logOut(): boolean {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        this.user.id = 0
        this.userLoggedInSource.next(false)

        return true
    }

    isAuthenticated(): boolean {
        if (localStorage.getItem('token')) {
            return true
        } else {
            return false
        }
    }

    isCustomer(): boolean {
        if (this.user.user_type === ConstantsService.USER_ROLES.CUSTOMER) {
            return true
        } else {
            return false
        }
    }

    doUserRedirects(resp: any, router: Router) {
        switch (resp.data.user_type) {
            case ConstantsService.USER_ROLES.CUSTOMER: {
                router.navigate(['/customer/rfq-list'])
                break
            }
            case 'business': {
                router.navigate(['/'])
                break
            }
            case 'admin': {
                router.navigate(['/'])
                break
            }
            case 'qto': {
                router.navigate(['/'])
                break
            }
            case 'deo': {
                router.navigate(['/'])
                break
            }
        }
    }

    jsonToFormData(jsonObject: object, parentKey?: any, carryFormData?: FormData): FormData {

        const formData = carryFormData || new FormData()
        let index = 0

        // tslint:disable-next-line: forin
        for (const key in jsonObject) {
            if (jsonObject.hasOwnProperty(key)) {
                if (jsonObject[key] !== null && jsonObject[key] !== undefined) {
                    let propName = parentKey || key
                    if (parentKey && this.isObject(jsonObject)) {
                        propName = parentKey + '[' + key + ']'
                    }
                    if (parentKey && this.isArray(jsonObject)) {
                        propName = parentKey + '[' + index + ']'
                    }
                    if (jsonObject[key] instanceof File) {
                        formData.append(propName, jsonObject[key])
                    } else if (jsonObject[key] instanceof FileList) {
                        for (let j = 0; j < jsonObject[key].length; j++) {
                            formData.append(propName + '[' + j + ']', jsonObject[key].item(j))
                        }
                    } else if (this.isArray(jsonObject[key]) || this.isObject(jsonObject[key])) {
                        this.jsonToFormData(jsonObject[key], propName, formData)
                    } else if (typeof jsonObject[key] === 'boolean') {
                        formData.append(propName, +jsonObject[key] ? '1' : '0')
                    } else {
                        formData.append(propName, jsonObject[key])
                    }
                }
            }
            index++
        }

        return formData
    }

    isArray(val: any) {
        const toString = ({}).toString

        return toString.call(val) === '[object Array]'
    }

    isObject(val: any) {
        return !this.isArray(val) && typeof val === 'object' && !!val
    }
    getPageContent(params): Observable<any> {
        const url = `${this.baseUrl}/page-content`

        return this.http.get<any>(url, { params })
    }
    saveContactUs(postData): Observable<any> {
        const url = `${this.baseUrl}/contact-us`

        return this.http.post<any>(url, postData)
    }
}
