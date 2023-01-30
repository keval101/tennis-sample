import {Component, Input, OnInit} from '@angular/core';
import {ProfileInformationInterface, ProfileStatisticInterface} from "src/app/pages/profile/interfaces/profile";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-game-stat',
  templateUrl: './profile-game-stat.component.html',
  styleUrls: ['./profile-game-stat.component.scss']
})
export class ProfileGameStatComponent implements OnInit {
  recentForm: boolean[] = []
  title: number = 0

  private _info: ProfileInformationInterface | undefined;
  @Input() set info(v: ProfileInformationInterface | undefined) {
    if (v) {
      this._info = v;
    }
  }
  get info(): ProfileInformationInterface | undefined {
    return this._info
  }

  private _statistics: ProfileStatisticInterface | undefined;
  @Input() set statistics(v: ProfileStatisticInterface | undefined) {
    if (v) {
      this._statistics = v;
      this.recentForm = v.recentGames.reverse().map(result => result == 'w').slice(0, 10)
      this.title = this.getWins([v.grandSlam, v.mainTours, v.master, v.cups, v.challengers, v.futures])
    }
  }
  get statistics(): ProfileStatisticInterface | undefined {
    return this._statistics
  }

  constructor() { }

  ngOnInit(): void {
  }

  private getWins(stat: string[]): number {
    return stat.map(v => parseInt(v.split('-')![0]) || 0).reduce((a, b) => a + b)
  }

  formatBestRank(bestRank: any) {
    return bestRank?.position ? `${bestRank.position} (${bestRank.date})` : '-';
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
