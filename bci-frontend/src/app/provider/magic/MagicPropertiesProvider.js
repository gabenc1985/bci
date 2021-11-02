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
    label: 'Propiedades',
    entries: [],
  };

  // Add the spell props to the black magic group.
  spellProps(blackMagicGroup, element, translate, datos);

  return [
    blackMagicGroup
  ];
}



export default function MagicPropertiesProvider(propertiesPanel, translate) {

  let datos = getDatos();
  // Register our custom magic properties provider.
  // Use a lower priority to ensure it is loaded after the basic BPMN properties.
  propertiesPanel.registerProvider(LOW_PRIORITY, this);

  this.getTabs = function (element) {

    return function (entries) {

      // Add the "magic" tab
      var magicTab = {
        id: 'magic',
        label: 'Propiedades',
        groups: createMagicTabGroups(element, translate, datos)
      };

      entries.push(magicTab);
      return entries;

    };
  };
}

function getDatos() {
  let variable = function (element, node) {
    var arrValues = []
    $.ajax({
      //url: "./assets/databases.json",
      url:"http://localhost:8080/componente/all",
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