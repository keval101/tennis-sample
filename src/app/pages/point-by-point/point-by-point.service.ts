import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PointByPointService {
  private readonly api: string = environment.apiUrl

  constructor(private http: HttpClient) {}

  getPointByPointData(
    year?: number | string,
    courtid?: number | string,
    rank?: number | string,
    pageNumber?: number,
    sortBy?: number | string,
    sortOrder?: number | string,
    type?: string,
    group?: string,
    ranking?: number | string,
    pageSize?: number | string
  ): Observable<any> {
    return this.http.get(
      `${this.api}/pbp-stat/${type}?year=${year}&courtid=${courtid}&rank=${rank}&pageNumber=${pageNumber}&sortBy=${sortBy}&pageSize=${pageSize}&sortOrder=${sortOrder}&group=${group}&ranking=${ranking}`
    );
  }
}
