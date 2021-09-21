import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Route, RouterModule } from '@angular/router';
import { DiagramComponent } from 'app/diagram/diagram.component';
import { ExampleComponent } from 'app/modules/admin/example/example.component';

const exampleRoutes: Route[] = [
    {
        path     : '',
        component: ExampleComponent
    }
];

@NgModule({
    declarations: [
        ExampleComponent,
        DiagramComponent
    ],
    imports     : [
        RouterModule.forChild(exampleRoutes), 
        CommonModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatIconModule,
        MatMenuModule,
    ]
})
export class ExampleModule
{
}
