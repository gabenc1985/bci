import {
  assign
} from 'min-dash';


/**
 * A palette provider for BPMN 2.0 elements.
 */
export default function PaletteProvider(
    palette, create, elementFactory,
    spaceTool, lassoTool, handTool,
    globalConnect, translate) {

  this._palette = palette;
  this._create = create;
  this._elementFactory = elementFactory;
  this._spaceTool = spaceTool;
  this._lassoTool = lassoTool;
  this._handTool = handTool;
  this._globalConnect = globalConnect;
  this._translate = translate;

  palette.registerProvider(this);
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool',
  'globalConnect',
  'translate'
];


PaletteProvider.prototype.getPaletteEntries = function(element) {

  var actions = {},
      create = this._create,
      elementFactory = this._elementFactory,
      lassoTool = this._lassoTool,
      handTool = this._handTool,
      globalConnect = this._globalConnect,
      translate = this._translate;


  function createAction(type, group, className, title, options) {

    function createListener(event) {
      var shape = elementFactory.createShape(assign({ type: type }, options));

      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded;
      }

      create.start(event, shape);
    }

    var shortType = type.replace(/^bpmn:/, '');

    return {
      group: group,
      className: className,
      title: title || translate('Create {type}', { type: shortType }),
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

  assign(actions, {
    'hand-tool': {
      group: 'tools',
      className: 'bpmn-icon-hand-tool',
      title: translate('Activate the hand tool'),
      action: {
        click: function(event) {
          handTool.activateHand(event);
        }
      }
    },
    'lasso-tool': {
      group: 'tools',
      className: 'bpmn-icon-lasso-tool',
      title: translate('Activate the lasso tool'),
      action: {
        click: function(event) {
          lassoTool.activateSelection(event);
        }
      }
    },
    'global-connect-tool': {
      group: 'tools',
      className: 'bpmn-icon-connection-multi',
      title: translate('Activate the global connect toolssss'),
      action: {
        click: function(event) {
          globalConnect.start(event);
        }
      }
    },
    'tool-separator': {
      group: 'tools',
      separator: true
    },
    'create.task-competition': createAction(
      'bpmn:BCICompetitionTask',
      'activity',
      'bpmn-icon-task',
      translate('Adquisición BCI Competición')
    ),
    'create.task-random': createAction(
      'bpmn:BCIAdquisitionRandomTask',
      'activity',
      'bpmn-icon-task',
      translate('Adquisición Random')
    ),
    'tool-adquisicion': {
      group: 'adquisicion',
      separator: true
    },
    'create.task-normalizacion': createAction(
      'bpmn:BCIPreNormalizacionTask',
      'activity',
      'bpmn-icon-task',
      translate('Normalización')
    ),
    'create.task-canales': createAction(
      'bpmn:BCIPreSeleCanalesTask',
      'activity',
      'bpmn-icon-task',
      translate('Seleccionar canales')
    ),
    'create.task-cortar': createAction(
      'bpmn:BCICPreCortarTask',
      'activity',
      'bpmn-icon-task',
      translate('Cortar')
    ),
    'create.task-filtro-pasa-banda': createAction(
      'bpmn:BCIPreFiltroPasaBandaTask',
      'activity',
      'bpmn-icon-task',
      translate('Filtro pasa banda')
    ),
    'create.task-filtro-pasa-bajos': createAction(
      'bpmn:BCIPreFiltroPasaBajosTask',
      'activity',
      'bpmn-icon-task',
      translate('Filtro pasa bajos')
    ),
    'create.task-filtro-pasa-altos': createAction(
      'bpmn:BCIPreFiltroPasaAltosTask',
      'activity',
      'bpmn-icon-task',
      translate('Filtro pasa altos')
    ),
    'create.task-filtro-car': createAction(
      'bpmn:BCIPreFiltroCarTask',
      'activity',
      'bpmn-icon-task',
      translate('Filtro CAR')
    ),
    'create.task-seleccionar': createAction(
      'bpmn:BCIPreTrialsTask',
      'activity',
      'bpmn-icon-task',
      translate('Seleccionar Trials')
    ),
    'create.task-concatenar': createAction(
      'bpmn:BCIPreConcatenarTask',
      'activity',
      'bpmn-icon-task',
      translate('Concatenar')
    ),
    'create.task-split': createAction(
      'bpmn:BCIPreSplitTask',
      'activity',
      'bpmn-icon-task',
      translate('Split')
    ),
    'tool-preprocesamiento': {
      group: 'preprocesamiento',
      separator: true
    },
    'create.task-hjorth': createAction(
      'bpmn:BCIExtHjorthTask',
      'activity',
      'bpmn-icon-task',
      translate('Hjorth')
    ),
    'create.task-estadistico': createAction(
      'bpmn:BCIExtEstadisticoTask',
      'activity',
      'bpmn-icon-task',
      translate('Estadisticos')
    ),
    'create.task-fourier': createAction(
      'bpmn:BCIExtTranFourierTask',
      'activity',
      'bpmn-icon-task',
      translate('Transformada de Fourier')
    ),
    'create.task-burg': createAction(
      'bpmn:BCIExtBurgTask',
      'activity',
      'bpmn-icon-task',
      translate('Método de Burg')
    ),
    'create.task-psd-welch': createAction(
      'bpmn:bpmn:BCIExtPsdWelchTask',
      'activity',
      'bpmn-icon-task',
      translate('PSD Welch')
    ),
    'create.task-aar': createAction(
      'bpmn:BCIExtAARTask',
      'activity',
      'bpmn-icon-task',
      translate('AAR')
    ),
    'create.task-wavelets': createAction(
      'bpmn:BCIExtWaveletsTask',
      'activity',
      'bpmn-icon-task',
      translate('Wavelets')
    ),
    'create.task-features': createAction(
      'bpmn:BCIExtConcatFeaturesTask',
      'activity',
      'bpmn-icon-task',
      translate('Concatenar features')
    ),
    'create.task-pca': createAction(
      'bpmn:BCIExtPcaTask',
      'activity',
      'bpmn-icon-task',
      translate('PCA')
    ),
    'create.task-fractal': createAction(
      'bpmn:BCIExtFractalTask',
      'activity',
      'bpmn-icon-task',
      translate('Fractal')
    ),
    'create.task-entropia': createAction(
      'bpmn:BCIExtEntropiaTask',
      'activity',
      'bpmn-icon-task',
      translate('Entropia')
    ),
    'tool-extraccion': {
      group: 'extraccion',
      separator: true
    },
    'create.task-svm': createAction(
      'bpmn:BCIClaSvmTask',
      'activity',
      'bpmn-icon-task',
      translate('SVM')
    ),
    'create.task-lda': createAction(
      'bpmn:BCIClaLdaTask',
      'activity',
      'bpmn-icon-task',
      translate('LDA')
    ),
    'create.task-knn': createAction(
      'bpmn:BCIClaKnnTask',
      'activity',
      'bpmn-icon-task',
      translate('KNN')
    ),
    'create.task-forest': createAction(
      'bpmn:BCIClaRandomForestTask',
      'activity',
      'bpmn-icon-task',
      translate('Random Forest')
    ),
    'create.task-neuronal-simple': createAction(
      'bpmn:BCIClaRedNeuronalTask',
      'activity',
      'bpmn-icon-task',
      translate('Red neuronal simple')
    )
  });

  return actions;
};
