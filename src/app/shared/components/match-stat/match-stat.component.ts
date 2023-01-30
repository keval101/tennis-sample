import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {
  OldPlayerInformationInterface,
  OldPlayerInterface,
  PlayerInterface,
} from 'src/app/shared/interfaces/player';
import {MatchStatService} from "../../services/match-stat.service";
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-match-stat',
  templateUrl: './match-stat.component.html',
  styleUrls: ['./match-stat.component.scss']
})
export class MatchStatComponent implements OnInit {
  show: boolean = false;

  @Input() oldWinner?: OldPlayerInterface;
  @Input() oldLooser?: OldPlayerInterface;

  @Input() winner?: PlayerInterface;
  @Input() looser?: PlayerInterface;

  @Input() oldWinnerInformation?: OldPlayerInformationInterface
  @Input() oldLooserInformation?: OldPlayerInformationInterface

  private _uniqueKey: any;

  constructor(
    private matchStatService: MatchStatService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this._uniqueKey = {left: this.oldWinnerInformation, right: this.oldLooserInformation}
    this.matchStatService.openPopUp.subscribe(v => {
      if (v != this._uniqueKey) this.show = false;
    })
  }

  showStats() {
    this.show = !this.show;
    this.matchStatService.openPopUp.next(this._uniqueKey)
  }

  closeTab() {
    this.show = false;
  }

  percents(first_serve: number | undefined, first_serve_of: number | undefined) {
    if (typeof(first_serve) == 'number' && typeof(first_serve_of) == 'number') {
      return Math.round((first_serve / first_serve_of) * 100)
    }
    return '*'
  }

  navigateToProfile(name: string = '') {
    this.router.navigate(['stats-ranking-titles-profile', name]);
    window.scroll({top: 0, behavior: 'smooth'})
  }

  isDoubles(name: string) {
    return name?.split('/').length>1;
  }

  navigateToH2h(name: string | any, name2: string | any) {
    const type = this.winner?.image.includes('atp') ? 'men' : 'women'
    if (name != 'Unknown Player' && name2 != 'Unknown Player') {
      this.router.navigate([
        'head-to-head/' +
          type +
          '/' +
          name.replaceAll(' ', '_') +
          '/' +
          name2.replaceAll(' ', '_') +
          '/.',
      ]);
      window.scroll({top: 0, behavior: 'smooth'})
    }
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
