import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SharedService } from '../../../services/shared/shared.service';
import { map } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { SignalEntityFiles } from '../../../shared/interface';

interface ChannelType {
  id: string;
  name: string;
}
interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'signaldb-entity-form',
  templateUrl: './entity-form.component.html',
  styleUrls: ['./entity-form.component.scss'],
})
export class EntityFormComponent implements OnInit {
  quillModules = {};
  constructor(private fb: FormBuilder, private shared: SharedService) {

    // This is the object for quill editor
    this.quillModules = {
      'emoji-shortname': true,
      'emoji-textarea': true,
      'emoji-toolbar': true,
      'toolbar': [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean'],                                         // remove formatting button

        ['link', 'image', 'video'],                         // link and image, video
        ['emoji']

      ]
    }
  }

  @Input() dropdownOptions: any;
  @Input() precedingEntityOption: any;
  @Input() precedingValSelected!: boolean;
  @Input() precedingSinalNumber = '';
  @Input() type = '';
  @Input() editData!: any;
  @Input() currenSignalNumber = '';
  // @Input() fileFormatSelected = '';
  signalFiles: SignalEntityFiles[] = [];
  isUploading = false;
  uploadProgress = 0;
  channel_types_arr: ChannelType[] = [];
  precedingEntity!:any;
  @Input() fileError!:string;
  entityForm = this.fb.group({
    signal_name: ['', Validators.required],
    channel_type_ids: [[]],
    wave_form: [{ id: '', name: '', del: null, table: '' }],
    comments: [''],
    associated_directory: [''],
    preceding_entity_id: [''],
    preceding_entity:[],
    repetitions:[],
    sequence_number:[1]
  });

  get signal_name() {
    return this.entityForm.get('signal_name');
  }

  //delete a signal file from the array 
  deleteSignalFile(i: number, filename: string) {
    // this.shared.deleteFile(filename).subscribe((result: any) => {
      this.signalFiles.splice(i, 1);
    // });
  }
  showChannelTypes(event: any) {
    let ids: any[] = [];
    this.entityForm.value.channel_type_ids
      ? (ids = this.entityForm.value.channel_type_ids)
      : (ids = []);
    for (let x = 0; x < ids.length; x++) {
      const pos = ids.indexOf(event.id);
      if (pos == -1) {
        const pos1 = this.channel_types_arr.indexOf(event);
        if (pos1 > -1) {
          this.channel_types_arr.splice(pos1, 1);
        }
      } else {
        const pos1 = this.channel_types_arr.indexOf(event);
        if (pos1 == -1) {
          this.channel_types_arr.push(event);
        }
      }
    }
    if (ids.length == 0) {
      this.channel_types_arr = [];
    }
  }

  //This method makes API call to get the file from API service and downloads it to local machine
  downloadFile(dbName: string, original_name: string, event_name:string | null | undefined) {
    this.shared.downloadFile(dbName).subscribe((result: any) => {
      // this.blob = new Blob([result]);
      /** Create an anchor tag to download the recieved file */
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = event_name ? event_name + '-' + original_name : original_name;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove(); // remove the element
    });
  }
  focus(event:any) {
    console.log(event)
  }
  

