import {NgModule} from '@angular/core';
import {ChampionsComponent} from "src/app/pages/tournament/components/champions/champions.component";
import {DrawGroupComponent} from "src/app/pages/tournament/components/draws/draw-group/draw-group.component";
import {DrawsComponent} from "src/app/pages/tournament/components/draws/draws.component";
import {TournamentShortStatsComponent} from "src/app/pages/tournament/components/tournament-short-stats/tournament-short-stats.component";
import {TournamentYearPickerComponent} from "src/app/pages/tournament/components/tournament-year-picker/tournament-year-picker.component";
import {SharedModule} from "../../shared/shared.module";
import {CommonModule} from "@angular/common";
import {TournamentComponent} from "./tournament.component";
import {BrowserModule} from "@angular/platform-browser";
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  declarations: [
    ChampionsComponent,
    DrawsComponent,
    DrawGroupComponent,
    TournamentShortStatsComponent,
    TournamentComponent,
    TournamentYearPickerComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    BrowserModule,
    ClickOutsideModule
  ],
  exports: [
    TournamentShortStatsComponent,
  ]
})
export class TournamentModule {
}
