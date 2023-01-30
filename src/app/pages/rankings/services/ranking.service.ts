import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {RankingFilter} from "src/app/pages/rankings/interfaces/ranking-filter";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private readonly api: string = environment.apiUrl

  constructor(
    private http: HttpClient
  ) {
  }

  public getRankingFilters(type: string): Observable<RankingFilter> {
    return this.http.get<RankingFilter>(`${this.api}/ranking/${type}/filters`)
  }

  public getRanking(type: string, date: string, countryAcr: string, group: string, page: number) {
    return this.http.get<any>(`${this.api}/ranking/${type}/`, {
      params: { date, countryAcr, group, page }
    })
  }
}
