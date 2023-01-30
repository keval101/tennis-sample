import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-away-team',
  templateUrl: './away-team.component.html',
  styleUrls: ['./away-team.component.scss'],
})
export class AwayTeamComponent implements OnInit {
  @Input() awayEmblem?: string = '';
  @Input() away?: string = '';
  @Input() needSmallIcon: boolean = false;
  constructor() {}

  ngOnInit(): void {}
}
