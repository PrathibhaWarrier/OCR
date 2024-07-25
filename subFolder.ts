html file
<input type="file" webkitdirectory (change)="onFolderSelected($event)">

typecript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  files: File[] = [];
  allowedExtensions = ['.sig', '.txt'];

  onFolderSelected(event: any) {
    const files = event.target.files;
    this.files = [];
    this.scanFiles(files);
  }

  scanFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (this.isAllowedExtension(file.name)) {
        this.files.push(file);
      }
    }
    console.log('Filtered Files:', this.files);
  }

  isAllowedExtension(fileName: string): boolean {
    const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    return this.allowedExtensions.includes(extension);
  }
}
