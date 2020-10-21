import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-no-content',
  templateUrl: './no-content.component.html',
  styleUrls: ['./no-content.component.css']
})
export class NoContentComponent implements OnInit {
  
  @Input() title: string;
  @Input() comment: string;
  @Input() addUrl: string;
  @Input() buttonText: string;
  @Input() imageURL: string;
  @Input() videoURL: string;
  @Input() videoPoster: string;
  @Input() videoTitle: string;
  constructor() { }

  ngOnInit() {
  }

}
