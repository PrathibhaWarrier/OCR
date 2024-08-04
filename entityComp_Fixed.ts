import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SharedService } from '../../../services/shared/shared.service';
import { map } from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';

interface ChannelType {
  id: string;
  name: string;
}

@Component({
  selector: 'signaldb-entity-form',
  templateUrl: './entity-form.component.html',
  styleUrls: ['./entity-form.component.scss'],
})
export class EntityFormComponent implements OnInit {
  quillModules = {};
  @Input() dropdownOptions: any;
  @Input() precedingEntityOption: any;
  @Input() precedingValSelected!: boolean;
  @Input() precedingSinalNumber = '';
  @Input() type = '';
  @Input() editData!: any;
  @Input() currenSignalNumber = '';
  signalFiles: any[] = [];
  isUploading = false;
  uploadProgress = 0;
  allowedExtensions = ['.sig', '.txt'];
  @Input() eventListDocs: any = { owner: 'EVENTLIST', files: [] };
  @Input() entityFiles: File[] = [];
  channel_types_arr: ChannelType[] = [];
  precedingEntity: any;
  @Input() fileError!: string;

  entityForm = this.fb.group({
    signal_name: ['', Validators.required],
    channel_type_ids: [[]],
    wave_form: [{ id: '', name: '', del: null, table: '' }],
    comments: [''],
    associated_directory: [''],
    preceding_entity_id: [''],
    preceding_entity: [],
    repetitions: [],
    sequence_number: [1],
  });

  constructor(private fb: FormBuilder, private shared: SharedService) {
    this.quillModules = {
      'emoji-shortname': true,
      'emoji-textarea': true,
      'emoji-toolbar': true,
      'toolbar': [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link', 'image', 'video'],
        ['emoji']
      ]
    };
  }

  get signal_name() {
    return this.entityForm.get('signal_name');
  }

  deleteSignalFile(i: number) {
    this.signalFiles.splice(i, 1);
  }

  showChannelTypes(event: ChannelType) {
    const ids = this.entityForm.value.channel_type_ids || [];
    const index = ids.indexOf(event.id);
    if (index === -1) {
      this.channel_types_arr = this.channel_types_arr.filter(item => item.id !== event.id);
    } else {
      if (!this.channel_types_arr.some(item => item.id === event.id)) {
        this.channel_types_arr.push(event);
      }
    }
  }

  downloadFile(dbName: string, original_name: string, event_name?: string) {
    this.shared.downloadFile(dbName).subscribe(result => {
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = event_name ? `${event_name}-${original_name}` : original_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  }

  onFolderSelected(event: any) {
    const files = event.target.files;
    this.entityFiles = [];
    this.scanFiles(files);
    this.uploadFiles(this.entityFiles);
  }

  scanFiles(files: FileList) {
    this.entityFiles = Array.from(files).filter(file => this.isAllowedExtension(file.name));
    console.log('Filtered Files:', this.entityFiles);
  }

  isAllowedExtension(fileName: string): boolean {
    const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    return this.allowedExtensions.includes(extension);
  }

  uploadFiles(files: File[]) {
    const formData = new FormData();
    files.forEach(file => formData.append('file', file));
    this.isUploading = true;
    this.shared.bulkFileUpload(formData).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            this.uploadProgress = Math.round((event.loaded * 100) / event.total);
          }
        } else if (event.type === HttpEventType.Response) {
          return event;
        }
      })
    ).subscribe({
      next: (event: any) => {
        if (event && event.body) {
          this.isUploading = false;
          this.eventListDocs.files.push(...event.body.map((file: any) => ({
            file_name: file.file_name,
            original_name: file.original_name,
          })));
        }
      },
      error: (error: any) => {
        console.error('Upload failed:', error);
        this.isUploading = false;
      }
    });
  }

  onSignalFileSelectedFn(event: any) {
    const files = event.target.files;
    this.uploadFiles(Array.from(files));
  }

  fillChannelTypes(ids: string[]) {
    this.channel_types_arr = this.dropdownOptions.CHANNEL_TYPE.filter((item: any) =>
      ids.includes(item.id)
    );
  }

  autoFill() {
    const wavePos = this.dropdownOptions.WAVE_FORM.findIndex((item: any) => item.id === this.editData.wave_form_id);
    const entPos = this.precedingEntityOption.findIndex((item: any) => item.id === this.editData.preceding_entity_id);
    this.entityForm.patchValue({
      signal_name: this.editData.signal_name,
      channel_type_ids: this.editData.channel_type_ids,
      wave_form: this.dropdownOptions.WAVE_FORM[wavePos] || { id: '', name: '', del: null, table: '' },
      comments: this.editData.comments,
      preceding_entity_id: this.editData.preceding_entity_id,
      preceding_entity: this.precedingEntityOption[entPos] || null,
      repetitions: this.editData.repetitions,
      sequence_number: this.editData.sequence_number
    });
    this.precedingValSelected = !!this.editData.preceding_entity;
    this.signalFiles = this.editData.signalEntityFiles || [];
    this.fillChannelTypes(this.editData.channel_type_ids || []);
  }

  ngOnInit(): void {
    if (this.editData && (this.type === 'edit' || this.type === 'editView')) {
      this.autoFill();
    }
  }
}

