import { ActivatedRoute, Router } from '@angular/router'
import { IAlertService } from './../../../libs/ialert/ialerts.service'
import { UIHelpers } from './../../../helpers/ui-helpers'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { LocalService } from './local.service'
import { DataService } from '../data.service'
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { AutocompleteComponent } from 'angular-ng-autocomplete'
@Component({
    selector: 'app-invitations',
    templateUrl: './invitations.component.html',
    styleUrls: ['./invitations.component.css'],
    providers: [LocalService]
})
export class InvitationsComponent implements OnInit {


    @ViewChild('autocomplete') autocomplete: AutocompleteComponent

    dataStatus = 'fetching'
    list = []
    selectedIndex = -1
    projectId = -1
    invForm: FormGroup
    loginLoading = false
    emialForm: FormGroup
    modalRef: BsModalRef
    keyword = 'email';
    selectedUser: any = []
    userData = []
    constructor(
        public dataService: DataService,
        public localService: LocalService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        public ms: BsModalService,
        public route: ActivatedRoute,
        private router: Router

    ) {




        this.invForm = this.fb.group({
            rfq_id: new FormControl(null),
            project_id: new FormControl(null),
            user_ids: new FormControl(null, [Validators.required]),
            emails: new FormControl(null, [Validators.required])
        })

        this.emialForm = this.fb.group({
            rfq_id: new FormControl(null),
            project_id: new FormControl(null),
            user_ids: new FormControl(null),
            emails: new FormControl(null, [Validators.required])
        })


    }

    ngOnInit() {
        this.dataService.activeMenu = 'invitations'
        this.dataService.rfqDataStatus.subscribe((status: string) => {
            if (status == 'done') {
                this.projectId = this.dataService.rfq.project_id

                const list = this.localService.list({ rfq_id: this.dataService.rfqId })
                list.subscribe((resp: any) => {
                    if (resp.success === true) {
                        this.list = resp.data
                        this.dataStatus = 'done'
                    }
                })

            }
        })
    }

    resetInput() {
        this.autocomplete.clear()
    }
    save(f: any) {
        this.loginLoading = true

        if (this.invForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            return false
        }

        const emails = this.invForm.value.emails.split(",")
        const user_ids = this.invForm.value.user_ids.split(",")
        const params = {
            emails: emails,
            user_ids: user_ids,
            rfq_id: this.dataService.rfqId,
            project_id: this.projectId
        }

        let saveUpdate = this.localService.add(params)
        saveUpdate.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                return false
            } else {
                this.alert.success('Lead added successfully!!')
                this.list = resp.data
                this.modalRef.hide()
                this.loginLoading = false
                f.resetForm()
            }
        })

    }

    saveViaUserId() {
        this.loginLoading = true
        if (this.selectedUser.length == 0) {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false
            return false



        }
        //userID = []
        const params = {
            emails: [],
            user_ids: [this.selectedUser.id],
            rfq_id: this.dataService.rfqId,
            project_id: this.projectId
        }

        let saveUpdate = this.localService.add(params)
        saveUpdate.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false
                return false
            } else {
                this.selectedUser = []
                this.userData = []
                this.alert.success('added successfully!!')
                this.list = resp.data
                this.resetInput()
                this.loginLoading = false

            }
        })

    }




    saveViaUserEmail(f: any) {
        this.loginLoading = true
        if (this.emialForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false
            return false
        }

        const params = {
            emails: [this.emialForm.value.emails],
            user_ids: [],
            rfq_id: this.dataService.rfqId,
            project_id: this.projectId
        }

        let saveUpdate = this.localService.add(params)
        saveUpdate.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                return false
            } else {
                this.userData = []
                this.alert.success('added successfully!!')
                this.list = resp.data
                this.loginLoading = false
                f.resetForm()
            }
        })

    }

    get g() {
        return this.invForm.controls
    }
    get e() {
        return this.emialForm.controls
    }



    openModal(modal, index) {

        // if (index > -1) {
        //     this.plansForm.controls.id.setValue(this.subbiddingPlans[index].id)
        //     this.plansForm.patchValue(this.subbiddingPlans[index])
        // }

        this.selectedIndex = index

        this.modalRef = this.ms.show(
            modal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    deleteEntry(f: any) {

        const params = {
            planHolderIds: [this.list[this.selectedIndex].id]
        }
        const deleteEntry = this.localService.delete(params)
        deleteEntry.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                return false
            } else {

                this.list.splice(this.selectedIndex, 1)
                this.alert.success('Entry Deleted successfully!!')
            }
            this.modalRef.hide()
        })
    }


    cancelButton(f: any) {
        if (f) {
            f.resetForm()
        }
        this.modalRef.hide()
    }

    onChangeSearch(keyword: string) {
        this.localService.searchUsers(keyword)
            .subscribe((resp: any) => {
                this.userData = resp.data
            }, (error) => {
                console.log('Error occuared', error);

            })
    }
    selectEvent(event) {
        console.log(event)
        this.selectedUser = event
    }
}
