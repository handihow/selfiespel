import { Component, OnInit, Input } from '@angular/core';
import { Assignment } from '../../models/assignment.model';
import { Image } from '../../models/image.model';

import {Location, Appearance } from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;
import { getDistance } from 'geolib';

@Component({
  selector: 'app-show-locations',
  templateUrl: './show-locations.component.html',
  styleUrls: ['./show-locations.component.css']
})
export class ShowLocationsComponent implements OnInit {

  @Input() assignment: Assignment;
  @Input() image: Image;

  appearance = Appearance;
  distance: number;

  zoom: number = 14;
  
  constructor() { }

  ngOnInit(): void {
    if(this.assignment && this.image && this.assignment.hasGooglePlacesLocation && this.image.hasLocation){
      this.distance = getDistance(
          { latitude: this.assignment.latitude, longitude: this.assignment.longitude },
          { latitude: this.image.latitude, longitude: this.image.longitude }
      );
    } else {
      this.distance = 0;
    }
  }

}

