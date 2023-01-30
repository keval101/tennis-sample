import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {ProfileService} from '../../pages/profile/services/profile.service';
import {MetaTagsService} from '../services/meta-tags.service';

@Injectable({
  providedIn: 'root'
})
export class ProfiltResolver implements Resolve<boolean> {

  constructor(private profileService: ProfileService, private metaTagService: MetaTagsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const name = route.paramMap.get('name')
    this.getProfileInformation('atp', name as string);
    return of(true);
  }

  getProfileInformation(type: string, name: string) {
    console.log(type)
    this.profileService.getInformation(name).subscribe(
      (res) => {
        const profile = res;
        const metaObject = {
          title: `${profile?.name} Bio, Profile of ${profile?.name} - Stats On All ATP & WTA Players`,
          description: `${profile?.name} Biography. Full profile on tennis career of ${profile?.name}, with all matches and records. Height, photos & stats of all ATP & WTA players including ${profile?.name}.`,
          keywords: `${profile?.name} Bio, Stats, height, photos, tennis`,
        };

        this.metaTagService.updateTheMetaTags(metaObject);
      },
    );
  }
}
