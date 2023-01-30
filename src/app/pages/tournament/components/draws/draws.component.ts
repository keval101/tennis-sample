import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {TournamentsHttpService} from "src/app/pages/tournament/services/tournaments-http.service";
import {DrawMatchInterface} from 'src/app/shared/interfaces/draw';
import {TabActiveInterface} from "src/app/shared/interfaces/tab-active";


@Component({
  selector: 'app-draws',
  templateUrl: './draws.component.html',
  styleUrls: ['./draws.component.scss']
})
export class DrawsComponent implements OnInit {
  active: 'singles' | 'doubles' | 'qualifying' = 'singles';

  private _drawSingles: DrawMatchInterface[] = []
  get drawSingles(): DrawMatchInterface[] {
    return this._drawSingles
  }

  private _drawDoubles: DrawMatchInterface[] = []
  get drawDoubles(): DrawMatchInterface[] {
    return this._drawDoubles
  }

  private _drawQualifying: DrawMatchInterface[] = []
  get drawQualifying(): DrawMatchInterface[] {
    return this._drawQualifying
  }

  @Input() tournamentName: string = ''

  selectedDraw: DrawMatchInterface[] = []

  currentYear: any;

  actives: TabActiveInterface[] = [
    {name: 'Men\'s Singles', active: 'singles'},
    {name: 'Men\'s Doubles', active: 'doubles'},
    {name: 'Men\'s Qualifying Singles', active: 'qualifying'}
  ];

  changeActive(active: TabActiveInterface) {
    if (active.active == 'singles') this.selectedDraw = this._drawSingles
    if (active.active == 'doubles') this.selectedDraw = this._drawDoubles
    if (active.active == 'qualifying') this.selectedDraw = this._drawQualifying
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private tournamentService: TournamentsHttpService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this._drawSingles = [];
      this._drawDoubles = [];
      this._drawQualifying = [];
      this.selectedDraw = [];
      this.getTournamentDraws(params['tournament'], params['year'], params['type'])

      if(params['type'] === 'atp') {
          this.actives = [
          {name: 'Men\'s Singles', active: 'singles'},
          {name: 'Men\'s Doubles', active: 'doubles'},
          {name: 'Men\'s Qualifying Singles', active: 'qualifying'}
        ];
      } else {
        this.actives = [
          { name: "Women's Singles", active: 'singles' },
          { name: "Women's Doubles", active: 'doubles' },
          { name: "Women's Qualifying Singles", active: 'qualifying' },
        ];
      }
    })
  }

  private getTournamentDraws(name: string, year: string, type: string) {
    this.tournamentService.getDraws(name, year, type).subscribe(draws => {
      this._drawSingles = draws.singles
      this.actives[0].isActive = !!this._drawSingles.length;
      this._drawDoubles = draws.doubles
      this.actives[1].isActive = !!this._drawDoubles.length;
      this._drawQualifying = draws.qualifying
      this.actives[2].isActive = !!this._drawQualifying.length;
      this.setFirstDrawTab()
    })
  }

  private setFirstDrawTab() {
    if (this._drawSingles?.length) {
      this.selectedDraw = this._drawSingles
      this.active = 'singles'
      return
    }
    if (this._drawDoubles?.length) {
      this.selectedDraw = this._drawDoubles
      this.active = 'doubles'
      return
    }
    if (this._drawQualifying?.length) {
      this.selectedDraw = this._drawQualifying;
      this.active = 'qualifying'
    }
  }
}
