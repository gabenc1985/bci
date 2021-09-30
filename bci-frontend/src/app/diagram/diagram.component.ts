import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
  SimpleChanges,
  EventEmitter
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';

/**
 * You may include a different variant of BpmnJS:
 *
 * bpmn-viewer  - displays BPMN diagrams without the ability
 *                to navigate themº
 * bpmn-modeler - bootstraps a full-fledged BPMN editor
 */

//import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { from, Observable, Subscription } from 'rxjs';
import customModule from '../custom';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import bpmnPropertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/bpmn';
import magicPropertiesProviderModule from '../provider/magic';
import magicModdleDescriptor from '../descriptors/magic.json';
import { UserService } from 'app/core/user/user.service';
import { ControlesService } from 'app/provider/controles.service';

@Component({
  selector: 'app-diagram',
  template: `
  <div class="bg-card">
  <div class="flex flex-col w-full max-w-screen-xl mx-auto px-6 sm:px-8">
      <div class=" flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-8 sm:my-12 justify-between w-full">
     
        <div>
          <div class="text-3xl font-semibold tracking-tight leading-8">Diagram Design</div>
          <div class="font-medium tracking-tight text-secondary">Desgin your diagram to analize</div>
        </div>
        <div class="flex items-center ml-6 space-x-3" >
          <button class="hidden sm:inline-flex" mat-stroked-button>
            <mat-icon class="icon-size-5" [svgIcon]="'heroicons_solid:cog'"></mat-icon>
            <span class="ml-2">Settings</span>
          </button>
          <button class="hidden sm:inline-flex ml-3" mat-flat-button [color]="'primary'" (click)="printXml()">
            <mat-icon class="icon-size-5" [svgIcon]="'heroicons_solid:save'"></mat-icon>
            <span class="ml-2">Export</span>
          </button>

          <!-- Actions menu (visible on xs) -->
          <div class="sm:hidden">
            <button [matMenuTriggerFor]="actionsMenu" mat-icon-button>
              <mat-icon [svgIcon]="'heroicons_outline:dots-vertical'"></mat-icon>
            </button>
            <mat-menu #actionsMenu="matMenu">
              <button mat-menu-item>Export</button>
              <button mat-menu-item>Settings</button>
            </mat-menu>
          </div>
        </div>
      </div>
      </div>
      </div>
      <div class="flex flex-col flex-auto min-w-0">
  <!-- Main -->
  <div class="diagram-parent" id="demo">
      <div class="diagram-container" #ref></div>
      <div class="js-properties-panel" #propertiesRef></div>
      </div>
  `,
  styles: [
    `

      .diagram-container {
        height: 100%;
        width: 100%;
        background-color: gray;
      }
      .js-properties-panel {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        width: 260px;
        z-index: 10;
        border-left: 1px solid #ccc;
        overflow: auto;
        background-color: white;
    }
    `
  ]
})
export class DiagramComponent implements AfterContentInit, OnChanges, OnDestroy {
  private bpmnJS: BpmnModeler;

  @ViewChild('ref', { static: true }) private el: ElementRef;
  @ViewChild('propertiesRef', { static: true }) private propertiesRef: ElementRef;
  @Output() private importDone: EventEmitter<any> = new EventEmitter();

  @Input() private url: string;

  constructor(private http: HttpClient, private controlesService:ControlesService) { }

  ngOnInit() {

    this.bpmnJS = new BpmnModeler({
      propertiesPanel: {
        parent: this.propertiesRef.nativeElement,
      },
      
      additionalModules: [
        customModule,
        propertiesPanelModule,
        bpmnPropertiesProviderModule,
        magicPropertiesProviderModule, 
        this.controlesService
      ],
      moddleExtensions: {
        magic: magicModdleDescriptor
      }

    });

    this.bpmnJS.on('import.done', ({ error }) => {
      if (!error) {
        this.bpmnJS.get('canvas').zoom('fit-viewport');
      }
    });
  }

  ngAfterContentInit() {
    console.log(this.el.nativeElement)
    console.log(this.propertiesRef.nativeElement)
    this.bpmnJS.attachTo(this.el.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    // re-import whenever the url changes
    if (changes.url) {
      this.loadUrl(changes.url.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  /**
   * Load diagram from URL and emit completion event
   */
  loadUrl(url: string): Subscription {
    url = '/assets/bpmn/initial.bpmn';
    return (
      this.http.get(url, { responseType: 'text' }).pipe(
        switchMap((xml: string) => this.importDiagram(xml)),
        map(result => result.warnings),
      ).subscribe(
        (warnings) => {
          this.importDone.emit({
            type: 'success',
            warnings
          });
        },
        (err) => {
          this.importDone.emit({
            type: 'error',
            error: err
          });
        }
      )
    );
  }

  /**
   * Creates a Promise to import the given XML into the current
   * BpmnJS instance, then returns it as an Observable.
   *
   * @see https://github.com/bpmn-io/bpmn-js-callbacks-to-promises#importxml
   */
  private importDiagram(xml: string): Observable<{ warnings: Array<any> }> {
    return from(this.bpmnJS.importXML(xml) as Promise<{ warnings: Array<any> }>);
  }


  public printXml() {
    this.bpmnJS.saveXML({ format: true }, function (err, xml) {
      //here xml is the bpmn format 
      console.log(xml)
    });
  }
}
