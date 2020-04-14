import { Component, OnInit, Input } from '@angular/core';
import { Assignment } from '../../models/assignment.model';
import { Image } from '../../models/image.model';

import {Location, Appearance } from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;

@Component({
  selector: 'app-show-locations',
  templateUrl: './show-locations.component.html',
  styleUrls: ['./show-locations.component.css']
})
export class ShowLocationsComponent implements OnInit {

  @Input() assignment: Assignment;
  @Input() image: Image;

  appearance = Appearance;

  zoom: number = 14;
  
  constructor() { }

  ngOnInit(): void {
  }

}

