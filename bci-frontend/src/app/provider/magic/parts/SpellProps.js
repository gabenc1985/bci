import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

var DELEGATE_TYPES = [
  'class',
  'expression',
  'delegateExpression'
];
var domQuery = require('min-dom').query;



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
  group.label = variable.alias;

  if (variable.code) {
    group.entries.push(entryFactory.textField(translate, {
      id: variable.code,
      description: variable.description,
      label: variable.code,
      /*
      hidden: function(element, inputNode) {
       // var input = domQuery('input[name="' + options.modelProperty + '"]', inputNode);
       // input.value = '';
        var input = domQuery('input[name="' + variable.code+ '"]', inputNode);
        input.value=variable.code
        return true;
    
      },
      */
      modelProperty: variable.code
    }))
  }
  if (variable.attributes) {

    let valores = variable.attributes;
    for (let i = 0; i < valores.length; i++) {
      let clave = valores[i].name;

      if (valores[i].type === 'string') {
        group.entries.push(entryFactory.textField(translate, {
          id: clave,
          description: valores[i].description,
          label: clave,

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

    for (let i = 0; i < valores.length; i++) {
      let clave = valores[i];

      if (typeof variable.list[clave] === 'object') {
        if (variable.list[clave].attributes instanceof Array) {
          let valoresLista = variable.list[clave].attributes;

          let campos = [{ "name": "Seleccione...", "value": "", "type": "string" }];
          campos = campos.concat(valoresLista);


          group.entries.push(entryFactory.selectBox(translate, {
            id: clave,
            //description: '2 Apply a black magic spell',
            label: clave,
            modelProperty: clave.toLowerCase().replaceAll(' ', '').replaceAll('#', ''),
            selectOptions: campos,
            setControlValue: true,
            emptyParameter: false
          }))
        }
      }
    }
  }

}