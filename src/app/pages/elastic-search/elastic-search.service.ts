import {HttpClient} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {environment} from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class ElasticSearchService {
  private readonly api: string = environment.apiUrl
  constructor(private http: HttpClient) {
  }

  public getElasticSearch(search: string): Observable<any> {
    return this.http.get(`${this.api}/search/${search}`)
  }

  public getSearchByCategory(search: string, category: string): Observable<any> {
    return this.http.get(`${this.api}/search/${search}/${category}`)
  }
}
