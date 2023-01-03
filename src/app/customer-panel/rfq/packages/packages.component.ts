import { LocalService } from './local.service'
import { MapsAPILoader } from '@agm/core'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { DataService } from '../data.service'

@Component({
    selector: 'app-packages',
    templateUrl: './packages.component.html',
    styleUrls: ['./packages.component.css'],
    providers: [LocalService]
})

export class PackagesComponent implements OnInit {
    @ViewChild('searchProjectLoc', { static: false }) public searchProjectLocElementRef: ElementRef
    packagesForm: FormGroup
    modalRef: BsModalRef
    dataStatus='fetching'
    projectId = -1
    checkList: BsModalRef
    csiDivisionList: any = []
    packagesList: any = []
    checkDList: any = []
    selectedIndex: any
    dellDivID: any
    loginLoading = false
    projectLat: any = null
    projectLng: any = null
    uploadDoc: any = null
    fileName: any
    csi_division_ids=[]


    constructor(
        public dataService: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private mapsAPILoader: MapsAPILoader,
        private ms: BsModalService,
        private ds: DataService,
        public local: LocalService
    ) {
        dataService.activeMenu = 'packages'
        this.packagesForm = this.fb.group({
            id: new FormControl(null),
            rfq_id: new FormControl(dataService.rfqId),
            project_id: new FormControl(this.projectId),
            title: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
            description: new FormControl(null, [Validators.required, Validators.maxLength(500)])

        })
        // csi_division_ids: new FormControl(null, [Validators.required])
    }

    addRemoveObj(id, data) {
        const index = this.checkDList.findIndex(d => d.id == id)
        if (index > -1) {
            this.checkDList.splice(index, 1)
        } else {
            this.checkDList.push(data)
        }

    }

    isChecked(id) {
        const index = this.checkDList.findIndex(d => d.id == id)
        if (index > -1) {
            return true
        } else {
            return false
        }

    }

    ngOnInit() {

        this.dataService.rfqDataStatus.subscribe((status: string) => {
            console.log('status',status);

            if (status == 'done') {

                this.projectId= this.dataService.rfq.project_id
                this.dataService.rfq.project.project_csi_divisions.forEach( (e: any) => {
                    this.csiDivisionList.push(e.csi_division)
                });

                //
                this.local.list({ rfq_id: this.ds.rfqId }).subscribe((resp: any) => {
                    if (resp.success === false) {
                        //this.alert.error(resp.errors.general)
                    }
                    if (resp.success === true) {
                        this.packagesList = resp.data
                        console.log(this.packagesList)
                        this.dataStatus='done'
                    }
                })

            }
        })



    }


    get g() {
        return this.packagesForm.controls
    }


