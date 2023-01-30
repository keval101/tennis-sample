import {AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Subject, Subscription} from "rxjs";
import {RankingService} from "src/app/pages/rankings/services/ranking.service";
import {CountryInterface} from "src/app/shared/interfaces/country";
import {CourtInterface} from "src/app/shared/interfaces/court";
import {FilterInterface} from "src/app/shared/interfaces/filter";
import {TabActiveInterface} from "src/app/shared/interfaces/tab-active";
import {RankingPlayerStatInterface} from "./interfaces/ranking-player-stat";
import {RankingTableInterface} from "./interfaces/ranking-table";
import { MetaTagsService } from 'src/app/shared/services/meta-tags.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.scss'],
})
export class RankingsComponent implements OnInit, AfterViewInit {
  @ViewChild('dateFilter') dateFilter!: TemplateRef<any>;
  @ViewChild('countryFilter') countryFilter!: TemplateRef<any>;
  @ViewChild('surfaceFilter') surfaceFilter!: TemplateRef<any>;

  @ViewChild('defaultHeader') defaultHeader!: TemplateRef<any>;
  @ViewChild('doubleHeader') doubleHeader!: TemplateRef<any>;
  @ViewChild('raceHeader') raceHeader!: TemplateRef<any>;
  @ViewChild('prizeHeader') prizeHeader!: TemplateRef<any>;

  @ViewChild('defaultBody') defaultBody!: TemplateRef<any>;
  @ViewChild('doublesBody') doublesBody!: TemplateRef<any>;
  @ViewChild('raceBody') raceBody!: TemplateRef<any>;
  @ViewChild('prizeBody') prizeBody!: TemplateRef<any>;

  currentTable?: RankingTableInterface;

  activeTypes: TabActiveInterface[] = [
    { name: 'ATP Rankings', active: 'atp', isActive: true },
    { name: 'WTA Rankings', active: 'wta', isActive: true },
  ];

  currentSelectedType: TabActiveInterface = {name: '', active: '', isActive: false}; 

  activeGroups: TabActiveInterface[] = [
    { name: 'Singles', active: 'singles', isActive: true },
    { name: 'Doubles', active: 'doubles', isActive: true },
    { name: 'Race', active: 'race', isActive: true },
    { name: 'By Surface', active: 'surface', isActive: true },
    { name: 'Prize Money', active: 'prize', isActive: true },
  ];

  private $selectedType: Subject<'atp' | 'wta'> = new Subject<'atp' | 'wta'>();
  public selectedGroup: 'singles' | 'doubles' | 'race' | 'surface' | 'prize' =
    'singles';

  public countryFilters: FilterInterface[] = [
    { name: 'loading...', value: '' },
  ];
  public surfaceFilters: FilterInterface[] = [
    { name: 'loading...', value: '' },
  ];
  public dateFilters: FilterInterface[] = [];

  public formGroupFilters: FormGroup = new FormGroup({});
  public playerStats: RankingPlayerStatInterface[] = [];
  public subs: Subscription = new Subscription();
  public page = 0;
  public active: TabActiveInterface = this.activeGroups[0];
  public type: 'atp' | 'wta' = '' as 'atp' | 'wta';
  constructor(
    private metaTagService: MetaTagsService,
    private rankingService: RankingService,
    private datePipe: DatePipe,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.type = this.router.url.includes('women') ? 'wta' : 'atp'; 
    this.currentSelectedType = this.activeTypes.filter(x => x.active === this.type)[0]
    this.getRankingFilters(this.type);

    this.$selectedType.subscribe((type) => {
      this.playerStats = [];
      this.getRankingFilters(type);
    });
  }

  ngAfterViewInit() {
    this.currentTable = {
      header: this.defaultHeader,
      body: this.defaultBody,
      filters: [this.dateFilter, this.countryFilter],
    };
    this.cd.detectChanges()
  }

  public changeActiveType(active: TabActiveInterface) {
    if (active.active == 'atp' || active.active == 'wta')
      this.$selectedType.next(active.active);
    this.page = 0;
    this.type = active.active as 'atp' | 'wta';
    this.updateTheMetaTags(this.type, this.dateFilters[0].value);
  }

