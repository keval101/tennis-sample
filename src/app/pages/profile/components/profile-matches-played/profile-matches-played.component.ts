import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {repeat, skip, take} from "rxjs/operators";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import {ProfileService} from "src/app/pages/profile/services/profile.service";
import {DrawMatchInterface} from 'src/app/shared/interfaces/draw';
import {FilterInterface} from "src/app/shared/interfaces/filter";
import {
  GroupMatchesPlayedInterface,
} from "src/app/shared/interfaces/group-matches-played";
import {PlayerInterface} from "src/app/shared/interfaces/player";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-profile-matches-played',
  templateUrl: './profile-matches-played.component.html',
  styleUrls: ['./profile-matches-played.component.scss']
})
export class ProfileMatchesPlayedComponent implements OnInit, OnChanges {

  levelFilters: FilterInterface[] = [
    {name: 'All Levels', value: ''}
  ];

  surfaceFilters: FilterInterface[] = [
    {name: 'All Surfaces', value: ''}
  ];

  roundFilters: FilterInterface[] = [
    {name: 'All Rounds', value: ''}
  ];

  yearFilters: FilterInterface[] = [];

  currentPage: number = 1;
  matchesCount = 0;

  weekFilters: FilterInterface[] = [];

  matchGrouped: GroupMatchesPlayedInterface[] = [];

  filtersFormGroup = new FormGroup({});

  public profileName = '';

  public subs: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private router: Router,
    private datePipe: DatePipe,
  ) { }

  @Input() name?: string | null;
  @Input() limit: number = 20;
  @Input() type?: string | undefined;

  ngOnInit(): void {
    this.generateWeekFilter()
    this.activatedRoute.params.subscribe(params => {
        this.profileName = params['name']
        this.ngOnChanges()
      })
  }

  ngOnChanges() {
    if(this.name) {
      this.profileName = this.name;
    }
    this.getFilters(this.profileName);
  }

  public nextPage() {
    ++this.currentPage;
    this.profileService.getMatchesPlayed(this.profileName, this.filtersFormGroup.value, this.currentPage, this.limit).subscribe(matches => {
      this.matchGrouped.push(...this.mapMatchesToGroups(matches.singles))
      this.deleteDuplicateGroups()
    });
  }

  private mapMatchesToGroups(matches: DrawMatchInterface[]): GroupMatchesPlayedInterface[] {
    matches = matches.map(match => ({...match,
      tournament: {
        ...match.tournament,
        date: this.datePipe.transform(new Date(match.tournament.date!), 'dd MMM YY') || '',
      },
    }))
    let drawGroups: string[] = [
      ...new Set(
        matches.sort((a, b) => new Date(b.tournament.date!).getTime() - new Date(a.tournament.date!).getTime())
          .map(v => v.tournament.name + ' ' + v.tournament.date))]
    let groups = [];
    for (let drawGroup of drawGroups) {
      groups.push({group: drawGroup, match: matches.filter(v => v.tournament.name + ' ' + v.tournament.date == drawGroup).map(v => ({matchPlayed: v}))})
    }
    let draws = [];
    for (let group of groups) {
      draws.push({
      group: group.group,
      icon: group?.match[0]?.matchPlayed?.tournament?.court?.name,
      date: group?.match[0]?.matchPlayed?.tournament?.date,
      tourName: group.match[0].matchPlayed.tournament.name
      });
      draws.push(...group.match)
    }
    return draws;
  }

  private generateWeekFilter() {
    let week = 52
    this.weekFilters = []
    while (week > 0) {
      this.weekFilters.push({ name: `Week ${week}`, value: week--})
    }
  }

  private getFilters(profileName: string) {
    this.profileService.getProfileFilters(profileName).subscribe(filters => {
      this.levelFilters = [
        {name: 'All Levels', value: ''},
        ...filters.level
          .map(level => ({name: level.name, value: level.id}))
      ]
      const surfaceFiltersTemp: FilterInterface[] = [{name: 'All Surfaces', value: ''}]
      for (let court of filters.courts) {
        let courtValues = [court.name]
        if (court.id == 4 || court.id == 10 || court.id == 6) continue
        if (court.id == 3) {
          courtValues.push('Carpet');
          courtValues.push('Acrylic');
        }
        surfaceFiltersTemp.push({name: court.name, value: courtValues.join(',')})
      }
      this.surfaceFilters = surfaceFiltersTemp
      this.roundFilters = [
        {name: 'All Rounds', value: ''},
        ...filters.rounds
          .map(round => ({name: round.name, value: round.name}))
      ]
      this.yearFilters = filters.years.map(year => ({name: year, value: year}))

      this.filtersFormGroup = new FormGroup({
        level: new FormControl(this.levelFilters[0].value),
        court: new FormControl(this.surfaceFilters[0].value),
        round: new FormControl(this.roundFilters[0].value),
        year: new FormControl(this.yearFilters[0].value),
        week: new FormControl(this.weekFilters[0].value),
      })
      this.fetchH2hMatchesPlayed(this.filtersFormGroup.value)
        this.filtersFormGroup.valueChanges.subscribe(changes => {
          if (changes?.year) {
            this.resetPage()
            this.matchGrouped = []
            this.fetchH2hMatchesPlayed(changes);
          }
        })
    })
  }

  private fetchH2hMatchesPlayed(changes: any) {
    this.subs.unsubscribe();
    this.subs = new Subscription();
    this.subs.add(
      this.profileService.getMatchesPlayed(this.profileName, changes, this.currentPage, this.limit).subscribe(matches => {
        this.matchGrouped = this.mapMatchesToGroups(matches.singles)
        this.matchesCount = matches.singlesCount;
      })
    )
  }

  private deleteDuplicateGroups() {
    const names = new Set()
    for (let match of this.matchGrouped) {
      if (match?.group) {
        names.add(match.group)
      }
    }
    this.matchGrouped = this.matchGrouped.filter(match => {
      if (match?.group) {
        if (names.has(match?.group)) {
          names.delete(match?.group)
        } else {
          return false
        }
      }
      return true
    })
  }

  private resetPage() {
    this.currentPage = 1;
  }

  navigateToTournament(name: string, date: string) {
    const tournamentDate = new Date(date).getFullYear();
    return `/draw-results/${this.type}/${name}/${tournamentDate}`;
  }

  test() {
    return '/profile/shit'
  }

  public correctH2h(h2h: string, winner: PlayerInterface) {
    let playersH2h = h2h.split('-')
    if (winner.name != this.profileName) {
      playersH2h = playersH2h.reverse()
    }
    return playersH2h.join('-')
  }

  navigateToH2h(name: string | any, name2: string | any) {
    if (name != 'Unknown Player' && name2 != 'Unknown Player') {
      this.router.navigate([
        'head-to-head/' +
          `${this.type == 'atp' ? 'men' : 'women'}` +
          '/' +
          name.replaceAll(' ', '_') +
          '/' +
          name2.replaceAll(' ', '_') +
          '/.',
      ]);
      window.scroll({top: 0, behavior: 'smooth'})
    }
  }

  getFormControl(control: string): FormControl {
    return this.filtersFormGroup?.controls[control] as FormControl
  }

  getCustomResult(score: string): any {
    // const score = '6-3 7-6(4) 6-0';
    const regEx = /([0-9]+-[0-9]+)|([0-9]+-[0-9]+\([0-9]+\))+/g;
    const custome = score.match(regEx)?.map((i) => i.split('-'));
    return custome
  }
}
