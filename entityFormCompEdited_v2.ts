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

@Component({
  selector: 'signaldb-entity-form',
  templateUrl: './entity-form.component.html',
  styleUrls: ['./entity-form.component.scss'],
})
export class EntityFormComponent implements OnInit {
  quillModules = {};
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
    }
  }

  @Input() dropdownOptions: any;
  @Input() precedingEntityOption: any;
  @Input() precedingValSelected!: boolean;
  @Input() precedingSinalNumber = '';
  @Input() type = '';
  @Input() editData!: any;
  @Input() currenSignalNumber = '';
  signalFiles: SignalEntityFiles[] = [];
  isUploading = false;
  uploadProgress = 0;
  channel_types_arr: ChannelType[] = [];
  precedingEntity!: any;
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
    sequence_number: [1]
  });

  get signal_name() {
    return this.entityForm.get('signal_name');
  }

  deleteSignalFile(i: number, filename: string) {
    this.signalFiles.splice(i, 1);
  }

  showChannelTypes(event: any) {
    let ids: any[] = this.entityForm.value.channel_type_ids || [];
    const pos = ids.indexOf(event.id);
    if (pos === -1) {
      const pos1 = this.channel_types_arr.indexOf(event);
      if (pos1 > -1) {
        this.channel_types_arr.splice(pos1, 1);
      }
    } else {
      const pos1 = this.channel_types_arr.indexOf(event);
      if (pos1 === -1) {
        this.channel_types_arr.push(event);
      }
    }
    if (ids.length === 0) {
      this.channel_types_arr = [];
    }
  }

  downloadFile(dbName: string, original_name: string, event_name: string | null | undefined) {
    this.shared.downloadFile(dbName).subscribe((result: any) => {
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = event_name ? event_name + '-' + original_name : original_name;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  }

  onFolderSelected(event: any) {
    const files = event.target.files;
    const txtFiles = Array.from(files).filter(file => file.type === 'text/plain');
    
    if (txtFiles.length > 0) {
      const formData = new FormData();
      txtFiles.forEach(file => {
        formData.append('file', file);
      });

      this.isUploading = true;
      this.shared.bulkFileUpload(formData)
        .pipe(
          map((event: any) => {
            switch (event.type) {
              case HttpEventType.UploadProgress:
                this.uploadProgress = Math.round((event.loaded * 100) / event.total);
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
            this.signalFiles.push(...files.map((file: any) => ({
              file_name: file.file_name,
              original_name: file.original_name,
            })));
          }
        });
    }
  }

  fillChannelTypes(ids: string[]) {
    if (ids) {
      for (let x = 0; x < ids.length; x++) {
        const pos = this.dropdownOptions.CHANNEL_TYPE.map((item: any) => item.id).indexOf(ids[x]);
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
      wavePos = this.dropdownOptions.WAVE_FORM.map((item: any) => item.id).indexOf(this.editData.wave_form_id);
    }
    if (this.editData.preceding_entity_id) {
      entPos = this.precedingEntityOption.map((item: any) => item.id).indexOf(this.editData.preceding_entity_id);
    }
    this.entityForm.patchValue({
      signal_name: this.editData.signal_name,
      channel_type_ids: this.editData.channel_type_ids,
      wave_form: this.dropdownOptions.WAVE_FORM[wavePos],
      comments: this.editData.comments,
      preceding_entity_id: this.editData.preceding_entity_id,
      preceding_entity: this.precedingEntityOption[entPos],
      repetitions: this.editData.repetitions,
      sequence_number: this.editData.sequence_number
    });
    if (this.editData.preceding_entity) {
      this.precedingValSelected = true;
    }
    this.signalFiles = this.editData.signalEntityFiles;
    this.fillChannelTypes(this.editData.channel_type_ids);
  }

  ngOnInit(): void {
    if ((this.editData && this.type === 'edit') || (this.editData && this.type === 'editView')) {
      this.autoFill();
    }
  }
}
