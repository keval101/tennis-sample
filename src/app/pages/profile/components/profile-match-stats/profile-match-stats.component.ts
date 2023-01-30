import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-profile-match-stats',
  templateUrl: './profile-match-stats.component.html',
  styleUrls: ['./profile-match-stats.component.scss']
})
export class ProfileMatchStatsComponent implements OnInit {
  constructor() { }
@Input() type : string | undefined
  ngOnInit(): void {}
}
