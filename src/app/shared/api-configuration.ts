/* tslint:disable */
import { Injectable } from '@angular/core';

/**
 * Global configuration for Api services
 */
@Injectable({
  providedIn: 'root',
})
export class ApiConfiguration {
  current: string = 'https://api.openweathermap.org/data/2.5/weather?q=';
  hourly: string = 'https://pro.openweathermap.org/data/2.5/forecast/hourly?q=';
  sixteenDays:string = 'https://api.openweathermap.org/data/2.5/forecast/daily?q='
}

export interface ApiConfigurationInterface {
  rootUrl?: string;
}