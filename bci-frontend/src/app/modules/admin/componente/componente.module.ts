import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ComponenteComponent } from './componente.component';


const componenteRoutes: Route[] = [
    {
        path     : '',
        component: ComponenteComponent
    }
];

@NgModule({
    declarations: [
        ComponenteComponent
    ],
    imports     : [
        RouterModule.forChild(componenteRoutes), 
        MatIconModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatIconModule,
        MatMenuModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        SharedModule,
    ]
})
export class ComponenteModule
{
}
