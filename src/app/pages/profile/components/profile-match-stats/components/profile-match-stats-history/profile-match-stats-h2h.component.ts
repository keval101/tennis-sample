import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'src/app/pages/profile/services/profile.service';
import { TableHeaderInterface } from 'src/app/shared/interfaces/table';
import { ProfileInterestingH2hInterface } from '../../../../interfaces/profile-interesting-h2h';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-profile-match-stats-h2h',
  templateUrl: './profile-match-stats-h2h.component.html',
  styleUrls: ['./profile-match-stats-h2h.component.scss'],
})
export class ProfileMatchStatsH2hComponent implements OnInit {
  headers: TableHeaderInterface[] = [{ name: 'opponent' }, { name: 'h2h' }];
  totalOpponents: ProfileInterestingH2hInterface[] = [];
  leftTable: ProfileInterestingH2hInterface[] = [];
  rightTable: ProfileInterestingH2hInterface[] = [];
  interestingH2hs: ProfileInterestingH2hInterface[] = [];
  name: string = '';
  totalOpponentsUrls: any[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService
  ) {}

  @Input() type: string | undefined;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.name = params['name'];
      this.leftTable = [];
      this.rightTable = [];
      this.profileService
        .getInterestingH2h(this.name)
        .subscribe((interestingH2hs) => {
          this.interestingH2hs = interestingH2hs;
          interestingH2hs = interestingH2hs.map((h2h) => ({
            h2h: `H2H ${h2h.h2h}`,
            opponent: h2h.opponent,
            params: [this.name, h2h.opponent],
          }));
          const totalOpponents = [
            ...new Map(
              interestingH2hs.map((item) => [item['opponent'], item])
            ).values(),
          ];
          // this.getProfileInfo(totalOpponents);

          let center = Math.round(interestingH2hs.length / 2);
          this.leftTable = interestingH2hs!.slice(0, center);
          this.rightTable = interestingH2hs!.slice(
            center,
            interestingH2hs.length
          );
        });
    });
  }

  navigateToH2h(name: string | any, name2: string | any) {
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

  countPercentage(value1: string, value2: string): string {
    const total = Number(value1) + Number(value2);
    return String(((Number(value1) / total) * 100).toFixed(2) + '%');
  }

  getProfileInfo(totalOpponents: any[]): void {
    totalOpponents.map((res) => {
      this.profileService.getInformation(res.opponent).subscribe((res) => {
        let imgUrl = res.image?.replace('/tennis/api2', '');
        this.totalOpponentsUrls.push({
          name: res.name,
          img: `${environment.apiUrl}${imgUrl}`,
        });
      });
    });
  }

  getImageUrl(image?: string | undefined): string {
    if (!environment.production) {
      const name = image as string;
      const imgUrl = name.replace('/tennis/api2', '');
      return `${environment.apiUrl}${imgUrl}`;
    } else {
      return image as string;
    }
  }

  getResult(score1: any,score2: any): string {
    return Number(score1) > Number(score2)
      ? 'Wins'
      : Number(score2) > Number(score1)
      ? 'Loss'
      : 'Draw'
  }
}
