import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { AppStorage } from "./../authentication/app-storage.service";

@Injectable({
  providedIn: "root"
})
export class ExceptionService {

  errorMessage = [
    'This link is expired',
    'Token is expired'
  ]
  errorStatusCode = [
    406,
    409
  ]


  constructor(
    private router: Router,
    private appStorage: AppStorage
  ) { }

  log(error: string): void {
    console.log(error);
  }

  /**
   * @method catchBadResponse
   * @param- error
   * @description logs the error to the console.
   */
  catchBadResponse: (errorResponse: any) => Observable<any> = (
    errorResponse: any
  ) => {
    // add your custome loading service
    this.handleStatusCode(errorResponse.status);
    let err: string = errorResponse.error['details']?.length > 0 ? errorResponse.error['details'] : null;
    this.log(errorResponse)

    if (this.errorMessage && this.errorMessage.findIndex(msg => msg == err) !== -1) {
      let serverError: string = errorResponse.error['message']
        ?
        errorResponse.error['message']
        :
        errorResponse.status === 0
          ?
          'No Internet connection'
          :
          errorResponse.message;

      // TODO:: add dialog or toaster service for shows the error. 
      console.log(serverError)
    } else if (err && (this.errorStatusCode.findIndex(msg => msg == errorResponse.error.statusCode) < 0)) {
      // TODO:: add dialog or toaster service for shows the error. 
      console.log(err[0])
    }

    return throwError(errorResponse);
  };

  /**
   *
   * @param- statusCode
   */
  private handleStatusCode(statusCode: number): void {
    switch (statusCode) {
      case 401:
        this.appStorage.clear();
        this.router.navigate(["auth"]);
        break;
    }
  }
}
