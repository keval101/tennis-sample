import { Component, OnInit } from '@angular/core';
import { MetaTagsService } from 'src/app/shared/services/meta-tags.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-point-by-point',
  templateUrl: './point-by-point.component.html',
  styleUrls: ['./point-by-point.component.scss'],
})
export class PointByPointComponent implements OnInit {
  public type: string = '';

  constructor( private metaTagService: MetaTagsService,private router: Router, private activatedRoute: ActivatedRoute) {}


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.type = params['type'] || 'atp';})
      const metaObject = {
        title: `ATP WTA Point By Point Analysis With Stats`,
        description: `Detailed point by point analysis of thousands of tennis matches from 2000. Federer, Nadal, Djokovic point by point analysis.`,
        keywords: `Point By Point Analysis, Tennis`,
      };

      this.metaTagService.updateTheMetaTags(metaObject);
    }
}
