<!-- Container to be displayed when the type is 'create'-->
<div class="form-container" *ngIf="type === 'create'">
    <form [formGroup]="entityForm">
      <div class="entity-form-row">
        <div class="form-div">
          <mat-form-field>
            <mat-label>Event name</mat-label>
            <input matInput formControlName="signal_name" />
          </mat-form-field>
        </div>
        <div class="form-div">
          <mat-form-field>
            <mat-label>Channel type(s)</mat-label>
            <mat-select formControlName="channel_type_ids"  multiple>
              <mat-option
                class="multi-content-option"
                [value]="opt.id"
                *ngFor="let opt of dropdownOptions.CHANNEL_TYPE"
                (click)="showChannelTypes(opt)"
                >{{ opt.name }}</mat-option>
              >
            </mat-select>
          </mat-form-field>
        </div>
      </div>
      <div class="entity-form-row">
        <div class="form-div">
          <mat-form-field>
            <mat-label>Wave form</mat-label>
            <mat-select formControlName="wave_form">
              <mat-option
                [value]="opt"
                *ngFor="let opt of dropdownOptions.WAVE_FORM"
                >{{ opt.name }}</mat-option>
              >
            </mat-select>
          </mat-form-field>
        </div>
        <div class="form-div" *ngIf="precedingEntityOption.length > 0">
          <mat-form-field>
            <mat-label>Preceding event number</mat-label>
            <mat-select formControlName="preceding_entity">
              <mat-option
                class="multi-content-option"
                [value]="opt"
                *ngFor="let opt of precedingEntityOption"
                >{{precedingSinalNumber}}-{{ opt.entity_number }}</mat-option>
              >
            </mat-select>
          </mat-form-field>
        </div>
      </div>
      <div class="form-row-item file-upload-div">
          <div>Upload event files</div>
          <input
            type="file"
            class="file-upload-input"
            #folderUpload
            webkitdirectory
            (change)="onFolderSelected($event)"
          />
          <button
            mat-flat-button
            color="primary"
            matTooltip="upload folder"
            class="upload-btn icon-btn"
            (click)="folderUpload.click()"
          >
            <mat-icon>folder</mat-icon>
          </button>
          <br>
          <mat-error *ngIf="fileError">{{fileError}}</mat-error>
          <div *ngIf="isUploading" class="progress-container">
            <span>File is uploading: Progress: {{uploadProgress}}%</span>
            <mat-progress-bar
              class="progress-bar"
              mode="determinate"
              [value]="uploadProgress"
              *ngIf="isUploading"
            ></mat-progress-bar>
          </div>
          <div *ngFor="let file of signalFiles; index as i" class="file-names">
            <span class="file-name-span"
              (click)="downloadFile(file.file_name, file.original_name, entityForm.value.signal_name)"
            >{{ file.original_name }}</span>
            <span
              class="action-span"
              (click)="deleteSignalFile(i, file.file_name)"
            ><mat-icon>delete</mat-icon></span>
            <span class="file-path-span">{{ file.file_path }}</span>
          </div>
      </div>
      <br>
      <quill-editor (onFocus)="focus($event)"
      class="quill-editor-create-new"
      [(ngModel)]="entityForm.value.comments"
      style="min-height: 40px;height:auto;margin-bottom: 20px;"  formControlName="comments"
      placeholder="'Type comments here...'"></quill-editor>
    </form>
  </div>
