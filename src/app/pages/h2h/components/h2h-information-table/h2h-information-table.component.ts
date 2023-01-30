import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TabActiveInterface } from 'src/app/shared/interfaces/tab-active';
import { H2HService } from '../../h2h.service';
import { H2HInfoTableInterface } from './interfaces/h2h-information-table';

@Component({
  selector: 'app-h2h-information-table',
  templateUrl: './h2h-information-table.component.html',
  styleUrls: ['./h2h-information-table.component.scss'],
})
export class H2hInformationTableComponent implements OnInit, AfterViewInit {
  @Input() playerOne: any;
  @Input() playerTwo: any;
  @Input() surfaceData: any;
  @Input() careerData: any;

  playerDetails1: any[] = [];
  playerDetails2: any[] = [];

  currentTable?: H2HInfoTableInterface;

  @ViewChild('h2hSummaryBody') h2hSummaryBody!: TemplateRef<any>;
  @ViewChild('profileBody') profileBody!: TemplateRef<any>;
  @ViewChild('wlSummaryBody') wlSummaryBody!: TemplateRef<any>;

  activeGroups: TabActiveInterface[] = [
    { name: 'H2H Summary', active: 'h2hSummary', isActive: true },
    { name: 'Profile', active: 'profile', isActive: true },
    { name: 'W/L Summary', active: 'wlSummary', isActive: true },
  ];
  public active: TabActiveInterface = this.activeGroups[0];
  public page = 0;
  public selectedGroup: 'h2hSummary' | 'profile' | 'wlSummary' = 'h2hSummary';

  constructor(private h2hService: H2HService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getPlayerFullDetail(
      this.playerOne.name.replace(' ', '%20'),
      this.playerTwo.name.replace(' ', '%20')
    );
  }

  ngAfterViewInit() {
    this.currentTable = {
      body: this.h2hSummaryBody,
    };
    this.cd.detectChanges()
  }

  public changeActiveGroup(active: TabActiveInterface) {
    this.active = active;
    this.page = 0;
    this.selectedGroup = active.active as
      | 'h2hSummary'
      | 'profile'
      | 'wlSummary';
    let templates: any;
    if (active.active == 'h2hSummary') {
      templates = {
        body: this.h2hSummaryBody,
      };
    }
    if (active.active == 'profile') {
      templates = {
        body: this.profileBody,
      };
    }
    if (active.active == 'wlSummary') {
      templates = {
        body: this.wlSummaryBody,
      };
    }

    this.currentTable = {
      body: templates?.body,
    };
  }

  getAge(date: Date) {
    let today = new Date();
    let birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getPlayerFullDetail(playerOne: string, playerTwo: string): any {
    this.h2hService
      .getInformation(playerOne)
      .subscribe((res) => this.playerDetails1.push(res.information));
    this.h2hService
      .getInformation(playerTwo)
      .subscribe((res) => this.playerDetails2.push(res.information));
  }

  getModifiedHeightWeight(text: string): string {
    let modifiedText;
    if (text.includes('(')) {
      modifiedText = text?.substring(
        text.indexOf('(') + 1,
        text.lastIndexOf(')')
      );
    } else {
      modifiedText = text;
    }
    return modifiedText;
  }

  calculatePercentage(
    number1: number,
    number2: number,
    playerNumber: number,
    player?: string
  ): string {
    const sum = number1 + number2;
    const percentage = ((playerNumber * 100) / sum).toFixed(2);
    if (player === 'range') {
      return percentage.toString() == 'NaN'
        ? '0.00%'
        : percentage.toString() + '%';
    }
    let finalText;
    if (player === 'player1')
      finalText = `${
        percentage.toString() == 'NaN' ? '0.00' : percentage
      }% (${playerNumber}-${number2})`;
    if (player === 'player2')
      finalText = `${
        percentage.toString() == 'NaN' ? '0.00' : percentage
      }% (${playerNumber}-${number1})`;
    return finalText ?? '';
  }
}
