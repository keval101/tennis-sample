import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {MatchVictory} from "src/app/shared/interfaces/match-victory";
import {PastChampionInterface, PastChampionsResponseInterface} from "src/app/shared/interfaces/past-champions";
import {TournamentInterface} from "src/app/shared/interfaces/tournament";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TournamentsHttpService {
  private readonly api: string = environment.apiUrl
  constructor(
    private http: HttpClient
  ) { }

  public getTournament(type: string, tournament: string, year: string): Observable<TournamentInterface> {
    return this.http.get<TournamentInterface>(`${this.api}/tournament/${type}/${tournament}/${year}`)
  }

  public getPoints(tournament: string, year: string, type: string): Observable<any> {
    return this.http.get<any>(`${this.api}/tournament/${type}/${tournament}/${year}/points`)
  }

  public getPastChampions(tournament: string, year: string, type: string): Observable<PastChampionsResponseInterface> {
    return this.http.get<PastChampionsResponseInterface>(`${this.api}/tournament/${type}/${tournament}/${year}/past-champions`)
  }

  public getMostVictories(tournament: string, type: string): Observable<MatchVictory[]> {
    return this.http.get<MatchVictory[]>(`${this.api}/tournament/${type}/${tournament}/most-victories`)
  }

  public getDraws(tournament: string, year: string, type: string): Observable<any> {
    return this.http.get<any>(`${this.api}/tournament/${type}/${tournament}/${year}/draws`)
  }
}
