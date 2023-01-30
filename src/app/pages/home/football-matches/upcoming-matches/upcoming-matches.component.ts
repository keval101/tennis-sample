import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { LoaderState } from 'src/app/shared/interfaces/team-profile.interface';
import { Upcoming } from 'src/app/shared/interfaces/upcoming-match.interface';
import { UpcomingMatchesService } from 'src/app/shared/services/upcoming-matches.service';

enum daysEnum {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
    SIX=6
}

@Component({
  selector: 'app-upcoming-matches',
  templateUrl: './upcoming-matches.component.html',
  styleUrls: ['./upcoming-matches.component.scss'],
})
export class UpcomingMatchesComponent implements OnInit {
  public upcomings: Upcoming[] = [];
  public filteredUpcomings: Upcoming[] = [];
  public groupByLeagues: any;
  public selectedDays = daysEnum;

  public pages = 0;
  public count = 10;

  public date = new Date();
  public year = this.date.getFullYear();
  public month = this.date.getMonth() + 1;
  public day = this.date.getDate();
  public today = [this.year, this.month, this.day].join('-');
  public currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  public nextDay = this.currentDate.getDate();
  public nextMonth = this.currentDate.getMonth() + 1;
  public nextYear = this.currentDate.getFullYear();
  public nextDate = [this.nextYear, this.nextMonth, this.nextDay].join('-');
  public perPage = 10;
  public page = daysEnum.ONE;
  public show: boolean = false;

  public loaderState: LoaderState = {
    val: false,
  };
  public lastLength: number = 0;
  public firstDay!: Date;
  public secondDay!: Date;
  public thirthDay!: Date;
  public fourthDay!: Date;
  public tomorrow!: Date;
  public isActive = true;
  public selected = 1;

  constructor(
    private readonly upcomingMatchesService: UpcomingMatchesService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.tomorrow = new Date();
    this.tomorrow.setDate(new Date().getDate() + 1);

    this.firstDay = new Date();
    this.firstDay.setDate(new Date().getDate() + 2);

    this.secondDay = new Date();
    this.secondDay.setDate(new Date().getDate() + 3);

    this.thirthDay = new Date();
    this.thirthDay.setDate(new Date().getDate() + 4);

    this.fourthDay = new Date();
    this.fourthDay.setDate(new Date().getDate() + 5);

    this.initialize();
  }

  public get days() {
    const listDate = [];
    const startDate = this.today;
    let nextDate = this.addMonths(new Date(), 1)
      .toLocaleDateString('en-US')
      .split('/');
    const month = +nextDate[0] < 10 ? '0' + nextDate[0] : nextDate[0];
    const endDate = nextDate[2] + '-' + month + '-' + nextDate[1];
    const dateMove = new Date(startDate);
    let strDate = startDate;

    while (strDate < endDate) {
      strDate = dateMove.toISOString().slice(0, 10);
      listDate.push(strDate);
      dateMove.setDate(dateMove.getDate() + 1);
    }

    return listDate;
  }

  public selectDate(event: string) {
    this.getUpcomingMatches(event, event);
  }

  private getUpcomingMatches(dateFrom: string, dateTo: string) {
    this.upcomingMatchesService
      .getFootballUpcomingMatches(this.page, this.perPage, dateFrom, dateTo)
      .subscribe((res: any) => {
        this.lastLength = res.length;
        this.upcomings = res;
        this.groupByLeagues = this.mapMatchesToGroups(this.upcomings);
      });
  }

  public addMonths(date: Date, months: number) {
    const d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }

  public activateClass(date: Date, selectedDay: number): void {
    const selectedDate = date.toLocaleDateString('en-US');
    const data = selectedDate.replace(/\//g, '-').split('-');
    const dataFormat = data[2] + '-' + data[0] + '-' + data[1];
    this.today = dataFormat;
    this.nextDate = dataFormat;
    this.selected = selectedDay;
    this.page = 1;
    this.getUpcomingMatches(this.today, this.nextDate);
  }

  more() {
    this.loaderState = {
      val: false,
    };
    this.page++;
    this.upcomingMatchesService
      .getFootballUpcomingMatches(
        this.page,
        this.perPage,
        this.today,
        this.nextDate
      )
      .subscribe((res: any) => {
        this.lastLength = res.length;
        this.upcomings = this.upcomings.concat(res);
        this.groupByLeagues = this.mapMatchesToGroups(this.upcomings);
        this.loaderState = {
          val: false,
        };
      });
  }

  navigateToTeamPage(teamName: string): void {
    window.location.href = `/football/team/${teamName}`;
  }

  navigateToH2h(firstTeamId: number, secondTeamId: number, firstTeamName: string, secondTeamName: string): void {
     window.location.href = `/football/h2h-odds-prediction/${firstTeamId}/${secondTeamId}/${firstTeamName}/${secondTeamName}`;
  }

  navigateToLeague(leagueName: string): void {
    window.location.href = `/football/league/${leagueName}`;
  }

  navigateToMatches(): void {
    window.location.href = `/football/football-upcoming-football-soccer-matches`;
    
  }

  public initialize() {
    this.getUpcomingMatches(this.today, this.nextDate);
  }

  private mapMatchesToGroups(matches: Upcoming[]) {
    matches = matches.map((match) => ({
      ...match,
      league: {
        ...match.league,
      },
    }));
    let drawGroups: string[] = [...new Set(matches.map((v) => v.league.name))];
    let groups = [];
    for (let drawGroup of drawGroups) {
      groups.push({
        group: drawGroup,
        match: matches
          .filter((v) => v.league.name == drawGroup)
          .map((v) => ({ matchPlayed: v })),
      });
    }
    let draws = [];
    for (let group of groups) {
      draws.push({
        group: group.group,
        logo_path: group?.match[0]?.matchPlayed?.league.logo_path,
      });
      draws.push(...group.match);
    }
    return draws;
  }
}
