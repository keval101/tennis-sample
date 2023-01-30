import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, ReplaySubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {YearInterface} from "src/app/shared/interfaces/year";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TournamentYearPickerService {
  private readonly api: string = environment.apiUrl
  openPopUp = new BehaviorSubject<any>(null)

  private _currentYear: ReplaySubject<YearInterface> = new ReplaySubject<YearInterface>(1);
  get currentYear(): Observable<YearInterface> {
    return this._currentYear.asObservable()
  }

  constructor(private http: HttpClient) { }

  public setCurrentYear(year: YearInterface) {
    this._currentYear.next(year)
  }

  getYearsHttp(tournament: string, type: string): Observable<YearInterface[]> {
    return this.http.get<YearInterface[]>(`${this.api}/tournament/${type}/${tournament}/`)
  }
}
