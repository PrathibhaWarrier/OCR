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
  folderPath: string = ''; // To store the folder path

  constructor(private fb: FormBuilder, private shared: SharedService) {}

  eventForm = this.fb.group({
    event_list_comments: [''],
    total_repetitions: [],
    folder_path: [''] // New form control for folder path
  });

  onFolderSelected(event: any) {
    const files = event.target.files;
    this.eventFiles = [];
    this.folderPath = ''; // Reset folder path
    this.scanFiles(files);
    this.uploadFiles(this.eventFiles);

    // Update the form with folder path
    if (files.length > 0) {
      this.folderPath = files[0].webkitRelativePath.split('/').slice(0, -1).join('/');
      this.eventForm.patchValue({
        folder_path: this.folderPath
      });
    }
  }

  scanFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.webkitRelativePath) {
        // Handle files in directories
        const relativePath = file.webkitRelativePath;
        const fileName = file.name;
        const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
        if (this.isAllowedExtension(extension)) {
          this.eventFiles.push(file);
        }
      } else if (this.isAllowedExtension(file.name)) {
        // Handle files directly selected
        this.eventFiles.push(file);
      }
    }
    console.log('Filtered Files:', this.eventFiles);
  }

  isAllowedExtension(fileName: string): boolean {
    const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    return this.allowedExtensions.includes(extension);
  }

  uploadFiles(files: any[]) {
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
    const filesArray = Array.from(files);
    this.uploadFiles(filesArray);
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






.\/////////////////////////////////html

<div>
  <form [formGroup]="eventForm">
    <div class="event-list-column">
      <div class="file-note-row">
        <div class="note-row">
          <!-- Additional note content here -->
        </div>
        <div class="form-row-item file-upload-div">
          <div class="file-upload-div-inner">
            <div>Upload event information files</div>
            <input type="file" webkitdirectory (change)="onFolderSelected($event)">
          </div>
        </div>
      </div>

      <div class="file-path">
        <div *ngFor="let file of eventFiles">
          {{ file.webkitRelativePath || file.name }}
        </div>
      </div>

      <div class="comments-row">
        <quill-editor
          (onFocus)="focus($event)"
          class="quill-editor-event-list"
          [(ngModel)]="eventForm.value.event_list_comments"
          style="min-height: 40px; height: auto"
          formControlName="event_list_comments"
          placeholder="Type comments here...">
        </quill-editor>
        <!-- Display folder path along with comments -->
        <div *ngIf="folderPath">
          <p><strong>Folder Path:</strong> {{ folderPath }}</p>
        </div>
      </div>
    </div>
  </form>
</div>
