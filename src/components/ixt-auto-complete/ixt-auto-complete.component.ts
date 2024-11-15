import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface AutocompleteOption {
  value: string;
  label: string;
}

@Component({
  selector: 'ixt-auto-complete',
  templateUrl: './ixt-auto-complete.component.html',
  styleUrls: ['./ixt-auto-complete.component.scss']
})
export class IxtAutoCompleteComponent implements OnInit {
  @Input() options: AutocompleteOption[] = [];
  @Input() placeholder = 'Search...';
  @Output() valueChange = new EventEmitter<AutocompleteOption>();

  inputControl = new FormControl('');
  filteredOptions: AutocompleteOption[] = [];
  showDropdown = false;

  ngOnInit() {
    this.inputControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.filterOptions(value || '');
    });
  }

  private filterOptions(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredOptions = this.options.filter(option =>
      option.label.toLowerCase().includes(filterValue)
    );
    this.showDropdown = true;
  }

  selectOption(option: AutocompleteOption) {
    this.inputControl.setValue(option.label);
    this.showDropdown = false;
    this.valueChange.emit(option);
  }

  onBlur() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }
}