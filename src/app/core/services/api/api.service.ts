import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ExceptionService } from './../exception/exception.service';
import { AppStorage } from './../authentication/app-storage.service';
import { EndpointService, IApiEndpoint } from './../../config';

export interface ApiParam {
    data?: object;
    queryParams?: object;
    pathParams?: object;
}

export interface Paginator {
    currentPage: number;
    limit: number;
    nextPage: string;
    previousPage: number;
    totalCount: number;
    totaPages: number;
}

export interface ApiResponse {
    statusCode: number;
    message: string;
    isSuccess: boolean;
    data: any;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(
        private http: HttpClient,
        private exceptionService: ExceptionService,
        private appStorage: AppStorage,
        private endpointService: EndpointService
    ) { }

    request(name: string, params?: ApiParam): Observable<any> {
        const endpoint = this.getEndpoint(name);
        let url;
        if (params.pathParams) {
            url = this.addPathParamsIfAny(endpoint.url, params);
        } else if (params.queryParams) {
            url = this.addQueryParamsIfAny(endpoint.url, params);
        } else {
            url = endpoint.url;
        }

        let method: string;
        if (endpoint.method) {
            method = endpoint.method;
        }
        const requestOptions = {
            headers: this.getHeaders(),
            body: params ? params.data : {}
        };

        return (
            this.http
                .request(method, url, requestOptions)
                .pipe(map(res => this.extractData<ApiResponse>(res)))
                .pipe(catchError(this.exceptionService.catchBadResponse))
        );
    }

    private getEndpoint(name: string): IApiEndpoint {
        const endpoint = this.endpointService.get(name);
        if (!endpoint) {
            throw new Error('No endpoint is registered with' + name);
        }
        return endpoint;
    }

    private getHeaders(): HttpHeaders {
        const token = this.appStorage.get('auth_token');
        let requestHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        if (token && !requestHeaders.has('Authorization')) {
            requestHeaders = requestHeaders.append('Authorization', 'Bearer ' + token);
        }
        return requestHeaders;
    }

    private extractData<R>(res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        const body = res ? res : null;
        return (body || {}) as R;
    }

    private addPathParamsIfAny(url: string, data: ApiParam): string {
        if (data && data.pathParams) {
            for (const key in data.pathParams) {
                if (data.pathParams.hasOwnProperty(key)) {
                    url = url.replace(key, data.pathParams[key]);
                }
            }
        }
        return url;
    }

    private addQueryParamsIfAny(url: string, data: ApiParam): string {
        if (data && data.queryParams) {
            url = url.concat('?');
            let parmasArray = [];
            for (const key in data.queryParams) {
                parmasArray.push(key + '=' + data.queryParams[key]);
            }
            url = url.concat(parmasArray.join('&'));
        }
        return url;
    }
}
