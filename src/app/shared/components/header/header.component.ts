import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import { FilterInterface } from 'src/app/shared/interfaces/filter';
import {ProfileService} from "src/app/pages/profile/services/profile.service";
import {ElasticSearchService} from "../../../pages/elastic-search/elastic-search.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isShowMenu: boolean = true;
  testNavigation: FilterInterface[] = [
    { name: 'Tennis', value: '' },
    { name: 'Football', value: 'football' },
  ];
  public elasticSearch: any[] = [];
  protected unSubscribe: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private elasticSearchService: ElasticSearchService
  ) {}

  @ViewChild('searchInput', { read: ElementRef }) searchInput!: ElementRef;

  ngOnInit(): void {}

  searchProfilesHeader(str: string) {
    this.elasticSearchService
      .getElasticSearch(str)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((res) => {
        this.elasticSearch = res;
      });
  }

  focusToSearch() {
    this.searchInput.nativeElement.children[0].children[0].children[0].focus();
  }

  showMenu() {
    this.isShowMenu = !this.isShowMenu;
  }

  counter = 0;
  tourNames = [
    'Noventi Open - Halle',
    'Dubai Duty Free Tennis Championships - Dubai',
    'Rio De Janeiro Challenger',
    'San Diego Open - San Diego',
    'Cordoba Open - Cordoba',
  ];
  nextTournamentNav() {
    this.router.navigate([
      'draw-results',
      'm',
      this.tourNames[this.counter++],
      '2021',
    ]);
    if (this.counter >= this.tourNames.length) {
      this.counter = 0;
    }
  }

  navigation() {
    window.location.href = `/football/football-upcoming-football-soccer-matches`;
    //this.router.navigate([$event, 'matches'])
  }

  clearSearchResult(e: Event) {
    this.elasticSearch = [];
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }

  routeToCalendar(): void {
    this.router.navigate(['tennis-calendar', 'atp', new Date().getFullYear()]);
  }
}
