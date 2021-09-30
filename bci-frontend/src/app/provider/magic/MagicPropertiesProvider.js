// Require your custom property entries.
import spellProps from './parts/SpellProps';
import $ from 'jquery'

var LOW_PRIORITY = 500;


// Create the custom magic tab.
// The properties are organized in groups.
function createMagicTabGroups(element, translate, datos) {

  // Create a group called "Black Magic".

  var blackMagicGroup = {
    id: 'black-magic',
    label: 'Black MagicX',
    entries: [],
  };

  // Add the spell props to the black magic group.
  spellProps(blackMagicGroup, element, translate, datos);

  return [
    blackMagicGroup
  ];
}



export default function MagicPropertiesProvider(propertiesPanel, translate) {

  console.log(propertiesPanel.dataAdicional)
  // Register our custom magic properties provider.
  // Use a lower priority to ensure it is loaded after the basic BPMN properties.
  propertiesPanel.registerProvider(LOW_PRIORITY, this);

  let datos = getDatos();
  console.log(datos)
  this.getTabs = function (element) {

    return function (entries) {

      // Add the "magic" tab
      var magicTab = {
        id: 'magic',
        label: 'Magic',
        groups: createMagicTabGroups(element, translate, datos)
      };

      entries.push(magicTab);

      // Show general + "magic" tab
      return entries;

    };
  };
}

async function getDatabases() {

  let url = "./assets/databases.json";
  //Funcion que hace llamada al servidor para pedir los datos EEG de la base de datos seleccionada

  //Enviamos el JSON de los bloques, para que el servidor los pueda procesar
  console.log('request database ...');
  let respuesta = await fetch(url, {
    method: 'GET',
  }).then(response => response.json()).then(text => {

    return text;
  });
  return respuesta;
};

function getDatos() {

  let variable = function (element, node) {
    var arrValues = []
    $.ajax({
      url: "./assets/databases.json",
      method: "GET",
      success: function (result) {
        arrValues = result;
      },
      async: false
    });
    return arrValues;
  }
  return variable();
}



MagicPropertiesProvider.$inject = ['propertiesPanel', 'translate']