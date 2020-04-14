import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Assignment } from '../../models/assignment.model';

import {Location, Appearance } from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.css']
})
export class SearchLocationComponent implements OnInit {

  @Input() assignment: Assignment;
  @Output() selectedLocation: EventEmitter<Location> = new EventEmitter();
  @Output() selectedPlaceResult: EventEmitter<PlaceResult> = new EventEmitter();

  appearance = Appearance;

  zoom: number = 12;
  latitude: number = 51.94696520000001;
  longitude: number = 4.4679567;
  selectedAddress: PlaceResult;

  constructor() { }

  ngOnInit(): void {
  	if(this.assignment && this.assignment.hasGooglePlacesLocation){
	    this.latitude = this.assignment.latitude;
	    this.longitude = this.assignment.longitude;
	} else {
		this.setCurrentPosition();
	}
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  onAutocompleteSelected(result: PlaceResult) {
    console.log('onAutocompleteSelected: ', result);
    this.selectedPlaceResult.emit(result);
  }

  onLocationSelected(location: Location) {
    console.log('onLocationSelected: ', location);
    this.selectedLocation.emit(location);
    this.latitude = location.latitude;
    this.longitude = location.longitude;
  }

}
