import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';




export default function (group, element, translate) {

  // Only return an entry, if the currently selected
  // element is a start event.

  if (is(element, 'bpmn:BCICompetitionTask')) {
    group.entries.push(entryFactory.selectBox(translate, {
      id: 'spell',
      description: 'Apply a black magic spell',
      label: translate('Database'),
      modelProperty: 'spell',
      selectOptions: [{name:"name", value:"value"}]
    }));
    group.entries.push(entryFactory.textField(translate, {
      id: 'spell2',
      description: '2 Apply a black magic spell',
      label: 'Spell',
      modelProperty: 'spell2'
    }));
  }
}

