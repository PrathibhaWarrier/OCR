<div>
    <form [formGroup]="eventForm">
        <!-- <h4 class="sub-header">Event information & sequence (customer info)</h4> -->
    <div class="event-list-column">
      <div class="file-note-row">
        <div class="note-row">
          <!-- <div class="note-content-div">
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
          </div> -->
          
        </div>
        <div class="form-row-item file-upload-div">
          <!-- <div class="repetitions-property">
            <mat-form-field>
                <mat-label>Total repetitions</mat-label>
                <input matInput type="number" min="0"  formControlName="total_repetitions" />
              </mat-form-field>
          </div> -->
          <div class="file-upload-div-inner">
            <div>Upload event information files</div>
            <input type="file" webkitdirectory (change)="onFolderSelected($event)">
          
          
            
              
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
/////////////////////////////////////////

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

  // Existing methods remain unchanged

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

  onFileSelected(event: any, type: string) {
    const file = event.target.files;
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
              this.uploadProgress = 0;
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
          this.isUploading = false;
          for (let x = 0; x < files.length; x++) {
            this.eventListDocs.files.push({
              file_name: files[x].file_name,
              original_name: files[x].original_name,
            });
          }
        }
      });
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
// import { Component, Input, OnInit } from '@angular/core';
// import { DocFile, DocParameterDetails } from '../../../shared/interface';
// import { FormBuilder } from '@angular/forms';
// import { DeleteFile, SharedService } from '../../../services/shared/shared.service';
// import { map } from 'rxjs';
// import { HttpEventType } from '@angular/common/http';

// @Component({
//   selector: 'signaldb-event',
//   templateUrl: './event.component.html',
//   styleUrls: ['./event.component.scss'],
// })
// export class EventComponent implements OnInit{
//   @Input() data:any;
//   @Input() eventListDocs: DocParameterDetails = {
//     owner: 'EVENTLIST',
//     files: []
//   };
//   @Input() eventFiles:any[] = [];
//   @Input() actionType = '';
//   uploadProgress: number = 0;
//   isUploading = false;

//   constructor(private fb: FormBuilder, private shared: SharedService) {}

//   eventForm = this.fb.group({
//     event_list_comments: [''],
//     total_repetitions:[]
//   });
//   downloadFile(dbName:string, original_name:string) {
//     this.shared.downloadFile(dbName).subscribe((result:any) => {
//       // this.blob = new Blob([result]);
//       const url = window.URL.createObjectURL(result);
//       const a = document.createElement('a');
//         document.body.appendChild(a);
//         a.setAttribute('style', 'display: none');
//         a.href = url;
//         a.download = original_name;
//         a.click();
//         window.URL.revokeObjectURL(url);
//         a.remove(); // remove the element
//     })
//   }
//   deleteFile(type: string, i: number, file: DocFile) {
//     let fileObj:DeleteFile;
//     // if((this.actionType == actionState.Create) || this.actionType == actionState.Edit) {
//     //   fileObj = { file_id: file.id, file_name:file.file_name};
//     //   this.shared.deleteFileNew(fileObj).subscribe((result: any) => {
//     //     this.eventListDocs.files.splice(i, 1)
//     //   });
//     // } else {
//       this.eventListDocs.files.splice(i, 1)
//     // }
//   }
//   onFileSelected(event: any, type: string) {
//     const file = event.target.files;
//     const formData = new FormData();
//     for (let index = 0; index < file.length; index++) {
//       // console.log(file[index].type);
//       formData.append('file', file[index]);
//     }
//     // formData.append('file', file);
//     this.isUploading = true;
//     this.shared
//       .bulkFileUpload(formData)
//       .pipe(
//         map((event: any) => {
//           switch (event.type) {
//             case HttpEventType.UploadProgress:
//               this.uploadProgress = 0;
//               file.progress = Math.round((event.loaded * 100) / event.total);
//               this.uploadProgress = file.progress;
//               break;
//             case HttpEventType.Response:
//               return event;
//           }
//         })
//       )
//       .subscribe((event: any) => {
//         if (typeof event === 'object') {
//           const files = event.body;
//           this.isUploading = false;
//             for (let x = 0; x < files.length; x++) {
//               this.eventListDocs.files.push({
//                 file_name: files[x].file_name,
//                 original_name: files[x].original_name,
//               });
//             }
//         }
        
//       });
//     // this.eventListDocs.files.push(...event.target.files);
//   }

//   // onFileSelectedNew(event: any) {
//   //   const file = event.target.files;
//   //   const files = [];
//   //   if(file && file.length > 0){
//   //     for (let index = 0; index < file.length; index++) {
//   //       // console.log(file[index].type);
//   //       files.push(file[index]);
//   //     }
//   //   }
//   //   console.log('tester',files)
    
//   //   // formData.append('file', file);
//   //   this.isUploading = true;
//   //   this.shared
//   //     .bulkFileUploadNew(files)
//   //     .pipe(
//   //       map((event: any) => {
//   //         switch (event.type) {
//   //           case HttpEventType.UploadProgress:
//   //             file.progress = Math.round((event.loaded * 100) / event.total);
//   //             this.uploadProgress = file.progress;
//   //             break;
//   //           case HttpEventType.Response:
//   //             return event;
//   //         }
//   //       })
//   //     )
//   //     .subscribe((event: any) => {
//   //       if (typeof event === 'object') {
//   //         const files = event.body;
//   //           for (let x = 0; x < files.length; x++) {
//   //             this.eventListDocs.files.push({
//   //               file_name: files[x].file_name,
//   //               original_name: files[x].original_name,
//   //             });
//   //           }
//   //       }
//   //       this.isUploading = false;
//   //     });
//   //   // this.eventListDocs.files.push(...event.target.files);
//   // }

//   focus(event:any) {
//     console.log("**")
//   }

//   /** Auto fill the event form if the data is passed frpm the parent component */
//   autoFill() {
//     for (const f in this.data) {
//       this.eventForm.patchValue({
//         [f]: this.data[f]
//       })
//     }
//   }

//   ngOnInit(): void {
//       this.autoFill()
//   }
// }
