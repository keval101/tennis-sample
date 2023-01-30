import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {RankingInterface} from "src/app/shared/interfaces/ranking";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AtpRankingService {
  private readonly api: string = environment.apiUrl

  constructor(
    private http: HttpClient
  ) {
  }

  public getAtpRankingTop(tab: string): Observable<RankingInterface[]> {
    return this.http.get<RankingInterface[]>(`${this.api}/ranking/${tab}/top`)
  }
}
