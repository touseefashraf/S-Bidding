import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UIHelpers } from 'src/app/helpers/ui-helpers';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { ApiService } from 'src/app/services/api.service';
import { apis } from 'src/environments/environment';
import { DataService } from './data.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

    googleCaptcha = ''
    @ViewChild('search', { static: false }) public searchElementRef: ElementRef
    registrationForm: FormGroup
    planHolderData: any
    dataStatus = 'fetching'
    planeholderId = '-1'
    companyName = ''
    companyNameInput = true
    registerStatus = false
    public searchControl: FormControl
    latit: any = null
    lngitut: any = null
    siteKey = apis.googleCaptchaSiteKey
    registerLoading = false
    public resolved(captchaResponse: string) {
        // console.log(`Resolved captcha with response: ${captchaResponse}`);
        this.googleCaptcha = captchaResponse
    }

    constructor(
        private fb: FormBuilder,
        public ui: UIHelpers,
        public api: ApiService,
        private alert: IAlertService,
        public route: ActivatedRoute,
        public ds: DataService,
        private mapsAPILoader: MapsAPILoader,

    ) {
        this.api.activeTab='register'
        this.registrationForm = this.fb.group({
            first_name: new FormControl('', [Validators.required]),
            last_name: new FormControl('', [Validators.required]),
            contact_1: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(15)]),
            contact_2: new FormControl('', [Validators.minLength(7), Validators.maxLength(15)]),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required]),
            password_confirmation: new FormControl('', [Validators.required]),
            plan_holder_id: new FormControl('a', []),
            company_name: new FormControl('', []),
            address: new FormControl('', [Validators.minLength(4), Validators.maxLength(150)]),
        })
    }

    checkId() {
        if (this.planeholderId !== '-1') {
            this.companyNameInput = false
        } else {
            this.companyNameInput = true
        }
    }
    ngOnInit() {
        this.ds.planHolders().subscribe((resp: any) => {
            if (resp.success === true) {
                this.planHolderData = resp.data
                this.dataStatus = 'done'
                console.log(this.planHolderData)
                this.autoCom()
            }
        })
    }

    get g() {
        return this.registrationForm.controls
    }

    reg(data: any): boolean {
        this.registerLoading = true
        console.log('ss', data.value)
        if (data.status === 'INVALID' || this.googleCaptcha === '') {
            this.alert.error('Please fill out valid data in all fields and try again')
            this.registerLoading = false

            return false
        }
        if (this.registrationForm.value.password !== this.registrationForm.value.password_confirmation) {
            this.alert.error('Password Confirmation Doesnot Match')
            this.registerLoading = false

            return false
        }
        if (this.planeholderId === '-1' && this.companyName === '') {
            this.alert.error('Please enter company name')
            this.registerLoading = false

            return false
        }
        this.ds.register(data.value).subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.registerLoading = false

                return false
            } else {
                this.registerStatus = true
                this.alert.success('Registered successfully')
            }
        })
    }

    getLocation(): void {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.lngitut = position.coords.longitude
                this.latit = position.coords.latitude
                this.mapsAPILoader.load().then(() => {
                    const geocoder = new google.maps.Geocoder()
                    const latlng = new google.maps.LatLng(this.latit, this.lngitut)
                    const request = {
                        location: latlng
                    }
                    geocoder.geocode(request, (results, status) => {
                        const address = results[0].formatted_address
                        this.registrationForm.controls.address.setValue(address)
                    })
                })
            })
        } else {
            this.alert.error('Unable to get current location')
        }
    }

    autoCom(): void {
        this.searchControl = new FormControl()
        this.mapsAPILoader.load().then(() => {
            const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ['address']
            })
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace()
                if (place.geometry === undefined || place.geometry === null) {
                    return
                }
                this.latit = place.geometry.location.lat()
                this.lngitut = place.geometry.location.lng()
                this.registrationForm.controls.address.setValue(place.formatted_address)

            })
        })
    }

}
