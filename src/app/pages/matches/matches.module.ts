import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchesComponent } from './matches.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { SharedModule } from 'src/app/shared/shared.module';
import { H2hModule } from '../h2h/h2h.module';
import { UpcomingMatchesComponent } from '../home/upcoming-matches/upcoming-matches.component';

@NgModule({
  declarations: [MatchesComponent, UpcomingMatchesComponent],
  imports: [CommonModule, ClickOutsideModule, SharedModule, H2hModule],
  exports: [MatchesComponent],
})
export class MatchesModule {}
