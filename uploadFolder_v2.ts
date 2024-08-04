uploadFiles(files: FileList) {
  const formData = new FormData();
  for (let index = 0; index < files.length; index++) {
    formData.append('file', files[index]);
  }
  this.isUploading = true;
  this.shared
    .bulkFileUpload(formData)
    .pipe(
      map((event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.uploadProgress = 0;
            event.loaded && event.total && (this.uploadProgress = Math.round((event.loaded * 100) / event.total));
            break;
          case HttpEventType.Response:
            return event;
        }
      })
    )
    .subscribe((event: any) => {
      if (typeof event === 'object') {
        const files = event.body;
        this.isUploading = false;
        for (let x = 0; x < files.length; x++) {
          this.eventListDocs.files.push({
            file_name: files[x].file_name,
            original_name: files[x].original_name,
          });
        }
      }
    }, (error: any) => {
      console.error('Upload failed:', error);
      this.isUploading = false;
    });
}

onFileSelected(event: any, type: string) {
  const files = event.target.files;
  this.uploadFiles(files);
}
//////////////////////////////////

onFolderSelected(event: any) {
  const files = event.target.files;
  this.eventFiles = [];
  this.scanFiles(files);
  this.uploadFiles(this.eventFiles);
}

///////////////////////////////

import { Component, Input, OnInit } from '@angular/core';
import { DocFile, DocParameterDetails } from '../../../shared/interface';
import { FormBuilder } from '@angular/forms';
import { DeleteFile, SharedService } from '../../../services/shared/shared.service';
import { map } from 'rxjs';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'signaldb-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit {
  @Input() data: any;
  @Input() eventListDocs: DocParameterDetails = {
    owner: 'EVENTLIST',
    files: [],
  };
  @Input() eventFiles: any[] = [];
  @Input() actionType = '';
  uploadProgress: number = 0;
  isUploading = false;
  allowedExtensions = ['.sig', '.txt'];

  constructor(private fb: FormBuilder, private shared: SharedService) {}

  eventForm = this.fb.group({
    event_list_comments: [''],
    total_repetitions: [],
  });

  onFolderSelected(event: any) {
    const files = event.target.files;
    this.eventFiles = [];
    this.scanFiles(files);
    this.uploadFiles(this.eventFiles);
  }

  scanFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (this.isAllowedExtension(file.name)) {
        this.eventFiles.push(file);
      }
    }
    console.log('Filtered Files:', this.eventFiles);
  }

  isAllowedExtension(fileName: string): boolean {
    const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    return this.allowedExtensions.includes(extension);
  }

  uploadFiles(files: FileList) {
    const formData = new FormData();
    for (let index = 0; index < files.length; index++) {
      formData.append('file', files[index]);
    }
    this.isUploading = true;
    this.shared
      .bulkFileUpload(formData)
      .pipe(
        map((event: any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.uploadProgress = 0;
              event.loaded && event.total && (this.uploadProgress = Math.round((event.loaded * 100) / event.total));
              break;
            case HttpEventType.Response:
              return event;
          }
        })
      )
      .subscribe((event: any) => {
        if (typeof event === 'object') {
          const files = event.body;
          this.isUploading = false;
          for (let x = 0; x < files.length; x++) {
            this.eventListDocs.files.push({
              file_name: files[x].file_name,
              original_name: files[x].original_name,
            });
          }
        }
      }, (error: any) => {
        console.error('Upload failed:', error);
        this.isUploading = false;
      });
  }

  onFileSelected(event: any, type: string) {
    const files = event.target.files;
    this.uploadFiles(files);
  }

  downloadFile(dbName: string, original_name: string) {
    this.shared.downloadFile(dbName).subscribe((result: any) => {
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = original_name;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  }

  deleteFile(type: string, i: number, file: DocFile) {
    let fileObj: DeleteFile;
    this.eventListDocs.files.splice(i, 1);
  }

  focus(event: any) {
    console.log('**');
  }

  autoFill() {
    for (const f in this.data) {
      this.eventForm.patchValue({
        [f]: this.data[f],
      });
    }
  }

  ngOnInit(): void {
    this.autoFill();
  }
}
