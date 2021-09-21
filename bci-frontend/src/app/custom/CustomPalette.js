const SUITABILITY_SCORE_HIGH = 100,
      SUITABILITY_SCORE_AVERGE = 50,
      SUITABILITY_SCORE_LOW = 25,
      BCI_COMPETITION='bci-competition';

export default class CustomPalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const {
      bpmnFactory,
      create,
      elementFactory,
      translate
    } = this;

    function createTask(suitabilityScore) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:Task');
       
        businessObject.suitable = suitabilityScore;

        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }

    function createTaskAdquisition(adquisition) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:BCICompetitionTask');
        businessObject.typeTask = adquisition
    
        const shape = elementFactory.createShape({
          type: 'bpmn:BCICompetitionTask',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }

    return {
      'create.bci-competition-task': {
        group: 'activity',
        className: 'bpmn-icon-task-bci-competition',
        title: translate('Create Task BCI Competition'),
        action: {
          dragstart: createTaskAdquisition(BCI_COMPETITION),
          click: createTaskAdquisition(BCI_COMPETITION)
        }
      }
    /*
      ,
      'create.low-task': {
        group: 'activity',
        className: 'bpmn-icon-task-bci-competition red',
        title: translate('Create Task with low suitability score'),
        action: {
          dragstart: createTaskAdquisition(SUITABILITY_SCORE_LOW),
          click: createTaskAdquisition(SUITABILITY_SCORE_LOW)
        }
      }  ,
      'create.average-task': {
        group: 'activity',
        className: 'bpmn-icon-task yellow',
        title: translate('Create Task with average suitability score gabriel'),
        action: {
          dragstart: createTask(SUITABILITY_SCORE_AVERGE),
          click: createTask(SUITABILITY_SCORE_AVERGE)
        }
      },
      'create.high-task': {
        group: 'activity',
        className: 'bpmn-icon-task green',
        title: translate('Create Task with high suitability score'),
        action: {
          dragstart: createTask(SUITABILITY_SCORE_HIGH),
          click: createTask(SUITABILITY_SCORE_HIGH)
        }
      }
      */
    };
  }
}

CustomPalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];