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

  let variable = datos.filter(cp => cp.name == element.type);
  console.log(variable)
  if (variable == undefined || variable == null) {
    return;
  }
  if (variable[0] == undefined) {
    return;
  }
  variable = variable[0];
  if (variable.listas) {
    let valores = Object.keys(variable.listas);
    console.log(valores)
    for (let i = 0; i < valores.length; i++) {
      let clave = valores[i];
      console.log(clave)
      if (typeof variable.listas[clave] === 'object') {
        if (variable.listas[clave] instanceof Array) {
          group.entries.push(entryFactory.selectBox(translate, {
            id: clave,
            //description: '2 Apply a black magic spell',
            label: clave,
            modelProperty: clave.toLowerCase().replaceAll(' ', '').replaceAll('#', ''),
            selectOptions: variable.listas[clave],
            setControlValue: true
          }))
        }
      }
    }
  }
  if (variable.atributos) {
    let valores = Object.keys(variable.atributos);
    for (let i = 0; i < valores.length; i++) {
      let clave = valores[i];
      if (typeof variable.atributos[clave] === 'string') {
        group.entries.push(entryFactory.textField(translate, {
          id: clave,
          //description: '2 Apply a black magic spell',
          label: clave,
          validate: function (element, values, node) {
            return values.delegate != undefined && values.delegate != null;
          },
          modelProperty: clave
        }))
      }
      if (typeof variable.atributos[clave] === 'number') {
        group.entries.push(entryFactory.textBox(translate, {
          id: clave,
          //description: '2 Apply a black magic spell',
          label: clave,
          modelProperty: clave.toLowerCase().replaceAll(' ', '').replaceAll('#', ''),
          validate: function (element, values, node) {
            return values.delegate != undefined && values.delegate != null;
          },
        }))
      }
      if (typeof variable.atributos[clave] === 'boolean') {
        group.entries.push(entryFactory.checkbox(translate, {
          id: clave,
          //description: '2 Apply a black magic spell',
          label: clave,
          modelProperty: clave.toLowerCase().replaceAll(' ', '').replaceAll('#', ''),
        }))
      }
    }
  }
}