  public changeActiveGroup(active: TabActiveInterface) {
    this.active = active;
    this.page = 0;
    this.selectedGroup = active.active as
      | 'singles'
      | 'doubles'
      | 'race'
      | 'prize'
      | 'surface';
    let templates: any;
    if (active.active == 'singles') {
      templates = {
        header: this.defaultHeader,
        body: this.defaultBody,
        filters: [this.countryFilter, this.dateFilter],
      };
    }
    if (active.active == 'doubles') {
      templates = {
        header: this.defaultHeader,
        body: this.defaultBody,
        filters: [this.countryFilter],
      };
    }
    if (active.active == 'surface') {
      templates = {
        header: this.defaultHeader,
        body: this.defaultBody,
        filters: [this.surfaceFilter, this.dateFilter],
      };
    }
    if (active.active == 'race') {
      templates = {
        header: this.raceHeader,
        body: this.raceBody,
        filters: [this.countryFilter],
      };
    }
    if (active.active == 'prize') {
      templates = {
        header: this.prizeHeader,
        body: this.prizeBody,
      };
    }

    this.currentTable = {
      header: templates?.header,
      body: templates?.body,
      filters: templates?.filters,
    };

    this.playerStats = [];

    this.getRanking();
  }

  private getRanking() {
    function mapResponse(response: any) {
      return response.map((ranking: RankingPlayerStatInterface) => ({
        player: ranking.player,
        position: ranking.position,
        pts: ranking.pts,
        wkPts: ranking.wkPts,
        wk: ranking.wk,
        yr: ranking.yr,
        prize: `$${ranking.prize}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      }));
    }

    this.rankingService
      .getRanking(
        this.type,
        this.formGroupFilters.value.date,
        this.formGroupFilters.value.country,
        this.active.active,
        this.page
      )
      .subscribe((rankings) => {
        if (this.page == 0) {
          this.playerStats = mapResponse(rankings);
        } else {
          this.playerStats.push(...mapResponse(rankings));
        }
      });
  }

  private getRankingFilters(type: 'atp' | 'wta') {
    this.rankingService.getRankingFilters(type).subscribe((filters) => {
      this.generateCountryFilter(filters.countries);
      this.generateDateFilter(filters.date);
      this.generateSurfaceFilter(filters.surfaces);
      this.formGroupFilters = new FormGroup({
        date: new FormControl(this.dateFilters[0].value),
        country: new FormControl(this.countryFilters[0].value),
      });
      this.getRanking();
      this.formGroupFilters.valueChanges.subscribe(res =>  this.updateTheMetaTags(type, this.formGroupFilters.value.date))
    });
  }

  private generateCountryFilter(countries: CountryInterface[]) {
    this.countryFilters = [
      { name: 'COUNTRY', value: '' },
      ...countries
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((country) => ({ name: country.name, value: country.acronym })),
    ];
  }

  private generateDateFilter(dates: Date[]) {
    this.dateFilters = dates.map((date) => {
      const dateFormatValue = new Date(date).toLocaleDateString('ru');
      const dateFormat: string =
        this.datePipe.transform(new Date(date), 'dd.MM.YYYY') || '';
      return {
        name: dateFormat,
        value: dateFormatValue,
      };
    });
  }

  private generateSurfaceFilter(surfaces: CourtInterface[]) {
    this.surfaceFilters = [
      { name: 'SURFACE', value: '' },
      ...surfaces
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((surface) => ({ name: surface.name, value: surface.name })),
    ];
  }

  addControl($event: FormControl, nameControl: string) {
    this.formGroupFilters.removeControl(nameControl);
    this.formGroupFilters.addControl(nameControl, $event);
  }

  nextPage() {
    this.page = this.page + 1;
    this.getRanking();
  }

  getFormControl(control: string): FormControl {
    return this.formGroupFilters?.controls[control] as FormControl;
  }

  updateTheMetaTags(type: string, date: string | number | null): void {
    const transformDate = (date?.toString())?.split('.').reverse().join('-');
    const metaObject = {
      title: `Live ${type.toUpperCase()} Rankings For ${transformDate} & ${type.toUpperCase()} Rankings History`,
      description: `Live ${type.toUpperCase()} Rankings For ${transformDate} & ${type.toUpperCase()} Rankings History. Rankings and stats for all years for all men tennis players.`,
      keywords: `Live ${type.toUpperCase()} Rankings For ${transformDate}, Tennis`,
    };

    this.metaTagService.updateTheMetaTags(metaObject);

    this.type === 'atp' ? this.router.navigate([ 'men-atp-rankings']) : this.router.navigate([ 'women-wta-rankings'])
  }
}
