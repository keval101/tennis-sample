import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {FootballMatchesComponent} from "./football-matches.component";
import { UpcomingMatchesComponent } from './upcoming-matches/upcoming-matches.component';
import { HomeUpcomingMatchComponent } from './home-upcoming-match/home-upcoming-match.component';
import { AwayTeamComponent } from 'src/app/shared/components/away-team/away-team.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
  {
    path: '',
    component: FootballMatchesComponent,
    pathMatch: 'full'
  },
];


@NgModule({
  declarations: [
    FootballMatchesComponent,
    UpcomingMatchesComponent,
    HomeUpcomingMatchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    FootballMatchesComponent,
    UpcomingMatchesComponent,
    HomeUpcomingMatchComponent,
  ]
})
export class FootballMatchesModule { }
