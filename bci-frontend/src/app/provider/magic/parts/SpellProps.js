import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

var DELEGATE_TYPES = [
  'class',
  'expression',
  'delegateExpression'
];



export default function (group, element, translate, datos) {

  // Only return an entry, if the currently selected
  // element is a start event.

  let variable = datos[element.type]
  if(variable == undefined || variable == null){
    return;
  }
  let valores = Object.keys(variable);
  for (let i = 0; i < valores.length; i++) {
    let clave = valores[i];
    if (typeof variable[clave] === 'string') {
      group.entries.push(entryFactory.textField(translate, {
        id: clave,
        //description: '2 Apply a black magic spell',
        label: clave,
        validate: function(element, values, node) {
          return values.delegate != undefined && values.delegate != null;
        },
        modelProperty: clave
      }))
    }
    if (typeof variable[clave] === 'number') {
      group.entries.push(entryFactory.textBox(translate, {
        id: clave,
        //description: '2 Apply a black magic spell',
        label: clave,
        modelProperty: clave.toLowerCase().replaceAll(' ','').replaceAll('#',''),
        validate: function(element, values, node) {
          return values.delegate != undefined && values.delegate != null;
        },
      }))
    }
    if (typeof variable[clave] === 'boolean') {
      group.entries.push(entryFactory.checkbox(translate, {
        id: clave,
        //description: '2 Apply a black magic spell',
        label: clave,
        modelProperty: clave.toLowerCase().replaceAll(' ','').replaceAll('#',''),
      }))
    }
    if (typeof variable[clave] === 'object') {
      if (variable[clave] instanceof Array) {
        group.entries.push(entryFactory.selectBox(translate, {
          id: clave,
          //description: '2 Apply a black magic spell',
          label: clave,
          modelProperty: clave.toLowerCase().replaceAll(' ','').replaceAll('#',''),
          selectOptions: variable[clave],
      setControlValue: true
        }))
      }
    }

  }
}