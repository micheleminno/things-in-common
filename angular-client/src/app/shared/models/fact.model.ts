import { Language } from './language.model';

export class Fact {
  constructor(

    username: string,
    description: string
  ) {}

  username: string;
  date: string;
  description: string;
  language: Language;
}
