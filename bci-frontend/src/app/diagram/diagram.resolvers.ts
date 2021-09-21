import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DiagramService } from './diagram.service';

@Injectable({
    providedIn: 'root'
})
export class DiagramResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _diagramService: DiagramService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._diagramService.getData();
    }
}