    openModalDell(divisionModal, id) {

        this.dellDivID = id
        this.checkList = this.ms.show(
            divisionModal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    openModalSubject(divisionModal, index) {
        this.checkList = this.ms.show(
            divisionModal,
            {
                class: 'website modal-sm modal-dialog-centered',
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



    openModalSubjectForm(divisionModal, index) {

        this.selectedIndex = index;
        if (index > -1) {
            this.packagesForm.patchValue(this.packagesList[index])

            this.checkDList = this.packagesList[index].rfq_package_divs

            if (this.packagesList[index].rfq_package_divs) {

                this.checkDList = []
                this.packagesList[index].rfq_package_divs.forEach(div => {

                    const index = this.csiDivisionList.findIndex(d => d.id == div.csi_division_id)
                    if (index > -1) {
                        this.checkDList.push(this.csiDivisionList[index])

                    }
                });
            }
        }
        this.modalRef = this.ms.show(
            divisionModal,
            {
                class: 'website modal-md modal-dialog-centered',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    browseFiles(event: any) {
        event.preventDefault()
        const element = document.getElementById('other-files')
        element.click()
    }

    onDocumentChange(event: any) {
        this.uploadFiles(event.target.files)
    }
    uploadFiles(files: FileList) {
        const allowedExtensions = ['xlsx', 'xls']
        const defaulterFiles = []

        Array.from(files).forEach((file: any) => {
            this.fileName=file.name
            const extension = file.name.split('.').pop().toLowerCase()

            if (allowedExtensions.indexOf(extension) > -1) {
                //this.readFile(file)
                this.uploadDoc = file
            } else {
                defaulterFiles.push(file.name)
                this.alert.error(`${file.name} has an invalid file type. Only xlsx,xls are allowed`)
            }
        })
    }
    readFile(file: any) {

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = (e: any) => {

            // const index = this.uploadedFiles.length
            // this.uploadedFiles.push({
            //     id: -1,
            //     file: reader.result,
            //     project_csi_divisions: csi,
            //     full_project_qto: this.full_project_qto,
            //     uploading: true
            // })
            this.uploadDocument(reader.result, file)
        }
    }
    uploadDocument(fileData: any, file: any) {
        fetch(fileData)
            .then(res => res.blob())
            .then(blob => {
                const myFile = new Blob([blob]) // for microsoft edge support
                const formData = new FormData()
                formData.append('document_type', 'qto')
                // formData.append('full_project_qto', '0')
                formData.append('document', myFile)
                formData.append('rfq_id', this.dataService.rfqId.toString())
                formData.append('csi_division_ids', JSON.stringify(this.csi_division_ids))
                formData.append('title', this.packagesForm.value.title)
                formData.append('description', this.packagesForm.value.description)
                formData.append('name', file.name.split(".")[0])
                formData.append('project_id', this.projectId.toString())
                this.local.add(formData).subscribe((resp: any) => {
                    if (resp.success == true) {
                        console.log('response BE', resp.data);
                        // this.uploadedFiles[index].id = resp.data
                        // this.uploadedFiles[index].uploading = false
                        // this.uploadedFiles[index].file_size = file.size
                        // this.uploadedFiles[index].name = file.name.split(".")[0]
                        // this.alert.success(`${file.name.split(".")[0]} uploaded successfully`)
                        // this.packagesList.push({
                        //     id: resp.data,
                        //     project_id: this.project_id,
                        //     full_name: file.name.split(".")[0],
                        //     file_size: file.size,
                        //     document_type: this.docType,
                        //     project_csi_divisions: this.csiDivisions
                        // })
                        // this.alert.success(`${file.name.split(".")[0]} uploaded successfully`)
                        // this.cancelButton()
                    } else {
                        this.alert.error(resp.errors.general)
                        // this.docData.splice(index, 1)
                    }
                })//upload api
            })
    }


    deleteDivision() {

    }

    save(data: any, f: any) {
        this.loginLoading = true
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false
            return false
        }

        if (this.checkDList.length > 0) {
            this.checkDList.forEach(element => {
                this.csi_division_ids.push(element.id)
            });
        }

        const params = {
            id: null,
            rfq_id: this.dataService.rfqId,
            project_id: this.projectId,
            title: data.value.title,
            description: data.value.description,
            csi_division_ids: this.csi_division_ids
        }
        let saveUpdate = this.local.add(params)
        if (this.selectedIndex > -1) {
            const params = {
                id: this.packagesList[this.selectedIndex].id,
                rfq_id: this.dataService.rfqId,
                project_id: this.projectId,
                title: data.value.title,
                description: data.value.description,
                csi_division_ids: this.csi_division_ids
            }
            saveUpdate = this.local.update(params)

        }
        saveUpdate.subscribe((resp: any) => {
            if (resp.success === true) {

                if (this.selectedIndex > -1) {

                    this.packagesList[this.selectedIndex] = resp.data
                    this.alert.success('Updated Successfully!')
                    this.loginLoading = false

                } else {
                    // this.readFile(this.uploadDoc)
                    this.packagesList.unshift(resp.data)
                    this.alert.success('Package added Successfully!')
                    this.loginLoading = false

                }
                this.modalRef.hide()
                f.resetForm()
            } else {
                this.alert.error('Request failed!')
                this.loginLoading =false

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
                        this.packagesForm.controls.project_location.setValue(address)
                    })
                })
            })
        } else {
            this.alert.error('Unable to get current location')
        }
    }
    deleteEntry(f: any) {

        const params = {
            id: this.dellDivID
        }
        const deleteEntry = this.local.deleteDivision(params)
        deleteEntry.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                return false
            } else {

                const index = this.packagesList[this.selectedIndex].rfq_package_divs.findIndex(d => d.id === this.dellDivID)
                this.packagesList[this.selectedIndex].rfq_package_divs.splice(index, 1)
                this.alert.success('Entry Deleted successfully!!')
            }
            this.checkList.hide()

        })
    }
    deletePack(f: any) {
        this.loginLoading = true
        const params = {
            id: this.packagesList[this.selectedIndex].id
        }
        const deleteEntry = this.local.delete(params)
        deleteEntry.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false
                return false
            } else {

                this.packagesList.splice(this.selectedIndex, 1)
                this.alert.success('Package Deleted successfully!!')
                this.loginLoading = false
            }
            this.modalRef.hide()
        })
    }
    cancelButton(f) {
        if (f) {
            f.resetForm()
            this.checkDList=[]
        }
        this.modalRef.hide()
    }
    cancelButtonList() {
        this.checkList.hide()
    }

}