<!-- Container to be displayed when the type is 'edit'-->
<div class="editing-form-container" *ngIf="type === 'edit'">
    <form [formGroup]="entityForm">
      <div class="property-div entity-number-property" *ngIf="type === 'edit'">
        <div class="property-label"><b>Event number</b></div>
        <div class="property-value">{{currenSignalNumber}}-{{editData.entity_number}}</div>
      </div>
      <div class="property-div">
        <div class="property-label"><b>Name</b></div>
        <div class="property-value">
          <mat-form-field>
            <mat-label>Event name</mat-label>
            <input matInput formControlName="signal_name" />
          </mat-form-field>
        </div>
      </div>
      <div class="property-div">
        <div class="property-label"><b>Channel types</b></div>
        <div class="property-value">
          <mat-form-field>
            <mat-label>Channel type(s)</mat-label>
            <mat-select formControlName="channel_type_ids"  multiple>
              <mat-option
                class="multi-content-option"
                [value]="opt.id"
                *ngFor="let opt of dropdownOptions.CHANNEL_TYPE"
                (click)="showChannelTypes(opt)"
                >{{ opt.name }}</mat-option>
              >
            </mat-select>
          </mat-form-field>
        </div>
      </div>
      <div class="property-div">
        <div class="property-label"><b>Wave form</b></div>
        <div class="property-value">
          <mat-form-field>
            <mat-label>Wave form</mat-label>
            <mat-select formControlName="wave_form">
              <mat-option
                [value]="opt"
                *ngFor="let opt of dropdownOptions.WAVE_FORM"
                >{{ opt.name }}</mat-option>
              >
            </mat-select>
          </mat-form-field>
        </div>
      </div>
      <div class="property-div" *ngIf="precedingEntityOption.length > 0">
        <div class="property-label"><b>Preceding Entity number</b></div>
        <div class="property-value">
          <mat-form-field>
            <mat-label>Preceding Entity number</mat-label>
            <mat-select formControlName="preceding_entity">
              <mat-option
                class="multi-content-option"
                [value]="opt"
                *ngFor="let opt of precedingEntityOption"
                >{{precedingSinalNumber}}-{{ opt.entity_number }}</mat-option>
              >
            </mat-select>
          </mat-form-field>
        </div>
      </div>
      <div class="property-div">
        <div class="property-label"><b>Upload event files</b></div>
        <div class="form-row-item file-upload-div-edit">
          <input
            type="file"
            class="file-upload-input"
            #signalFileUpload
            (change)="onSignalFileSelected($event)"
            multiple
          />
          <button
            mat-flat-button
            color="primary"
            matTooltip="upload file"
            class="upload-btn icon-btn"
            [disabled]="signalFiles.length > 0"
            (click)="signalFileUpload.click()"
          >
            <mat-icon>attach_file</mat-icon>
          </button>
          <br>
          <mat-error *ngIf="fileError">{{fileError}}</mat-error>
          <div *ngIf="isUploading" class="progress-container">
            <span>File is uploading: Progress: {{uploadProgress}}%</span>
            <mat-progress-bar
              class="progress-bar"
              mode="determinate"
              [value]="uploadProgress"
              *ngIf="isUploading"
            ></mat-progress-bar>
          </div>
          <div *ngFor="let file of signalFiles; index as i" class="file-names">
            <span class="file-name-span"
              (click)="downloadFile(file.file_name, file.original_name, entityForm.value.signal_name)"
            >{{ file.original_name }}</span>
            <span
              class="action-span"
              (click)="deleteSignalFile(i, file.file_name)"
            ><mat-icon>delete</mat-icon></span>
            <span class="file-path-span">{{ file.file_path }}</span>
          </div>
        </div>
      </div>
      <br>
      <div class="property-div quill-editor-form-div-edit">
        <div class="property-label"><b>Comments</b></div>
        <div class="property-value">
          <quill-editor (onFocus)="focus($event)"
          [(ngModel)]="entityForm.value.comments"
          style="min-height: 40px;height:auto"  formControlName="comments"
          placeholder="'Type comments here...'"></quill-editor>
        </div>
      </div>
    </form>
  </div>
