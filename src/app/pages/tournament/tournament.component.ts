import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TournamentsHttpService} from "src/app/pages/tournament/services/tournaments-http.service";
import {TournamentYearPickerService} from "src/app/pages/tournament/services/tournament-year-picker.service";
import {PastChampionInterface} from "src/app/shared/interfaces/past-champions";
import {OldTournamentInterface, TournamentInterface} from 'src/app/shared/interfaces/tournament';
import {YearInterface} from "src/app/shared/interfaces/year";
import { MetaTagsService } from 'src/app/shared/services/meta-tags.service';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent implements OnInit {

  tournamentIsLoad = false;
  tournamentLoadError = false;

  currentYear: YearInterface | undefined;
  oldCurrentTournament?: OldTournamentInterface;
  currentTournament?: TournamentInterface;
  singlesPastChampions: PastChampionInterface[] = [];
  doublesPastChampions: PastChampionInterface[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private metaTagService: MetaTagsService,
    private tournamentHttpService: TournamentsHttpService,
    private yearPickerService: TournamentYearPickerService,
  ) { }

  ngOnInit(): void {
    this.yearPickerService.currentYear.subscribe(value => {
      this.currentYear = value
    })

    this.activatedRoute.params.subscribe(params => {
      this.yearPickerService.setCurrentYear({year: params['year'], tournamentName: params['tournament']})
      this.changeTournamentRoute(params['type'], params['tournament'], params['year'])
    })
  }

  private changeTournamentRoute(type: string, tournament: string, year: string) {
    this.tournamentHttpService.getTournament(type, tournament, year).subscribe(result => {
      this.tournamentIsLoad = true;
      this.tournamentLoadError = false;
      this.currentTournament = result;
       const metaObject = {
         title: `${this.currentTournament.name} Draw ${
           this.currentYear?.year
         } | ${type == 'atp' ? 'Men' : 'Women'}'s Qualifying & Main Event Results`,
         description: `${type.toUpperCase()} ${
           this.currentTournament.name
         } Draw & Results ${this.currentYear?.year}. View the main draw &
qualifying draws. Results, stats & preview for all ${type.toUpperCase()} ${
           this.currentTournament.name
         } tennis draws for ${this.currentYear?.year} & past years.`,
         keywords: `${this.currentTournament.name} Draw ${this.currentYear?.year}, Tennis`,
       };

       this.metaTagService.updateTheMetaTags(metaObject);
    }, () => {
      this.tournamentIsLoad = true;
      this.tournamentLoadError = true;
      this.currentTournament = undefined
    });
    this.tournamentHttpService.getPastChampions(tournament, year, type).subscribe(result => {
      this.singlesPastChampions = result.singlesChampions.filter(v => v.result != '').map(draw => ({
        ...draw,
        date: new Date(draw.date || draw.tournament.date)
      }))
      this.doublesPastChampions = result.doublesChampions.map(draw => ({
        ...draw,
        date: new Date(draw.date || draw.tournament.date)
      }))
    }, () => {
      this.singlesPastChampions = []
      this.doublesPastChampions = []
    })
  }
}
