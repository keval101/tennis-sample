import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LiveEventsService } from 'src/app/shared/services/live-events.service';

@Component({
  selector: 'app-live-events',
  templateUrl: './live-events.component.html',
  styleUrls: ['./live-events.component.scss']
})
export class LiveEventsComponent implements OnInit {

  constructor(private readonly liveEvents: LiveEventsService, private readonly router: Router) { }
  atpLiveEvents: any = []
  wtaLiveEvents: any = []
  ngOnInit(): void {
    this.liveEvents.getLiveEventsHome('atp').subscribe(res => {
      this.atpLiveEvents = res
    })
    this.liveEvents.getLiveEventsHome('wta').subscribe(res => this.wtaLiveEvents = res)
  }

  allUpcoming(): void {
    this.router.navigate([ 'tennis-calendar', 'atp', new Date().getFullYear()])
  }

  navigateToTournament(type: string, name: string, year: string) {
     this.router.navigate([
       'draw-results',
       type,
       name,
       new Date(year).getFullYear(),
     ]);
  }
}
