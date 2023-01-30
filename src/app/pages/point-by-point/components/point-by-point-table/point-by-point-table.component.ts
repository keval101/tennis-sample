import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CourtInterface } from 'src/app/shared/interfaces/court';
import { FilterInterface } from 'src/app/shared/interfaces/filter';
import { TabActiveInterface } from 'src/app/shared/interfaces/tab-active';
import { PointByPointService } from '../../point-by-point.service';

@Component({
  selector: 'app-point-by-point-table',
  templateUrl: './point-by-point-table.component.html',
  styleUrls: ['./point-by-point-table.component.scss'],
})
export class PointByPointTableComponent implements OnInit {
  analysisStat = 10;

  public type: string = 'atp';

  activeTypes: TabActiveInterface[] = [
    { name: 'ATP', active: 'atp', isActive: true },
    { name: 'WTA', active: 'wta', isActive: true },
  ];

  activeGroups: TabActiveInterface[] = [
    { name: 'Singles', active: 'singles', isActive: true },
    { name: 'Doubles', active: 'doubles', isActive: true },
  ];
  selectedGroupType: string = 'singles';
  selectedRanking: any = '';

  private $selectedType: BehaviorSubject<'atp' | 'wta'> = new BehaviorSubject<
    'atp' | 'wta'
  >('atp');

  selectedType: string = 'atp';

  public pointByPointData: any[] = [];
  public selectedYear: number = 2019;
  public selectedLevel: number | string = '';
  public selectedSurface: number | string = '';
  public isCaseOneShort: boolean = false;
  public isCaseTwoShort: boolean = false;
  public isCaseThreeShort: boolean = false;
  public isCaseFourShort: boolean = false;
  headers = [
    { name: 'stats', value: '№' },
    {
      name: 'firstPlayer',
      value: 'player',
      styles: { 'text-align': 'center' },
    },
    {
      name: 'secondPlayer',
      value: 'held from 0/40',
      styles: { 'text-align': 'center' },
    },
    {
      name: 'secondPlayer',
      value: 'held from 0/15',
      styles: { 'text-align': 'center' },
    },
    {
      name: 'secondPlayer',
      value: 'IMMEDIATE BREAK BACK',
      styles: { 'text-align': 'center' },
    },
    {
      name: 'secondPlayer',
      value: 'SERVE DOMINANCE',
      styles: { 'text-align': 'center' },
    },
  ];

  filtersFormGroup = new FormGroup({});

  public surfaceFilters: FilterInterface[] = [
    { value: '', name: 'All Surface' },
    { value: 1, name: 'Hard' },
    { value: 2, name: 'Clay' },
    { value: 3, name: 'I.hard' },
    { value: 4, name: 'Carpet' },
    { value: 5, name: 'Grass' },
    { value: 6, name: 'Acrylic' },
    { value: 1, name: 'N/A' },
  ];
  public levelFilters: FilterInterface[] = [
    { value: '', name: 'All Level' },
    { value: 0, name: 'Futures/Satellites/ITF tournaments $10K' },
    { value: 1, name: 'Challengers/ITF tournaments > $10K' },
    { value: 2, name: 'Main tour' },
    { value: 3, name: 'Masters series' },
    { value: 4, name: 'Grand Slam' },
    { value: 5, name: 'Davis/Fed Cup' },
    { value: 6, name: 'Non ATP/WTA Events + Juniors' },
  ];
  public rankingFilters: FilterInterface[] = [
    { value: '', name: 'All Ranking' },
    { value: 1, name: '1-100' },
    { value: 2, name: '101-200' },
    { value: 3, name: '201-300' },
    { value: 4, name: '301-400' },
    { value: 5, name: '401-500' },
    { value: 6, name: '501-600' },
    { value: 7, name: '601-700' },
    { value: 8, name: '701-800' },
    { value: 9, name: '801-900' },
    { value: 10, name: '901-1000' },
  ];
  public yearFilters: FilterInterface[] = [
    { name: '2022', value: 2022 },
    { name: '2021', value: 2021 },
    { name: '2020', value: 2020 },
    { name: '2019', value: 2019 },
    { name: '2018', value: 2018 },
    { name: '2017', value: 2017 },
    { name: '2016', value: 2016 },
    { name: '2015', value: 2015 },
    { name: '2014', value: 2014 },
    { name: '2013', value: 2013 },
    { name: '2012', value: 2012 },
    { name: '2011', value: 2011 },
    { name: '2010', value: 2010 },
    { name: '2009', value: 2009 },
    { name: '2008', value: 2008 },
    { name: '2007', value: 2007 },
    { name: '2006', value: 2006 },
  ];
  page: number = 1;
  caseType: string = 'case1';
  filterSortOrder: string  = '';
  isVeiwMoreClicked: boolean = false;
  isNeedToSortTable: boolean = false;
  getCurrentDataLength: number = 0;

  constructor(
    private datePipe: DatePipe,
    private pointByPointService: PointByPointService
  ) {}


