import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { MetaTagsService } from 'src/app/shared/services/meta-tags.service';
import { H2HService } from '../h2h/h2h.service';
import { ProfileStatisticInterface } from '../profile/interfaces/profile';
import { ProfileService } from '../profile/services/profile.service';

interface IUpcomingMatch {
  player1: { name: string; countryAcr: string };
  player2: { name: string; countryAcr: string };
}
@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss'],
})
export class MatchesComponent implements OnInit {
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

  @Input() isMatchesPage = true;

  @Input() playerOne!: string | any;
  @Input() playerTwo!: string | any;
  public type: string = '';
  careerData: any;
  constructor(
    private metaTagService: MetaTagsService,
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private h2hService: H2HService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.statistics1 = undefined;
      this.statistics2 = undefined;
      this.type = params['type'] || 'atp';
    });

    const metaObject = {
      title: `Todays Tennis Matches | ATP WTA ITF Upcoming Schedule`,
      description: `Full schedule of today's tennis matches and order of play, including detailed stats and predictions of all upcoming matches.`,
      keywords: `Todays Tennis Matches, Tennis`,
    };

    if(this.isMatchesPage) {
      this.metaTagService.updateTheMetaTags(metaObject);
    }
  }

  ngOnChanges(): void {
    if(this.playerOne && this.playerTwo) {
          this.getProfileInformation(this.playerOne, this.playerTwo);

          this.profiles$ = this.h2hService.getProfilesData(
            this.type,
            this.playerOne,
            this.playerTwo
          );

          this.fetchH2hBreakdown(this.playerOne, this.playerTwo);
    }
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
}
