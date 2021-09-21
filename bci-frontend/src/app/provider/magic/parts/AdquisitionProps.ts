import { HttpClient } from '@angular/common/http';
import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

export class AdquisitionProps {
  constructor(httpClient: HttpClient) {

  }

  renderProperties(group, element, translate) {
    if (is(element, 'bpmn:BCICompetitionTask')) {
      group.entries.push(entryFactory.selectBox(translate, {
        id: 'spell',
        description: 'Apply a black magic spell',
        label: translate('Database'),
        modelProperty: 'spell',
        selectOptions: [
          { name: 'string', value: 'string' },
          { name: 'long', value: 'long' },
          { name: 'boolean', value: 'boolean' },
          { name: 'date', value: 'date' },
          { name: 'enum', value: 'enum' }
        ],
      }));
      group.entries.push(entryFactory.textField(translate, {
        id: 'spell2',
        description: '2 Apply a black magic spell',
        label: 'Spell',
        modelProperty: 'spell2'
      }));
    }
  }
}
/*
export default function (group, element, translate) {

  // Only return an entry, if the currently selected
  // element is a start event.

  if (is(element, 'bpmn:BCICompetitionTask')) {
    group.entries.push(entryFactory.selectBox(translate, {
      id: 'spell',
      description: 'Apply a black magic spell',
      label: translate('Database'),
      modelProperty: 'spell',
      selectOptions: [
        { name: 'string', value: 'string' },
        { name: 'long', value: 'long' },
        { name: 'boolean', value: 'boolean' },
        { name: 'date', value: 'date' },
        { name: 'enum', value: 'enum' }
      ],
    }));
    group.entries.push(entryFactory.textField(translate, {
      id: 'spell2',
      description: '2 Apply a black magic spell',
      label: 'Spell',
      modelProperty: 'spell2'
    }));
  }
}

getDatabases(){

}
*/