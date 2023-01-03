import { ApiService } from './../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router'
import { IAlertService } from './../../../libs/ialert/ialerts.service'
import { UIHelpers } from './../../../helpers/ui-helpers'
import { FormGroup, FormBuilder, FormControl, Validators, FormGroupDirective } from '@angular/forms'
import { DataService } from '../data.service'
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { MapsAPILoader } from '@agm/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import * as moment from 'moment'

@Component({
    selector: 'app-project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('searchProjectLoc', { static: false }) public searchProjectLocElementRef: ElementRef
    projectDetailsForm: FormGroup
    modalRef: BsModalRef
    dataStatus = 'fetching'
    csiDivisionList = []
    selectedDivisions = []
    divisionIds = []
    selectedIndex: any
    loginLoading = false
    projectLat: any = null
    projectLng: any = null
    data: any
    rfqid: any
    loggedinUserId: any;
    projectUserId: any;

    constructor(
        public dataService: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private mapsAPILoader: MapsAPILoader,
        private ms: BsModalService,
        private ds: DataService,
        private router: Router,
        private route: ActivatedRoute,
        private api: ApiService
    ) {

    }

    ngOnInit() {
        console.log('ngOnInit')
        this.rfqid = this.dataService.rfqId
        this.dataService.activeMenu = 'project-details'
        this.projectDetailsForm = this.fb.group({
            id: new FormControl(null),
            title: new FormControl(null, [Validators.required, Validators.maxLength(300)]),
            solicitation: new FormControl(null, [Validators.required, Validators.maxLength(150)]),
            bid_amount: new FormControl(null, [Validators.required]),
            project_location: new FormControl(null, [Validators.required, Validators.maxLength(225)]),
            project_lat: new FormControl(null, []),
            project_lng: new FormControl(null, []),
            bid_method: new FormControl(null, [Validators.required, Validators.maxLength(225)]),
            bid_date: new FormControl(null, [Validators.required]),
            completion_time: new FormControl(null, [Validators.required, Validators.maxLength(225)]),
            notes: new FormControl(null, [Validators.maxLength(500)]),
            csi_division_ids: new FormControl(null, [])
        })

        this.dataService.rfqDataStatus.subscribe((status: string) => {
            if (status == 'done') {

                if (this.dataService.rfq !== null) {
                    this.loggedinUserId = this.api.user.id
                    this.projectUserId = this.dataService.rfq.project.user_id
                    const project = this.dataService.rfq.project
                    this.projectDetailsForm.patchValue(project)
                    this.projectDetailsForm.controls.bid_date.setValue(new Date(project.bid_date))
                    project.project_csi_divisions.forEach((ele: any) => {
                        this.selectedDivisions.push(ele.csi_division)
                        this.divisionIds.push(ele.csi_division_id)
                    });
                } else {
                    this.projectDetailsForm.reset()
                }
                this.dataStatus = 'done'
            }
        })

        this.ds.getCsiDivisionList().subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
            }

            if (resp.success === true) {
                this.csiDivisionList = resp.data
                console.log('csiDivisionList', this.csiDivisionList)
            }
        })
    }

    ngAfterViewInit() {
        this.autoComProjectLocation()
    }

    get g() {
        return this.projectDetailsForm.controls
    }

    openModalSubject(divisionModal, index) {
        this.modalRef = this.ms.show(
            divisionModal,
            {
                class: 'modal-md modal-dialog-centered',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }
    openModal(modal, index) {


        this.selectedIndex = index

        this.modalRef = this.ms.show(
            modal,
            {
                class: 'modal-sm modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    save(data: any, f: any) {
        this.loginLoading = true
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }
        const params = data.value
        params.bid_date = moment(data.value.bid_date).format('YYYY-MM-DD')
        params.csi_division_ids = this.divisionIds

        let saveMethod = this.ds.addRFQ(params)
        if (this.dataService.rfq != null) {
            params.rfq_id = this.dataService.rfq.id
            saveMethod = this.ds.updateRFQ(params)
        }
        saveMethod.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                if (this.dataService.rfq === null) {

                    this.alert.success('RFQ Created successfully!!')
                    f.resetForm()
                    this.router.navigate(['../../' + resp.data.id + '/packages'], { relativeTo: this.route })
                } else {
                    this.dataService.rfq = resp.data
                    this.alert.success('RFQ Updated successfully!!')

                    this.router.navigate(['../packages'], { relativeTo: this.route })
                }

                f.resetForm()
            }

        })
    }

    // Project Location
    getProjectLocation(): void {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.projectLng = position.coords.longitude
                this.projectLat = position.coords.latitude
                this.mapsAPILoader.load().then(() => {
                    const geocoder = new google.maps.Geocoder()
                    const latlng = new google.maps.LatLng(this.projectLat, this.projectLng)
                    const request = {
                        location: latlng
                    }
                    geocoder.geocode(request, (results, status) => {
                        const address = results[0].formatted_address
                        this.projectDetailsForm.controls.project_location.setValue(address)
                    })
                })
            })
        } else {
            this.alert.error('Unable to get current location')
        }
    }

    autoComProjectLocation(): void {
        this.mapsAPILoader.load().then(() => {
            const autocomplete = new google.maps.places.Autocomplete(this.searchProjectLocElementRef.nativeElement, {
                types: ['address']
            })
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace()
                if (place.geometry === undefined || place.geometry === null) {
                    return
                }
                // this.projectLat = place.geometry.location.lat()
                // this.projectLng = place.geometry.location.lng()
                this.projectDetailsForm.controls.project_lat.setValue(place.geometry.location.lat())
                this.projectDetailsForm.controls.project_lng.setValue(place.geometry.location.lng())
                this.projectDetailsForm.controls.project_location.setValue(place.formatted_address)

            })
        })
    }
    // Project Location End

    cancelButton() {
        this.modalRef.hide()
    }

    selectDivision(division: any) {
        let index = this.csiDivisionList.findIndex((d: any) => {
            return d.id == division.id
        })
        // add to selected
        this.selectedDivisions.push(
            this.csiDivisionList[index]
        );
        // remove from all
        this.csiDivisionList.splice(index, 1)
        // add to dataToSend
        if (!this.divisionIds.includes(division.id)) {
            this.divisionIds.push(division.id)
            console.log('dataToSend', this.divisionIds);
        }
    }

    unSelectDivision(division: any) {
        const index = this.selectedDivisions.findIndex((p: any) => {
            return p.id == division.id
        })
        // add to all
        this.csiDivisionList.push(
            this.selectedDivisions[index]
        );
        // remove from selected
        this.selectedDivisions.splice(index, 1)
        // remove from dataToSend
        const i = this.divisionIds.indexOf(division.id)
        this.divisionIds.splice(i, 1)
        console.log(this.divisionIds);
    }

    ngOnDestroy() {
        console.log('distroying ')
    }
}
