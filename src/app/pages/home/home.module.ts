import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { H2hSearchFootballClubsComponent } from './h2h-search-football-clubs/h2h-search-football-clubs.component';
import { SharedModule } from '../../shared/shared.module';
import { H2hSearchTennisAtpComponent } from './h2h-search-tennis-atp/h2h-search-tennis-atp.component';
import { FootballMatchesModule } from './football-matches/football-matches.module';
import { MatchesModule } from '../matches/matches.module';
import { MatchesComponent } from '../matches/matches.component';
import { LiveEventsComponent } from './live-events/live-events.component';
import { H2hListModule } from '../h2h-list/h2h-list.module';

@NgModule({
  declarations: [
    HomeComponent,
    H2hSearchFootballClubsComponent,
    H2hSearchTennisAtpComponent,
    LiveEventsComponent,
  ],
  imports: [CommonModule, FootballMatchesModule, SharedModule, MatchesModule],
  exports: [
    HomeComponent,
    H2hSearchFootballClubsComponent,
    H2hSearchTennisAtpComponent,
    LiveEventsComponent,
  ],
})
export class HomeModule {}
