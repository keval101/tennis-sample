import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { H2hListComponent } from './h2h-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { H2hModule } from '../h2h/h2h.module';
import { HomeModule } from '../home/home.module';



@NgModule({
  declarations: [
    H2hListComponent
  ],
  imports: [
    CommonModule,SharedModule, HomeModule, H2hModule,HomeModule
  ]
})
export class H2hListModule { }
