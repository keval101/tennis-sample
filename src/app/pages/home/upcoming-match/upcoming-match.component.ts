import { Component, OnInit } from '@angular/core';
import {UpcomingMatchesService} from "../../../shared/services/upcoming-matches.service";
import {forkJoin, Observable} from "rxjs";
import {ProfileStatisticInterface} from "../../profile/interfaces/profile";
import {H2HService} from "../../h2h/h2h.service";
import {ProfileService} from "../../profile/services/profile.service";
import {Router} from "@angular/router";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-upcoming-match',
  templateUrl: './upcoming-match.component.html',
  styleUrls: ['./upcoming-match.component.scss']
})
export class UpcomingMatchComponent implements OnInit {

  public profiles!: any;
  public statistics1?: ProfileStatisticInterface;
  public statistics2?: ProfileStatisticInterface;
  public limit: number = 1;
  public offset: number = 1;
  public type?: string;

  constructor(private readonly upcomingMatchservice: UpcomingMatchesService,
              private readonly h2hService: H2HService,
              private readonly profileService: ProfileService,
              private router: Router) { }

  ngOnInit(): void {
    this.upcomingMatchservice.getUpcomingMatches(this.limit, this.offset)
        .pipe(
            switchMap((res) => {
              this.type = res.matches[0].type;
              return this.h2hService.getProfilesData(res.matches[0]?.type, res.matches[0].player1.name, res.matches[0].player2.name)
            })
        )
        .subscribe(res => {
          this.profiles = res;
          if(res?.matches && res?.matches[0]?.player1?.name && res?.matches[0]?.player2?.name) {
            this.getProfileInformation(res?.matches[0]?.player1?.name, res?.matches[0]?.player2?.name);
          }
        });
  }

  getProfileInformation(player1: string, player2: string): void {
    forkJoin({
      statistics1: this.profileService.getStatistics(player1),
      statistics2: this.profileService.getStatistics(player2),
    }).subscribe(({statistics1, statistics2}) => {
      this.statistics1 = statistics1;
      this.statistics2 = statistics2;
    })
  }

  navigateToH2h(player1: string | any, player2: string | any): void {
    if (player1 != 'Unknown Player' && player2 != 'Unknown Player') {
      this.router.navigate([
        'head-to-head/' +
          `${this.type == 'atp' ? 'men' : 'women'}` +
          '/' +
          player1.replaceAll(' ', '_') +
          '/' +
          player2.replaceAll(' ', '_') +
          '/.',
      ]);
      window.scroll({top: 0, behavior: 'smooth'})
    }
  }

}
