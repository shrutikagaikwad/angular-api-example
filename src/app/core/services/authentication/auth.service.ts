import { Injectable, Optional, SkipSelf } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable, of } from 'rxjs';
import { EndpointService } from './../../config';
import { AppStorage } from './app-storage.service';
import { ExceptionService } from './../exception/exception.service';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IResponse {
    success: boolean;
    result: any;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private LoggedInUserSubject = new Subject<any>();
    private loggedInUserState;
    currentUser: any;

    constructor(
        @Optional() @SkipSelf() prior: AuthService,
        private http: HttpClient,
        private endpointService: EndpointService,
        private exceptionService: ExceptionService,
        private appStorage: AppStorage,
        private router: Router
    ) {
        if (prior) { return prior; }
    }

    signup(request: ILoginRequest): Observable<any> {
        //add loading service and start
        const url = this.endpointService.get('SIGNUP').url;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const body = JSON.stringify(request);
        const response = this.http.post(`${url}`, body, { headers }).pipe(map((res) => {
            const resp = this.extractData(res);
            return resp;
        }))
            .pipe(catchError(this.exceptionService.catchBadResponse));
        return response;
    }

    login(request: ILoginRequest): Observable<any> {
        //add loading service and start
        const url = this.endpointService.get('LOGIN').url;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const body = JSON.stringify(request);
        const response = this.http.post(`${url}`, body, { headers }).pipe(map((res) => {
            const resp = this.extractData(res);
            this.saveTokenOnSuccessLogin(resp);
            //add loading service and hide
            return resp;
        })).pipe(catchError(this.exceptionService.catchBadResponse));
        return response;
    }


    public saveTokenOnSuccessLogin(response) {
        if (response) {
            // tslint:disable-next-line:no-string-literal
            const token = response['data'].tokenDetails['accessToken'];
            const refreshToken = response['data'].tokenDetails['refreshToken'];
            this.LoggedInUserSubject.next(response['data']);
            this.appStorage.save('auth_token', token);
            this.appStorage.save('refresh_token', refreshToken);
        }
    }

    private extractData(res) {
        if (res.statusCode < 200 || res.statusCode >= 300) {
            throw new Error('Bad response statusCode: ' + res.statusCode);
        }
        const body = res ? res : null;
        return body || {};
    }

}
