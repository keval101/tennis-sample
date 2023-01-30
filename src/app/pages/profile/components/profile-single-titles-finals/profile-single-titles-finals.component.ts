import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'src/app/pages/profile/services/profile.service';
import { SinglesInterface } from '../../interfaces/profile-singles-finals';
import { TabActiveInterface } from 'src/app/shared/interfaces/tab-active';

@Component({
  selector: 'app-profile-single-titles-finals',
  templateUrl: './profile-single-titles-finals.component.html',
  styleUrls: ['./profile-single-titles-finals.component.scss'],
})
export class ProfileSingleTitlesFinalsComponent
  implements OnInit, AfterViewInit
{
  titles: SinglesInterface[] = [];
  finals: SinglesInterface[] = [];

  activeGroups: TabActiveInterface[] = [
    { name: 'Title', active: 'title', isActive: true },
    { name: 'Finals', active: 'finals', isActive: true },
    { name: 'Semis', active: 'semis', isActive: true },
  ];

  @ViewChild('titlesBody') titlesBody!: TemplateRef<any>;
  @ViewChild('finalsBody') finalsBody!: TemplateRef<any>;
  @ViewChild('semisBody') semisBody!: TemplateRef<any>;

  @Input() years: string[] = [];
  @Input() type: string | undefined;

  public profileName = '';

  public selectedGroup: 'title' | 'finals' | 'semis' = 'title';

  public page = 0;

  currentTable?: any;

  public active: TabActiveInterface = this.activeGroups[0];

  constructor(
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.profileName = params['name'];
      this.finals = [];
      this.titles = [];
      this.getSinglesFinals(this.profileName, this.years[0]);
    });
  }

  ngAfterViewInit() {
    this.currentTable = {
      body: this.titlesBody,
    };
    this.cd.detectChanges();
  }

  changeYear(year: string) {
    this.getSinglesFinals(this.profileName, year);
  }

  public changeActiveGroup(active: TabActiveInterface) {
    this.active = active;
    this.page = 0;
    this.selectedGroup = active.active as 'title' | 'finals' | 'semis';
    let templates: any;
    if (active.active == 'title') {
      templates = {
        body: this.titlesBody,
      };
    }
    if (active.active == 'finals') {
      templates = {
        body: this.finalsBody,
      };
    }
    if (active.active == 'semis') {
      templates = {
        body: this.semisBody,
      };
    }

    this.currentTable = {
      body: templates?.body,
    };
  }

  private getSinglesFinals(name: string, year: string) {
    this.profileService.getSinglesFinals(name, year).subscribe((finals) => {
      this.titles = finals.titles;
      this.finals = finals.finals;
    });
  }

  navigateToTournament(name: string, year: string) {
    this.router.navigate([
       
      'draw-results',
      `${this.type}`,
      name,
      new Date(year).getFullYear(),
    ]);
  }
}
