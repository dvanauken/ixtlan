// geo-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Feature, FeatureCollection } from 'geojson';

@Injectable()
export class GeoDataService {
  constructor(private http: HttpClient) {}

  loadGeoJSON(src: string): Observable<Feature[]> {
    if (!src) {
      return throwError(() => new Error('Source URL is required'));
    }

    // Handle both absolute and relative URLs
    const url = src.startsWith('http') || src.startsWith('//')
      ? src
      : `/assets/${src}`;

    return this.http.get<FeatureCollection>(url).pipe(
      map(response => {
        if (!response.features) {
          throw new Error('Invalid GeoJSON: missing features array');
        }
        return response.features;
      }),
      catchError(error => {
        console.error('Error loading GeoJSON:', error);
        return throwError(() => new Error(`Failed to load GeoJSON from ${url}: ${error.message}`));
      })
    );
  }
}

