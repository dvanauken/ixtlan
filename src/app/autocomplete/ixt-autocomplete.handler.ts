// src/app/autocomplete/ixt-autocomplete.handler.ts
import { Injectable } from '@angular/core';
import { AutocompleteOption } from '../../components/ixt-auto-complete/ixt-auto-complete.component';

@Injectable()
export class IxtAutocompleteHandler {
   onValueChange(selected: AutocompleteOption) {
       console.log('Selected projection:', selected);
   }
}