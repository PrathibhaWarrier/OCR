<div>
    <form [formGroup]="eventForm">
        <h4 class="sub-header">Event information & sequence (customer info)</h4>
    <div class="event-list-column">
      <div class="file-note-row">
        <div class="note-row">
          <div class="note-content-div">
            <ul>
              <li>
                <b>Event</b> length:
                <ul>
                  <li>
                    Maximum event duration of 1 or 2 minutes (to avoid the shock heating up
      too much during iterations steps)
                  </li>
                  <li>Each event of the test track should be separately given in a signal file</li>
                </ul>
              </li>
              <li>
                <b>Sequence</b> (recipe) of events and repetitions for each event
              </li>
            </ul>
          </div>
          
        </div>
        
        <!-- <div class="form-row-item file-upload-div"> -->
          <div
          class="form-row-item file-upload-div"
          (drop)="onDrop($event)"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          [class.dragging]="isDragging"
        >
          <!-- <div class="repetitions-property">
            <mat-form-field>
                <mat-label>Total repetitions</mat-label>
                <input matInput type="number" min="0"  formControlName="total_repetitions" />
              </mat-form-field>
          </div> -->
          <div class="file-upload-div-inner">
            <div>Upload event information files step2</div>
          <input
            type="file"
            class="file-upload-input"
            accept=".png, .jpg, .jpeg, .tif, .tiff, .xlsx, .csv, .txt, .pdf, .ppt, .docx"
            (change)="onFileSelected($event, 'event')"
            #eventFileUpload
            multiple
          />
          <button
            mat-flat-button
            color="primary"
            matTooltip="upload file"
            class="upload-btn icon-btn"
            (click)="eventFileUpload.click()"
          >
            <mat-icon>attach_file</mat-icon>
          </button>&nbsp;&nbsp;
          <span class="accepted-files-message">Accepted files: .png, .jpg, .jpeg, .tif, .tiff, .xlsx, .csv, .txt, .pdf</span>
          <div class="files-container">
            <div *ngIf="isUploading" class="progress-container">
              <span>File is uploading: Progress: {{uploadProgress}}%</span>          
              <mat-progress-bar
                class="progress-bar"
                mode="determinate"
                [value]="uploadProgress"
                *ngIf="isUploading"
              ></mat-progress-bar>
            </div>
    
            <div
              *ngFor="let file of eventListDocs.files; index as i"
              class="file-names"
              
            >
              <span class="file-name-span" 
                    (click)="downloadFile(file.file_name, file.original_name)"
                    >{{ file.original_name }}</span>
              <span
                class="action-span"
                (click)="deleteFile('event', i, file)"
                ><mat-icon>delete</mat-icon></span>
            </div>
          </div>
          </div>
        </div>
        
      </div>
      <div class="comments-row">
        <!-- <div class="form-row-item comments-div">
          <mat-form-field>
            <mat-label>Comments</mat-label>
            <textarea matInput formControlName="event_list_comments"></textarea>
          </mat-form-field>
        </div> -->
        <quill-editor (onFocus)="focus($event)"
        class="quill-editor-event-list"
        [(ngModel)]="eventForm.value.event_list_comments"
        style="min-height: 40px;height:auto"  formControlName="event_list_comments"
        placeholder="'Type comments here...'"></quill-editor>
      </div>
    </div>
    </form>
</div>

//////////////////////////////

import { Component, Input, OnInit } from '@angular/core';
import { DocFile, DocParameterDetails } from '../../../shared/interface';
import { FormBuilder, FormGroup } from '@angular/forms';
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
    files: []
  };
  @Input() eventFiles: any[] = [];
  @Input() actionType = '';
  uploadProgress: number = 0;
  isUploading = false;

  eventForm: FormGroup;
  isDragging = false;

  constructor(private fb: FormBuilder, private shared: SharedService) {
    this.eventForm = this.fb.group({
      event_list_comments: [''],
      total_repetitions: []
    });
  }

  ngOnInit(): void {
    this.autoFill();
  }

  downloadFile(dbName:string, original_name:string) {
    this.shared.downloadFile(dbName).subscribe((result:any) => {
      // this.blob = new Blob([result]);
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = original_name;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
    })
  }

  deleteFile(type: string, i: number, file: DocFile) {
    const fileObj: DeleteFile = { file_id: file.id, file_name: file.file_name };
    this.shared.deleteFileNew(fileObj).subscribe(
      () => {
        this.eventListDocs.files.splice(i, 1);
      },
      error => {
        console.error('File delete error:', error);
      }
    );
  }

  onFileSelected(event: Event, type: string) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    this.uploadFiles(input.files);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files.length) {
      this.uploadFiles(event.dataTransfer.files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  uploadFiles(files: FileList) {
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('file', file));

    this.isUploading = true;
    this.shared.bulkFileUpload(formData).pipe(
      map((event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.uploadProgress = Math.round((event.loaded * 100) / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      })
    ).subscribe(
      (event: any) => {
        if (event.body) {
          const uploadedFiles = event.body;
          uploadedFiles.forEach((file: any) => {
            this.eventListDocs.files.push({
              file_name: file.file_name,
              original_name: file.original_name,
            });
          });
          this.isUploading = false;
        }
      },
      error => {
        console.error('File upload error:', error);
        this.isUploading = false;
      }
    );
  }

  focus(event: any) {
    console.log('Focused:', event);
  }

  /** Auto fill the event form if the data is passed from the parent component */
  autoFill() {
    if (this.data) {
      this.eventForm.patchValue(this.data);
    }
  }
}
