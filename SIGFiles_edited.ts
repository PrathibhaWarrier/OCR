import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  entityForm: FormGroup;
  signalFiles: any[] = [];
  entityFiles: any[] = [];
  isUploading: boolean = false;
  uploadProgress: number = 0;
  fileError: string = '';

  @ViewChild('signalFolderUpload', { static: false }) signalFolderUpload: ElementRef;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.entityForm = this.fb.group({
      signal_name: [''],
      channel_type_ids: [[]],
      wave_form: [''],
      preceding_entity: [''],
      entity_list_comments: ['']
    });
  }

  onFolderSelected(event: any) {
    const files: FileList = event.target.files;
    this.signalFiles = [];
    this.entityFiles = [];

    for (let i = 0; i < files.length; i++) {
      if (files[i].name.endsWith('.txt')) {
        this.signalFiles.push({
          file: files[i],
          file_name: files[i].name,
          webkitRelativePath: files[i].webkitRelativePath,
          original_name: files[i].name
        });
        this.entityFiles.push(files[i]);
      }
    }

    this.entityForm.patchValue({ signal_files: this.signalFiles });
  }

  // Other methods like upload, download, delete, etc.

}
////////////////////////////////////////////////////////////////////////////////////////////////




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

      <div class="entity-form-row">
        <div class="form-div">
          <mat-form-field>
            <mat-label>Wave form</mat-label>
            <mat-select formControlName="wave_form">
              <mat-option
                [value]="opt"
                *ngFor="let opt of dropdownOptions.WAVE_FORM"
              >
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

      <div class="entity-form-row file-upload-div">
        <div class="file-upload-div-inner">
          <div>Upload event files-Signal</div>
          <input type="file" class="file-upload-input" webkitdirectory #signalFolderUpload (change)="onFolderSelected($event)">
          <button
            mat-flat-button
            color="primary"
            matTooltip="upload file"
            class="upload-btn icon-btn"
            [disabled]="signalFiles.length > 0"
            (click)="signalFolderUpload.click()"
          >
            <mat-icon>attach_file</mat-icon>
          </button>
        </div>
      </div>

      <div class="file-path">
        <div *ngFor="let file of entityFiles">
          {{ file.webkitRelativePath }}
        </div>
      </div>

      <mat-error *ngIf="fileError">{{ fileError }}</mat-error>
      <div *ngIf="isUploading" class="progress-container">
        <span>File is uploading: Progress: {{ uploadProgress }}%</span>
        <mat-progress-bar
          class="progress-bar"
          mode="determinate"
          [value]="uploadProgress"
          *ngIf="isUploading"
        ></mat-progress-bar>
      </div>

      <div *ngFor="let file of signalFiles; index as i" class="file-names">
        <span class="file-name-span" (click)="downloadFile(file.file_name, file.original_name, entityForm.value.signal_name)">
          {{ file.original_name }}
        </span>
        <span class="action-span" (click)="deleteSignalFile(i, file.file_name)">
          <mat-icon>delete</mat-icon>
        </span>
      </div>

      <quill-editor
        (onFocus)="focus($event)"
        class="quill-editor-create-new"
        [(ngModel)]="entityForm.value.entity_list_comments"
        style="min-height: 40px; height: auto; margin-bottom: 20px;"
        formControlName="entity_list_comments"
        placeholder="'Type comments here...'"
      ></quill-editor>
    </form>
</div>
