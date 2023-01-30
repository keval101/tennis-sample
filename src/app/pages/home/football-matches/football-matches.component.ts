import { MetaTagsService } from 'src/app/shared/services/meta-tags.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-football-matches',
  templateUrl: './football-matches.component.html',
  styleUrls: ['./football-matches.component.scss'],
})
export class FootballMatchesComponent implements OnInit {
  constructor(private metaTagService: MetaTagsService) {}

  ngOnInit(): void {
}
}
