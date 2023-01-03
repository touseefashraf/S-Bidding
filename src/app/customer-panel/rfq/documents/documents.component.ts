import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { Component, OnInit } from '@angular/core';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
    selector: 'app-documents',
    templateUrl: './documents.component.html',
    styleUrls: ['./documents.component.css'],
})
export class DocumentsComponent implements OnInit {
    docType: any;
    type1: any;
    type2: any;
    loginLoading = false
    filesize: any
    docData: any;
    dataStatus = 'fetching';
    fileStatus = 'uploaded';
    project_id: any
    uploadedFiles = []
    projectUserId: any;
    loggedinUserId: any;
    constructor(
        public dataService: DataService,
        public route: ActivatedRoute,
        public alert: IAlertService,
        private router: Router,
        private api: ApiService,
    ) { }

    ngOnInit() {



        this.dataService.rfqDataStatus.subscribe((status: string) => {
            if (status == 'done') {
                this.loggedinUserId = this.api.user.id
                this.projectUserId = this.dataService.rfq.project.user_id
                this.project_id = this.dataService.rfq.project_id
                console.log('rfq detail', this.dataService.rfq);

                const myFunc = (params: any) => {
                    this.dataStatus = 'fetching';
                    this.dataService.activeMenu = params.docType
                    this.docType = params.docType;
                    // let types = this.docType.split('-');
                    // this.type1 = types[0];
                    // this.type2 = types[1];
                    console.log('doc type', this.docType);
                    // console.log('second doc type', this.type2);

                    const param = {
                        project_id: this.project_id,
                        document_type: this.docType
                    };

                    this.dataService.getDocData(param).subscribe((resp: any) => {
                        if (resp.success === true) {
                            this.docData = resp.data;
                            console.log('documentList', this.docData);
                            this.dataStatus = 'done';
                        }
                        this.docData.forEach((file: any) => {
                            if (file.document_type === this.docType) {
                                this.uploadedFiles.push({
                                    id: file.id,
                                    name: file.name,
                                })
                            }
                        })
                    })



                };
                this.route.params.subscribe(myFunc);

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
        this.fileStatus = 'deleting'
        const params = {
            id: this.docData[index].id,
            project_id: this.project_id,
            file_type: this.docType
        }
        this.dataService.deleteFile(params).subscribe(resp => {
            if (resp.success == true) {
                this.alert.success(`${this.docData[index].name} Deteled Successfully`)
                this.docData.splice(index, 1)
                this.fileStatus = 'uploaded'
            } else {
                this.alert.error(resp.errors.general)
                this.fileStatus = 'uploaded'
            }
        })
    }
    browseFiles(event: any) {
        event.preventDefault()
        const element = document.getElementById('other-files')
        element.click()
    }
    onDocumentChange(event: any) {
        this.uploadFiles(event.target.files)
        this.filesize = event.target.files[0].size / 1000
        console.log(this.filesize);


    }

    uploadFiles(files: FileList) {
        const allowedExtensions = ['pdf']
        const defaulterFiles = []

        Array.from(files).forEach((file: any) => {
            const extension = file.name.split('.').pop().toLowerCase()
            // if (this.checkFileExist(file)) {
            //     return false
            // }
            if (allowedExtensions.indexOf(extension) > -1) {
                this.readFile(file)
            } else {
                defaulterFiles.push(file.name)
                this.alert.error(`${file.name} has an invalid file type. Only pdf are allowed`)
            }
        })
    }

    readFile(file: any) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = (e: any) => {
            const index = this.uploadedFiles.length
            this.uploadedFiles.push({
                id: -1,
                file: reader.result,
                uploading: true
            })
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
                formData.append('document_type', this.docType)
                formData.append('document', myFile)
                formData.append('name', file.name.split(".")[0])
                formData.append('project_id', this.project_id.toString())
                this.dataService.uploadFile(formData).subscribe((resp: any) => {
                    if (resp.success == true) {
                        this.uploadedFiles[index].id = resp.data
                        this.uploadedFiles[index].uploading = false
                        this.uploadedFiles[index].name = file.name.split(".")[0]
                        this.docData.push({
                            id: resp.data,
                            project_id: this.docData.id,
                            full_name: file.name.split(".")[0],
                            file_size: this.filesize,
                            document_type: this.docType
                        })

                        this.alert.success(`${file.name.split(".")[0]} uploaded successfully`)
                        this.fileStatus = 'uploaded'
                    } else {
                        this.alert.error(resp.errors.general)
                        this.uploadedFiles[index].uploading = false
                    }
                    // this.inputFieldRef.nativeElement.value = ''
                })//upload api
            })
    }
    fileDragStart(e: any): void {
        e.preventDefault()
        e.target.classList.add('highlight')
    }
    fileDragEnd(e: any): void {
        e.preventDefault()
        e.target.classList.remove('highlight')
    }

    fileDropped(e: any): void {
        e.preventDefault()
        e.stopPropagation()
        if (e.dataTransfer && e.dataTransfer.files.length) {
            this.uploadFiles(e.dataTransfer.files)
        }
        e.target.classList.remove('highlight')
    }

    navigate(type: string) {
        const steps = ['plan', 'spec', 'addendum', 'other']
        const index = steps.findIndex(s => s === this.docType)
        let url = ''
        if (type == 'next') {
            if (index == steps.length - 1) {
                url = '../subbidding-documents'
            } else {
                url = steps[index + 1]
            }
        } else {
            if (index == 0) {
                url = '../packages'
            } else {
                url = steps[index - 1]
            }
        }
        this.router.navigate(['../' + url], { relativeTo: this.route })
    }
}
