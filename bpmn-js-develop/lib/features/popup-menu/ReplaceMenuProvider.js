import {
  getBusinessObject,
  is
} from '../../util/ModelUtil';

import {
  isEventSubProcess,
  isExpanded
} from '../../util/DiUtil';

import {
  isDifferentType
} from './util/TypeUtil';

import {
  forEach,
  filter
} from 'min-dash';

import * as replaceOptions from '../replace/ReplaceOptions';


/**
 * This module is an element agnostic replace menu provider for the popup menu.
 */
export default function ReplaceMenuProvider(
    bpmnFactory, popupMenu, modeling, moddle,
    bpmnReplace, rules, translate) {

  this._bpmnFactory = bpmnFactory;
  this._popupMenu = popupMenu;
  this._modeling = modeling;
  this._moddle = moddle;
  this._bpmnReplace = bpmnReplace;
  this._rules = rules;
  this._translate = translate;

  this.register();
}

ReplaceMenuProvider.$inject = [
  'bpmnFactory',
  'popupMenu',
  'modeling',
  'moddle',
  'bpmnReplace',
  'rules',
  'translate'
];


/**
 * Register replace menu provider in the popup menu
 */
ReplaceMenuProvider.prototype.register = function() {
  this._popupMenu.registerProvider('bpmn-replace', this);
};


/**
 * Get all entries from replaceOptions for the given element and apply filters
 * on them. Get for example only elements, which are different from the current one.
 *
 * @param {djs.model.Base} element
 *
 * @return {Array<Object>} a list of menu entry items
 */
ReplaceMenuProvider.prototype.getEntries = function(element) {

  var businessObject = element.businessObject;

  var rules = this._rules;

  var entries;

  if (!rules.allowed('shape.replace', { element: element })) {
    return [];
  }

  var differentType = isDifferentType(element);

  // start events outside sub processes
  if (is(businessObject, 'bpmn:StartEvent') && !is(businessObject.$parent, 'bpmn:SubProcess')) {

    entries = filter(replaceOptions.START_EVENT, differentType);

    return this._createEntries(element, entries);
  }

  // end events
  if (is(businessObject, 'bpmn:EndEvent')) {

    entries = filter(replaceOptions.END_EVENT, function(entry) {
      var target = entry.target;

      // hide cancel end events outside transactions
      if (target.eventDefinitionType == 'bpmn:CancelEventDefinition' && !is(businessObject.$parent, 'bpmn:Transaction')) {
        return false;
      }

      return differentType(entry);
    });

    return this._createEntries(element, entries);
  }

  // gateways
  if (is(businessObject, 'bpmn:Gateway')) {

    entries = filter(replaceOptions.GATEWAY, differentType);

    return this._createEntries(element, entries);
  }

  // sequence flows
  if (is(businessObject, 'bpmn:SequenceFlow')) {
    return this._createSequenceFlowEntries(element, replaceOptions.SEQUENCE_FLOW);
  }

  // flow nodes
  if (is(businessObject, 'bpmn:FlowNode')) {

    // collapsed SubProcess can not be replaced with itself
    if (is(businessObject, 'bpmn:SubProcess') && !isExpanded(businessObject)) {
      entries = filter(entries, function(entry) {
        return entry.label !== 'Sub Process (collapsed)';
      });
    }
    if (is(businessObject, 'bpmn:BCICompetitionTask')
      || is(businessObject, 'bpmn:BCIAdquisitionRandomTask')) {
      entries = filter(replaceOptions.TASK_BCI, differentType);
    }
    if (is(businessObject, 'bpmn:BCIClaSvmTask')
      || is(businessObject, 'bpmn:BCIClaLdaTask')
      || is(businessObject, 'bpmn:BCIClaKnnTask')
      || is(businessObject, 'bpmn:BCIClaRandomForestTask')
      || is(businessObject, 'bpmn:BCIClaRedNeuronalTask')) {
      entries = filter(replaceOptions.TASK_BCI_CLA, differentType);
    }
    if (is(businessObject, 'bpmn:BCIExtHjorthTask')
      || is(businessObject, 'bpmn:BCIExtEstadisticoTask')
      || is(businessObject, 'bpmn:BCIExtTranFourierTask')
      || is(businessObject, 'bpmn:BCIExtBurgTask')
      || is(businessObject, 'bpmn:BCIExtPsdWelchTask')
      || is(businessObject, 'bpmn:BCIExtAARTask')
      || is(businessObject, 'bpmn:BCIExtWaveletsTask')
      || is(businessObject, 'bpmn:BCIExtConcatFeaturesTask')
      || is(businessObject, 'bpmn:BCIExtPcaTask')
      || is(businessObject, 'bpmn:BCIExtFractalTask')
      || is(businessObject, 'bpmn:BCIExtEntropiaTask')) {
      entries = filter(replaceOptions.TASK_BCI_EXT, differentType);
    }
    if (is(businessObject, 'bpmn:BCIPreNormalizacionTask')
      || is(businessObject, 'bpmn:BCIPreSeleCanalesTask')
      || is(businessObject, 'bpmn:BCICPreCortarTask')
      || is(businessObject, 'bpmn:BCIPreFiltroPasaBandaTask')
      || is(businessObject, 'bpmn:BCIPreFiltroPasaBajosTask')
      || is(businessObject, 'bpmn:BCIPreFiltroPasaAltosTask')
      || is(businessObject, 'bpmn:BCIPreFiltroCarTask')
      || is(businessObject, 'bpmn:BCIPreTrialsTask')
      || is(businessObject, 'bpmn:BCIPreConcatenarTask')
      || is(businessObject, 'bpmn:BCIPreSplitTask')) {
      entries = filter(replaceOptions.TASK_BCI_PRE, differentType);
    }
    return this._createEntries(element, entries);
  }

  return [];
};


