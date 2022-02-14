import { Fact } from './fact.model';

export class Thing {

  constructor(
    id: string,
    name: string
  ) { }

  id: string;
  name: string;
  description: string;
  facts: Fact[];
}
