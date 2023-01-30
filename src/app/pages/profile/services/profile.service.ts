import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProfileSurfaceSummaryInterface} from "src/app/pages/profile/components/profile-match-stats/interfaces/profile-surface-summary";
import {ProfileInformationInterface, ProfileStatisticInterface} from "src/app/pages/profile/interfaces/profile";
import {ProfileBreakdownInterface} from "src/app/pages/profile/interfaces/profile-breakdown";
import {DrawInterface} from 'src/app/shared/interfaces/draw';
import {ProfileMatchStatFiltersInterface,
  ProfileMatchStatInterface
} from "src/app/pages/profile/components/profile-match-stats/interfaces/profile-match-stat";
import {MatchFiltersInterface} from "src/app/shared/interfaces/match-filters";
import {UpcomingInterface} from "src/app/shared/interfaces/upcoming";
import {ProfileInterestingH2hInterface} from "../interfaces/profile-interesting-h2h";
import {TitleFinalInterface} from "../interfaces/profile-singles-finals";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly api: string = environment.apiUrl

  constructor(private http: HttpClient) {
  }

  public getInformation(name: string): Observable<ProfileInformationInterface> {
    return this.http.get<ProfileInformationInterface>(`${this.api}/profile/${name}`)
  }

  public getStatistics(name: string): Observable<ProfileStatisticInterface> {
    return this.http.get<ProfileStatisticInterface>(`${this.api}/profile/${name}/statistics`)
  }

  public getUpcomingMatches(name: string): Observable<UpcomingInterface[]> {
    return this.http.get<UpcomingInterface[]>(`${this.api}/profile/${name}/upcoming`)
  }

  public getBreakdown(name: string): Observable<ProfileBreakdownInterface> {
    return this.http.get<ProfileBreakdownInterface>(`${this.api}/profile/${name}/breakdown`)
  }

  public getMatchesPlayed(name: string, filters: any, page: number, limit: number): Observable<DrawInterface> {
    return this.http.get<DrawInterface>(`${this.api}/profile/${name}/matches-played`, {
      params: {
        year: filters?.year,
        level: filters?.level,
        court: filters?.court,
        round: filters?.round,
        week: filters?.week,
        limit: limit,
        page: page,
      }
    })
  }

  public getProfileFilters(name: string): Observable<MatchFiltersInterface> {
    return this.http.get<MatchFiltersInterface>(`${this.api}/profile/${name}/filters`)
  }

  public getSinglesFinals(name: string, year: string): Observable<TitleFinalInterface> {
    return this.http.get<TitleFinalInterface>(`${this.api}/profile/${name}/finals/${year}`)
  }

  public getInterestingH2h(name: string): Observable<ProfileInterestingH2hInterface[]> {
    return this.http.get<ProfileInterestingH2hInterface[]>(`${this.api}/profile/${name}/interesting`)
  }

  public getSummary(name: string): Observable<ProfileSurfaceSummaryInterface[]> {
    return this.http.get<ProfileSurfaceSummaryInterface[]>(`${this.api}/profile/${name}/surface-summary`)
  }

  public getMatchStats(name: string, filters: ProfileMatchStatFiltersInterface | any): Observable<ProfileMatchStatInterface> {
    return this.http.get<ProfileMatchStatInterface>(`${this.api}/profile/${name}/match-stat/${filters.year}`, {
      params: {
        level: filters?.level,
        round: filters?.round,
        court: filters?.court,
      }
    })
  }

  public searchProfiles(str: string, type?: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.api}/profile/search/${str}/${type}`)
  }
}
