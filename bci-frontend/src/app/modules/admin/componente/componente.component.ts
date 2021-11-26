import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Attribute } from 'app/core/flow/flow.type';
import { authConfirmationRequiredRoutes } from 'app/modules/auth/confirmation-required/confirmation-required.routing';
import { map } from 'lodash';
import { Observable, Subject, merge } from 'rxjs';
import { ComponenteService } from './componente.service';

@Component({
    selector: 'componente',
    templateUrl: './componente.component.html',
    styles: [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 50% 50%;
   
            }
            .attribute-grid {
                grid-template-columns: 80% 20%;
            }
            .list-grid {
                grid-template-columns: 60% 20% 20%;
            }
            .attribute-list-grid {
                grid-template-columns: 40% 40% 20%;
            }
        `
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class ComponenteComponent {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    isLoading: boolean = false;
    componentes$: Observable<any[]>;
    listaComponentes: any
    selectedComponente: any | null = null;
    flashMessage: any = {};//= {'type':'success', 'text':'success'} | {'type':'error','text':'error'} ;
    selectedComponenteForm: FormGroup;
    keysListas: any;
    listaAtributo: Attribute[]
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    key: string;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _componentenService: ComponenteService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.componentes$ = this._componentenService.componentes$;
        this._componentenService.getComponentes().subscribe();

        this.selectedComponenteForm = this._formBuilder.group({
            id: [''],
            name: ['', [Validators.required]],
            description: [''],
            list: [{}],
            attributes: [[]],
            atributo: [''],
            atributoLista: [''],
            labelLista: [''],
            lista: ['']

        });
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        console.log('afterview')


    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle product details
     *
     * @param componenteId
     */
    toggleDetails(componenteId: string): void {
        // If the product is already selected...
        if (this.selectedComponente && this.selectedComponente.id === componenteId) {
            // Close the details
            this.closeDetails();
            return;
        }
        this.selectedComponenteForm = this._formBuilder.group({
            id: [''],
            name: ['', [Validators.required]],
            description: [''],
            list: [{}],
            attributes: [[]],
            atributo: [''],
            atributoLista: [''],
            labelLista: [''],
            lista: ['']

        });

        // Get the product by id
        this._componentenService.getProductById(componenteId)
            .subscribe((product) => {

                // Set the selected product
                this.selectedComponente = product;

                // Fill the form
                this.selectedComponenteForm.patchValue(product);
                if (this.selectedComponenteForm.get('list').value) {
                    let aux: any[] = this.selectedComponenteForm.get('list').value;
                    this.listaAtributo = [];
                    this.keysListas = Object.keys(aux)//.map((k) => aux[k])
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
    * Update the selected product using the form data
    */
    updateSelectedComponente(): void {
        const componente = this.selectedComponenteForm.getRawValue();

        console.log(componente)
        // Update the product on the server
        this._componentenService.updateComponente(componente.id, componente).subscribe(() => {

            // Show a success message
            this.showFlashMessage('Se actualizo el componente', 'success');
        });
    }


    addList() {
        if (this.selectedComponenteForm.get('lista').value) {
            let aux: any = this.selectedComponenteForm.get('list').value;
            let nuevaLista = this.selectedComponenteForm.get('lista').value;
            aux[nuevaLista] = [];
            this.selectedComponenteForm.get('list').setValue(aux)
            this.keysListas = Object.keys(aux)
            console.log(this.selectedComponenteForm.get('list').value)
            this.selectedComponenteForm.get('lista').setValue(null);
        }
        else {
            this.showFlashMessage('Ingrese un valor para la lista', 'error')
        }
        this._changeDetectorRef.markForCheck();
    }


    deleteAttributeList(attr: Attribute) {

        let repetidos = this.listaAtributo.filter(item =>
            item.name != attr.name
        )
        let aux: any = this.selectedComponenteForm.get('list').value;
        aux[this.key] = repetidos;
        this.selectedComponenteForm.get('list').setValue(aux)
        this.showFlashMessage('Atributo eliminado', 'success');
        console.log(this.selectedComponenteForm)
        this.listaAtributo = aux[this.key];
        this._changeDetectorRef.markForCheck();

    }

    addAttributeList() {
        console.log(this.selectedComponenteForm.get('atributoLista').value)
        console.log(this.selectedComponenteForm.get('labelLista').value)

        let repetidos = this.listaAtributo.filter(item =>
            item.name == this.selectedComponenteForm.get('atributoLista').value
        )

        if (repetidos.length > 0) {
            this.showFlashMessage('Atributo ya existe', 'error');
            return;
        }
        if (!this.key) {
            this.showFlashMessage('Debe seleccionar una lista, para ingresar un atributo', 'error')
            return;
        }
        console.log(this.selectedComponenteForm.get('atributoLista').value)
        console.log(this.selectedComponenteForm.get('labelLista').value)
        if (this.selectedComponenteForm.get('atributoLista').value) {
            if (this.selectedComponenteForm.get('labelLista').value) {
                let atributo: Attribute = {
                    name: this.selectedComponenteForm.get('labelLista').value,
                    value: this.selectedComponenteForm.get('atributoLista').value,
                    type: 'string'
                }

                if (this.listaAtributo.length == 0) {
                    this.listaAtributo = [];
                }
                this.listaAtributo.push(atributo);
                let aux: any = this.selectedComponenteForm.get('list').value;
                aux[this.key] = this.listaAtributo;
                this.selectedComponenteForm.get('list').setValue(aux)
                this.showFlashMessage('Atributo agregado', 'success');
            }
            else {
                this.showFlashMessage('Ingrese un () y (Valor) antes de ingresar a la lista', 'error')
            }
        }
        else {
            this.showFlashMessage('Ingrese un (Label) y (Valor) antes de ingresar a la lista', 'error')
        }
        this._changeDetectorRef.markForCheck();
    }

    deleteList(listaKey: string) {
        this.key = undefined;
        let aux: any = this.selectedComponenteForm.get('list').value;
        delete aux[listaKey];
        this.selectedComponenteForm.get('list').setValue(aux)
        this.listaAtributo = [];
        this.keysListas = Object.keys(aux);
        this.showFlashMessage('Lista ' + listaKey + ' se ha eliminado', 'success')
        this._changeDetectorRef.markForCheck();


    }

    toggleDetailsLista(listaKey: string) {
        let aux: any[] = this.selectedComponenteForm.get('list').value;
        this.listaAtributo = aux[listaKey];
        this.key = listaKey;
    }

    addAttribute() {
        if (this.selectedComponenteForm.get('atributo').value) {
            let atributos: Attribute[] = this.selectedComponenteForm.get('attributes').value;
            let repetidos = atributos.filter(item =>
                item.name == this.selectedComponenteForm.get('atributo').value
            )
            if (repetidos.length > 0) {
                this.showFlashMessage('Atributo ya existe', 'error');
                return;
            }
            let atributo: Attribute = {
                name: this.selectedComponenteForm.get('atributo').value,
                value: null,
                type: 'string'
            }
            atributos.push(atributo)
            this.selectedComponenteForm.get('attributes').setValue(atributos)
            this.selectedComponenteForm.get('atributo').setValue(null)
            this.showFlashMessage('Atributo agregado', 'success');
        }
        else {
            this.showFlashMessage('Ingrese un valor para el atributo', 'error')
        }

    }

    deleteAttribute(attr: Attribute) {
        let atributos: Attribute[] = this.selectedComponenteForm.get('attributes').value;
        let repetidos = atributos.filter(item =>
            item.name != attr.name
        )
        this.selectedComponenteForm.get('attributes').setValue(repetidos)
        this.showFlashMessage('Atributo eliminado', 'success');
    }

    /**
     * Close the details
     */
    closeDetails(): void {

        this.selectedComponente = null;
    }

    /**
     * Show flash message
     */
    showFlashMessage(text, type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = {};

        this.flashMessage.type = type;
        this.flashMessage.text = text;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {

            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}