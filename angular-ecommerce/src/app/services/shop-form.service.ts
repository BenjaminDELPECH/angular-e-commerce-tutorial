import {Injectable} from '@angular/core';
import {Observable, of, map} from "rxjs";
import {Country} from "../common/country";
import {HttpClient} from "@angular/common/http";
import {State} from "../common/state";

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  countriesUrl = 'http://localhost:8098/api/countries';
  statesUrl = 'http://localhost:8098/api/states';

  constructor(private httpClient: HttpClient) {
  }

  getCountries(): Observable<Country[]> {
    let data: Country[] = [];
    return this.httpClient.get<GetResponseCountry>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    )
  }

  getStateByCountryCode(theCountryCode : string): Observable<State[]> {
    const countryUrl :string = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient.get<GetResponseState>(this.statesUrl).pipe(
      map(response => response._embedded.states)
    );
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }
    return of(data);
  }
}


interface GetResponseCountry {
  _embedded: {
    countries: Country[]
  }
}

interface GetResponseState {
  _embedded: {
    states: State[]
  }
}
