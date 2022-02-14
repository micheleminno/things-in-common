import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Thing, Fact } from '../shared/models';
import { ThingsService, FactsService } from '../shared/services';


@Component({
  selector: 'things-page',
  templateUrl: './things.component.html'
})
export class ThingsComponent implements OnInit {

  constructor(
    private router: Router,
    private thingsService: ThingsService,
    private factsService: FactsService
  ) { }

  thingList: Thing[] = [];
  thing: Thing = new Thing('0', '');
  facts: Fact[] = [];
  status: Status = new Status();
  rowsAmount: number;
  loading: boolean;

  searchKeywords: string;

  insertedFilterKeywords: string;
  filterKeywords: string;

  ngOnInit() {

    this.insertedFilterKeywords = 'i.e. music*';
    this.showThings();
  }

  showThings() {

    this.loading = true;
    this.status.active = ModeLabels.TARGET_SEARCH;

    this.thingsService
      .getThings()
      .subscribe(
      targetUserIds => {

        console.log("Retrieved " + targetUserIds.length + " target thing ids");

        if (targetUserIds.length == 0) {

          this.thingList = [];
          this.loading = false;

        } else {

          this.thingsService
            .loadThings()
            .subscribe(
            targetUsers => {

              console.log("Loaded " + targetUsers.length + " things");

              for (var targetIndex in targetUsers) {

                targetUsers[targetIndex]["inTarget"] = true;
              }

              this.factsService
                .getThings(targetUsers)
                .subscribe(
                users => {

                  console.log("Loaded facts of " + users.length + " things");

                  this.thingsService
                    .updateThingList(users);

                  this.loading = false;

                  var requests = 0;

                  users.forEach((user, index) => {

                    requests++;
                    this.thingsService
                      .index(user)
                      .subscribe(
                      users => {

                        requests--;
                        if (requests == 0) {

                          console.log("All things indexed");
                          this.assignFacts(users);
                        }
                      });
                  });
                });
            });
        }
      });
  };

  search(searchKeywords: string) {

    //this.isSubmitting = true;
    console.log("Search things by keywords '" + searchKeywords + "'");

    this.status.active = ModeLabels.KEYWORDS_SEARCH;

    var actualItems = this.status.keywordsSearchResult.items;
    var actualPages = actualItems / 20;
    var nextPage = actualPages + 1;

    this.factsService
      .searchFacts(searchKeywords, nextPage).subscribe(
      facts => {

        //this.isSubmitting = false;
        //this.onToggle.emit(false);

        console.log("Found " + facts.length + " facts");

        this.status.keywordsSearchResult.items = actualItems
          + facts.length;

        // TODO

      });
  };

  canShowThing(index, parentIndex) {

    var inCurrentRow = (index) / 4 < parentIndex + 1
      && (index) / 4 >= parentIndex;

    return inCurrentRow;
  };

  assignFacts(things: Thing[]) {

    for (let thingIndex in things) {

      things[thingIndex].facts = [];
    }

    if (this.facts.length == 0) {

      this.loading = false;

    } else {

      var requests = 0;

      this.facts
        .forEach((fact, index) => {

          requests++;

          this.thingsService
            .getThingsMatching(
            fact)
            .subscribe(matchingThings => {

              requests--;
              if (requests == 0) {

                this.loading = false;
              }

              var matchingThingsIds = [];
              for (let matchingThing of matchingThings) {

                matchingThingsIds
                  .push(parseInt(matchingThing.id));
              }

              things
                .forEach(function(
                  thing) {

                  if (matchingThingsIds
                    .indexOf(thing.id) > -1) {

                    thing.facts
                      .push(fact);

                    console.log("Fact '" + fact.username + "' added to thing '" + thing.name + "'");
                  }
                });
            });
        });
    }
  };

  goToFactsPage() {

    this.router.navigateByUrl('/facts');
  }
}

const enum ModeLabels {

  TARGET_SEARCH, // 0
  KEYWORDS_SEARCH, // 1
  SCREENNAME_SEARCH, // 2
  INTERESTS_SEARCH,  // 3
  ALGORITHM_SEARCH // 4
}

export class Mode {

  constructor(active?: boolean, items?: number) {

    this.active = active || false;
    this.items = items || 0;
  }

  active: boolean;
  items: number;
}

export class Status {

  constructor(

    active?: ModeLabels,

    targetSearchResult?: Mode,
    keywordsSearchResult?: Mode,
    screennameSearchResult?: Mode,
    factSearchResult?: Mode,
    algorithmSearchResult?: Mode
  ) {

    this.active = active || undefined;
    this.targetSearchResult = targetSearchResult || new Mode();
    this.keywordsSearchResult = keywordsSearchResult || new Mode();
    this.screennameSearchResult = screennameSearchResult || new Mode();
    this.factSearchResult = factSearchResult || new Mode();
    this.algorithmSearchResult = algorithmSearchResult || new Mode();
  }

  active: ModeLabels;
  targetSearchResult: Mode;
  keywordsSearchResult: Mode;
  screennameSearchResult: Mode;
  factSearchResult: Mode;
  algorithmSearchResult: Mode;
}