<!-- Container to be displayed when the type is 'editView'-->
<div class="form-container" *ngIf="type === 'editView'">
    <form [formGroup]="entityForm">
      <div class="entity-form-row">
        <div class="form-div">
          <mat-form-field>
            <mat-label>Event name</mat-label>
            <input matInput formControlName="signal_name" />
          </mat-form-field>
        </div>
        <div class="form-div">
          <mat-form-field>
            <mat-label>Channel type(s)</mat-label>
            <mat-select formControlName="channel_type_ids"  multiple>
              <mat-option
                class="multi-content-option"
                [value]="opt.id"
                *ngFor="let opt of dropdownOptions.CHANNEL_TYPE"
                (click)="showChannelTypes(opt)"
                >{{ opt.name }}</mat-option>
              >
            </mat-select>
          </mat-form-field>
        </div>
      </div>
      <div class="entity-form-row">
        <div class="form-div">
          <mat-form-field>
            <mat-label>Wave form</mat-label>
            <mat-select formControlName="wave_form">
              <mat-option
                [value]="opt"
                *ngFor="let opt of dropdownOptions.WAVE_FORM"
                >{{ opt.name }}</mat-option>
              >
            </mat-select>
          </mat-form-field>
        </div>
        <div class="form-div" *ngIf="precedingEntityOption.length > 0">
          <mat-form-field>
            <mat-label>Preceding event number</mat-label>
            <mat-select formControlName="preceding_entity">
              <mat-option
                class="multi-content-option"
                [value]="opt"
                *ngFor="let opt of precedingEntityOption"
                >{{precedingSinalNumber}}-{{ opt.entity_number }}</mat-option>
              >
            </mat-select>
          </mat-form-field>
        </div>
      </div>
      <div class="form-row-item file-upload-div">
          <div>Upload event files</div>
          <input
            type="file"
            class="file-upload-input"
            #folderUpload
            webkitdirectory
            (change)="onFolderSelected($event)"
          />
          <button
            mat-flat-button
            color="primary"
            matTooltip="upload folder"
            class="upload-btn icon-btn"
            (click)="folderUpload.click()"
          >
            <mat-icon>folder</mat-icon>
          </button>
          <br>
          <mat-error *ngIf="fileError">{{fileError}}</mat-error>
          <div *ngIf="isUploading" class="progress-container">
            <span>File is uploading: Progress: {{uploadProgress}}%</span>
            <mat-progress-bar
              class="progress-bar"
              mode="determinate"
              [value]="uploadProgress"
              *ngIf="isUploading"
            ></mat-progress-bar>
          </div>
          <div *ngFor="let file of signalFiles; index as i" class="file-names">
            <span class="file-name-span"
              (click)="downloadFile(file.file_name, file.original_name, entityForm.value.signal_name)"
            >{{ file.original_name }}</span>
            <span
              class="action-span"
              (click)="deleteSignalFile(i, file.file_name)"
            ><mat-icon>delete</mat-icon></span>
            <span class="file-path-span">{{ file.file_path }}</span>
          </div>
      </div>
      <br>
      <quill-editor (onFocus)="focus($event)"
      class="quill-editor-create-new"
      [(ngModel)]="entityForm.value.comments"
      style="min-height: 40px;height:auto;margin-bottom: 20px;"  formControlName="comments"
      placeholder="'Type comments here...'"></quill-editor>
    </form>
  </div>


////////////////////////////////////////////ts///////////////////////////////////////////






import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent {
  @ViewChild('folderUpload', { static: false }) folderUpload: ElementRef;
  entityForm: FormGroup;
  signalFiles: Array<{ file_name: string, original_name: string, file_path: string }> = [];
  fileError: string = '';
  isUploading: boolean = false;
  uploadProgress: number = 0;

  constructor(private fb: FormBuilder) {
    this.entityForm = this.fb.group({
      signal_name: [''],
      channel_type_ids: [[]],
      wave_form: [''],
      preceding_entity: [''],
      comments: ['']
    });
  }

  onFolderSelected(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.processFiles(files);
    }
  }

  processFiles(files: FileList) {
    this.isUploading = true;
    this.uploadProgress = 0;
    let uploadedFiles = 0;
    const totalFiles = files.length;
    const allowedExtensions = ['txt', 'docx'];

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (allowedExtensions.includes(fileExtension)) {
        // Simulate file upload and save file path
        const filePath = file.webkitRelativePath;
        this.signalFiles.push({
          file_name: file.name,
          original_name: file.name,
          file_path: filePath
        });

        // Update the event name with the file paths
        this.entityForm.patchValue({
          signal_name: (this.entityForm.value.signal_name || '') + '\n' + filePath
        });

        uploadedFiles++;
        this.uploadProgress = (uploadedFiles / totalFiles) * 100;

        // Mocking a delay to simulate file upload
        setTimeout(() => {
          if (uploadedFiles === totalFiles) {
            this.isUploading = false;
          }
        }, 1000);
      } else {
        this.fileError = `Unsupported file type: ${file.name}`;
      }
    }
  }

  // Mock methods for download and delete
  downloadFile(fileName: string, originalName: string, signalName: string) {
    console.log(`Downloading file: ${fileName}`);
  }

  deleteSignalFile(index: number, fileName: string) {
    this.signalFiles.splice(index, 1);
    console.log(`Deleted file: ${fileName}`);
  }

  focus(event: any) {
    console.log('Focused on editor', event);
  }

  showChannelTypes(opt: any) {
    console.log('Selected channel type:', opt);
  }
}
