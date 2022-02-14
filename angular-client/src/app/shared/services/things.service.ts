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
export class ThingsService {

  constructor(
    private apiService: ApiService,
    private http: HttpClient
  ) { }

  thingList: Thing[] = [];
  rowsAmount: number = 0;
  thingImages: string[] = [];

  update(thing): Observable<Thing> {

    return this.apiService
      .put('/thing', { thing })
      .map(data => {
        return data.thing;
      });
  }

  updateThingList(things: Thing[]): Observable<boolean> {

    var thingsToAdd = [];

    for (var thingsIndex in this.thingList) {

      this.thingList[thingsIndex]["status"] = "old";
    }

    if (things.length == 0) {

      return Observable.of(false);
    }

    for (var newThingsIndex in things) {

      var found = false;

      for (var thingsIndex in this.thingList) {

        if (this.thingList[thingsIndex]["id"] == things[newThingsIndex]["id"]) {

          found = true;
          var newFacts = things[newThingsIndex]["facts"];
          if (newFacts) {

            for (var factIndex in newFacts) {

              if (this.thingList[thingsIndex]["facts"]
                .indexOf(newFacts[factIndex]) == -1) {

                this.thingList[thingsIndex]["facts"]
                  .push(newFacts[factIndex]);

                console.log("Fact " + newFacts[factIndex]["name"] + " added to thing " +
                                this.thingList[thingsIndex]["screen_name"]);
              }
            }
          }

          break;
        }
      }
      if (!found) {

        things[newThingsIndex]["status"] = "new";

        var thingId = things[newThingsIndex]["id"];

        thingsToAdd.push(things[newThingsIndex]);
        console.log("New thing " + things[newThingsIndex]["screen_name"])
      }
    }

    this.thingList = this.thingList.concat(thingsToAdd);
    this.rowsAmount += Math
      .ceil(thingsToAdd.length / 4);

    return Observable.of(true);
  }

  index(thing: Thing) {

    console.log("Indexing a new thing");
    console.log(thing);

    return this.apiService.post('/things/index', thing);
  }

  loadThings() {

    // TODO
    console.log("Loading things");

    return this.apiService.get('/things/load?ids=');
  }

  getThings(): Observable<Thing[]> {

    const serviceUrl = 'TODO';

    return null;
  }

  urlExists(url: string) {

		return this.apiService.get('/utilities/url-exists?url=' + url)
					 .map(data => data);
	}

  getThingsMatching(fact: Fact): Observable<Thing[]> {

    console.log("Getting things matching with fact " + fact.username);

    return this.apiService
      .get('/things/matching?name=' + fact.username + '&query=' + fact.description);
  }
}
