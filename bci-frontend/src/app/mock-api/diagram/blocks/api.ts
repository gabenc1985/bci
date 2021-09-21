import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiUtils } from '@fuse/lib/mock-api/mock-api.utils';
import { FuseMockApiService } from '@fuse/lib/mock-api/mock-api.service';
import { database as tagsData, subjects as tasksData } from 'app/mock-api/diagram/blocks/data';

@Injectable({
    providedIn: 'root'
})
export class BlocksMockApi {
    private _databases: any[] = tagsData;
    private _subjects: any[] = tasksData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Tags - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/block/adquisition/databases')
            .reply(() => [
                200,
                cloneDeep(this._databases)
            ]);

            this._fuseMockApiService
            .onGet('api/block/adquisition/subjects')
            .reply(() => [
                200,
                cloneDeep(this._subjects)
            ]);

    }
}
