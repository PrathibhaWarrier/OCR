<div class="container">
  <div class="general-info" *ngIf="signalItem">
    <div class="version-alert" [ngClass]="versionClass" *ngIf="versionClass !== 'current'">
      <!-- <marquee direction="right" height="30%"> -->
        {{versionMessage}}
        <!-- </marquee> -->
    </div>
    <div class="item-headers">
      <span><h1 class="header-name">{{signalItem.project_name}}</h1></span>
      <div class="header-action-div">
        <div class="item-header-div">
          <div class="item-header" *ngIf="signalItem">
            <button mat-icon-button matTooltip="Edit signal info"  class="clickable-item" (click)="editGeneralInfo()">
              <mat-icon color="primary" 
              class="">edit_note</mat-icon>
            </button>
            <button mat-stroked-button class="version-menu" matTooltip="Signal versions"  [matMenuTriggerFor]="versions">
              <mat-icon  class="" color="primary">arrow_drop_down</mat-icon>v{{signalItem.signalVersion?.version_number}}</button>
              <span>
                  <button mat-icon-button 
                      [matMenuTriggerFor]="menu" 
                      aria-label="settings"
                      class=""
                      color="primary"
                      matTooltip="Actions" >
                      <mat-icon>settings</mat-icon>
                </button>
            <mat-menu #menu="matMenu">
              <ng-template matMenuContent>
              <!-- <button mat-menu-item  (click)="editGeneralInfo()" >
                <mat-icon matTooltip="View signal" color="primary">edit_note</mat-icon>
                <span>Edit</span>
              </button> -->
              <button mat-menu-item (click)="copySignal(signalItem.id)">
                <mat-icon matTooltip="Edit signal" color="primary">content_copy</mat-icon>
                <span>Copy</span>
              </button>
              <!-- <button mat-menu-item (click)="setStatus(signalItem.id)">
                <mat-icon [matTooltip]="statusTooltipText" color="primary">update</mat-icon>
                <span>Status</span>
              </button> -->
              <button mat-menu-item (click)="deleteSignal(signalItem.id)" *ngIf="currentVersion === selectedVersion">
                  <mat-icon matTooltip="Delete signal"  color="warn">delete</mat-icon>
                  <span>Delete</span>
                </button>
              </ng-template>
            </mat-menu>
            <mat-menu #versions="matMenu">
              <button mat-menu-item (click)="newVersionOfSignal()"><mat-icon matTooltip="Add version" color="primary">add</mat-icon></button>
              <button mat-menu-item 
                      *ngFor="let version of SignalVersions;index as i"
                      [ngClass]="signalItem.id === version.signal_id ? 'active-version' : null"
                      [disabled]="!version.isAvailable"
                      (click)="updateSignalItem(version)">v{{version.version_number }}</button>
              
            </mat-menu>
              </span>
          </div>
        </div>
        </div>
    </div>
    <div style="display: flex; justify-content: space-between;" >
      <div class="general-info-data">
        <div class="general-info-row">
          <div class="general-info-label"><b></b></div>
          <div class="general-info-value"></div>
        </div>
        <div class="general-info-row">
          <div class="general-info-label"><b>Signal number:</b></div>
          <div class="general-info-value">{{signalItem.signal_number}}</div>
        </div>
        <div class="general-info-row">
          <div class="general-info-label"><b>Creator:</b></div>
          <div class="general-info-value">{{signalItem.requestor}}</div>
        </div>
        <div class="general-info-row">
          <div class="general-info-label"><b>Project number:</b></div>
          <div class="general-info-value">{{signalItem.project_xnr}}</div>
        </div>
        <div class="general-info-row">
          <div class="general-info-label"><b>Customer:</b></div>
          <div class="general-info-value">{{signalItem.customer?.name}}</div>
        </div>
        <div class="general-info-row">
          <div class="general-info-label"><b>Control mode:</b></div>
          <div class="general-info-value">{{signalItem.controlMode?.name}}</div>
        </div>
        <!-- <div class="general-info-row">
          <div class="general-info-label"><b>File format:</b></div>
          <div class="general-info-value">{{signalItem.fileFormat?.name}}</div>
        </div> -->
        <div class="general-info-row flex-cancel" >
          <div class="general-info-label"><b>Test domain:</b></div>
            <div class="multiple-values">
              <ng-container *ngFor="let c of signalItem.signalTestDomain; let last = last">
                <span >{{c.test_domain.name}}{{!last ? ', ':''}}</span></ng-container>      
            </div>
          </div>
        <div class="general-info-row">
          <div class="general-info-label"><b>Associated directory:</b></div>
          <div class="general-info-value">{{signalItem.associated_directory}}</div>
        </div>
        <div class="general-info-row">
          <div class="general-info-label"><b>Preceding SG number:</b></div>
          <div class="general-info-value">{{signalItem.precedingSignal?.signal_number}}</div>
        </div>
        <div class="general-info-row">
          <div class="general-info-label"><b>Status:</b></div>
          <div class="general-info-value">
            <mat-icon color="success" *ngIf="signalItem.in_use">check</mat-icon>
            <mat-icon color="warn" *ngIf="!signalItem.in_use">close</mat-icon>
  
          </div>
        </div>
        
      </div>
      <div>
        <mat-accordion>
          <mat-expansion-panel expanded="true">
            <mat-expansion-panel-header>
              <mat-panel-title>
                <b><p style="font-size: 17px;">Preceding Signals</p></b>&nbsp;<mat-icon style="color:#3f51b5;" class="tooltipClass" [matTooltip]='toolTipContent'>help</mat-icon>
              </mat-panel-title>
            </mat-expansion-panel-header>
              <signaldb-network-graph [signalId]="signalItem.id" [signalNumber]="signalItem.signal_number"></signaldb-network-graph>
          </mat-expansion-panel>
        </mat-accordion>
       
      </div>
     
    </div>
    
    <!-- <div class="general-info-main">
      <div class="general-info-content">
        <div class="general-info-row">
          <div class="general-info-item">
              <div class="general-info-label">Signal number</div>
              <div class="general-info-value">{{signalItem.signal_number}}</div>
          </div>
          <div class="general-info-item">
            <div class="general-info-label">Requestor</div>
            <div class="general-info-value">{{signalItem.requestor}}</div>
          </div>
          <div class="general-info-item">
            <div class="general-info-label">Signal name</div>
            <div class="general-info-value">{{signalItem.project_name}}</div>
          </div>
          <div class="general-info-item">
            <div class="general-info-label">Project number</div>
            <div class="general-info-value">{{signalItem.project_xnr }}</div>
          </div>
        </div>
        <div class="general-info-row">
          <div class="general-info-item">
            <div class="general-info-label">Customer</div>
            <div class="general-info-value">{{signalItem.customer?.name}}</div>
          </div>
          <div class="general-info-item">
            <div class="general-info-label">Control mode</div>
            <div class="general-info-value">{{signalItem.controlMode?.name}}</div>
          </div>
          <div class="general-info-item">
            <div class="general-info-label">File format</div>
            <div class="general-info-value">{{signalItem.fileFormat?.name}}</div>
          </div>
          <div class="general-info-item">
            <div class="general-info-label">Test domain</div>
            <div class="general-info-value">{{signalItem.testDomain?.name}}</div>
          </div>
        </div>
        <div class="general-info-row">
          
          <div class="general-info-item">
            <div class="general-info-label">Associated directory</div>
            <div class="general-info-value">{{signalItem.associated_directory}}</div>
          </div>
          <div class="general-info-item">
            <div class="general-info-label">Preceding SG number</div>
            <div class="general-info-value">{{signalItem.precedingSignal?.signal_number}}</div>
          </div>
        </div>
        
      </div>
      <div class="header-action-div">
      <div class="item-header-div">
        <div class="item-header" *ngIf="signalItem">
          <button mat-icon-button class="white-icon-btn" (click)="editGeneralInfo()">
            <mat-icon matTooltip="View signal" 
            class="white-icon-btn">edit_note</mat-icon>
          </button>
          <button mat-stroked-button class="white-icon-btn version-menu" [matMenuTriggerFor]="versions">
            <mat-icon  class="white-icon-btn">arrow_drop_down</mat-icon>v{{signalItem.signalVersion?.version_number}}</button>
            <span>
                <button mat-icon-button 
                    [matMenuTriggerFor]="menu" 
                    aria-label="settings"
                    class="white-icon-btn"
                    matTooltip="actions" >
                    <mat-icon>settings</mat-icon>
              </button>
          <mat-menu #menu="matMenu">
            <ng-template matMenuContent>
            <button mat-menu-item (click)="copySignal(signalItem.id)">
              <mat-icon matTooltip="Edit signal" color="primary">content_copy</mat-icon>
              <span>Copy</span>
            </button>
            <button mat-menu-item (click)="deleteSignal(signalItem.id)" *ngIf="currentVersion === selectedVersion">
                <mat-icon matTooltip="Delete signal"  color="warn">delete</mat-icon>
                <span>Delete</span>
              </button>
            </ng-template>
          </mat-menu>
          <mat-menu #versions="matMenu">
            <button mat-menu-item (click)="newVersionOfSignal()"><mat-icon matTooltip="Add version" color="primary">add</mat-icon></button>
            <button mat-menu-item 
                    *ngFor="let version of SignalVersions;index as i"
                    [ngClass]="signalItem.id === version.signal_id ? 'active-version' : null"
                    [disabled]="!version.isAvailable"
                    (click)="updateSignalItem(version)">v{{version.version_number }}</button>
            
          </mat-menu>
            </span>
        </div>
      </div>
      </div>
    </div> -->
  </div>
    <mat-card class="content-card">
    
        <div *ngIf="signalItem">
         
          <mat-accordion multi>
            <mat-expansion-panel expanded="true" class="expansion-pane-class">
              <mat-expansion-panel-header>
                <mat-panel-title class="expansion-panel-title-text">
                  <mat-icon  color="primary">query_stats</mat-icon>&nbsp;&nbsp;
                  Events
                </mat-panel-title>
                <mat-panel-description>
                </mat-panel-description>
              </mat-expansion-panel-header>
              <!-- <h3>Event list & sequence</h3> -->
              <div class="event-actions">
                <button mat-stroked-button  matTooltip="Event column settings"  (click)="entityColumnSettings()" class="add-event-btn">
                  <mat-icon color="primary">view_column</mat-icon>
                </button>
                <button mat-stroked-button (click)="addEvent()" matTooltip="Add Event"  class="add-event-btn">
                  <mat-icon color="primary">add</mat-icon>
                </button>
              </div>
              <table matSort (matSortChange)="sortEventsTableHeader($event)" mat-table [dataSource]="datasource" class="entity-table" multiTemplateDataRows>
                <ng-container
                  [matColumnDef]="column.name"
                  *ngFor="let column of displayedEventColumns"
                >
                  <ng-container *ngIf="column.isChecked">
                    <ng-container *ngIf="column.name === 'settings' || column.name === 'channel_type_ids' || column.name === 'signalEntityFiles'">
                      <th
                      mat-header-cell
                      *matHeaderCellDef
                    >
                      {{ column.displayName }}
                    </th>
                    </ng-container>
                    <ng-container *ngIf="column.name !== 'settings'">
                      <th
                      mat-header-cell
                      *matHeaderCellDef
                      [mat-sort-header]="column.name"
                    >
                      {{ column.displayName }}
                    </th>
                    </ng-container>
                    <td mat-cell *matCellDef="let element; let i = index">
                      <ng-container
                        *ngIf="
                          column.name === 'entity_number' ||
                            column.name === 'channel_type_ids' ||
                            column.name === 'signalEntityFiles' || 
                            column.name === 'comments' || 
                            column.name === 'settings';
                          else otherContent
                        "
                      >
                        <div *ngIf="column.name === 'entity_number'">
                          {{ signalItem?.signal_number + '-' + element.entity_number }}
                        </div>
                        <div *ngIf="column.name === 'channel_type_ids'">
                          <ng-container *ngFor="let c of element.channel_type_ids">
                            {{ channelTypesWithName[c] }}
                          </ng-container>
                        </div>
                        <ng-container *ngIf="column.name === 'signalEntityFiles'">
                          <div
                            *ngFor="let file of element.signalEntityFiles"
                            class="signal-entity-file"
                            (click)="
                              downloadFile(
                                file.file_name,
                                file.original_name,
                                element.signal_name
                              )
                            "
                          >
                            {{ file.original_name }}
                          </div>
                        </ng-container>
                        <div *ngIf="column.name === 'comments'">
                          {{ element.comments }}
                        </div>
                        <div *ngIf="column.name === 'settings'">
                          <mat-icon  color="primary" matTooltip="Edit event" class="clickable-item" (click)="updateSignalEntity(i, element);$event.stopPropagation()">edit_note</mat-icon> &nbsp;&nbsp;
                          <mat-icon  color="warn" matTooltip="Delete event" class="clickable-item" (click)="deleteSignalEntity(element);$event.stopPropagation()">delete</mat-icon> 
                        </div>
                      </ng-container>
                      <ng-template #otherContent>
                        {{
                          typeOfVar(element[column.name]) === 'object'
                            ? element[column.name].name
                            : element[column.name]
                        }}
                      </ng-template>
                    </td>
                  </ng-container>
                </ng-container>
                <ng-container matColumnDef="expandedDetail" >
                  <td mat-cell *matCellDef="let element" [attr.colspan]="displayedEventColumnsString.length">
                    <div class="example-element-detail"
                    [@detailExpand]="element === expandedElement ? 'expanded' : 'collapsed'">
                    <!-- <signaldb-signal-channel-types [datasource]="yourDataSource"></signaldb-signal-channel-types> -->
                      <!-- <signaldb-signal-channel-types [datasource]="element.signalStatistics"></signaldb-signal-channel-types> -->
                      <signaldb-signal-channel-types [datasource]="[element]"></signaldb-signal-channel-types>

                    </div>
                  </td>
                </ng-container>
                  <tr mat-header-row *matHeaderRowDef="displayedEventColumnsString"></tr>
                  <tr mat-row *matRowDef="let element; columns: displayedEventColumnsString"
                    (click)="expandedElement = expandedElement === element ? null : element"></tr>
                    <tr mat-row *matRowDef="let row; columns: ['expandedDetail']" class="example-detail-row"></tr>
              </table>
              <br>
              <hr>
              <div class="events-sequence-row">
                <div class="event-sequence-value">
                  <div class="remarks-row-header">
                    <div class="remarks-owner">  </div>
                    <div class="content-files"><b>Files</b></div>
                    <div class="remarks" > <b>Comments</b> </div>
                  </div> 
                  <div class="remarks-row">
                    <div class="remarks-owner"> Event information </div>
                    <div class="content-files">
                      <div *ngFor="let file of eventFiles"
                           class="file-name"
                           (click)="downloadFile(file.file_name, file.original_name)">
                            {{file.original_name}}
                          </div>
                    </div>
                    <div class="remarks" [innerHTML]="signalItem.event_list_comments">  </div>
                  </div>
                  <!-- <div class="total-repetitions">
                    <div class="event-sequence-header">
                      <b>Total repetitions</b>
                    </div>
                    <div class="event-sequence-value">{{signalItem.total_repetitions}}</div>
                  </div>
                  <div class="event-sequence-files">
                    <div class="event-sequence-header">
                      <b>Files</b>
                    </div>
                    <div class="event-sequence-value">
                      <div *ngFor="let file of eventFiles"
                             class="file-name"
                             (click)="downloadFile(file.file_name, file.original_name)">
                              {{file.original_name}}
                            </div>
                    </div>
  
                  </div>
                  <div class="event-sequence-comments">
                    <div class="event-sequence-header">
                      <b>Comments</b>
                    </div>
                    <div class="event-sequence-value" [innerHTML]="signalItem.event_list_comments">
                    </div>
  
                  </div> -->
                </div>
                <div class="event-sequence-action">
                  <mat-icon  color="primary" matTooltip="Edit eventlist info" class="clickable-item" (click)="editEventContent(signalItem.id)">edit_note</mat-icon>
                </div>
              </div>
              
            </mat-expansion-panel>
            <mat-expansion-panel  expanded="true"  class="expansion-pane-class">
              <mat-expansion-panel-header>
                <mat-panel-title class="expansion-panel-title-text" color="primary">
                  <mat-icon  color="primary">list_alt</mat-icon>&nbsp;
                  Signal Content
                </mat-panel-title>
                <mat-panel-description>
                </mat-panel-description>
              </mat-expansion-panel-header>

              <div class="comments-container">
                <div class="comments-value">
                  <div class="remarks-row-header">
                    <div class="remarks-owner">  </div>
                    <div class="content-files"><b>Files</b></div>
                    <div class="remarks" > <b>Comments</b> </div>
                  </div> 
                  <!-- <div class="remarks-row">
                    <div class="remarks-owner"> Event list  </div>
                    <div class="content-files">
                      <div *ngFor="let file of eventFiles"
                           class="file-name"
                           (click)="downloadFile(file.file_name, file.original_name)">
                            {{file.original_name}}
                          </div>
                    </div>
                    <div class="remarks" [innerHTML]="signalItem.event_list_comments">  </div>
                  </div>  -->
                  <div class="remarks-row">
                    <div class="remarks-owner"> Channel information  </div>
                    <div class="content-files">
                      <div *ngFor="let file of channelFiles"
                           class="file-name"
                           (click)="downloadFile(file.file_name, file.original_name)">
                           {{file.original_name}}</div>
                    </div>
                    <div class="remarks" [innerHTML]="signalItem.channel_list_comments">  </div>
                  </div> 
                </div>
                <div class="comments-action"><mat-icon  color="primary" class="clickable-item" matTooltip="Edit signal content" (click)="editSignalContent(signalItem.id)">edit_note</mat-icon></div>

              </div>
            </mat-expansion-panel>
            <mat-expansion-panel  expanded="true"  class="expansion-pane-class">
              <mat-expansion-panel-header>
                <mat-panel-title class="expansion-panel-title-text">
                  <mat-icon color="primary">build</mat-icon>&nbsp;&nbsp;
                  Setup information
                </mat-panel-title>
                <mat-panel-description>
                </mat-panel-description>
              </mat-expansion-panel-header>
              <div class="comments-container">
                <div class="comments-value">
                  <div class="toolings-list"><b>Tooling numbers:</b>&nbsp;
                    <ng-container *ngIf="signalItem.tooling_numbers?.length">
                      <span *ngFor="let s of signalItem.tooling_numbers;index as m">{{s}}
                        <span *ngIf="m !== signalItem.tooling_numbers?.length -1">,&nbsp; </span>
                      </span>
                    </ng-container>
                  </div>
                  <div class="remarks-row-header">
                    <div class="remarks-owner">  </div>
                    <div class="content-files"><B>Files</B></div>
                    <div class="remarks"> <b>Comments</b> </div>
                  </div> 
                  <div class="remarks-row">
                    <div class="remarks-owner"> Kinematic & 3D model  </div>
                    <div class="content-files">
                      <div *ngFor="let file of kinematicsFiles"
                           class="file-name"
                           (click)="downloadFile(file.file_name, file.original_name)">
                           {{file.original_name}}</div>
                    </div>
                    <div class="remarks"  [innerHTML]="signalItem.kinematic_model_comments"> </div>
                  </div> 
                  <div class="remarks-row">
                    <div class="remarks-owner"> Tool & setup drawing</div>
                    <div class="content-files">
                      <div *ngFor="let file of toolingFiles"
                           class="file-name"
                           (click)="downloadFile(file.file_name, file.original_name)">
                            {{file.original_name}}
                          </div>
                    </div>
                    <div class="remarks" [innerHTML]="signalItem.tooling_comments">  </div>
                  </div> 
                  <div class="remarks-row">
                    <div class="remarks-owner"> Suspension parts  </div>
                    <div class="content-files">
                      <div *ngFor="let file of suspensionFiles"
                           class="file-name"
                           (click)="downloadFile(file.file_name, file.original_name)">
                            {{file.original_name}}
                          </div>
                    </div>
                    <div class="remarks" [innerHTML]="signalItem.suspension_part_comments">  </div>
                  </div> 
                  
                  </div>
                  <div class="comments-action"><mat-icon  color="primary" class="clickable-item" matTooltip="Edit setup info" (click)="editSetupInfo(signalItem.id)">edit_note</mat-icon></div>

              </div>
              
            </mat-expansion-panel>
            <mat-expansion-panel expanded="true" class="expansion-pane-class">
              <mat-expansion-panel-header>
                <mat-panel-title class="expansion-panel-title-text">
                  <mat-icon  color="primary">comment</mat-icon>&nbsp;&nbsp;
                  Comments
                </mat-panel-title>
                <mat-panel-description>
                </mat-panel-description>
              </mat-expansion-panel-header>
              <div class="comments-container">
                <div class="comments-value"
                [innerHTML]="signalItem.project_comments"></div>
                <div class="comments-action"><mat-icon color="primary" class="clickable-item" matTooltip="Edit signal comments" (click)="editComments(signalItem.id, signalItem.project_comments)">edit_note</mat-icon></div>

              </div>
            </mat-expansion-panel>
            <mat-expansion-panel  expanded="false"  class="expansion-pane-class">
              <mat-expansion-panel-header>
                <mat-panel-title class="expansion-panel-title-text">
                  <mat-icon  color="primary">directions_car</mat-icon>&nbsp;&nbsp;
                  Vehicle & track Info
                </mat-panel-title>
                <mat-panel-description>
                </mat-panel-description>
              </mat-expansion-panel-header>
              <div class="advanced-container">
                <table class="advanced-info-table">
                  <tr>
                    <th>Vehicle classification</th>
                    <th>Vehicle brand</th>
                    <th>Vehicle model</th>
                    <th>Vehicle model code</th>
                    <th>Platform</th>
                    <th>Test track name</th>
                  </tr>
                  <tr>
                    <td>{{signalItem.carClassification?.name}}</td>
                    <td>{{signalItem.vehicle_brand}}</td>
                    <td>{{signalItem.vehicle_model}}</td>
                    <td>{{signalItem.vehicle_model_code}}</td>
                    <td>{{signalItem.platform}}</td>
                    <td>{{signalItem.test_track_name}}</td>
                  </tr>
                </table>
                  <!-- <div class="advanced-info-row">
                    <div class="advanced-info-item">
                      <div class="advanced-info-label"><b>Vehicle classification</b></div>
                      <div class="advanced-info-value">{{signalItem.carClassification?.name}}</div>
                    </div>
                    <div class="advanced-info-item">
                      <div class="advanced-info-label"><b>Vehicle brand</b></div>
                      <div class="advanced-info-value">{{signalItem.vehicle_brand}}</div>
                    </div>
                    <div class="advanced-info-item">
                      <div class="advanced-info-label"><b>Vehicle model</b></div>
                      <div class="advanced-info-value">{{signalItem.vehicle_model}}</div>
                    </div>
                    <div class="advanced-info-item">
                      <div class="advanced-info-label"><b>Platform</b></div>
                      <div class="advanced-info-value">{{signalItem.platform}}</div>
                    </div>
                    <div class="advanced-info-item">
                      <div class="advanced-info-label"><b>Vehicle model code</b></div>
                      <div class="advanced-info-value">{{signalItem.vehicle_model_code}}</div>
                    </div>
                    <div class="advanced-info-item">
                      <div class="advanced-info-label"><b>Test track name</b></div>
                      <div class="advanced-info-value">{{signalItem.test_track_name}}</div>
                    </div>
                </div> -->
                <div class="comments-action"><mat-icon color="primary" matTooltip="Edit advanced info" class="clickable-item" (click)="editAdvancedInfo()">edit_note</mat-icon></div>
              </div>
              
            </mat-expansion-panel>
          </mat-accordion>

            </div>
    </mat-card>
