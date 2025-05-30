import { Component } from '@angular/core';

@Component({
  selector: 'cms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedFeature: string = 'documents';

  onNavigate(feature: string) {
    this.selectedFeature = feature;
  }
}
