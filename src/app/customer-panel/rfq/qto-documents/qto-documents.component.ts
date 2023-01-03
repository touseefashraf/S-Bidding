import { ApiService } from './../../../services/api.service';
import { DataService } from '../data.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-qto-documents',
    templateUrl: './qto-documents.component.html',
    styleUrls: ['./qto-documents.component.css']
})
export class QtoDocumentsComponent implements OnInit {
    docType: any;
    filesize: any
    docData: any;
    loginLoading = false
    modalRef: BsModalRef
    csiList = []
    csiDivisionIds: any = []
    csiDivisions: any = []
    full_project_qto: any = 0
    uploadDoc: any = null
    uploadCsiIndex: any = []
    fileStatus = 'uploaded'
    dataStatus = 'fetching';
    project_id: any
    uploadedFiles = []
    dataToSend = {
        divisionIds: []
    };
    loggedinUserId: any;
    projectUserId: any;
    fileName: any;
    constructor(
        public dataService: DataService,
        public route: ActivatedRoute,
        public alert: IAlertService,
        private modalService: BsModalService,
        private api: ApiService,
    ) { }

    ngOnInit() {

        this.dataService.rfqDataStatus.subscribe((status: string) => {
            if (status == 'done') {

                this.loggedinUserId = this.api.user.id
                this.projectUserId = this.dataService.rfq.project.user_id
                this.docType = this.route.snapshot.paramMap.get('docType')
                this.project_id = this.dataService.rfq.project_id
                this.dataService.activeMenu = this.docType
                const param = {
                    project_id: this.project_id,
                    document_type: this.docType
                };

                this.dataService.getQtoDocData(param).subscribe((resp: any) => {
                    if (resp.success === true) {
                        this.docData = resp.data;
                        console.log('documentList', this.docData);
                        this.dataStatus = 'done';
                    }
                    // this.docData.forEach((file: any) => {
                    //     if (file.document_type === this.docType) {
                    //         this.uploadedFiles.push({
                    //             id: file.id,
                    //             name: file.name,
                    //         })
                    //     }
                    // })
                })

                this.dataService.getProjectDivisions(this.project_id).subscribe((resp: any) => {
                    if (resp.success === false) {
                        this.alert.error(resp.errors.general)
                    }

                    if (resp.success === true) {
                        this.csiList = resp.data
                        console.log('csiDivisionList', this.csiList)
                    }
                })

            }
        })


    }

    downloadDocument(documentId: number, file: any) {
        this.dataService
            .downloadDocument(file.project_id, file.document_type, documentId)
            .subscribe((resp: any) => {
                const binaryData = [];
                binaryData.push(resp);
                const downloadLink = document.createElement('a');
                downloadLink.href = window.URL.createObjectURL(
                    new Blob(binaryData, { type: resp.type })
                );
                if (file.name) {
                    downloadLink.setAttribute(
                        'download',
                        file.name.split('.')[0]
                    );
                } else {
                    downloadLink.setAttribute('download', 'document');
                }
                document.body.appendChild(downloadLink);
                downloadLink.click();
            });
    }

    deleteFile(index: number) {

        const params = {
            id: this.docData[index].id,
            project_id: this.project_id,
            file_type: this.docType
        }
        this.dataService.deleteFile(params).subscribe(resp => {
            if (resp.success == true) {
                this.alert.success(`${this.docData[index].name} Deteled Successfully`)
                this.docData.splice(index, 1)
            } else {
                this.alert.error(resp.errors.general)
            }
        })
    }
    openModal(modelName) {
        this.modalRef = this.modalService.show(
            modelName,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
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
            const extension = file.name.split('.').pop().toLowerCase()

            if (allowedExtensions.indexOf(extension) > -1) {
                //this.readFile(file)
                this.uploadDoc = file
                this.fileName=file.name
            } else {
                defaulterFiles.push(file.name)
                this.alert.error(`${file.name} has an invalid file type. Only xlsx,xls are allowed`)
            }
        })
    }
    readFile(file: any) {
        const csi: any = []
        this.csiList
        if (this.uploadCsiIndex.length > 0) {
            this.uploadCsiIndex.forEach(element => {
                csi.push(
                    {
                        csi_division_id: this.csiList[element].id,
                        csi_division: this.csiList[element].csi_division
                    })

            });
        }

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = (e: any) => {

            const index = this.uploadedFiles.length
            // this.uploadedFiles.push({
            //     id: -1,
            //     file: reader.result,
            //     project_csi_divisions: csi,
            //     full_project_qto: this.full_project_qto,
            //     uploading: true
            // })
            this.uploadDocument(reader.result, index, file)
        }
    }

    uploadDocument(fileData: any, index: number, file: any) {
        this.fileStatus = 'uploading'
        fetch(fileData)
            .then(res => res.blob())
            .then(blob => {
                const myFile = new Blob([blob]) // for microsoft edge support
                const formData = new FormData()
                formData.append('document_type', 'qto')
                formData.append('full_project_qto', '0')
                formData.append('document', myFile)
                formData.append('csi_division_ids', this.csiDivisionIds)
                formData.append('name', file.name.split(".")[0])
                formData.append('project_id', this.project_id.toString())
                this.dataService.uploadFile(formData).subscribe((resp: any) => {
                    if (resp.success == true) {
                        console.log('response BE', resp.data);
                        // this.uploadedFiles[index].id = resp.data
                        // this.uploadedFiles[index].uploading = false
                        // this.uploadedFiles[index].file_size = file.size
                        // this.uploadedFiles[index].name = file.name.split(".")[0]
                        // this.alert.success(`${file.name.split(".")[0]} uploaded successfully`)
                        this.docData.push({
                            id: resp.data,
                            project_id: this.project_id,
                            full_name: file.name.split(".")[0],
                            file_size: file.size,
                            document_type: this.docType,
                            project_csi_divisions: this.csiDivisions
                        })
                        this.alert.success(`${file.name.split(".")[0]} uploaded successfully`)
                        this.fileStatus = 'uploaded'
                        this.cancelButton()
                    } else {
                        this.alert.error(resp.errors.general)
                        this.docData.splice(index, 1)
                    }
                })//upload api
            })
    }
    save() {
        if (this.full_project_qto == 0) {
            if (this.csiDivisionIds.length == 0) {
                this.alert.error(`CSI Division is required`)
                return false
            }
        }
        if (this.uploadDoc == null) {
            this.alert.error(`Document is required`)
            return false
        }

        this.readFile(this.uploadDoc)

    }

    cancelButton() {
        this.csiDivisionIds = []
        this.full_project_qto = 1
        this.uploadDoc = null
        this.uploadCsiIndex = []
        this.modalRef.hide()
    }

    checkcsiId(id: any) {
        const index = this.csiDivisionIds.findIndex(d => d == id)
        if (index > -1) {
            return true
        } else {
            return false
        }
    }
    spliceAddCsiId(id: any, rowIndex) {
        const index = this.csiDivisionIds.findIndex(d => d == id)
        const indexOfList = this.csiList.findIndex((e: any) => e.csi_division_id == id)
        if (index > -1) {
            this.uploadCsiIndex.splice(index, 1)
            this.csiDivisionIds.splice(index, 1)
            this.csiDivisions.splice(index, 1)
        } else {
            this.uploadCsiIndex.push(+rowIndex)
            this.csiDivisionIds.push(+id)
            this.csiDivisions.push(this.csiList[indexOfList])
        }
        console.log('this.csiDivisions', this.csiDivisions, 'this.csiDivisionIds', this.csiDivisionIds)
    }


}