/**
 * Get a list of header items for the given element. This includes buttons
 * for multi instance markers and for the ad hoc marker.
 *
 * @param {djs.model.Base} element
 *
 * @return {Array<Object>} a list of menu entry items
 */
ReplaceMenuProvider.prototype.getHeaderEntries = function(element) {

  var headerEntries = [];

  if (is(element, 'bpmn:DataObjectReference')) {
    headerEntries = headerEntries.concat(this._getDataObjectIsCollection(element));
  }

  if (is(element, 'bpmn:Participant')) {
    headerEntries = headerEntries.concat(this._getParticipantMultiplicity(element));
  }

  if (is(element, 'bpmn:SubProcess') &&
    !is(element, 'bpmn:Transaction') &&
    !isEventSubProcess(element)) {
    headerEntries.push(this._getAdHocEntry(element));
  }

  return headerEntries;
};


/**
 * Creates an array of menu entry objects for a given element and filters the replaceOptions
 * according to a filter function.
 *
 * @param  {djs.model.Base} element
 * @param  {Object} replaceOptions
 *
 * @return {Array<Object>} a list of menu items
 */
ReplaceMenuProvider.prototype._createEntries = function(element, replaceOptions) {
  var menuEntries = [];

  var self = this;

  forEach(replaceOptions, function(definition) {
    var entry = self._createMenuEntry(definition, element);

    menuEntries.push(entry);
  });

  return menuEntries;
};

/**
 * Creates an array of menu entry objects for a given sequence flow.
 *
 * @param  {djs.model.Base} element
 * @param  {Object} replaceOptions

 * @return {Array<Object>} a list of menu items
 */
ReplaceMenuProvider.prototype._createSequenceFlowEntries = function(element, replaceOptions) {

  var businessObject = getBusinessObject(element);

  var menuEntries = [];

  var modeling = this._modeling,
      moddle = this._moddle;

  var self = this;

  forEach(replaceOptions, function(entry) {

    switch (entry.actionName) {
    case 'replace-with-default-flow':
      if (businessObject.sourceRef.default !== businessObject &&
          (is(businessObject.sourceRef, 'bpmn:ExclusiveGateway') ||
            is(businessObject.sourceRef, 'bpmn:InclusiveGateway') ||
            is(businessObject.sourceRef, 'bpmn:ComplexGateway') ||
            is(businessObject.sourceRef, 'bpmn:Activity'))) {

        menuEntries.push(self._createMenuEntry(entry, element, function() {
          modeling.updateProperties(element.source, { default: businessObject });
        }));
      }
      break;
    case 'replace-with-conditional-flow':
      if (!businessObject.conditionExpression && is(businessObject.sourceRef, 'bpmn:Activity')) {

        menuEntries.push(self._createMenuEntry(entry, element, function() {
          var conditionExpression = moddle.create('bpmn:FormalExpression', { body: '' });

          modeling.updateProperties(element, { conditionExpression: conditionExpression });
        }));
      }
      break;
    default:

      // default flows
      if (is(businessObject.sourceRef, 'bpmn:Activity') && businessObject.conditionExpression) {
        return menuEntries.push(self._createMenuEntry(entry, element, function() {
          modeling.updateProperties(element, { conditionExpression: undefined });
        }));
      }

      // conditional flows
      if ((is(businessObject.sourceRef, 'bpmn:ExclusiveGateway') ||
          is(businessObject.sourceRef, 'bpmn:InclusiveGateway') ||
          is(businessObject.sourceRef, 'bpmn:ComplexGateway') ||
          is(businessObject.sourceRef, 'bpmn:Activity')) &&
          businessObject.sourceRef.default === businessObject) {

        return menuEntries.push(self._createMenuEntry(entry, element, function() {
          modeling.updateProperties(element.source, { default: undefined });
        }));
      }
    }
  });

  return menuEntries;
};