  /** Save the file in the backend service */
  onSignalFileSelected(event: any) {
    // console.log('File selected');
    const file = event.target.files;
    if (file) {
      // console.log(file.type);
      const formData = new FormData();
      for (let index = 0; index < file.length; index++) {
        formData.append('file', file[index]);
      }
      this.isUploading = true;
      this.shared
        .bulkFileUpload(formData)
        .pipe(
          map((event: any) => {
            switch (event.type) {
              case HttpEventType.UploadProgress:
                file.progress = Math.round((event.loaded * 100) / event.total);
                this.uploadProgress = file.progress;
                break;
              case HttpEventType.Response:
                return event;
            }
          })
        )
        .subscribe((event: any) => {
          if (typeof event === 'object') {
            this.isUploading = false;
            this.fileError = '';
            const files = event.body;
            for (let x = 0; x < files.length; x++) {
              // console.log(this.signalFiles);
              /** Creating the file object to save it to the database with its 
               * original name and unique name that is recieved from API while storing the file in the server
               *  */
              this.signalFiles.push({
                file_name: files[x].file_name,
                original_name: files[x].original_name,
              });
            }
          }
        });
    }
  }
  onSignalFileSelectedFn(event: any) {
    const file = event.target.files;
    const formData = new FormData();
    for (let index = 0; index < file.length; index++) {
      formData.append('file', file[index]);
    }
    // formData.append('file', file);
    this.isUploading = true;
    this.shared
      .bulkFileUpload(formData)
      .pipe(
        map((event: any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              file.progress = Math.round((event.loaded * 100) / event.total);
              this.uploadProgress = file.progress;
              break;
            case HttpEventType.Response:
              return event;
          }
        })
      )
      .subscribe((event: any) => {
        if (typeof event === 'object') {
          const files = event.body;
          for (let x = 0; x < files.length; x++) {
            this.signalFiles.push({
              file_name: files[x].file_name,
              original_name: files[x].original_name,
            });
          }
        }
        this.isUploading = false;
      });
    // this.signalFiles.push(...event.target.files);
  }


  // This method will get the selected channel types from channel_type_ids by checking in the dropdownOptions object
  fillChannelTypes(ids: string[]) {
    if (ids) {
      for (let x = 0; x < ids.length; x++) {
        const pos = this.dropdownOptions.CHANNEL_TYPE.map((item: any) => {
          return item.id;
        }).indexOf(ids[x]);
        if (pos !== -1) {
          this.channel_types_arr.push(this.dropdownOptions.CHANNEL_TYPE[pos]);
        }
      }
    }
  }


  autoFill() {
    let wavePos = -1;
    let entPos = -1;
    if (this.editData.wave_form_id) {
      // Find the index of wave_form of the oentity's wave_form_id in the 'dropdownOptions' object
      wavePos = this.dropdownOptions.WAVE_FORM.map((item: any) => {
        return item.id;
      }).indexOf(this.editData.wave_form_id);
    }
    if(this.editData.preceding_entity_id) {
      //Find the index of the precedinng entity 
      entPos = this.precedingEntityOption.map((item:any) => { return item.id}).indexOf(this.editData.preceding_entity_id);
      }

      //creating the signal entity form object
      this.entityForm.patchValue({
        signal_name: this.editData.signal_name,
        channel_type_ids: this.editData.channel_type_ids,
        wave_form: this.dropdownOptions.WAVE_FORM[wavePos],
        comments: this.editData.comments,
        preceding_entity_id: this.editData.preceding_entity_id,
        preceding_entity: this.precedingEntityOption[entPos],
        repetitions:this.editData.repetitions,
        sequence_number: this.editData.sequence_number
      });
      if(this.editData.preceding_entity) {
        this.precedingValSelected = true;
      }
    this.signalFiles = this.editData.signalEntityFiles;
    this.fillChannelTypes(this.editData.channel_type_ids);
  }
  ngOnInit(): void {
    /** Auto populate the entity form with data when operation is edit
     * type == 'edit' when the edit is clicked from the create signal dialog
     * type == 'editView' when entity edit is clicked from the 'signal view' screen
     */
    if (this.editData && this.type == 'edit' || this.editData && this.type == 'editView') {
      this.autoFill();
    }
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//.html

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
                >{{ opt.name }}</mat-option
              >
            </mat-select>
          </mat-form-field>
        </div>
        <!-- <div class="form-div">
          <mat-form-field>
            <mat-label>Sequence number</mat-label>
            <input matInput type="number" min="0" formControlName="sequence_number" />
          </mat-form-field>
        </div> -->
      </div>
      <!-- <div  class="entity-form-row">
        <div class="form-div">
          <mat-form-field>
            <mat-label>Repetitions</mat-label>
            <input matInput type="number" min="0"  formControlName="repetitions" />
          </mat-form-field>
        </div>
        
      </div> -->
      <div  class="entity-form-row">
        <div class="form-div">
          <mat-form-field>
            <mat-label>Wave form</mat-label>
            <mat-select formControlName="wave_form">
              <mat-option
                [value]="opt"
                *ngFor="let opt of dropdownOptions.WAVE_FORM"
                >{{ opt.name }}</mat-option
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
                >{{precedingSinalNumber}}-{{ opt.entity_number }}</mat-option
              >
            </mat-select>
          </mat-form-field>
        </div>
      </div>
      <!-- <div class="create-form-container"> -->

        <div class="form-row-item file-upload-div">
          <div>Upload event files 22222</div>
          <input
            type="file"
            class="file-upload-input"
            #signalFileUpload
            (change)="onSignalFileSelected($event)"
            
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
  
          <div 
            *ngFor="let file of signalFiles; index as i" 
            class="file-names">
              <span class="file-name-span" 
                  (click)="downloadFile(file.file_name, file.original_name, entityForm.value.signal_name)"
                  >{{ file.original_name }}</span>
            <span
              class="action-span"
              (click)="deleteSignalFile(i, file.file_name)"
              ><mat-icon>delete</mat-icon></span>
          </div>
        </div>
        <br>
        <!-- <div class="form-div">
          <mat-form-field>
            <mat-label>Comments</mat-label>
            <input matInput formControlName="comments" />
          </mat-form-field>
        </div> -->
        <!-- <div class="form-div quill-editor-form-div">
         
        </div> -->
        <quill-editor (onFocus)="focus($event)"
      class="quill-editor-create-new"
      [(ngModel)]="entityForm.value.comments"
      style="min-height: 40px;height:auto;margin-bottom: 20px;"  formControlName="comments"
      placeholder="'Type comments here...'"></quill-editor>
      <!-- </div> -->
      
    </form>
  </div>
  <!-- Container to be displayed when the type is 'edit'-->
  <div class="editing-form-container"  *ngIf="type === 'edit'">
    <form [formGroup]="entityForm">
    <div class="property-div entity-number-property" *ngIf="type === 'edit'">
      <div class="property-label"><b>Event number</b></div>
      <div class="property-value">{{currenSignalNumber}}-{{editData.entity_number}}</div>
    </div>
    <div  class="property-div">
      <div class="property-label"><b>Name</b></div>
      <div class="property-value">
        <mat-form-field>
          <mat-label>Event name</mat-label>
          <input matInput formControlName="signal_name" />
        </mat-form-field>
      </div>
    </div>
    <!-- <div  class="property-div">
      <div class="property-label"><b>Sequence number</b></div>
      <div class="property-value">
        <mat-form-field>
          <mat-label>Sequence number</mat-label>
          <input matInput  type="number"  min="0"  formControlName="sequence_number" />
        </mat-form-field>
      </div>
    </div> -->
    <!-- <div  class="property-div">
      <div class="property-label"><b>Repetitions</b></div>
      <div class="property-value">
        <mat-form-field>
          <mat-label>Repetitions</mat-label>
          <input matInput  type="number"   min="0"  formControlName="repetitions" />
        </mat-form-field>
      </div>
    </div> -->

    <div  class="property-div">
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
              >{{ opt.name }}</mat-option
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
              >{{ opt.name }}</mat-option
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
              >{{precedingSinalNumber}}-{{ opt.entity_number }}</mat-option
            >
          </mat-select>
        </mat-form-field>
      </div>
      
    </div>
    <div class="property-div">
      <div class="property-label"><b>Upload event files</b></div>
      <div class="form-row-item file-upload-div-edit">
        <!-- <div>Upload Signal files</div> -->
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

        <div 
          *ngFor="let file of signalFiles; index as i" 
          class="file-names">
            <span class="file-name-span" 
                (click)="downloadFile(file.file_name, file.original_name, entityForm.value.signal_name)"
                >{{ file.original_name }}</span>
          <span
            class="action-span"
            (click)="deleteSignalFile(i, file.file_name)"
            ><mat-icon>delete</mat-icon></span>
        </div>
      </div>
    </div>
    <br>
    <!-- <div class="property-div">
      <div class="property-label">Comments</div>
      <div class="property-value">
        <mat-form-field>
          <mat-label><b>Comments</b></mat-label>
          <input matInput formControlName="comments" />
        </mat-form-field>
      </div>

    </div> -->
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
                >{{ opt.name }}</mat-option
              >
            </mat-select>
          </mat-form-field>
        </div>
        <!-- <div class="form-div">
          <mat-form-field>
            <mat-label>Sequence number</mat-label>
            <input matInput type="number"  min="0"  formControlName="sequence_number" />
          </mat-form-field>
        </div> -->
      </div>
      <!-- <div class="entity-form-row">
        <div class="form-div">
          <mat-form-field>
            <mat-label>Repetitions</mat-label>
            <input matInput type="number"   min="0" formControlName="repetitions" />
          </mat-form-field>
        </div>
        
      </div> -->
      <div class="entity-form-row">
        <div class="form-div">
          <mat-form-field>
            <mat-label>Wave form</mat-label>
            <mat-select formControlName="wave_form">
              <mat-option
                [value]="opt"
                *ngFor="let opt of dropdownOptions.WAVE_FORM"
                >{{ opt.name }}</mat-option
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
                >{{precedingSinalNumber}}-{{ opt.entity_number }}</mat-option
              >
            </mat-select>
          </mat-form-field>
        </div>
      </div>
      <div class="create-form-container">
        <div class="form-row-item file-upload-div">
          <div>Upload event files 2233</div>
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
          <div 
            *ngFor="let file of signalFiles; index as i" 
            class="file-names">
              <span class="file-name-span" 
                  (click)="downloadFile(file.file_name, file.original_name, entityForm.value.signal_name)"
                  >{{ file.original_name }}</span>
            <span
              class="action-span"
              (click)="deleteSignalFile(i, file.file_name)"
              ><mat-icon>delete</mat-icon></span>
          </div>
        </div>
        <div class="form-div quill-editor-form-div">
          <!-- <mat-form-field>
            <mat-label>Comments</mat-label>
            <input matInput formControlName="comments" />
          </mat-form-field> -->
         
        </div>
        <quill-editor (onFocus)="focus($event)"
        class="quill-editor-editView"
        [(ngModel)]="entityForm.value.comments"
        style="min-height: 40px;height:auto"  formControlName="comments"
        placeholder="'Type comments here...'"></quill-editor>
      </div>
    </form>
  </div>
