import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'example',
    templateUrl: './example.component.html',
    styleUrls: ['./example.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ExampleComponent {
    /**
     * Constructor
     */
    constructor() {
    }

    diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
    importError?: Error;

    handleImported(event) {

        const {
            type,
            error,
            warnings
        } = event;

        if (type === 'success') {
            console.log(`Rendered diagram (%s warnings)`, warnings.length);
        }

        if (type === 'error') {
            console.error('Failed to render diagram', error);
        }

        this.importError = error;
    }
}
