import { Component, OnInit } from '@angular/core';
import { InterestingH2hInterface, InterestingH2hService } from '../../services/interesting-h2h.service';

@Component({
  selector: 'app-interesting-h2h',
  templateUrl: './interesting-h2h.component.html',
  styleUrls: ['./interesting-h2h.component.scss'],
})
export class InterestingH2hComponent implements OnInit {
  constructor(private interestingh2hService: InterestingH2hService) {}
  atpH2hData: InterestingH2hInterface[] = [];
  wtaH2hData: InterestingH2hInterface[] = [];
  ngOnInit(): void {
    this.interestingh2hService.getInterestingH2h('atp').subscribe((res) => {
      this.atpH2hData = res;
    });
    this.interestingh2hService.getInterestingH2h('wta').subscribe((res) => {
      this.wtaH2hData = res;
    });
  }

  navigateToH2h(type: string, playerOne: string | any, playerTwo: string | any) {
    window.location.href = `/head-to-head/${
      type == 'atp' ? 'men' : 'women'
    }/${playerOne.replaceAll(' ', '_')}/${playerTwo.replaceAll(' ', '_')}/`;
  }
}
