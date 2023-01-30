import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NewGameInterface} from "src/app/pages/calendar/interfaces/calendar-tournament";
import {CalendarFilterResponseInterface} from "../../pages/calendar/calendar.component";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";


export interface CalendarResponseInterface {
  id: number;
  court: { id: number; name: string; };
  name: string;
  date: string;
  countryAcr: string;
  prize?: string;
  games: NewGameInterface[]
  rank: {
    name: string;
    id: number;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private readonly api: string = environment.apiUrl

  constructor(private http: HttpClient) { }

  public getCalendar(type: string, year: string, level?: string, surfaces?: string, search?: string): Observable<CalendarResponseInterface[]> {
    const params: any = {}
    if (level) params.level = level
    if (surfaces) params.surfaces = surfaces
    if (search) params.search = search

    return this.http.get<CalendarResponseInterface[]>(`${this.api}/calendar/${type}/${year}`, {params})
  }

  public getCalendarFilters(type: string) {
    return this.http.get<CalendarFilterResponseInterface>(`${this.api}/calendar/${type}/filters`)
  }
}
