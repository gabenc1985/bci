import {
  bootstrapModeler,
  getBpmnJS,
  inject
} from 'test/TestHelper';

import coreModule from 'lib/core';
import createModule from 'diagram-js/lib/features/create';
import modelingModule from 'lib/features/modeling';
import paletteModule from 'lib/features/palette';

import { createMoveEvent } from 'diagram-js/lib/features/mouse/Mouse';

import {
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';


describe('features/palette', function() {

  var diagramXML = require('../../../fixtures/bpmn/features/replace/01_replace.bpmn');

  var testModules = [
    coreModule,
    createModule,
    modelingModule,
    paletteModule
  ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  it('should provide BPMN modeling palette', inject(function(canvas) {

    // when
    var paletteElement = domQuery('.djs-palette', canvas._container);
    var entries = domQueryAll('.entry', paletteElement);

    // then
    expect(entries.length).to.equal(3);
  }));

  describe('tools', function() {

    // skip on PhantomJS to prevent unwanted <forEach> behaviors
    // cf. https://github.com/bpmn-io/diagram-js/pull/517
    (isPhantomJS() ? it.skip : it)('should not fire <move> on globalConnect', inject(
      function(eventBus) {

        // given
        var moveSpy = sinon.spy();

        eventBus.on('global-connect.move', moveSpy);

        // when
        triggerPaletteEntry('global-connect-tool');

        // then
        expect(moveSpy).to.not.have.been.called;

      }
    ));

  });

});

// helpers //////////

function triggerPaletteEntry(id) {
  getBpmnJS().invoke(function(palette) {
    var entry = palette.getEntries()[ id ];

    if (entry && entry.action && entry.action.click) {
      entry.action.click(createMoveEvent(0, 0));
    }
  });
}

function isPhantomJS() {
  return /PhantomJS/.test(window.navigator.userAgent);
}