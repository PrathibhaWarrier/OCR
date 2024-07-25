import { Component, Input, OnInit } from '@angular/core';
import { signalChannelStatistics } from '../../../shared/interface';
import {MatDialog, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { GraphPreviewComponent } from '../graph-preview/graph-preview.component';

@Component({
  selector: 'signaldb-signal-channel-types',
  templateUrl: './signal-channel-types.component.html',
  styleUrls: ['./signal-channel-types.component.scss'],
})
export class SignalChannelTypesComponent {

  @Input() 
  // datasource: any;
  datasource!: signalChannelStatistics;
  displayedColumns: string[] = ['channel_name', 'ur', 'time', 'cycles', 'excitmin', 'excitmax', 'dtmin','dtmax', 'rms', 'mean', 'stddev', 'preview'];

  constructor(public dialog: MatDialog) {console.log(this.datasource);}

  previewGraph(displacement:string) {
      const dialogRef = this.dialog.open(GraphPreviewComponent, {
        panelClass: 'graph-dialog',
        minWidth:'70vw',
        height:'auto',
        minHeight:'70%',
        data: displacement
      });
  }
}

////////////////////////////////////////////////////  HTML ///////////////////////////////////////////////////////////////////

<div class="channels-table">
  <div *ngIf="datasource.length === 0" style="text-align: center;">No data available</div>
  <table mat-table [dataSource]="datasource " class="mat-elevation-z8">
    <ng-container matColumnDef="channel_name">
        <th mat-header-cell *matHeaderCellDef> Channel name </th>
        <td mat-cell *matCellDef="let element"> {{element.channel_name}} </td>
      </ng-container>
      <!-- [datasource]="element.signalStatistics" -->

      <ng-container matColumnDef="ur">
        <th mat-header-cell *matHeaderCellDef> Update rate</th>
        <td mat-cell *matCellDef="let element"> {{element.ur}} </td>
      </ng-container>

      <ng-container matColumnDef="time">
        <th mat-header-cell *matHeaderCellDef> Time</th>
        <td mat-cell *matCellDef="let element"> {{element.time}} </td>
      </ng-container>

      <ng-container matColumnDef="cycles">
        <th mat-header-cell *matHeaderCellDef> Cycle</th>
        <td mat-cell *matCellDef="let element"> {{element.cycles}} </td>
      </ng-container>
      
      <ng-container matColumnDef="excitmax">
        <th mat-header-cell *matHeaderCellDef>Excitation max </th>
        <td mat-cell *matCellDef="let element"> {{element.excitmax}} </td>
      </ng-container>

      <ng-container matColumnDef="excitmin">
        <th mat-header-cell *matHeaderCellDef> Excitation min</th>
        <td mat-cell *matCellDef="let element"> {{element.excitmin}} </td>
      </ng-container>

      <ng-container matColumnDef="dtmax">
        <th mat-header-cell *matHeaderCellDef> dtmax </th>
        <td mat-cell *matCellDef="let element"> {{element.dtmax}} </td>
      </ng-container>

      <ng-container matColumnDef="dtmin">
        <th mat-header-cell *matHeaderCellDef> dtmin </th>
        <td mat-cell *matCellDef="let element"> {{element.dtmin}} </td>
      </ng-container>
      
      <ng-container matColumnDef="mean">
        <th mat-header-cell *matHeaderCellDef> Mean </th>
        <td mat-cell *matCellDef="let element"> {{element.mean}} </td>
      </ng-container>
      
      <ng-container matColumnDef="stddev">
        <th mat-header-cell *matHeaderCellDef> Standard deviation </th>
        <td mat-cell *matCellDef="let element"> {{element.stddev}} </td>
      </ng-container>
            
      <ng-container matColumnDef="rms">
        <th mat-header-cell *matHeaderCellDef>Root Mean Square</th>
        <td mat-cell *matCellDef="let element"> {{element.rms}} </td>
      </ng-container>

      <ng-container matColumnDef="preview">
        <th mat-header-cell *matHeaderCellDef>Preview</th>
        <td mat-cell *matCellDef="let element"> 
          <mat-icon color="primary" (click)="previewGraph(element.displacement)" matTooltip="Preview signal">preview</mat-icon> 
        </td>
      </ng-container>
      
  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>
</div>

Error///////////////////

Error: src/app/feature-modules/signal/signal-channel-types/signal-channel-types.component.html:3:26 - error TS2339: Property 'length' does not exist on type 'signalChannelStatistics'.

3   <div *ngIf="datasource.length === 0" style="text-align: center;">No data available</div>
                           ~~~~~~

  src/app/feature-modules/signal/signal-channel-types/signal-channel-types.component.ts:8:16
    8   templateUrl: './signal-channel-types.component.html',
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component SignalChannelTypesComponent.


Error: src/app/feature-modules/signal/signal-channel-types/signal-channel-types.component.html:4:21 - error TS2322: Type 'signalChannelStatistics' is not assignable to type 'CdkTableDataSourceInput<any>'.

4   <table mat-table [dataSource]="datasource " class="mat-elevation-z8">
                      ~~~~~~~~~~

  src/app/feature-modules/signal/signal-channel-types/signal-channel-types.component.ts:8:16
    8   templateUrl: './signal-channel-types.component.html',
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component SignalChannelTypesComponent.




× Failed to compile.


      Solution:

<div class="channels-table">
  <div *ngIf="!datasource || datasource.length === 0" style="text-align: center;">
    No data available
  </div>
  <table mat-table [dataSource]="datasource" class="mat-elevation-z8">
    
    <ng-container matColumnDef="channel_name">
      <th mat-header-cell *matHeaderCellDef> Channel name </th>
      <td mat-cell *matCellDef="let element"> {{element.channel_name}} </td>
    </ng-container>
    
    <ng-container matColumnDef="ur">
      <th mat-header-cell *matHeaderCellDef> Update rate </th>
      <td mat-cell *matCellDef="let element"> {{element.ur}} </td>
    </ng-container>
    
    <ng-container matColumnDef="time">
      <th mat-header-cell *matHeaderCellDef> Time </th>
      <td mat-cell *matCellDef="let element"> {{element.time}} </td>
    </ng-container>
    
    <ng-container matColumnDef="cycles">
      <th mat-header-cell *matHeaderCellDef> Cycle </th>
      <td mat-cell *matCellDef="let element"> {{element.cycles}} </td>
    </ng-container>
    
    <ng-container matColumnDef="excitmax">
      <th mat-header-cell *matHeaderCellDef> Excitation max </th>
      <td mat-cell *matCellDef="let element"> {{element.excitmax}} </td>
    </ng-container>
    
    <ng-container matColumnDef="excitmin">
      <th mat-header-cell *matHeaderCellDef> Excitation min </th>
      <td mat-cell *matCellDef="let element"> {{element.excitmin}} </td>
    </ng-container>
    
    <ng-container matColumnDef="dtmax">
      <th mat-header-cell *matHeaderCellDef> dtmax </th>
      <td mat-cell *matCellDef="let element"> {{element.dtmax}} </td>
    </ng-container>
    
    <ng-container matColumnDef="dtmin">
      <th mat-header-cell *matHeaderCellDef> dtmin </th>
      <td mat-cell *matCellDef="let element"> {{element.dtmin}} </td>
    </ng-container>
    
    <ng-container matColumnDef="mean">
      <th mat-header-cell *matHeaderCellDef> Mean </th>
      <td mat-cell *matCellDef="let element"> {{element.mean}} </td>
    </ng-container>
    
    <ng-container matColumnDef="stddev">
      <th mat-header-cell *matHeaderCellDef> Standard deviation </th>
      <td mat-cell *matCellDef="let element"> {{element.stddev}} </td>
    </ng-container>
    
    <ng-container matColumnDef="rms">
      <th mat-header-cell *matHeaderCellDef> Root Mean Square </th>
      <td mat-cell *matCellDef="let element"> {{element.rms}} </td>
    </ng-container>
    
    <ng-container matColumnDef="preview">
      <th mat-header-cell *matHeaderCellDef> Preview </th>
      <td mat-cell *matCellDef="let element">
        <mat-icon color="primary" (click)="previewGraph(element.displacement)" matTooltip="Preview signal">
          preview
        </mat-icon>
      </td>
    </ng-container>
    
    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>
</div>
