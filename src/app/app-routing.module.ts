import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ElasticSearchComponent} from "src/app/pages/elastic-search/elastic-search.component";
import {TempComponent} from "src/app/temp/temp.component";
import {TournamentComponent} from "./pages/tournament/tournament.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {ProfileComponent} from "./pages/profile/profile.component";
import {CalendarComponent} from "./pages/calendar/calendar.component";
import {RankingsComponent} from "./pages/rankings/rankings.component";
import {H2hComponent} from "./pages/h2h/h2h.component";
import {HomeComponent} from "./pages/home/home.component";
import {MatchesComponent} from "./pages/matches/matches.component";
import {H2hListComponent} from "./pages/h2h-list/h2h-list.component";
import { PointByPointComponent } from './pages/point-by-point/point-by-point.component';

const routes: Routes = [
  {component: HomeComponent, path: ''},
  {component: MatchesComponent, path: 'upcoming-todays-tennis-matches'},
  {component: H2hListComponent, path: 'h2h-search'},
  {component: PointByPointComponent, path: 'point-by-point-analysis'},
  {component: TournamentComponent, path: 'draw-results/:type/:tournament/:year', },
  // {component: ProfileComponent, path: 'profile/:name', },
  {component: ProfileComponent, path: 'stats-ranking-titles-profile/:name', },
  {component: CalendarComponent, path: 'tennis-calendar/:type/:year', },
  {component: RankingsComponent, path: 'men-atp-rankings'},
  {component: RankingsComponent, path: 'women-wta-rankings'},
  {component: H2hComponent, path: 'head-to-head/:type/:playerOne/:playerTwo/.'},
  {component: ElasticSearchComponent, path: 'elastic-search'},
  {component: TempComponent, path: 'temp'},
  {component: NotFoundComponent, path: '404'},
  {path: '**', redirectTo: '404'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