  ngOnInit(): void {
    this.getFilters();

    this.$selectedType.subscribe((type) => {
      this.selectedType = type;
      this.getData('case1', 'desc', type);
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

  private generateDateFilter(dates: Date[]) {
    this.yearFilters = dates.map((date) => {
      const dateFormatValue = new Date(date).toLocaleDateString('ru');
      const dateFormat: string =
        this.datePipe.transform(new Date(date), 'YYYY') || '';
      return {
        name: dateFormat,
        value: dateFormatValue,
      };
    });
  }

  private getData(
    sortBy?: string,
    sortOrder?: string,
    type?: string,
    group?: string,
    ranking?: number
  ): void {
    const sortByType = sortBy ? sortBy : '';
    const sortOrderType = sortOrder ? sortOrder : '';
    const selectedType = type ? type : this.selectedType;
    const selectedGroupType = group ? group : this.selectedGroupType;
    const selectedRanking = ranking ? ranking : this.selectedRanking;
    const currentPageSize = this.isNeedToSortTable ? this.page * 50 : 50;
    const page = this.isNeedToSortTable ? 1 : this.page;
    this.pointByPointService
      .getPointByPointData(
        this.selectedYear,
        this.selectedSurface,
        this.selectedLevel,
        page,
        sortByType,
        sortOrderType,
        selectedType,
        selectedGroupType,
        selectedRanking,
        currentPageSize
      )
      .subscribe((res) => {
        this.getCurrentDataLength = res.data.length; 
        if (this.page === 1) {
          this.pointByPointData = [];
          this.pointByPointData = res.data;
        } else {
          if (this.isVeiwMoreClicked) {
            this.pointByPointData.push(...res.data);
            this.isVeiwMoreClicked = false
          } else {
            this.pointByPointData = res.data;
          }
        }
      });
  }

  private getFilters() {
    const data = [
      {
        name: 'test',
        value: 'Option 1',
      },
    ];
    this.filtersFormGroup = new FormGroup({
      year: new FormControl(this.yearFilters[0].value),
      level: new FormControl(this.levelFilters[0].value),
      surface: new FormControl(this.surfaceFilters[0].value),
    });
  }

  getFormControl(control: string): FormControl {
    return (
      (this.filtersFormGroup?.controls[control] as FormControl) || undefined
    );
  }

  change() {
    this.page = 1;
    this.isNeedToSortTable = false;
    this.getData(this.caseType, this.filterSortOrder, this.selectedType);
  }

  calculatePercentage(won: number, total: number): number {
    const percentage = parseInt(((won * 100) / total).toFixed(2));

    return !isNaN(percentage) ? percentage : 0;
  }

  nextPage() {
    this.page = this.page + 1;
    this.isNeedToSortTable = false;
    this.getData(this.caseType, this.filterSortOrder, this.selectedType);
    this.isVeiwMoreClicked = true;
  }

  sortTable(caseType: string): void {
    this.isNeedToSortTable = true;
    this.caseType = caseType;
    if (caseType === 'case1') {
      this.filterSortOrder = this.isCaseOneShort === true ? 'desc' : 'asc';
      this.isCaseOneShort = !this.isCaseOneShort;
      this.isCaseTwoShort = false;
      this.isCaseThreeShort = false;
      this.isCaseFourShort = false;
      this.getData(caseType, this.filterSortOrder, this.selectedType);
    }
    if (caseType === 'case2') {
      this.filterSortOrder = this.isCaseTwoShort === true ? 'desc' : 'asc';
      this.isCaseTwoShort = !this.isCaseTwoShort;
      this.isCaseOneShort = false;
      this.isCaseThreeShort = false;
      this.isCaseFourShort = false;
      this.getData(caseType, this.filterSortOrder, this.selectedType);
    }
    if (caseType === 'case3') {
      this.filterSortOrder = this.isCaseThreeShort === true ? 'desc' : 'asc';
      this.isCaseThreeShort = !this.isCaseThreeShort;
      this.isCaseOneShort = false;
      this.isCaseTwoShort = false;
      this.isCaseFourShort = false;
      this.getData(caseType, this.filterSortOrder, this.selectedType);
    }
    if (caseType === 'case4') {
      this.filterSortOrder = this.isCaseFourShort === true ? 'desc' : 'asc';
      this.isCaseFourShort = !this.isCaseFourShort;
      this.isCaseOneShort = false;
      this.isCaseTwoShort = false;
      this.isCaseThreeShort = false;
      this.getData(caseType, this.filterSortOrder, this.selectedType);
    }
  }

  public changeActiveType(active: TabActiveInterface) {
    if (active.active == 'atp' || active.active == 'wta')
      this.$selectedType.next(active.active);
    this.page = 1;
    this.type = active.active;
  }

  public changeActiveGroup(active: TabActiveInterface) {
    this.page = 1;

    if (active.active == 'singles') {
      this.selectedGroupType = 'singles';
      this.getData();
    }
    if (active.active == 'doubles') {
      this.selectedGroupType = 'doubles';
      this.getData();
    }
  }
}
