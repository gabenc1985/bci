import { Route } from '@angular/router';
import { DiagramComponent } from './diagram.component';
import { DiagramResolver } from './diagram.resolvers';

export const diagramsRoutes: Route[] = [
    {
        path     : '',
        component: DiagramComponent,
        resolve  : {
            data: DiagramResolver
        }
    }
];
