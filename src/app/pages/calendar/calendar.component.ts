import {Component, OnInit} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {FilterInterface} from "src/app/shared/interfaces/filter";
import {FormControl, FormGroup} from "@angular/forms";
import { CalendarService } from 'src/app/shared/services/calendar.service';
import {repeat, skip, take} from "rxjs/operators";
import {TabActiveInterface} from "../../shared/interfaces/tab-active";
import {CalendarTournamentGroupInterface} from "./interfaces/calendar-tournament-group";
import { MetaTagsService } from 'src/app/shared/services/meta-tags.service';
import { ActivatedRoute, Router } from '@angular/router';


interface FilterResponseInterface {
  id: number;
  name: string;
}

export interface CalendarFilterResponseInterface {
  years: string[];
  levels: FilterResponseInterface[];
  surfaces: FilterResponseInterface[];
}

export const COLORS = [
  'orange',
  'green',
  'navygreen',
  'pink',
  'blue',
  'navyblue',
  'violet',
]

export let LEVEL_COLOR: {[key: string]: string} = {}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  actives: TabActiveInterface[] = [
    { name: 'ATP Calendar', active: 'atp', isActive: true },
    { name: 'WTA Calendar', active: 'wta', isActive: true },
  ];

  matchGrouped: CalendarTournamentGroupInterface[] = [];
  currentSelectedType: TabActiveInterface = {name: '', active: '', isActive: false}; 

  allLevelFilter: FilterInterface = { name: 'All levels', value: '' };
  allSurfaceFilter: FilterInterface = { name: 'All surfaces', value: '' };

  yearFilter: FilterInterface[] = [];
  levelFilter: FilterInterface[] = [this.allLevelFilter];
  surfacesFilter: FilterInterface[] = [this.allSurfaceFilter];

  public activeControl = new FormControl();
  filterFormGroup: FormGroup = new FormGroup({
    year: new FormControl(),
    level: new FormControl(),
    surfaces: new FormControl(),
    search: new FormControl(),
  });

  public subs: Subscription = new Subscription();
  public type: string = '';

  constructor(
    private calendarService: CalendarService,
    private metaTagService: MetaTagsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.calendarService
      .getCalendarFilters('atp')
      .subscribe((response: CalendarFilterResponseInterface) => {
        this.yearFilter = response.years
          .map((v) => parseInt(v) || 1900)
          .sort((a, b) => b - a)
          .map((v) => ({ name: v.toString(), value: v.toString() }));
        this.levelFilter = [
          this.allLevelFilter,
          ...response.levels.map((v) => ({ name: v.name, value: v.name })),
        ];
        const surfaceFiltersTemp: FilterInterface[] = [
          { name: 'All Surfaces', value: '' },
        ];
        for (let court of response.surfaces) {
          let courtValues: string[] = [court.name];
          if (court.id == 4 || court.id == 10 || court.id == 6) continue;
          if (court.id == 3) {
            courtValues.push('Carpet');
            courtValues.push('Acrylic');
          }
          surfaceFiltersTemp.push({
            name: court.name,
            value: courtValues.join(','),
          });
        }
        this.surfacesFilter = surfaceFiltersTemp;

        this.activatedRoute.params.subscribe((params) => {
          this.currentSelectedType = this.actives.filter(x => x.active === params.type)[0]
          this.type = params.type;
          this.activeControl.setValue(params.type)
          this.getCalendarData(params.type, params.year);
        })

        LEVEL_COLOR = {};
        for (let ind in response.levels) {
          LEVEL_COLOR[response.levels[ind].name] = COLORS[ind];
        }

        this.filterFormGroup = new FormGroup({
          year: new FormControl(this.yearFilter[0].value),
          level: new FormControl(this.levelFilter[0].value),
          surfaces: new FormControl(this.surfacesFilter[0].value),
          search: new FormControl(''),
        });

        this.subs.unsubscribe();
        this.subs = new Subscription();
        this.subs.add(
          this.filterFormGroup.valueChanges.subscribe((v) => {
            this.getCalendarData(
              this.activeControl.value,
              v.year,
              v.level,
              v.surfaces,
              v.search
            );
            this.updateTheMetaTags(this.type, v.year)
          })
        );
      });
      
  }

  private getCalendarData(
    type: string,
    year: string | number,
    level?: string,
    surfaces?: string,
    search?: string
  ) {
    this.calendarService
      .getCalendar(type, year.toString(), level, surfaces, search)
      .subscribe((result) => {
        this.matchGrouped = [];
        let week = 0;
        let previousDate = new Date(year.toString());
        for (
          let date = new Date(previousDate);
          date.getFullYear() == year;
          date.setDate(date.getDate() + 7)
        ) {
          let group: CalendarTournamentGroupInterface = {
            week: week,
            date: previousDate.toLocaleDateString('en-US'),
            tournaments: [],
          };
          for (let tournament of result) {
            const tourDate = new Date(tournament.date);
            if (previousDate < tourDate && tourDate < date) {
              group.tournaments.push({
                date: new Date(tournament.date).toLocaleDateString('en-US'),
                country: tournament.countryAcr,
                prize: tournament.prize || '',
                winner: {
                  name:
                    tournament?.games[tournament?.games.length - 1]?.player1
                      ?.name || '',
                  countryAcr:
                    tournament?.games[tournament?.games.length - 1]?.player1
                      ?.countryAcr || '',
                  id:
                    tournament?.games[
                      tournament?.games.length - 1
                    ]?.player1?.id.toString() || '',
                  image: '',
                  seed: '',
                },
                name: tournament.name,
                colorStatus: LEVEL_COLOR[tournament.rank.name],
                court: tournament.court.name.toLowerCase().replace(/ /g, ''),
                final: tournament.games[0],
              });
            }
          }
          if (group.tournaments.length) this.matchGrouped.push(group);
          previousDate = new Date(date);
          ++week;
        }
      });
  }

  changeActive(active: TabActiveInterface) {
    this.type = active.active;
    this.activeControl.setValue(active.active);
    this.filterFormGroup.patchValue({
        year: this.yearFilter[0].value,
        level: this.levelFilter[0].value,
        surfaces: this.surfacesFilter[0].value,
        search: '',
    });
    this.getCalendarData(
      active.active,
      this.filterFormGroup.value.year,
      this.filterFormGroup.value.level,
      this.filterFormGroup.value.surfaces,
      this.filterFormGroup.value.search
    );
    this.router.navigate([  'tennis-calendar', this.type, new Date().getFullYear()])
    this.updateTheMetaTags(active.active, this.filterFormGroup.value.year);
  }

  getFormControl(control: string): FormControl {
    return this.filterFormGroup?.controls[control] as FormControl;
  }

  searchTournaments(tournament: string) {
    this.filterFormGroup.patchValue({
      search: tournament,
    });
  }

  updateTheMetaTags(type: string, year: string): void {
        const metaObject = {
          title: `${type.toUpperCase()} Calendar ${year} - Challenger & ITF Futures Calendar ${year}`,
          description: `${type.toUpperCase()} Calendar ${year} - Challenger & ITF Futures Calendar ${year}. ${type.toUpperCase()} Tennis tour calendar ${year}. Easily see all ${type.toUpperCase()} events or just Futures and Challenger tennis tour events ${year}.`,
          keywords: `${type.toUpperCase()} Calendar ${year} - Challenger & ITF Futures Calendar ${year}, tennis`,
        };

        this.metaTagService.updateTheMetaTags(metaObject);
  }
}
