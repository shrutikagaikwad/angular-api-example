import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

/**
 * @interface IApiEndpoint
 * @description Interface to provide fixed structure
 */
export interface IApiEndpoint {
  name: string;
  method?: string;
  url: string;
  restfull?: boolean;
}

/**
 *  @enum ApiEndpointType
 *  @description Http methods enum
 */
export enum ApiEndpointType {
  GET,
  PUT,
  POST,
  DELETE
}

/**
 * @class EndpointService
 * @description Service provider for getting api urls and methods for api calling
 */
@Injectable({
  providedIn: "root"
})
export class EndpointService {
  private readonly baseUrl: string = environment.baseUrl;

  private endpoints: Array<IApiEndpoint> = [];

  constructor() {
    this.init();
  }

  /**
   * @function get
   * @description returns end point for given api name
   * @param- name
   */
  get(name: string): IApiEndpoint {
    const requiredEndpoint = this.endpoints.find(
      endpoint => endpoint.name === name
    );

    if (requiredEndpoint) {
      // check if endpoint url has the baseUrl already.
      if (requiredEndpoint && requiredEndpoint.url.indexOf(this.baseUrl) !== 0) {
        requiredEndpoint.url = this.baseUrl + requiredEndpoint.url;
      }
    }

    return requiredEndpoint;
  }

  /**
   * @function init
   * @description Initialize endpoints array
   */
  private init() {
    this.endpoints = [
      { name: "LOGIN", url: "users/login", method: "POST"},
      { name: "SIGNUP", url: "users/signup", method: "POST"},
      { name: "USERS", url: "users", method: "GET"},
      { name: "USERS_BY_ID", url: "user", method: "GET"}
    ];
  }
}
