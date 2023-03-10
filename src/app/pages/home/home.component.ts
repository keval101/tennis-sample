import { Component, OnInit } from '@angular/core';
import { MetaTagsService } from 'src/app/shared/services/meta-tags.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  playerOne!: string;
  playerTwo!: string
  constructor(private metaTagService: MetaTagsService) {}

  ngOnInit(): void {
    this.metaTagService.updateTheMetaTags({
      title: 'Tennis H2H Stats | Tennis Predictions & Results  |  ATP WTA ITF',
      desciption:
        'All Historical and current tennis head to head stats for the  ATP WTA ITF tours. Full match predictions and tennis stats analysis at Stevegtennis.com',
      keywords: 'Tennis, H2h Stats, Tennis Predictions, Results, ATP, WTA, ITF, Stevegtennis',
    });
  }

  getFeaturedMatch(data: any): void {
    const featureMatch = data[0]
    this.playerOne = featureMatch.player1.name
    this.playerTwo = featureMatch.player2.name
  }
}
