export var START_EVENT = [
  {
    label: 'Start Event',
    actionName: 'replace-with-none-start',
    className: 'bpmn-icon-start-event-none',
    target: {
      type: 'bpmn:StartEvent'
    }
  },
  {
    label: 'End Event',
    actionName: 'replace-with-none-end',
    className: 'bpmn-icon-end-event-none',
    target: {
      type: 'bpmn:EndEvent'
    }
  }
];

export var START_EVENT_SUB_PROCESS = [
  {
    label: 'Start Event',
    actionName: 'replace-with-none-start',
    className: 'bpmn-icon-start-event-none',
    target: {
      type: 'bpmn:StartEvent'
    }
  }
];

export var END_EVENT = [
  {
    label: 'Start Event',
    actionName: 'replace-with-none-start',
    className: 'bpmn-icon-start-event-none',
    target: {
      type: 'bpmn:StartEvent'
    }
  },
  {
    label: 'End Event',
    actionName: 'replace-with-none-end',
    className: 'bpmn-icon-end-event-none',
    target: {
      type: 'bpmn:EndEvent'
    }
  }
];

export var GATEWAY = [
  {
    label: 'Exclusive Gateway',
    actionName: 'replace-with-exclusive-gateway',
    className: 'bpmn-icon-gateway-xor',
    target: {
      type: 'bpmn:ExclusiveGateway'
    }
  }

  // Gateways deactivated until https://github.com/bpmn-io/bpmn-js/issues/194
  // {
  //   label: 'Event based instantiating Gateway',
  //   actionName: 'replace-with-exclusive-event-based-gateway',
  //   className: 'bpmn-icon-exclusive-event-based',
  //   target: {
  //     type: 'bpmn:EventBasedGateway'
  //   },
  //   options: {
  //     businessObject: { instantiate: true, eventGatewayType: 'Exclusive' }
  //   }
  // },
  // {
  //   label: 'Parallel Event based instantiating Gateway',
  //   actionName: 'replace-with-parallel-event-based-instantiate-gateway',
  //   className: 'bpmn-icon-parallel-event-based-instantiate-gateway',
  //   target: {
  //     type: 'bpmn:EventBasedGateway'
  //   },
  //   options: {
  //     businessObject: { instantiate: true, eventGatewayType: 'Parallel' }
  //   }
  // }
];
export var TASK_BCI = [
  {
    label: 'Adquisición BCI Competición',
    actionName: 'replace-with-task-bci',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCICompetitionTask'
    }
  },
  {
    label: 'Adquisición Random',
    actionName: 'replace-with-task-random',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIAdquisitionRandomTask'
    }
  }
];
export var TASK_BCI_PRE = [
  {
    label: 'Normalización',
    actionName: 'replace-with-task-pre',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIPreNormalizacionTask'
    }
  },
  {
    label: 'Seleccionar canales',
    actionName: 'replace-with-task-can',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIPreSeleCanalesTask'
    }
  },
  {
    label: 'Cortar',
    actionName: 'replace-with-task-cortar',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCICPreCortarTask'
    }
  },
  {
    label: 'Filtro pasa banda',
    actionName: 'replace-with-task-pasa-banda',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIPreFiltroPasaBandaTask'
    }
  },
  {
    label: 'Filtro pasa bajos',
    actionName: 'replace-with-task-pasa-bajos',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIPreFiltroPasaBajosTask'
    }
  },
  {
    label: 'Filtro pasa altos',
    actionName: 'replace-with-task-pasa-altos',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIPreFiltroPasaAltosTask'
    }
  },
  {
    label: 'Filtro CAR',
    actionName: 'replace-with-task-filtro-car',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIPreFiltroCarTask'
    }
  },
  {
    label: 'Seleccionar Trials',
    actionName: 'replace-with-task-trials',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIPreTrialsTask'
    }
  },
  {
    label: 'Concatenar',
    actionName: 'replace-with-task-concat',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIPreConcatenarTask'
    }
  },
  {
    label: 'Split',
    actionName: 'replace-with-task-split',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIPreSplitTask'
    }
  }
];
export var TASK_BCI_EXT = [
  {
    label: 'Hjorth',
    actionName: 'replace-with-task-hjorth',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIExtHjorthTask'
    }
  },
  {
    label: 'Estadisticos',
    actionName: 'replace-with-task-estadis',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIExtEstadisticoTask'
    }
  },
  {
    label: 'Transformada de Fourier',
    actionName: 'replace-with-task-fourier',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIExtTranFourierTask'
    }
  },
  {
    label: 'Método de Burg',
    actionName: 'replace-with-task-burg',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIExtBurgTask'
    }
  },
  {
    label: 'PSD Welch',
    actionName: 'replace-with-task-psd',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIExtPsdWelchTask'
    }
  },
  {
    label: 'AAR',
    actionName: 'replace-with-task-aar',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIExtAARTask'
    }
  },
  {
    label: 'Wavelets',
    actionName: 'replace-with-task-wavelets',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIExtWaveletsTask'
    }
  },
  {
    label: 'Concatenar features',
    actionName: 'replace-with-task-features',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIExtConcatFeaturesTask'
    }
  },
  {
    label: 'PCA',
    actionName: 'replace-with-task-pca',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIExtPcaTask'
    }
  },
  {
    label: 'Fractal',
    actionName: 'replace-with-task-fractal',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIExtFractalTask'
    }
  },
  {
    label: 'Entropia',
    actionName: 'replace-with-task-entropia',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIExtEntropiaTask'
    }
  }
];
export var TASK_BCI_CLA = [
  {
    label: 'SVM',
    actionName: 'replace-with-task-cla',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIClaSvmTask'
    }
  },
  {
    label: 'LDA',
    actionName: 'replace-with-task-lda',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIClaLdaTask'
    }
  },
  {
    label: 'KNN',
    actionName: 'replace-with-task-knn',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIClaKnnTask'
    }
  },
  {
    label: 'Random Forest',
    actionName: 'replace-with-task-forest',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIClaRandomForestTask'
    }
  },
  {
    label: 'Red neuronal simple',
    actionName: 'replace-with-task-simple-neuronal',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:BCIClaRedNeuronalTask'
    }
  }
];

export var SEQUENCE_FLOW = [
  {
    label: 'Sequence Flow',
    actionName: 'replace-with-sequence-flow',
    className: 'bpmn-icon-connection'
  },
  {
    label: 'Default Flow',
    actionName: 'replace-with-default-flow',
    className: 'bpmn-icon-default-flow'
  },
  {
    label: 'Conditional Flow',
    actionName: 'replace-with-conditional-flow',
    className: 'bpmn-icon-conditional-flow'
  }
];

export var PARTICIPANT = [
  {
    label: 'Expanded Pool',
    actionName: 'replace-with-expanded-pool',
    className: 'bpmn-icon-participant',
    target: {
      type: 'bpmn:Participant',
      isExpanded: true
    }
  },
  {
    label: function(element) {
      var label = 'Empty Pool';

      if (element.children && element.children.length) {
        label += ' (removes content)';
      }

      return label;
    },
    actionName: 'replace-with-collapsed-pool',

    // TODO(@janstuemmel): maybe design new icon
    className: 'bpmn-icon-lane',
    target: {
      type: 'bpmn:Participant',
      isExpanded: false
    }
  }
];
