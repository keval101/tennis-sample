import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'matchstat';

  onActivate(event: any) {
    document.body.scrollTop = 0;
  }

}