</div>


TS//////////////////////////////////////////////////////

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SignalService } from '../../../services/signal/signal.service';
import { CreateSignalComponent } from '../create-signal/create-signal.component';
import { actionState } from '../../../shared/enums';
import { MatDialog } from '@angular/material/dialog';
import { DropdownOptions, SignalEntity } from '../../../shared/interface';
import { snackbarColors } from '../../../shared/enums';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { SharedService } from '../../../services/shared/shared.service';
import { UpdateIndividualComponent } from '../update-individual/update-individual.component';
import { ViewEventComponent } from '../view-event/view-event.component';
import { eventColummns } from '../entity-table/entity-table.component';
import { EntityColumnsComponent } from '../entity-columns/entity-columns.component';
import { columnType } from '../list/list.component';
import { Sort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';

interface Files {
  id: string;
  original_name: string;
  file_name: string;
  owner_id: string;
}
@Component({
  selector: 'signaldb-signal-item',
  templateUrl: './signal-item.component.html',
  styleUrls: ['./signal-item.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SignalItemComponent implements OnInit {
  toolTipContent = 'Drag to move signal nodes or click to navigate to corresponding signals'
  tooltipClass = 'tooltip-line-break'
  signalItem?: any;
  dropdownOptionsRaw = [];
  dropdownOptionsSorted: any = [];
  expandedElement!:any | null;
  displayedColumns: string[] = [
    'EntityNumber',
    'Name',
    // 'SequenceNumber',
    // 'Repetitions',
    'Channels',
    'Waveform',
    'Comments',
    'Files',
    'Action'
  ];
  datasource: any;
  filesList: any;
  constructor(
    public notification: NotificationComponent,
    private route: ActivatedRoute,
    private router: Router,
    private service: SignalService,
    public dialog: MatDialog,
    private shared: SharedService
  ) {}

  eventFiles: Files[] = [];
  channelFiles: Files[] = [];
  suspensionFiles: Files[] = [];
  kinematicsFiles: Files[] = [];
  toolingFiles: Files[] = [];
  SignalVersions: any;
  currentVersion = 0;
  currentSignalNumber = '';
  currentSignalId = '';
  versionClass = 'current';
  versionMessage = '';
  selectedVersion = 0;
  statusTooltipText = '';
  displayedEventColumns:columnType[] = []
  displayedEventColumnsString:string[] = [];
  channelTypesWithName: { [key: string]: string } = { };
  getSignalItemById(id: string) {
    this.service.getSignalById(id).subscribe((result: any) => {
      this.formatData(result);
      this.signalItem = result;
      this.currentSignalId = id;
      this.currentSignalNumber = result.signal_number;
      this.statusTooltipText = this.signalItem.in_use ? `Mark as 'Not in use'` : `Mark as 'In use'`;
      this.getOptions();
      this.getSignalVersions();
      // this.signalItem = result;
      // this.formatData(result)
    });
  }

  editAdvancedInfo() {
    const generalInfo = {
      car_classification_id: this.signalItem.carClassification?.id,
      vehicle_brand: this.signalItem.vehicle_brand,
      platform: this.signalItem.platform,
      vehicle_model: this.signalItem.vehicle_model,
      vehicle_model_code: this.signalItem.vehicle_model_code,
      test_track_name: this.signalItem.test_track_name
    }
    const dialogRef = this.dialog.open(UpdateIndividualComponent, {
      width: '70%',
      data: { type: 'advanced',
              generalInfo, 
              title: 'Edit Vehicle & track info',
              dropdownOptions: this.dropdownOptionsSorted },
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        // console.log(data)
        this.service
          .updateSignalComments(this.signalItem.id, { ...data })
          .subscribe((result: any) => {
            this.getSignalItemById(this.signalItem.id);
          });
      }
    });
  }
  editGeneralInfo() {
    console.log('testing');
    const test_domain_id: any[] = []
    this.signalItem.signalTestDomain?.forEach((x: { test_domain: any; })=>{
      test_domain_id.push(x.test_domain.id)
    })
    console.log('testing for value', test_domain_id)
    const generalInfo = {
      requestor: this.signalItem.requestor,
      project_name: this.signalItem.project_name,
      project_xnr: this.signalItem.project_xnr,
      customer_id: this.signalItem.customer?.id,
      car_classification_id: this.signalItem.carClassification?.id,
      test_domain_id: test_domain_id,
      control_mode_id: this.signalItem.controlMode?.id,
      associated_directory: this.signalItem.associated_directory,
      in_use:this.signalItem.in_use
    }
    const dialogRef = this.dialog.open(UpdateIndividualComponent, {
      width: '70%',
      data: { type: 'general',
              generalInfo, 
              title: 'Edit Signal info',
              dropdownOptions: this.dropdownOptionsSorted },
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        // console.log(data)
        this.service
          .updateSignalComments(this.signalItem.id, { ...data })
          .subscribe((result: any) => {
            this.getSignalItemById(this.signalItem.id);
          });
      }
    });
  }
  updateSignalItem(version: any) {
    this.selectedVersion = version.version_number;
    // this.router.navigate(['/signals', version.signal_id]).then((nav) => {
    //   console.log(nav);
    // });
    if (version.isAvailable) {
      this.signalItem = version.signal;
      this.datasource = this.formEntityData(this.signalItem?.signalEntities);
      console.log(this.datasource);
      if (this.currentVersion > version.version_number) {
        this.versionClass = 'previous-version';
        this.versionMessage = `This is an old version of ${this.currentSignalNumber}`;
      } else if (this.currentVersion == version.version_number) {
        this.versionClass = 'current';
        this.versionMessage = '';
      } else {
        this.versionClass = 'latest-version';
        this.versionMessage = `This is a newer version of ${this.currentSignalNumber}`;
      }
    }
  }
  downloadFile(dbName: string, original_name: string, event_name?:string | null | undefined) {
    this.shared.downloadFile(dbName).subscribe((result: any) => {
      // this.blob = new Blob([result]);
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

  sortDropdownOptions(options: DropdownOptions[]) {
    const grd: any = {};
    for (let x = 0; x < options.length; x++) {
      const opt = options[x];
      // eslint-disable-next-line no-prototype-builtins
      if (grd.hasOwnProperty(opt.table)) {
        grd[opt.table] ? grd[opt.table].push(opt) : (grd[opt.table][0] = opt);
      } else {
        grd[opt.table] = [opt];
      }
    }
    // const grouped = _.groupBy(options, 'table')
    this.dropdownOptionsSorted = grd;
    for(let x = 0; x < this.dropdownOptionsSorted['CHANNEL_TYPE'].length; x++) {
      this.channelTypesWithName[this.dropdownOptionsSorted['CHANNEL_TYPE'][x].id] = this.dropdownOptionsSorted['CHANNEL_TYPE'][x].name;
      }
    this.datasource = this.formEntityData(this.signalItem?.signalEntities);
    console.log(this.datasource);
  }
  typeOfVar(element:any) {
    const x = ((element !== null) && (element !== undefined)) ? typeof element : 'string';
    return x;
  }
  getOptions() {
    this.service.getOptions().subscribe((result: any) => {
      this.dropdownOptionsRaw = result;
      this.sortDropdownOptions(this.dropdownOptionsRaw);
    });
  }

  copySignal(id: string) {
    // console.log(id);
    const r = { ...this.signalItem };
    delete r.id;
    delete r.signal_id;
    this.openDialog(actionState.Copy, r, true);
  }
  setStatus(id:string) {
    const status = !this.signalItem.in_use;
    const titleTxt = status ? 'Not in use' : 'In use';
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      data: {
        title: `Mark signal as ${titleTxt} `,
        message: `The signal will be marked as ${titleTxt}. Are you sure?`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this.service.setStatus(this.signalItem.id, status).subscribe((result) => {
          // this.notification.openSnackbar(
          //   'Signal status changed successfully!!',
          //   'Close',
          //   snackbarColors.success
          // );
          // this.router.navigate(['/signals']).then((nav) => {
          //   console.log(nav);
          // });
          this.getSignalItemById(this.signalItem.id);
        });
      }
    });
  }
  formatSignalData(data: any) {
    for (let m = 0; m < data.signalEntities?.length; m++) {
      delete data.signalEntities[m].id;
      delete data.signalEntities[m].entity_number;
      for (let n = 0; n < data.signalEntities[m].channelTypes.length; n++) {
        delete data.signalEntities[m].channelTypes[n].id;
        delete data.signalEntities[m].channelTypes[n].signal_entity_id;
      }
      for(let o = 0; o < data.signalEntities[m].signalEntityFiles.length; o++) {
        const x = data.signalEntities[m].signalEntityFiles[o];
        delete x.id;
        delete x.signal_entity_id;
      }
    }
    for(let h = 0; h < data.docParameterDetails.length; h++) {
      // console.log(data.docParameterDetails);
      delete data.docParameterDetails[h].id;
      delete data.docParameterDetails[h].signal_id;
      for(let i = 0; i < data.docParameterDetails[h].files.length; i++) {
      delete data.docParameterDetails[h].files[i].id;
      }
    }
    return data;
    // return {
    //   signal_number: data.signal_number,
    //   requestor: data.requestor,
    //   project_name: data.project_name,
    //   project_xnr: data.project_xnr,
    //   customer_id: data.customer_id,
    //   car_classification_id: data.car_classification_id,
    //   file_format_id: data.file_format_id,
    //   test_domain_id: data.test_domain_id,
    //   control_mode_id: data.control_mode_id,
    //   project_comments: data.project_comments,
    //   preceding_sg_number: data.preceding_sg_number,
    //   event_list_comments: data.event_list_comments,
    //   channel_list_comments: data.channel_list_comments,
    //   suspension_part_comments: data.suspension_part_comments,
    //   kinematic_model_comments: data.kinematic_model_comments,
    //   tooling_number: data.tooling_number,
    //   tooling_name: data.tooling_name,
    //   tooling_comments: data.tooling_comments,
    //   signalEntities: data.signalEntities,
    // };
  }
  newVersionOfSignal() {
    let bId = '';
    this.signalItem.base_version_id
      ? (bId = this.signalItem.base_version_id)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      : (bId = this.signalItem.id);
    const data = this.formatSignalData(this.signalItem);
    this.openDialog(actionState.Version, data, true, this.SignalVersions[0]?.version_number);
  }

  editSignal(id: string) {
    this.service.getSignalById(id).subscribe((result) => {
      const r = this.signalItem;
      this.openDialog(actionState.Edit, r);
    });
  }
  deleteSignal(id: string) {
    // console.log(id);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      data: {
        title: 'Delete Signal',
        message: `All the versions of signal ${this.signalItem.signal_number} will be permanently deleted. Are you sure?`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this.service.deleteSignal(this.signalItem.signal_number).subscribe((result) => {
          this.notification.openSnackbar(
            'Signal deleted successfully!!',
            'Close',
            snackbarColors.success
          );
          this.router.navigate(['/signals'])
        });
      }
    });
  }

  deleteSignalEntity(item:any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      data: {
        title: 'Delete Event',
        message: `Event ${this.signalItem.signal_number}-${item.entity_number} will be permanently deleted. Are you sure?`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this.service.deleteSignalEntity(item.id).subscribe((result) => {
          this.notification.openSnackbar(
            'Event deleted successfully!!',
            'Close',
            snackbarColors.success
          );
          this.getSignalItemById(this.signalItem.id);
        });
      }
    });
  }
  sortEventsTableHeader(sort:Sort) {
      const data = this.datasource.slice();
      console.log(this.datasource);
      if (!sort.active || sort.direction === '') {
        this.datasource = data;
      } else {
        this.datasource = data.sort((a: any, b: any) => {
          const aValue = (a as any)[sort.active];
          const bValue = (b as any)[sort.active];
          return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
        });
    }
    console.log(this.datasource);
  }
  addEvent() {
    // console.log("event");
    let precedingOption = [];
    // const fileInd = this.dropdownOptionsSorted.FILE_FORMAT.map( (item:any) => { return item.id}).indexOf(this.signalItem?.file_format_id);
    if(this.signalItem.precedingSignal) {
      precedingOption = this.signalItem.precedingSignal.signalEntities;
    }
    const data = {
      type: 'entity',
      title: 'Add Event',
      dropdownOptions: this.dropdownOptionsSorted,
      precedingEntityOption: precedingOption,
      precedingValSelected: this.signalItem.preceding_sg_id ? true : false,
      // fileFormatName: fileInd > -1 ? this.dropdownOptionsSorted.FILE_FORMAT[fileInd].name : 'Other',
      signalNumber: this.signalItem.signal_number,
      precedingSinalNumber: this.signalItem.precedingSignal?.signal_number
    }
    const dialogRef = this.dialog.open(UpdateIndividualComponent, {
      width: '70%',
      data: data,
    });
    dialogRef.afterClosed().subscribe((data1) => {
      if (data1) {
        if(data1.preceding_entity) {
          data1.preceding_entity_id = data1.preceding_entity.id;
        }
        data1.signal_id = this.signalItem.id;
        const fields: {[key:string]:string}= {};
        Object.keys(data1).forEach(key => data1[key] ? fields[key] = data1[key] : key);

        this.service
          .addSignalEntity( fields)
          .subscribe((result: any) => {
            this.getSignalItemById(this.signalItem.id);
          });
      }
    });
  }
  updateSignalEntity(index:number, item: SignalEntity) {
    let precedingOption = [];
    if(this.signalItem.precedingSignal) {
      precedingOption = this.signalItem.precedingSignal.signalEntities;
    }
    // item.comments=item.comments.replace(/<[\/]*p>/g, '');
    // console.log(item.comments);
    // find the file format name
    // const fileInd = this.dropdownOptionsSorted.FILE_FORMAT.map( (item:any) => { return item.id}).indexOf(this.signalItem?.file_format_id);
    const data = {
      type: 'entity',
      title: 'Edit Event',
      // event_list_comments: this.signalItem.event_list_comments,
      dropdownOptions: this.dropdownOptionsSorted,
      precedingEntityOption: precedingOption,
      precedingValSelected: this.signalItem.preceding_sg_id ? true : false,
      editData: item,
      // fileFormatName: fileInd > -1 ? this.dropdownOptionsSorted.FILE_FORMAT[fileInd].name : 'Other',
      signalNumber: this.signalItem.signal_number,
      precedingSinalNumber: this.signalItem.precedingSignal?.signal_number
    }
    const dialogRef = this.dialog.open(UpdateIndividualComponent, {
      width: '70%',
      data: data,
    });
    dialogRef.afterClosed().subscribe((data1) => {
      data1.comments=data1.comments.replace(/<[\/]*p>/g, '');
      if (data1) {
        if(data1.preceding_entity) {
          data1.preceding_entity_id = data1.preceding_entity.id;
        }
        for (let i = 0; i < data1.signalEntityFiles.length; i++) {
          data1.signalEntityFiles[i].signal_entity_id = item.id
        }
        const fields: {[key:string]:string}= {};
        Object.keys(data1).forEach(key => data1[key] ? fields[key] = data1[key] : key);
        if(item.id) {
          this.service
          .updateSignalEntity(item.id, fields)
          .subscribe((result: any) => {
            this.getSignalItemById(this.signalItem?.id);
            console.log(fields);
          });
          // console.log(data1);
          
        }
        
      }
    });
  }
  entityColumnSettings() {
    // console.log("column settings");
    localStorage.setItem('displayedEventColumns', JSON.stringify(this.displayedEventColumns));
    const dialogRef = this.dialog.open(EntityColumnsComponent, {
      width: '35%',
      maxHeight:'90vh',
      data: {parent:'view_signal'},
    });
    dialogRef.afterClosed().subscribe((result) => {
      // const x = localStorage.getItem('displayedColumns') || '';
      if(result == 'reset') {
        localStorage.removeItem('displayedEventColumns');
      }
      this.getColumns();
      
    });
  }
  getColumns() {
    const x = localStorage.getItem('displayedEventColumns');
    if (x) {
      this.displayedEventColumns = JSON.parse(x);
      const ind = this.displayedEventColumns.findIndex(item => item.name === 'settings');
      if(ind == -1) {
        this.displayedEventColumns.push({name:'settings',  displayName:'Action',isChecked:true })
      }
    } else {
      console.log(eventColummns);
      this.displayedEventColumns = eventColummns;
      localStorage.setItem(
        'displayedEventColumns',
        JSON.stringify(this.displayedEventColumns)
      );
    }
    const r = [];
    for (let m = 0; m < this.displayedEventColumns.length; m++) {
      if (this.displayedEventColumns[m].isChecked) {
        r.push(this.displayedEventColumns[m].name);
      }
    }
    this.displayedEventColumnsString = r;
    console.log(this.displayedEventColumnsString);
    this.datasource = this.formEntityData(this.signalItem?.signalEntities);
    console.log(this.datasource);
    // this.datasource=["Hello world"];
  }
  editComments(id: string, comments: string) {
    const dialogRef = this.dialog.open(UpdateIndividualComponent, {
      width: '70%',
      maxHeight:'90vh',
      data: { type: 'project', comments, title: 'Edit Signal comments' },
      
    });
    
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {


        this.service
          .updateSignalComments(id, { project_comments: data.comments })
          
          .subscribe((result: any) => {
            this.signalItem.project_comments = result.project_comments;
            console.log(data);
          });
      }
    });
  }
  editEventContent(id:string) {
    console.log(this.signalItem.event_list_comments);
    const data = {
      type: 'event',
      title: 'Edit Event list & sequence',
      signalContent: {
        // total_repetitions:this.signalItem.total_repetitions,
        event_list_comments: this.signalItem.event_list_comments,
        // channel_list_comments: this.signalItem.channel_list_comments,
      },
      eventFiles: { owner: 'EVENTLIST', files: this.eventFiles },
      // channelFiles: { owner: 'CHANNELLIST', files: this.channelFiles },
    };
    const dialogRef = this.dialog.open(UpdateIndividualComponent, {
      width: '70%',
      data: data,
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        const arr = [{ owner: 'SUSPENSION', files: this.suspensionFiles },
                   { owner: 'KINEMATICS', files: this.kinematicsFiles},
                   { owner: 'TOOLING', files: this.toolingFiles},
                   { owner: 'CHANNELLIST', files: this.channelFiles},];
        const r = data.docParameterDetails;
        data.docParameterDetails = [...r, ...arr];
        this.service.updateSignalComments(id, data).subscribe((result: any) => {
          this.signalItem.event_list_comments = result.event_list_comments;
          // this.signalItem.total_repetitions = result.total_repetitions;
          for(let x = 0; x < result.docParameterDetails?.length; x++ ) {
            this.formatData(result)
          }
        });
      }
    });
  }
  editSignalContent(id: string) {
    const data = {
      type: 'signalContent',
      title: 'Edit Signal Content',
      signalContent: {
        event_list_comments: this.signalItem.event_list_comments,
        channel_list_comments: this.signalItem.channel_list_comments,
      },
      eventFiles: { owner: 'EVENTLIST', files: this.eventFiles },
      channelFiles: { owner: 'CHANNELLIST', files: this.channelFiles },
    };
    const dialogRef = this.dialog.open(UpdateIndividualComponent, {
      width: '70%',
      data: data,
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        const arr = [{ owner: 'SUSPENSION', files: this.suspensionFiles },
                   { owner: 'KINEMATICS', files: this.kinematicsFiles},
                   { owner: 'TOOLING', files: this.toolingFiles}];
        const r = data.docParameterDetails;
        data.docParameterDetails = [...r, ...arr];
        this.service.updateSignalComments(id, data).subscribe((result: any) => {
          this.signalItem.event_list_comments = result.event_list_comments;
          this.signalItem.channel_list_comments = result.channel_list_comments;
          for(let x = 0; x < result.docParameterDetails?.length; x++ ) {
            this.formatData(result)
          }
        });
      }
    });
  }
  
  editSetupInfo(id:string) {
    const data = {
      type: 'setupInfo',
      edit: 'Edit Setup Info',
      title: 'Edit Setup Info',
      setupInfo: {
        suspension_part_comments: this.signalItem.suspension_part_comments,
        kinematic_model_comments: this.signalItem.kinematic_model_comments,
      },
      toolingInfoData:{
        tooling_numbers: this.signalItem.tooling_numbers,
        tooling_name: this.signalItem.tooling_name,
        tooling_comments: this.signalItem.tooling_comments,
      },
      suspensionFiles: { owner: 'SUSPENSION', files: this.suspensionFiles },
      kinematicsFiles: { owner: 'KINEMATICS', files: this.kinematicsFiles },
      toolingFiles: { owner: 'TOOLING', files: this.toolingFiles}
    };
    const dialogRef = this.dialog.open(UpdateIndividualComponent, {
      width: '70%',
      data: data,
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        const arr = [{ owner: 'EVENTLIST', files: this.eventFiles },
                   { owner: 'CHANNELLIST', files: this.channelFiles},
                   { owner: 'TOOLING', files: this.toolingFiles}];
        const r = data.docParameterDetails;
        data.docParameterDetails = [...r, ...arr];
        this.service.updateSignalComments(id, data).subscribe((result: any) => {
          this.getSignalItemById(this.signalItem.id)
        });
      }
    });
  }
  editToolingInfo(id:string) {
    const data = {
      type: 'toolingInfo',
      title: 'Edit Tooling',
      toolingInfoData: {
        tooling_number: this.signalItem.tooling_number,
      tooling_comments: this.signalItem.tooling_comments,
      },
      toolingFiles: { owner: 'TOOLING', files: this.toolingFiles },
    };
    const dialogRef = this.dialog.open(UpdateIndividualComponent, {
      width: '70%',
      data: data,
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        const arr = [{ owner: 'EVENTLIST', files: this.eventFiles },
                   { owner: 'CHANNELLIST', files: this.channelFiles},
                   { owner: 'SUSPENSION', files: this.suspensionFiles },
                   { owner: 'KINEMATICS', files: this.kinematicsFiles},];
        const r = data.docParameterDetails;
        data.docParameterDetails = [...r, ...arr];
        this.service.updateSignalComments(id, data).subscribe((result: any) => {
          this.signalItem.kinematic_model_comments = result.kinematic_model_comments;
          this.signalItem.suspension_part_comments = result.suspension_part_comments;
          this.formatData(result)
        });
      }
    });
  }
  openDialog(type: string, data?: any, isVersionOperation?: boolean, latestVNum?:number): void {
    this.service.getAllSignals().subscribe((result: any) => {
      let v = null;
      isVersionOperation ? (v = this.signalItem) : (v = null);
      const dialogRef = this.dialog.open(CreateSignalComponent, {
        width: '85%',
        data: {
          type: type,
          ...this.dropdownOptionsSorted,
          data: data,
          list: result,
          versionOf: v,
          latestVNum:latestVNum
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if(result) {
          this.router.navigate(['/signals/view', result])
        }
        // this.ngOnInit();
      });
    });
  }

  entitySelected(row: SignalEntity) {
    console.log('sfsdf');
    const dialogRef = this.dialog.open(ViewEventComponent,{
      width: '50%',
      data: {event:row, signal_number:this.signalItem.signal_number}
    });
    dialogRef.afterClosed().subscribe()
  }

  formatData(data: any) {
    const docs = data.docParameterDetails;
    console.log(data);
    for (let i = 0; i < docs?.length; i++) {
      switch (docs[i].owner) {
        case 'EVENTLIST':
          this.eventFiles = docs[i].files;
          break;
        case 'CHANNELLIST':
          this.channelFiles = docs[i].files;
          break;
        case 'SUSPENSION':
          this.suspensionFiles = docs[i].files;
          break;
        case 'KINEMATICS':
          this.kinematicsFiles = docs[i].files;
          break;
        case 'TOOLING':
          this.toolingFiles = docs[i].files;
          break;
      }
    }
    this.filesList = [
      {
        name: 'Event list',
        files: this.eventFiles,
      },
      {
        name: 'Channel list',
        files: this.channelFiles,
      },
      {
        name: 'Suspension parts',
        files: this.suspensionFiles,
      },
      {
        name: 'Tooling',
        files: this.toolingFiles,
      },
    ];

  }
  formEntityData(entitiesOr: any) {
    if (entitiesOr) {
      const entities = entitiesOr.sort((a: { created_date: string | number | Date; }, b: { created_date: string | number | Date; }) => { return new Date(b.created_date).getTime() - new Date(a.created_date).getTime()})
      for (let x = 0; x < entities.length; x++) {
        const pos = this.dropdownOptionsSorted.WAVE_FORM.map((f: any) => {
          return f.id;
        }).indexOf(entities[x].wave_form_id);
        if(pos > -1) {
          entities[x].wave_form_name = this.dropdownOptionsSorted.WAVE_FORM[pos].name;
        } 
        const channels: any[] = [];
        for (let y = 0; y < entities[x].channel_type_ids?.length; y++) {
          const pos = this.dropdownOptionsSorted.CHANNEL_TYPE.map((f: any) => {
            return f.id;
          }).indexOf(entities[x].channel_type_ids[y]);
          channels.push(this.dropdownOptionsSorted.CHANNEL_TYPE[pos].name);
        }
        entities[x].channels = channels;
      }

      return entities;
    } else {
      return [];
    }
  }
  getSignalVersions() {
    let vId = null;
    if (this.signalItem.signalVersion?.base_version_id) {
      vId = this.signalItem.signalVersion?.base_version_id;
    } else if (this.signalItem.signalVersion?.signal_id) {
      vId = this.signalItem.signalVersion?.signal_id;
    }
    this.service.getVersionsByBaseId(vId).subscribe((result: any) => {
      this.SignalVersions = result.sort((a: any, b: any) => {
        if (a.signal == null) {
          a.isAvailable = false;
        } else {
          if (a.signal.id == this.currentSignalId) {
            this.currentVersion = a.version_number;
          }
        }
        return b.version_number - a.version_number;
      });
      for (let x = 0; x < this.SignalVersions.length; x++) {
        this.SignalVersions[x].isAvailable = true;
        if (this.SignalVersions[x].signal == null) {
          this.SignalVersions[x].isAvailable = false;
        } else {
          if (this.SignalVersions[x].signal.id == this.currentSignalId) {
            this.currentVersion = this.SignalVersions[x].version_number;
            this.selectedVersion = this.SignalVersions[x].version_number;
          }
        }
      }
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((p: Params) => {
      this.getSignalItemById(p['params'].id);
      console.log(p['params']);
    });
    this.getColumns();
  }
}
