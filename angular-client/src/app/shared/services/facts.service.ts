import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ApiService } from './api.service';
import { Thing, Fact } from '../models';


@Injectable()
export class FactsService {

  constructor(
    private apiService: ApiService,
    private http: HttpClient
  ) { }

  callService(serviceUrl: string): Observable<boolean> {

    console.log("Calling service: " + serviceUrl);

    return this.apiService.get(serviceUrl);
  }

  loadFacts(): Observable<Fact[]> {

    console.log("Loading all facts");

    const serviceUrl = '/facts';

    console.log("Calling service: " + serviceUrl);

    return this.apiService.get(serviceUrl)
      .map(resultData => {
        return resultData.facts;
      });
  }

  add(fact: Fact): Observable<boolean> {

    console.log("Fact to add:" + JSON.stringify(fact));

    const serviceUrl = '/facts/add?username=' + fact.username + '&date=' + fact.date +
                        '&description=' + fact.description;

    return this.callService(serviceUrl);
  }

  remove(factName: string): Observable<boolean> {

    const serviceUrl = '/fact/remove?name=' + factName;

    return this.callService(serviceUrl);
  }

  update(name: string, text: string): Observable<boolean> {

    const serviceUrl = '/fact/update?name=' + name + '&text=' + text;

    return this.callService(serviceUrl);
  }

  getThings(facts: Fact[]): Observable<Thing[]> {

    const serviceUrl = 'TODO';

    return null;
  }

  getFacts(thing: Thing): Observable<Fact[]> {

    const serviceUrl = 'TODO';

    return null;
  }

  searchFacts(keywords: string, cursor: number): Observable<Fact[]> {

    const serviceUrl = 'TODO';

    return null;
  }
}
