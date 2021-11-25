import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class ComponenteService {


    // Private
    private _componente: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _componentes: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    private _url = 'http://localhost:8888/componente/'
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }



    /**
     * Getter for product
     */
    get componente$(): Observable<any> {
        return this._componente.asObservable();
    }

    /**
     * Getter for products
     */
    get componentes$(): Observable<any[]> {
        return this._componentes.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    /**
     * Get products
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getComponentes():
        Observable<any[]> {
        return this._httpClient.get<any[]>(this._url + 'all', {
        }).pipe(

            tap((response) => {
                console.log(response);
                this._componentes.next(response);
            })
        );
    }

    /**
     * Get product by id
     */
    getProductById(id: string): Observable<any> {
        return this._httpClient.get<{ componente: any }>(this._url + '/find/' + id, {
        }).pipe(
            tap((response) => {
                this._componente.next(response);
            })
        );
    }

    updateComponente(id: any, componente: any) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'text/plain, */*',
                'Content-Type': 'application/json' // We send JSON
            }),
            responseType: 'text' as 'json'  // We accept plain text as response.
        };
        return this._httpClient.post<string>(this._url + 'add',
            componente, httpOptions).
            pipe(map((response) => {

                return response;
            }));

    }


}
