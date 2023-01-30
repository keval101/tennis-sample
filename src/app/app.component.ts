import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'matchstat';

  scroll(): void {
    window.scrollTo(0,0)
    document.body.scrollTop = 0;
  }
}
