import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointByPointTableComponent } from './components/point-by-point-table/point-by-point-table.component';
import { PointByPointComponent } from './point-by-point.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PointByPointComponent,
    PointByPointTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    PointByPointComponent,
    PointByPointTableComponent
  ]
})
export class PointByPointModule { }
