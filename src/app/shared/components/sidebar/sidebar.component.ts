import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LiveEventInterface } from 'src/app/shared/interfaces/live-event';
import { RankingInterface } from 'src/app/shared/interfaces/ranking';
import { AtpRankingService } from 'src/app/shared/services/atp-ranking.service';
import { LiveEventsService } from '../../services/live-events.service';
import {
  InterestingH2hInterface,
  InterestingH2hService,
} from '../../services/interesting-h2h.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  atpRankings: RankingInterface[] = [];
  liveEvents: LiveEventInterface[] = [];
  interestingH2h: InterestingH2hInterface[] = [];
  tab: string = 'atp';
  @Input() showAtpRanking: boolean = true;
  @Input() showLiveEvents: boolean = true;
  @Input() showInterestingH2h: boolean = true;
  @Input()
  set activeType(tab: string) {
    this.tab = tab;
    this.getRanking(tab);
    this.getEvents(tab);
    this.getInterestingH2h(tab);
  }
  get activeType(): string {
    return this.tab;
  }
  constructor(
    private atpRankingService: AtpRankingService,
    private liveEventsService: LiveEventsService,
    private interestingH2hService: InterestingH2hService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getRanking(this.activeType);
    this.getEvents(this.activeType);
    this.getInterestingH2h(this.activeType);
  }

  getRanking(tab: string) {
    this.atpRankingService.getAtpRankingTop(tab).subscribe((v) => {
      this.atpRankings = v;
    });
  }

  getEvents(tab: string) {
    this.liveEventsService
      .getLiveEvents(tab)
      .subscribe((v) => (this.liveEvents = v));
  }

  getInterestingH2h(tab: string) {
    this.interestingH2hService.getInterestingH2h(tab).subscribe((v) => {
      this.interestingH2h = v;
    });
  }

  navigateToProfile(name: string = '') {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() =>
        this.router.navigate([  'stats-ranking-titles-profile', name])
      );
  }

    navigateToTournament(name: string, date: string) {
        this.router.navigate([
           
          'draw-results',
          `${this.activeType}`,
          name,
          new Date(date).getFullYear(),
        ]);
        window.scroll({top: 0, behavior: 'smooth'})
    }

  navigateToH2h(name: string | any, name2: string | any) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() =>
        
        this.router.navigate([
        'head-to-head/' +
          `${this.activeType == 'atp' ? 'men' : 'women'}` +
          '/' +
          name.replaceAll(' ', '_') +
          '/' +
          name2.replaceAll(' ', '_') +
          '/.',
      ])
      );
  }
}