/**
 * Creates and returns a single menu entry item.
 *
 * @param  {Object} definition a single replace options definition object
 * @param  {djs.model.Base} element
 * @param  {Function} [action] an action callback function which gets called when
 *                             the menu entry is being triggered.
 *
 * @return {Object} menu entry item
 */
ReplaceMenuProvider.prototype._createMenuEntry = function(definition, element, action) {
  var translate = this._translate;
  var replaceElement = this._bpmnReplace.replaceElement;

  var replaceAction = function() {
    return replaceElement(element, definition.target);
  };

  var label = definition.label;
  if (label && typeof label === 'function') {
    label = label(element);
  }

  action = action || replaceAction;

  var menuEntry = {
    label: translate(label),
    className: definition.className,
    id: definition.actionName,
    action: action
  };

  return menuEntry;
};

/**
 * Get a list of menu items containing a button for the collection marker
 *
 * @param  {djs.model.Base} element
 *
 * @return {Array<Object>} a list of menu items
 */
ReplaceMenuProvider.prototype._getDataObjectIsCollection = function(element) {

  var self = this;
  var translate = this._translate;

  function toggleIsCollection(event, entry) {
    self._modeling.updateModdleProperties(
      element,
      dataObject,
      { isCollection: !entry.active });
  }

  var dataObject = element.businessObject.dataObjectRef,
      isCollection = dataObject.isCollection;

  var dataObjectEntries = [
    {
      id: 'toggle-is-collection',
      className: 'bpmn-icon-parallel-mi-marker',
      title: translate('Collection'),
      active: isCollection,
      action: toggleIsCollection,
    }
  ];
  return dataObjectEntries;
};

/**
 * Get a list of menu items containing a button for the participant multiplicity marker
 *
 * @param  {djs.model.Base} element
 *
 * @return {Array<Object>} a list of menu items
 */
ReplaceMenuProvider.prototype._getParticipantMultiplicity = function(element) {

  var self = this;
  var bpmnFactory = this._bpmnFactory;
  var translate = this._translate;

  function toggleParticipantMultiplicity(event, entry) {
    var isActive = entry.active;
    var participantMultiplicity;

    if (!isActive) {
      participantMultiplicity = bpmnFactory.create('bpmn:ParticipantMultiplicity');
    }

    self._modeling.updateProperties(
      element,
      { participantMultiplicity: participantMultiplicity });
  }

  var participantMultiplicity = element.businessObject.participantMultiplicity;

  var participantEntries = [
    {
      id: 'toggle-participant-multiplicity',
      className: 'bpmn-icon-parallel-mi-marker',
      title: translate('Participant Multiplicity'),
      active: !!participantMultiplicity,
      action: toggleParticipantMultiplicity,
    }
  ];
  return participantEntries;
};


/**
 * Get the menu items containing a button for the ad hoc marker
 *
 * @param  {djs.model.Base} element
 *
 * @return {Object} a menu item
 */
ReplaceMenuProvider.prototype._getAdHocEntry = function(element) {
  var translate = this._translate;
  var businessObject = getBusinessObject(element);

  var isAdHoc = is(businessObject, 'bpmn:AdHocSubProcess');

  var replaceElement = this._bpmnReplace.replaceElement;

  var adHocEntry = {
    id: 'toggle-adhoc',
    className: 'bpmn-icon-ad-hoc-marker',
    title: translate('Ad-hoc'),
    active: isAdHoc,
    action: function(event, entry) {
      if (isAdHoc) {
        return replaceElement(element, { type: 'bpmn:SubProcess' }, {
          autoResize: false,
          layoutConnection: false
        });
      } else {
        return replaceElement(element, { type: 'bpmn:AdHocSubProcess' }, {
          autoResize: false,
          layoutConnection: false
        });
      }
    }
  };

  return adHocEntry;
};
