// Require your custom property entries.
import spellProps from './parts/SpellProps';

var LOW_PRIORITY = 500;


// Create the custom magic tab.
// The properties are organized in groups.
function createMagicTabGroups(element, translate) {

  // Create a group called "Black Magic".
  var blackMagicGroup = {
    id: 'black-magic',
    label: 'Black Magic',
    entries: []
  };

  // Add the spell props to the black magic group.
  spellProps(blackMagicGroup, element, translate);

  return [
    blackMagicGroup
  ];
}

async function getDatabases() {

  let url = "./assets/databases.json";
  //Funcion que hace llamada al servidor para pedir los datos EEG de la base de datos seleccionada

  //Enviamos el JSON de los bloques, para que el servidor los pueda procesar
  console.log('request database ...');
 let response = await fetch(url, {
    method: 'GET',
  }).then(response => response.json()).then(text => {
    return text;
  });

 // await response.json();

 return response


};

export default function MagicPropertiesProvider(propertiesPanel, translate) {

  console.log('magic provider')
  // Register our custom magic properties provider.
  // Use a lower priority to ensure it is loaded after the basic BPMN properties.
  propertiesPanel.registerProvider(LOW_PRIORITY, this);

  this.getTabs = function(element) {

    return function(entries) {

      // Add the "magic" tab
      var magicTab = {
        id: 'magic',
        label: 'Magic',
        groups: createMagicTabGroups(element, translate)
      };

      entries.push(magicTab);
  
      // Show general + "magic" tab
      return entries;
    }
  };
}

MagicPropertiesProvider.$inject = [ 'propertiesPanel', 'translate' ]