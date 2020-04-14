import { Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import PlaceResult = google.maps.places.PlaceResult;
import { UIService } from '../../shared/ui.service';

import { Assignment } from '../../models/assignment.model';
import { AssignmentService } from '../assignment.service';

@Component({
  selector: 'app-choose-poi-modal',
  templateUrl: './choose-poi-modal.component.html',
  styleUrls: ['./choose-poi-modal.component.css']
})
export class ChoosePoiModalComponent implements OnInit {

  pointsOfInterest: PlaceResult[] = [];
  selectedPOIs : PlaceResult[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any,
				private dialogRef:MatDialogRef<ChoosePoiModalComponent>,
        private assignmentService: AssignmentService,
        private uiService: UIService) {}

  ngOnInit(): void {
  	this.pointsOfInterest = this.passedData.pointsOfInterest;
  }

  onSelect(){
    if(this.selectedPOIs.length === 0){
      this.uiService.showSnackbar('You must select at least one point of interest to create assignments', null, 3000);
      return;
    }
    const newAssignments = this.newPOIAssignments(this.selectedPOIs);
    this.assignmentService.addAssignments(this.passedData.gameId, newAssignments);
    this.dialogRef.close();
  }
            

  newPOIAssignments(placeResults: PlaceResult[]): Assignment[]{
    const assignments : Assignment[] = [];
    placeResults.forEach((poi, i) => {
      const assignment : Assignment = {
        assignment: poi.name,
        maxPoints: 3,
        order: i,
        theme: 'Point of Interest',
        isOutside: true,
        hasGooglePlacesLocation: true,
        latitude: this.getSafe(poi.geometry.location.lat()),
        longitude: this.getSafe(poi.geometry.location.lng()),
        formatted_address: this.getSafe(poi.formatted_address),
        name: this.getSafe(poi.name),
        photos: poi.photos && poi.photos.length > 0 ? poi.photos.map(p => {
          const height = p.height ? p.height : 300;
          const width = p.width ? p.width : 600;
          return {
            height: height,
            width: width,
            url: p.getUrl({maxHeight: height, maxWidth: width})
          }
        }) : [],
        place_id: this.getSafe(poi.place_id),
        rating: this.getSafe(poi.rating),
        reviews: this.getSafe(poi.reviews),
        types: this.getSafe(poi.types),
        url: this.getSafe(poi.url),
        user_ratings_total: this.getSafe(poi.user_ratings_total),
        vicinity: this.getSafe(poi.vicinity),
        website: this.getSafe(poi.website)
      }
      assignments.push(assignment);
    })
    return assignments;
  }

  private getSafe(input){
      if(!input){
        return null;
      } else {
        return input;
      }
    }

}

