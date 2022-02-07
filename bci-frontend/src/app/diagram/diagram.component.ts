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
  EventEmitter,
  Attribute
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
import propertiesPanelModule from 'bpmn-js-properties-panel';
import bpmnPropertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/bpmn';
import magicPropertiesProviderModule from '../provider/magic';
import { ControlesService } from 'app/provider/controles.service';
import { AttributeBCI, Constantes } from 'app/core/flow/flow.type';
declare var require: any;
var fastXmlParser = require('fast-xml-parser');

@Component({
  selector: 'app-diagram',
  template: `
  <div class="bg-card">
  <div class="flex flex-col w-full max-w-screen-xl mx-auto px-6 sm:px-8">
      <div class=" flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-8 sm:my-12 justify-between w-full">
     
        <div>
          <div class="text-3xl font-semibold tracking-tight leading-8">Diseño de diagrama</div>
          <div class="font-medium tracking-tight text-secondary">Diseño su diagrama para analizar</div>
        </div>
        <div class="flex items-center ml-6 space-x-3" >
          <button class="hidden sm:inline-flex" mat-stroked-button>
            <mat-icon class="icon-size-5" [svgIcon]="'heroicons_solid:save'"></mat-icon>
            <span class="ml-2">Guardar</span>
          </button>
          <button class="hidden sm:inline-flex ml-3" mat-flat-button [color]="'primary'" (click)="printXml()">
            <mat-icon class="icon-size-5" [svgIcon]="'heroicons_solid:cog'"></mat-icon>
            <span class="ml-2">Analizar</span>
          </button>

          <!-- Actions menu (visible on xs) -->
          <div class="sm:hidden">
            <button [matMenuTriggerFor]="actionsMenu" mat-icon-button>
              <mat-icon [svgIcon]="'heroicons_outline:dots-vertical'"></mat-icon>
            </button>
            <mat-menu #actionsMenu="matMenu">
              <button mat-menu-item>Analizar</button>
              <button mat-menu-item>Guardar</button>
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

  private componentesBCI = new Map();


  constructor(private http: HttpClient, private controlesService: ControlesService) {

  }

  ngOnInit() {

    this.bpmnJS = new BpmnModeler({
      propertiesPanel: {
        parent: this.propertiesRef.nativeElement,
      },

      additionalModules: [
        propertiesPanelModule,
        bpmnPropertiesProviderModule,
        magicPropertiesProviderModule
      ]

    });

    this.bpmnJS.on('import.done', ({ error }) => {
      if (!error) {
        this.bpmnJS.get('canvas').zoom('fit-viewport');
      }
    });
  }

  ngAfterContentInit() {
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
      const defaultOptions = {
        attributeNamePrefix: "",
        attrNodeName: false, //default is false
        textNodeName: "#text",
        ignoreAttributes: false,
        ignoreNamespaces: true,
        cdataTagName: false, //default is false
        cdataPositionChar: "\\c",
        format: true,
        indentBy: "  ",
        supressEmptyNode: true,
        rootNodeName: "element"
      };
      if (fastXmlParser.validate(xml) === true) { //optional (it'll return an object in case it's not valid)
        let jsonObj = fastXmlParser.parse(xml, defaultOptions);
        if (jsonObj[Constantes.DEFINITIONS]) {
          let definiciones = jsonObj[Constantes.DEFINITIONS]
          let proceso = <Map<any, any>>definiciones[Constantes.PROCESS]

          let secuencia = proceso[Constantes.SEQUENCE]
          let startComponentes = secuencia.filter(item => {
            delete item[Constantes.ID]
            return ("" + item.sourceRef).startsWith("StartEvent_")
          })
          let mapaComponentes = new Map();
          let index = 0;
          startComponentes.map(componente => {
            mapaComponentes.set(componente.targetRef, index++)
          })

          secuencia.map(sec => {
            if (!mapaComponentes.has(sec.sourceRef) && !sec.sourceRef.startsWith("StartEvent_")) {
              mapaComponentes.set(sec.sourceRef, index++)
            }
            if (!mapaComponentes.has(sec.targetRef) && !sec.targetRef.startsWith("Event_")) {
              mapaComponentes.set(sec.targetRef, index++)
            }
          })

          let recursivo = startComponentes.map(element => {
            return getSecuencia(element, secuencia, new Set());
          })
          let vectores = new Set<String>();
          recursivo.map(element => vectores = new Set([...vectores, ...element]))

          let connections = [];
          vectores.forEach(vec => {
            let inicio = mapaComponentes.get(vec.split('-')[0])
            let fin = mapaComponentes.get(vec.split('-')[1])
            if (inicio != undefined && fin != undefined)
              connections.push(inicio + "-" + fin)
          })

          let componentesProceso = Object.keys(proceso)
            .filter(k => {
              return k != 'isExecutable'
                && k != 'id'
                && k != 'bpmn:sequenceFlow'
                && k !== 'bpmn:startEvent'
                && k !== 'bpmn:endEvent'

            }).map(item => {
              delete proceso[item][Constantes.INCOMING]
              delete proceso[item][Constantes.OUTGOING]
              return proceso[item];
            })
          let componentesBCI = new Map()
          componentesBCI.set("bpmn:bCICompetitionTask", "BCIcompeticion");
          componentesBCI.set("bpmn:bCIAdquisitionRandomTask", "RandomAdquisition");
          componentesBCI.set("bpmn:bCIPreNormalizacionTask", "Normalization");
          componentesBCI.set("bpmn:bCIPreCortarTask", "Cut");
          componentesBCI.set("bpmn:bCIPreSeleCanalesTask", "SelectChannels");
          componentesBCI.set("bpmn:bCIPreFiltroPasaBandaTask", "Bandpass");
          componentesBCI.set("bpmn:bCIPreFiltroPasaBajosTask", "Lowpass");
          componentesBCI.set("bpmn:bCIPreFiltroPasaAltosTask", "Highpass");
          componentesBCI.set("bpmn:bCIPreFiltroCarTask", "CAR");
          componentesBCI.set("bpmn:bCIPreTrialsTask", "Trials");
          componentesBCI.set("bpmn:bCIPreConcatenarTask", "Concatenar");
          componentesBCI.set("bpmn:bCIPreSplitTask", "Split");
          componentesBCI.set("bpmn:bCIExtHjorthTask", "Hojorth");
          componentesBCI.set("bpmn:bCIExtEstadisticoTask", "Stadistics");
          componentesBCI.set("bpmn:bCIExtBurgTask", "Burg");
          componentesBCI.set("bpmn:bCIExtPsdWelchTask", "Welch");
          componentesBCI.set("bpmn:bCIExtAARTask", "AAR");
          componentesBCI.set("bpmn:bCIExtWaveletsTask", "Wavelets");
          componentesBCI.set("bpmn:bCIExtTranFourierTask", "FFT");
          componentesBCI.set("bpmn:bCIExtConcatFeaturesTask", "ConcatFeatures");
          componentesBCI.set("bpmn:bCIExtPcaTask", "PCA");
          componentesBCI.set("bpmn:bCIExtFractalTask", "Fractal");
          componentesBCI.set("bpmn:bCIExtEntropiaTask", "Entropy");
          componentesBCI.set("bpmn:bCIClaSvmTask", "SVM");
          componentesBCI.set("bpmn:bCIClaLdaTask", "LDA");
          componentesBCI.set("bpmn:bCIClaKnnTask", "KNN");
          componentesBCI.set("bpmn:bCIClaRandomForestTask", "RF");
          componentesBCI.set("bpmn:bCIClaRedNeuronalTask", "NeuralNetwork");
          let bloques = [];
          delete proceso[Constantes.START_EVENT]
          delete proceso[Constantes.END_EVENT]
          delete proceso[Constantes.SEQUENCE_FLOW]
          console.log(proceso)
          console.log(mapaComponentes)
          mapaComponentes.forEach((value: string, key: string) => {
            let id = value;
            let idActividad = key;
            let params = componentesProceso.filter(cP => cP.id === idActividad);
            let param = new Map();
            params.map(actividad => {
              Object.keys(actividad).map(atributo => {
                if (atributo != 'id') {
                  param[atributo] = actividad[atributo];
                }
              })
            })
            var type = "type"
            Object.keys(proceso).map(it => {

              if (proceso[it] instanceof Array) {
                <[]>proceso[it].map(item => {
                  if (item.id == idActividad) {
                    type = componentesBCI.get(it)
                  }
                })
              } else
                if (proceso[it].id == idActividad) {
                  type = componentesBCI.get(it)
                }
            })

            let attribute: AttributeBCI = {
              id: +id,
              type: type,
              params: param,

            }
            bloques.push(attribute)
          })


          let resultado = {
            bloques: bloques,
            conexiones: connections
          }

          console.log(JSON.stringify(resultado))

        }
      }
    });
  }
}


function getSecuencia(origen: any, vectorComponente: any, vectorOrdenado: Set<String>) {

  let componenteNuevo = vectorComponente.filter(item => {
    return origen.targetRef == item.sourceRef;
  });
  //vectorOrdenado.push(componenteNuevo)

  componenteNuevo.map(vo => {
    vectorOrdenado.add(vo.sourceRef + "-" + vo.targetRef);
    getSecuencia(vo, vectorComponente, vectorOrdenado);
  })
  return vectorOrdenado;

}



