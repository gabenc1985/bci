import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { Attribute, AttributeList } from 'app/core/flow/flow.type';
import { Observable, Subject, merge } from 'rxjs';
import { ComponenteService } from './componente.service';

@Component({
    selector: 'componente',
    templateUrl: './componente.component.html',
    styles: [
        /* language=SCSS */
        `
        .inventory-grid {
            grid-template-columns: 48px auto 40px;

            @screen sm {
                grid-template-columns: auto 72px;
            }

            @screen md {
                grid-template-columns: 150px 150px auto auto;
            }

            @screen lg {
                grid-template-columns: 250px 220px 220px 220px auto;
            }
        }

        .attribute-grid {
            grid-template-columns: 220px auto auto;

        }

        .list-grid{
            grid-template-columns: 220px auto auto auto;
        }

        .attribute-list-grid{
            grid-template-columns: 220px auto auto ;
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
    keysListas: any[];
    listaAtributo: Attribute[]
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    key: string;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
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
            code: ['', [Validators.required]],
            name: ['', [Validators.required]],
            type: [''],
            alias: ['', [Validators.required]],
            description: [''],
            list: [{}],
            attributes: [[]],
            atributo: [''],
            atributoLista: [''],
            labelLista: [''],
            lista: [''],
            order: [''], //posicion del componente en el grupo de componentes
            position: [''] //posicion del atributo dentro el componente
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

    cancelar() {
        // Close the details
        this.selectedComponenteForm.get('lista').setValue(null);
        this.selectedComponenteForm.get('position').setValue(null);
        this.selectedComponenteForm.get('labelLista').setValue(null);
        this.selectedComponenteForm.get('atributoLista').setValue(null);
        this.key = undefined
        this.closeDetails();
        return;

    }
    /**
     * Toggle product details
     *
     * @param componenteId
     */
    toggleDetails(componenteId: string): void {
        this.selectedComponenteForm.get('lista').setValue(null);
        this.selectedComponenteForm.get('position').setValue(null);
        this.selectedComponenteForm.get('labelLista').setValue(null);
        this.selectedComponenteForm.get('atributoLista').setValue(null);
        this.key = undefined
        // If the product is already selected...
        if (this.selectedComponente && this.selectedComponente.id === componenteId) {
            // Close the details

            this.closeDetails();
            return;
        }
        this.selectedComponenteForm = this._formBuilder.group({
            id: [''],
            name: ['', [Validators.required]],
            code: ['', [Validators.required]],
            type: [''],
            alias: ['', [Validators.required]],
            description: [''],
            list: [{}],
            attributes: [[]],
            atributo: [''],
            atributoLista: [''],
            labelLista: [''],
            lista: [''],
            order: ['', [Validators.required]],
            position: ['']
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
                    this.keysListas = [];
                    Object.keys(aux).map(item => {
                        this.keysListas.push({ nombre: item, position: aux[item].position, attributes: [] })
                    })
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
    * Update the selected component using the form data
    */
    updateSelectedComponente(): void {
        const componente = this.selectedComponenteForm.getRawValue();
        // Update the component on the server
        this._componentenService.updateComponente(componente.id, componente).subscribe(() => {

            // Show a success message
            this.showFlashMessage('Se actualizo el componente', 'success');
        });
    }


    addList() {
        if (this.selectedComponenteForm.get('lista').value)
            if (this.selectedComponenteForm.get('position').value) {
                let aux: any = this.selectedComponenteForm.get('list').value;
                let position = this.selectedComponenteForm.get('position').value;
                let nombreLista = this.selectedComponenteForm.get('lista').value;
                let nuevo: AttributeList = { attributes: [], position: position }
                aux[nombreLista] = nuevo;
                this.selectedComponenteForm.get('list').setValue(aux)
                this.keysListas = [];
                Object.keys(aux).map(item => {
                    this.keysListas.push({ nombre: item, position: aux[item].position })
                })
                this.selectedComponenteForm.get('lista').setValue(null);
                this.selectedComponenteForm.get('position').setValue(null);
            }
            else {
                this.showFlashMessage('Ingrese un nombre y posicion para la lista', 'error')
            }
        this._changeDetectorRef.markForCheck();
    }


    deleteAttributeList(attr: Attribute) {

        let nuevaLista = this.listaAtributo.filter(item =>
            item.name != attr.name
        )
        let aux: any = this.selectedComponenteForm.get('list').value;
        aux[this.key].attributes = nuevaLista;
        this.selectedComponenteForm.get('list').setValue(aux)
        this.showFlashMessage('Atributo eliminado', 'success');
        this.listaAtributo = aux[this.key].attributes;
        this._changeDetectorRef.markForCheck();

    }

    addAttributeList() {

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
        if (this.selectedComponenteForm.get('atributoLista').value) {
            if (this.selectedComponenteForm.get('labelLista').value) {
                let atributo: Attribute = {
                    name: this.selectedComponenteForm.get('labelLista').value,
                    value: this.selectedComponenteForm.get('atributoLista').value,
                    position: 0,
                    type: 'string'
                }

                if (this.listaAtributo.length == 0) {
                    this.listaAtributo = [];
                }
                this.listaAtributo.push(atributo);
                let aux: any = this.selectedComponenteForm.get('list').value;
                console.log(aux)
                aux[this.key].attributes = this.listaAtributo;
                this.selectedComponenteForm.get('list').setValue(aux)
                this.showFlashMessage('Atributo agregado', 'success');
                this.selectedComponenteForm.get('labelLista').setValue(null);
                this.selectedComponenteForm.get('atributoLista').setValue(null);
            }
            else {
                this.showFlashMessage('Ingrese un (Nombre) y (Valor) antes de ingresar a la lista', 'error')
            }
        }
        else {
            this.showFlashMessage('Ingrese un (Nombre) y (Valor) antes de ingresar a la lista', 'error')
        }
        this._changeDetectorRef.markForCheck();
    }

    deleteList(listaKey: string) {
        this.key = undefined;
        let aux: any = this.selectedComponenteForm.get('list').value;
        delete aux[listaKey];
        this.selectedComponenteForm.get('list').setValue(aux)
        this.listaAtributo = [];
        this.keysListas = [];
        Object.keys(aux).map(item => {
            this.keysListas.push({ nombre: item, position: aux[item].position })
        })
        this.showFlashMessage('Lista ' + listaKey + ' se ha eliminado', 'success')
        this._changeDetectorRef.markForCheck();


    }

    toggleDetailsLista(listaKey: string) {
        let aux: any[] = this.selectedComponenteForm.get('list').value;
        this.listaAtributo = aux[listaKey].attributes;
        this.key = listaKey;
    }

    addAttribute() {
        if (this.selectedComponenteForm.get('atributo').value)
            if (this.selectedComponenteForm.get('position').value) {
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
                    position: this.selectedComponenteForm.get('position').value,
                    type: 'string'
                }
                atributos.push(atributo)
                this.selectedComponenteForm.get('attributes').setValue(atributos)
                this.selectedComponenteForm.get('atributo').setValue(null)
                this.selectedComponenteForm.get('position').setValue(null)
                this.showFlashMessage('Atributo agregado', 'success');
            }
            else {
                this.showFlashMessage('Ingrese un atributo y posición', 'error')
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