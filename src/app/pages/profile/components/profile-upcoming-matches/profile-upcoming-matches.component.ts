import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProfileService} from "src/app/pages/profile/services/profile.service";
import { OldPlayerInterface } from 'src/app/shared/interfaces/player';
import {UpcomingInterface} from "src/app/shared/interfaces/upcoming";
import { environment } from 'src/environments/environment';

interface UpcomingMatchMockInterface {
  round: string;
  event: string;
  opponent: OldPlayerInterface;
  result?: string;
  k1: number;
  k2: number;
  h2h: string;
}

@Component({
  selector: 'app-profile-upcoming-matchs',
  templateUrl: './profile-upcoming-matches.component.html',
  styleUrls: ['./profile-upcoming-matches.component.scss'],
})
export class ProfileUpcomingMatchesComponent implements OnInit {
  public recentGames = ['w', 'w', 'l', 'w', 'w'];
  upcomingMatches: UpcomingInterface[] = [];
  selectedName: string = '';

  constructor(
    private profileService: ProfileService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  @Input() type: string | undefined;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.upcomingMatches = [];
      this.selectedName = params['name'];
      this.profileService
        .getUpcomingMatches(params['name'])
        .subscribe((upcoming) => {
          this.upcomingMatches = upcoming;
        });
    });
  }

  navigateToTournament(name: string, year: any) {
    this.router.navigate([
       
      'draw-results',
      `${this.type}`,
      name,
      new Date(year).getFullYear(),
    ]);
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
      window.scroll({ top: 0, behavior: 'smooth' });
    }
  }

  getImageUrl(profileImage: string | undefined): string {
    if (!environment.production) {
      const name = profileImage as string;
      const imgUrl = name.replace('/tennis/api2', '');
      return `${environment.apiUrl}${imgUrl}`;
    } else {
      return profileImage as string;
    }
  }

  getDateText(date: any): any {
    return new Date(date).getFullYear() == new Date().getFullYear() &&
      new Date(date).getMonth() == new Date().getMonth() &&
      new Date(date).getDate() == new Date().getDate()
      ? 'Today'
      : new Date(date).getFullYear() == new Date().getFullYear() &&
        new Date(date).getMonth() == new Date().getMonth() &&
        new Date(date).getDate() == new Date().getDate() + 1
      ? 'Tommorrow'
      : 'Date';
  }

  navigateToProfile(name: string) {
    this.router.navigate([`/stats-ranking-titles-profile/${name}`]);
  }
}
