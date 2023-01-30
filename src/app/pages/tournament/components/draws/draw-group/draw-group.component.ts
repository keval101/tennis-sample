import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DrawMatchInterface} from 'src/app/shared/interfaces/draw';
import {GROUPS} from "src/app/shared/variables/groups";

@Component({
  selector: '[drawTable]',
  templateUrl: './draw-group.component.html',
  styleUrls: ['./draw-group.component.scss']
})
export class DrawGroupComponent implements OnInit {
  type: string = 'atp';
  @Input() set draws(value: DrawMatchInterface[]) {
    this.groupDraws = this.getGroupedDraws(value)
  };
  groupDraws: (DrawMatchInterface | { group: string })[] | any = [];

  constructor(private router: Router,private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.type = params['type'] == 'atp' ? 'men' : 'women';})
  }

  public getGroupedDraws(value: DrawMatchInterface[]): any[] {
    let drawGroups: number[] = [...new Set(value.map(v => v.roundId))].sort((a, b) => b - a)
    let groups = []
    for (let drawGroup of drawGroups) {
      groups.push({group: drawGroup, draws: value.filter(v => v.roundId == drawGroup)})
    }
    let draws = []
    for (let group of groups) {
      draws.push(group)
      draws.push(...group.draws)
    }
    return draws
  }

  public getGroupName(groupNumber: number): string {
    return GROUPS[groupNumber] || 'Unknown'
  }


  navigateToH2h(name: string | any, name2: string | any) {
    if (name != 'Unknown Player' && name2 != 'Unknown Player') {
     this.router.navigate([
       'head-to-head/' +
         this.type +
         '/' +
         name.replaceAll(' ', '_') +
         '/' +
         name2.replaceAll(' ', '_') +
         '/.',
     ]);
      window.scroll({top: 0, behavior: 'smooth'})
    }
  }

  getCustomResult(score: string): any {
    const regEx = /([0-9]+-[0-9]+)|([0-9]+-[0-9]+\([0-9]+\))+/g;
    return score.match(regEx)?.map((i) => i.split('-'));
  }
}
