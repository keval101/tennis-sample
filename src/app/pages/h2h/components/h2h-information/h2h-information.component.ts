import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileStatisticInterface } from 'src/app/pages/profile/interfaces/profile';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-h2h-information',
  templateUrl: './h2h-information.component.html',
  styleUrls: ['./h2h-information.component.scss'],
})
export class H2hInformationComponent implements OnInit {
  @Input() playerOne: any;
  @Input() playerTwo: any;
  @Input() surfaceData: any;
  newDate = new Date();
  private _statistics1: ProfileStatisticInterface | undefined;
  private _statistics2: ProfileStatisticInterface | undefined;

  @Input() set statistics1(v: ProfileStatisticInterface | undefined) {
    if (v) {
      this._statistics1 = v;
    }
  }
  get statistics1(): ProfileStatisticInterface | undefined {
    return this._statistics1;
  }

  @Input() set statistics2(v: ProfileStatisticInterface | undefined) {
    if (v) {
      this._statistics2 = v;
    }
  }
  get statistics2(): ProfileStatisticInterface | undefined {
    return this._statistics2;
  }

  constructor(private router: Router) {}

  ngOnInit(): void {}

  getAge(date: Date) {
    let today = new Date();
    let birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  navigateToProfile(name: string) {
    this.router.navigate([`/stats-ranking-titles-profile/${name}`]);
  }

  getImageUrl(profileImage: string | undefined): string {
    if(!environment.production) {
      const name = profileImage as string
      const imgUrl = name.replace('/tennis/api2', '');
      return `${environment.apiUrl}${imgUrl}`
    } else {
      return profileImage as string;
    }
  }
}
