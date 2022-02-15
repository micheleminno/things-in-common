import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Fact, Language } from '../shared/models';
import { FactsService } from '../shared/services';

@Component({
  selector: 'facts-page',
  templateUrl: './facts.component.html'
})
export class FactsComponent implements OnInit {

  factList: Fact[] = [];
  fact: Fact = new Fact('', '');
  newFactForm: FormGroup;
  errors: Object = {};
  isSubmitting = false;


  constructor(
    private router: Router,
    private factsService: FactsService,
    private fb: FormBuilder
  ) {

    this.newFactForm = this.fb.group({
      name: '',
      date: '',
      description: ''
    });
    // Optional: subscribe to changes on the form
    // this.factsForm.valueChanges.subscribe(values => this.updateFact(values));
  }

  insertedFactUsername: string;
  insertedFactDate: string;
  insertedFactDescription: string;


  ngOnInit() {

    this.insertedFactUsername = 'fact username';
    this.insertedFactDate = 'fact date';
    this.insertedFactDescription = 'fact description';

    this.showFacts();
  }

  showFacts() {

    this.factsService
      .loadFacts()
      .subscribe(
      facts => {

        console.log("Retrieved " + facts.length + " facts");
        console.log(facts);

        this.factList = [... this.factList.concat(facts)];

      });
  }

  addFact() {

    //TODO: this.factActive = true
    this.isSubmitting = true;

    this.createNewFact(this.newFactForm.value);

    this.factsService
      .add(this.fact)
      .subscribe(
      updatedFact => {
        if(updatedFact) {
            this.factList.push(this.fact);
        }
      },
      err => {
        this.errors = err;
        this.isSubmitting = false;
      }
      );
  }

  createNewFact(values: Object) {

    (<any>Object).assign(this.fact, values);
  }

  goToThingsPage() {

    this.router.navigateByUrl('');
  }
}
