<!-- Container to be displayed when the type is 'create' -->
<div class="form-container" *ngIf="type === 'create'">
  <form [formGroup]="entityForm">
    <!-- Event Name -->
    <div class="entity-form-row">
      <div class="form-div">
        <mat-form-field>
          <mat-label>Event name</mat-label>
          <input matInput formControlName="signal_name" />
        </mat-form-field>
      </div>

      <!-- Channel Type(s) -->
      <div class="form-div">
        <mat-form-field>
          <mat-label>Channel type(s)</mat-label>
          <mat-select formControlName="channel_type_ids" multiple>
            <mat-option
              class="multi-content-option"
              [value]="opt.id"
              *ngFor="let opt of dropdownOptions.CHANNEL_TYPE"
              (click)="showChannelTypes(opt)"
            >
              {{ opt.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </div>

    <!-- Wave Form and Preceding Event -->
    <div class="entity-form-row">
      <div class="form-div">
        <mat-form-field>
          <mat-label>Wave form</mat-label>
          <mat-select formControlName="wave_form">
            <mat-option [value]="opt" *ngFor="let opt of dropdownOptions.WAVE_FORM">
              {{ opt.name }}
            </mat-option>
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
            >
              {{ precedingSinalNumber }}-{{ opt.entity_number }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </div>

    <!-- File Upload -->
    <div class="form-row-item file-upload-div">
      <div>Upload event files</div>
      <div
        class="file-drop-zone"
        [class.dragging]="isDragging"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
      >
        <input
          type="file"
          class="file-upload-input"
          #signalFileUpload
          (change)="onSignalFileSelected($event)"
          multiple
          style="display: none;"
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
        <p>Drag and drop files here or click to upload.</p>
      </div>
      <br />
      <mat-error *ngIf="fileError">{{ fileError }}</mat-error>
      <div *ngIf="isUploading" class="progress-container">
        <span>File is uploading: Progress: {{ uploadProgress }}%</span>
        <mat-progress-bar class="progress-bar" mode="determinate" [value]="uploadProgress"></mat-progress-bar>
      </div>
      <div *ngFor="let file of signalFiles; index as i" class="file-names">
        <span
          class="file-name-span"
          (click)="downloadFile(file.file_name, file.original_name, entityForm.value.signal_name)"
        >
          {{ file.original_name }}
        </span>
        <span class="action-span" (click)="deleteSignalFile(i, file.file_name)">
          <mat-icon>delete</mat-icon>
        </span>
      </div>
    </div>

    <!-- Comments -->
    <quill-editor
      (onFocus)="focus($event)"
      class="quill-editor-create-new"
      [(ngModel)]="entityForm.value.comments"
      style="min-height: 40px; height: auto; margin-bottom: 20px;"
      formControlName="comments"
      placeholder="'Type comments here...'"
    ></quill-editor>
  </form>
</div>

<!-- Container to be displayed when the type is 'edit' -->
<div class="editing-form-container" *ngIf="type === 'edit'">
  <form [formGroup]="entityForm">
    <div class="property-div entity-number-property" *ngIf="type === 'edit'">
      <div class="property-label"><b>Event number</b></div>
      <div class="property-value">{{ currenSignalNumber }}-{{ editData.entity_number }}</div>
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
          <mat-select formControlName="channel_type_ids" multiple>
            <mat-option
              class="multi-content-option"
              [value]="opt.id"
              *ngFor="let opt of dropdownOptions.CHANNEL_TYPE"
              (click)="showChannelTypes(opt)"
            >
              {{ opt.name }}
            </mat-option>
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
            <mat-option [value]="opt" *ngFor="let opt of dropdownOptions.WAVE_FORM">
              {{ opt.name }}
            </mat-option>
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
            >
              {{ precedingSinalNumber }}-{{ opt.entity_number }}
            </mat-option>
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
        <br />
        <mat-error *ngIf="fileError">{{ fileError }}</mat-error>
        <div *ngIf="isUploading" class="progress-container">
          <span>File is uploading: Progress: {{ uploadProgress }}%</span>
          <mat-progress-bar class="progress-bar" mode="determinate" [value]="uploadProgress"></mat-progress-bar>
        </div>

        <div *ngFor="let file of signalFiles; index as i" class="file-names">
          <span
            class="file-name-span"
            (click)="downloadFile(file.file_name, file.original_name, entityForm.value.signal_name)"
          >
            {{ file.original_name }}
          </span>
          <span class="action-span" (click)="deleteSignalFile(i, file.file_name)">
            <mat-icon>delete</mat-icon>
          </span>
        </div>
      </div>
    </div>
    <div class="property-div quill-editor-form-div-edit">
      <div class="property-label"><b>Comments</b></div>
      <div class="property-value">
        <quill-editor
          (onFocus)="focus($event)"
          [(ngModel)]="entityForm.value.comments"
          style="min-height: 40px; height: auto"
          formControlName="comments"
          placeholder="'Type comments here...'"
        ></quill-editor>
      </div>
    </div>
  </form>
</div>

<!-- Container to be displayed when the type is 'editView' -->
<div class="form-container" *ngIf="type === 'editView'">
  <form [formGroup]="entityForm">
    <div class="entity-form-row">
      <div class="form-div">
        <mat-form-field>
          <mat-label>Event name</mat-label>
          <input matInput formControlName="signal_name" />
        </mat-form-field>
      </div>

      <!-- Channel Type(s) -->
      <div class="form-div">
        <mat-form-field>
          <mat-label>Channel type(s)</mat-label>
          <mat-select formControlName="channel_type_ids" multiple>
            <mat-option
              class="multi-content-option"
              [value]="opt.id"
              *ngFor="let opt of dropdownOptions.CHANNEL_TYPE"
              (click)="showChannelTypes(opt)"
            >
              {{ opt.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </div>

    <!-- Wave Form and Preceding Event -->
    <div class="entity-form-row">
      <div class="form-div">
        <mat-form-field>
          <mat-label>Wave form</mat-label>
          <mat-select formControlName="wave_form">
            <mat-option [value]="opt" *ngFor="let opt of dropdownOptions.WAVE_FORM">
              {{ opt.name }}
            </mat-option>
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
            >
              {{ precedingSinalNumber }}-{{ opt.entity_number }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </div>

    <!-- File Upload -->
    <div class="form-row-item file-upload-div">
      <div>Upload event files</div>
      <div
        class="file-drop-zone"
        [class.dragging]="isDragging"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
      >
        <input
          type="file"
          class="file-upload-input"
          #signalFileUpload
          (change)="onSignalFileSelected($event)"
          multiple
          style="display: none;"
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
        <p>Drag and drop files here or click to upload.</p>
      </div>
      <br />
      <mat-error *ngIf="fileError">{{ fileError }}</mat-error>
      <div *ngIf="isUploading" class="progress-container">
        <span>File is uploading: Progress: {{ uploadProgress }}%</span>
        <mat-progress-bar class="progress-bar" mode="determinate" [value]="uploadProgress"></mat-progress-bar>
      </div>
      <div *ngFor="let file of signalFiles; index as i" class="file-names">
        <span
          class="file-name-span"
          (click)="downloadFile(file.file_name, file.original_name, entityForm.value.signal_name)"
        >
          {{ file.original_name }}
        </span>
        <span class="action-span" (click)="deleteSignalFile(i, file.file_name)">
          <mat-icon>delete</mat-icon>
        </span>
      </div>
    </div>

    <!-- Comments -->
    <quill-editor
      (onFocus)="focus($event)"
      class="quill-editor-create-new"
      [(ngModel)]="entityForm.value.comments"
      style="min-height: 40px; height: auto; margin-bottom: 20px;"
      formControlName="comments"
      placeholder="'Type comments here...'"
    ></quill-editor>
  </form>
</div>
//////////////////////////////

.ts

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css']
})
export class EntityComponent implements OnInit {
  @ViewChild('signalFileUpload') signalFileUpload: ElementRef<HTMLInputElement>;

  entityForm: FormGroup;
  type: string;
  currenSignalNumber: string;
  editData: any;
  precedingSinalNumber: string;
  dropdownOptions = {
    CHANNEL_TYPE: [],
    WAVE_FORM: []
  };
  precedingEntityOption = [];
  signalFiles = [];
  isUploading = false;
  uploadProgress = 0;
  fileError = '';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.entityForm = this.fb.group({
      signal_name: [''],
      channel_type_ids: [[]],
      wave_form: [''],
      preceding_entity: [''],
      comments: ['']
    });
  }

  showChannelTypes(opt): void {
    // Implement your logic here
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    this.handleFileSelection(files);
  }

  onSignalFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.handleFileSelection(files);
  }

  handleFileSelection(files: FileList): void {
    this.isUploading = true;
    this.uploadProgress = 0;
    // Simulate file upload and progress
    setTimeout(() => {
      this.uploadProgress = 100;
      this.isUploading = false;
      for (let i = 0; i < files.length; i++) {
        this.signalFiles.push({ file_name: files[i].name, original_name: files[i].name });
      }
    }, 3000);
  }

  downloadFile(fileName: string, originalName: string, signalName: string): void {
    // Implement file download logic here
  }

  deleteSignalFile(index: number, fileName: string): void {
    this.signalFiles.splice(index, 1);
  }

  focus(event: any): void {
    // Implement focus logic here
  }
}