/////////////////////////////////////////HTML////////////////////////////////////////////////

<form [formGroup]="entityForm" (ngSubmit)="onSubmit()">
  <div>
    <label for="signal_name">Signal Name:</label>
    <input id="signal_name" formControlName="signal_name">
    <div *ngIf="signal_name?.invalid && (signal_name?.touched || signal_name?.dirty)">
      <small *ngIf="signal_name?.errors?.required">Signal name is required.</small>
    </div>
  </div>

  <div>
    <label for="channel_types">Channel Types:</label>
    <select id="channel_types" formControlName="channel_type_ids" multiple>
      <option *ngFor="let option of dropdownOptions.CHANNEL_TYPE" [value]="option.id">
        {{ option.name }}
      </option>
    </select>
  </div>

  <div>
    <label for="wave_form">Wave Form:</label>
    <select id="wave_form" formControlName="wave_form">
      <option *ngFor="let form of dropdownOptions.WAVE_FORM" [ngValue]="form">
        {{ form.name }}
      </option>
    </select>
  </div>

  <div>
    <label for="comments">Comments:</label>
    <textarea id="comments" formControlName="comments"></textarea>
  </div>

  <div>
    <label for="associated_directory">Associated Directory:</label>
    <input id="associated_directory" formControlName="associated_directory">
  </div>

  <div>
    <label for="preceding_entity">Preceding Entity:</label>
    <select id="preceding_entity" formControlName="preceding_entity_id">
      <option *ngFor="let entity of precedingEntityOption" [value]="entity.id">
        {{ entity.name }}
      </option>
    </select>
  </div>

  <div>
    <label for="repetitions">Repetitions:</label>
    <input id="repetitions" formControlName="repetitions" type="number">
  </div>

  <div>
    <label for="sequence_number">Sequence Number:</label>
    <input id="sequence_number" formControlName="sequence_number" type="number">
  </div>

  <div>
    <label for="files">Upload Files:</label>
    <input id="files" type="file" (change)="onSignalFileSelectedFn($event)" multiple>
  </div>

  <div>
    <label for="folder">Upload Folder:</label>
    <input id="folder" type="file" (change)="onFolderSelected($event)" webkitdirectory directory multiple>
  </div>

  <button type="submit" [disabled]="entityForm.invalid">Submit</button>

  <div *ngIf="isUploading">
    <p>Uploading... {{ uploadProgress }}%</p>
  </div>

  <ul>
    <li *ngFor="let file of signalFiles">
      {{ file.file_name }}
      <button (click)="deleteSignalFile(file)">Delete</button>
    </li>
  </ul>
</form>

