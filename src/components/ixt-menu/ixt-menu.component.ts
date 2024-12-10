import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseThemeColors } from '../theme/theme.colors';
import { ThemeVariant, ThemeColors } from '../theme/theme.types';

interface MenuItem {
  name: string;
  link: string;
}

interface MenuConfig {
  items: MenuItem[];
}

@Component({
  selector: 'ixt-menu',
  templateUrl: './ixt-menu.component.html',
  styleUrls: ['./ixt-menu.component.scss']
})
export class IxtMenuComponent implements OnInit {
  @Input() linkAlignment: string = 'start';
  @Input() src: string = '';
  @Input() brandName: string = '';
  @Input() brandLogo?: string;
  @Input() brandLink: string = '/';
  @Input() showSearch: boolean = false;
  @Input() searchPlaceholder: string = 'Search...';
  
  // Theme inputs
  @Input() variant: ThemeVariant = 'primary';
  @Input() theme: ThemeColors = baseThemeColors;
  
  @Output() searchSubmitted = new EventEmitter<string>();

  menuItems: MenuItem[] = [];
  searchTerm: string = '';

  get themeStyles() {
    const colors = this.theme[this.variant];
    return {
      'background-color': colors.base,
      'color': colors.text,
      '--theme-hover': colors.hover,
      '--theme-active': colors.active
    };
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    if (this.src) {
      this.loadMenu();
    }
  }

  loadMenu() {
    this.http.get<MenuConfig>(this.src).subscribe({
      next: (data) => {
        this.menuItems = data.items;
      },
      error: (error) => {
        console.error('Error loading menu:', error);
      }
    });
  }

  onSearch(event: Event) {
    event.preventDefault();
    if (this.searchTerm.trim()) {
      this.searchSubmitted.emit(this.searchTerm);
    }
  }
}