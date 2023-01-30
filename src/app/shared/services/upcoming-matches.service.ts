import {Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import { Upcoming } from '../interfaces/upcoming-match.interface';
import { UpcomingMatchesInterface } from '../interfaces/upcoming';

@Injectable({
  providedIn: 'root'
})
export class UpcomingMatchesService {
  private readonly footballApiUrl: string = environment.footballApiUrl;
  private readonly apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUpcomingMatches(limit: number, date: any): Observable<UpcomingMatchesInterface> {
    return this.http.post<UpcomingMatchesInterface>(`${this.apiUrl}/upcoming/matches`, {limit, date})
  }
  getFootballUpcomingMatches(page: number, perPage: number, dateFrom: string, dateTo: string): Observable<Upcoming[]> {
    return this.http.post<Upcoming[]>(`${this.footballApiUrl}/matches/upcoming`, {page, perPage, dateFrom, dateTo})
  }
}
