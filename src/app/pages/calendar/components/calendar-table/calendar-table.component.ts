import {Component, Input, OnInit} from '@angular/core';
import {CalendarTournamentGroupInterface} from "../../interfaces/calendar-tournament-group";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-calendar-table',
  templateUrl: './calendar-table.component.html',
  styleUrls: ['./calendar-table.component.scss']
})
export class CalendarTableComponent implements OnInit {
  @Input() matches: CalendarTournamentGroupInterface[] = []

  public sizeOfCalendarImages = '2.5em'

  constructor(private readonly router: Router) { }

  ngOnInit(): void {
  }

  @Input() type: string | undefined;
  public ConvertToDate(date: string) {
    return new Date(date)
  }

  public navigateToTournament(name: string, date: string) {
    this.router.navigate([  'draw-results', `${this.type}`, name, new Date(date).getFullYear()])
  }
}
