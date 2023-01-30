import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { UpcomingInterface } from 'src/app/shared/interfaces/upcoming';
import { MetaTagsService } from 'src/app/shared/services/meta-tags.service';
import { UpcomingMatchesService } from 'src/app/shared/services/upcoming-matches.service';
import { H2HService } from '../h2h/h2h.service';
import { ProfileStatisticInterface } from '../profile/interfaces/profile';
import { ProfileService } from '../profile/services/profile.service';

interface IUpcomingMatch {
  player1: { name: string; countryAcr: string };
  player2: { name: string; countryAcr: string };
}
@Component({
  selector: 'app-h2h-list',
  templateUrl: './h2h-list.component.html',
  styleUrls: ['./h2h-list.component.scss'],
})
export class H2hListComponent implements OnInit {
  public limit = 10;
  public offset = 1;
  public groupByTournament!: any[];
  public profiles$!: Observable<any>;
  statistics1?: ProfileStatisticInterface;
  statistics2?: ProfileStatisticInterface;

  PlOneStat: any;
  PlTwoStat: any;
  filtersFormGroup = new FormGroup({});
  headers: any;
  playerEventStats: any;
  career: string = 'YTD W/L';
  court: string = '';
  round: string = '';
  tournament: string = '';
  careerData: any;

  public playerOne!: string | any;
  public playerTwo!: string | any;
  public type: string = '';
  constructor(
    private readonly upcomingMatchesService: UpcomingMatchesService,
    private metaTagService: MetaTagsService,
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private h2hService: H2HService
  ) {}

  ngOnInit(): void {
    this.initialize();
    const metaObject = {
      title: `Tennis Head To Head Search | ATP & WTA Tennis H2H Search`,
      description: `Search head to head stats between any tennis player. Detailed H2H analysis of results and match stats of WTA and ATP players.`,
      keywords: `Tennis Head To Head Search, Tennis`,
    };

    this.metaTagService.updateTheMetaTags(metaObject);
  }
  getProfileInformation(name1: string, name2: string) {
    this.profileService.getStatistics(name1).subscribe((res) => {
      this.statistics1 = res;
    });

    this.profileService.getStatistics(name2).subscribe((res) => {
      this.statistics2 = res;
    });
  }
  navigateToH2h() {
    window.location.href = `/head-to-head/${
      this.type == 'atp' ? 'men' : 'women'
    }/${this.playerOne.replaceAll(' ', '_')}/${this.playerTwo.replaceAll(' ', '_')}/`;
  }

  getUpcomingMatchedData(data: any): void {
    const match = data[0];
    this.statistics1 = undefined;
    this.statistics2 = undefined;
    this.type = match.type ?? 'atp';
    this.playerOne = match.player1.name;
    this.playerTwo = match.player2.name;
    this.getProfileInformation(match.player1.name, match.player2.name);

    this.profiles$ = this.h2hService.getProfilesData(
      this.type,
      this.playerOne,
      this.playerTwo
    );
    this.fetchH2hBreakdown(this.playerOne, this.playerTwo);
  }

  private fetchH2hBreakdown(playerOne: string, playerTwo: string) {
    const changes = {
      career: '',
      court: '',
      round: '',
      tournament: '',
    };

    forkJoin({
      firstPlayer: this.h2hService.getBreakDownStats(
        this.type,
        playerOne,
        changes
      ),
      secondPlayer: this.h2hService.getBreakDownStats(
        this.type,
        playerTwo,
        changes
      ),
    }).subscribe(({ firstPlayer, secondPlayer }) => {
      this.PlOneStat = firstPlayer;
      this.PlTwoStat = secondPlayer;

      if (this.PlOneStat && this.PlTwoStat) {
        this.headers = [
          { name: 'stats', value: 'Stats' },
          { name: 'firstPlayer', value: this.PlOneStat.name },
          { name: 'secondPlayer', value: this.PlTwoStat.name },
        ];
        let eventStats = [
          {
            stats: 'Hard',
            firstPlayer: `${this.PlOneStat.hard1}/${this.PlOneStat.hard2}`,
            secondPlayer: `${this.PlTwoStat.hard1}/${this.PlTwoStat.hard2}`,
          },
          {
            stats: 'Clay',
            firstPlayer: `${this.PlOneStat.clay1}/${this.PlOneStat.clay2}`,
            secondPlayer: `${this.PlTwoStat.clay1}/${this.PlTwoStat.clay2}`,
          },
          {
            stats: 'Indoor',
            firstPlayer: `${this.PlOneStat.iHard1}/${this.PlOneStat.iHard2}`,
            secondPlayer: `${this.PlTwoStat.iHard1}/${this.PlTwoStat.iHard2}`,
          },
          {
            stats: 'Grass',
            firstPlayer: `${this.PlOneStat.grass1}/${this.PlOneStat.grass2}`,
            secondPlayer: `${this.PlTwoStat.grass1}/${this.PlTwoStat.grass2}`,
          },
        ];

        if (this.court != '' || this.round != '' || this.tournament != '') {
          this.playerEventStats = eventStats.filter((el: any) => {
            return (
              el.stats != 'Hard' &&
              el.stats != 'Clay' &&
              el.stats != 'Grass' &&
              el.stats != 'Indoor'
            );
          });
        } else {
          this.playerEventStats = eventStats;
        }
        let customData = this.playerEventStats.reduce(function (
          acc: any,
          curr: any
        ) {
          acc[curr['stats']] = {
            firstPlayer: curr.firstPlayer,
            secondPlayer: curr.secondPlayer,
          };
          return acc;
        },
        {});
        this.careerData = customData;
      }
    });
  }

  public initialize() {
    const date = new Date().toISOString();
  }
}
