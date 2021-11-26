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
  
  if (variable == undefined || variable == null) {
    return;
  }
  if (variable[0] == undefined) {
    return;
  }
  variable = variable[0];
  if (variable.attributes) {
    let valores = variable.attributes;
    console.log(valores.length)
    for (let i = 0; i < valores.length; i++) {
      console.log(valores[i])
      let clave = valores[i].name;
      if (valores[i].type === 'string') {
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
      if (valores[i].type === 'number') {
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
      if (valores[i].type === 'boolean') {
        group.entries.push(entryFactory.checkbox(translate, {
          id: clave,
          //description: '2 Apply a black magic spell',
          label: clave,
          modelProperty: clave.toLowerCase().replaceAll(' ', '').replaceAll('#', ''),
        }))
      }
    }
  }
  if (variable.list) {
    let valores = Object.keys(variable.list);
    console.log(valores)
    for (let i = 0; i < valores.length; i++) {
      let clave = valores[i];
      if (typeof variable.list[clave] === 'object') {
        if (variable.list[clave] instanceof Array) {
          console.log(variable.list[clave])
          let campos = [{"name": "Seleccione2...","value": "","type":"string"}];
          campos=campos.concat(variable.list[clave]);
          console.log(campos);
          
          group.entries.push(entryFactory.selectBox(translate, {
            id: clave,
            //description: '2 Apply a black magic spell',
            label: clave,
            modelProperty: clave.toLowerCase().replaceAll(' ', '').replaceAll('#', ''),
            selectOptions: campos,
            setControlValue: true,
            emptyParameter:false
          }))
        }
      }
    }
  }
  
}