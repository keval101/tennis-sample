import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  navigateToLinks(link: string): void {
    if (link === 'calendar') {
      this.router.navigate([
        'tennis-calendar',
        'atp',
        new Date().getFullYear(),
      ]);
    } else {
      this.router.navigate([link]);
    }
  }

  navigateToFootball(link: string): void {
    window.location.href = link;
  }
}
