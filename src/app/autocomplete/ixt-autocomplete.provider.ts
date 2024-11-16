// src/app/autocomplete/ixt-autocomplete.provider.ts
import { Injectable } from '@angular/core';
import { AutocompleteOption } from '../../components/ixt-auto-complete/ixt-auto-complete.component';

@Injectable()
export class IxtAutocompleteProvider {
   projectionOptions: AutocompleteOption[] = [
       { value: "geoAlbers", label: "Albers" },
       { value: "geoAlbersUsa", label: "Albers USA" },
       { value: "geoAzimuthalEqualArea", label: "Azimuthal Equal Area" },
       { value: "geoAzimuthalEquidistant", label: "Azimuthal Equidistant" },
       { value: "geoConicConformal", label: "Conic Conformal" },
       { value: "geoConicEqualArea", label: "Conic Equal Area" },
       { value: "geoConicEquidistant", label: "Conic Equidistant" },
       { value: "geoMercator", label: "Mercator" },
       { value: "geoOrthographic", label: "Orthographic" }
   ];
}

