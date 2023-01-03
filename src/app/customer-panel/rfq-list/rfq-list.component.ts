import { ApiService } from 'src/app/services/api.service';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { DataService } from './data.service';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'

@Component({
    selector: 'app-rfq-list',
    templateUrl: './rfq-list.component.html',
    styleUrls: ['./rfq-list.component.css']
})
export class RfqListComponent implements OnInit {
    dataStatus = 'fetching'
    list= []
    selectedIndex=-1
    loginLoading = false
    modalRef: BsModalRef
    constructor(public ds:DataService, private alert: IAlertService, public ms: BsModalService,public api:ApiService) {
        this.api.activeTab='rfq-list'
        const list = this.ds.list()
        list.subscribe((resp: any) => {
            if (resp.success === true) {
                this.list = resp.data
                console.log(this.list);

                this.dataStatus = 'done'
            }
        })
    }

    ngOnInit() {
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
    deleteEntry(f: any) {
        this.loginLoading = true
        const params = {
            id: this.list[this.selectedIndex].id
        }
        const deleteEntry = this.ds.delete(params)
        deleteEntry.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false
                return false
            } else {

                this.list.splice(this.selectedIndex, 1)
                this.alert.success('Entry Deleted successfully!!')
                this.loginLoading = false
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
}
