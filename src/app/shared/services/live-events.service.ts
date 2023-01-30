import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import { LiveEventInterface } from '../interfaces/live-event';

@Injectable({
  providedIn: 'root',
})
export class LiveEventsService {
  private readonly api: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getLiveEvents(tab: string): Observable<LiveEventInterface[]> {
    return this.http.get<LiveEventInterface[]>(
      `${this.api}/live-events/${tab}`
    );
  }
  public getLiveEventsHome(tab: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/live-events/${tab}`);
  }
}
