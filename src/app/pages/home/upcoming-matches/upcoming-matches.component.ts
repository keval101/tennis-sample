import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {UpcomingMatchesService} from "../../../shared/services/upcoming-matches.service";
import {UpcomingInterface} from "../../../shared/interfaces/upcoming";
import {Router} from "@angular/router";

@Component({
  selector: 'app-upcoming-matches',
  templateUrl: './upcoming-matches.component.html',
  styleUrls: ['./upcoming-matches.component.scss'],
})
export class UpcomingMatchesComponent implements OnInit {
  public limit = 10;
  public groupByTournament!: any[];
  public nextPageData : boolean = false;

  @Output() dataEmit = new EventEmitter();
  @Input() viewbtn: boolean = false;

  constructor(
    private readonly upcomingMatchesService: UpcomingMatchesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initialize();
  }

  public initialize() {
    const date = new Date().toISOString();
    this.upcomingMatchesService
      .getUpcomingMatches(this.limit, date)
      .subscribe((res) => {
        this.groupByTournament = this.mapMatchesToGroups(res.matches);
        this.dataEmit.emit(this.groupByTournament);
      });
  }

  public nextPage() {
    const date =
      this.groupByTournament[this.groupByTournament.length - 1].matchPlayed.date;
    
    this.upcomingMatchesService
      .getUpcomingMatches(this.limit, date)
      .subscribe((res) => {
        const data = this.mapMatchesToGroups(res.matches);
        this.nextPageData = res.matches.length < 10;
        this.groupByTournament.push(...data);
      });
      
  }

  public navigateToTournament(name: string, year: string, type: string): void {
    this.router.navigate([
       
      'draw-results',
      type,
      name,
      new Date(year).getFullYear(),
    ]);
  }

  public allUpcoming(): void {
    this.router.navigate(['/upcoming-todays-tennis-matches']);
  }

  public navigateToH2h(player1: string | any, player2: string | any, type: string): void {
    if (player1 != 'Unknown Player' && player2 != 'Unknown Player') {
        this.router.navigate([
        'head-to-head/' +
          `${type == 'atp' ? 'men' : 'women'}` +
          '/' +
          player1.replaceAll(' ', '_') +
          '/' +
          player2.replaceAll(' ', '_') +
          '/.',
      ]);
      window.scroll({ top: 0, behavior: 'smooth' });
    }
  }

  private mapMatchesToGroups(matches: UpcomingInterface[]) {
    let drawGroups: string[] = [
      ...new Set(matches.map((v) => v.tournament.name)),
    ];
    let groups = [];
    for (let drawGroup of drawGroups) {
      groups.push({
        group: drawGroup,
        match: matches
          .filter((v) => v.tournament.name == drawGroup)
          .map((v) => ({ matchPlayed: v })),
      });
    }
    let draws = [];
    for (let group of groups) {
      draws.push({
        group: group.group,
        type: group.match[0].matchPlayed?.type,
        date: group.match[0].matchPlayed?.date,
        logo_path: group?.match[0]?.matchPlayed?.tournament.court.name,
      });
      draws.push(...group.match);
    }

    return draws;
  }
}
