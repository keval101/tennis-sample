import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-not-stat",
  templateUrl: "./not-stat.component.html",
  styleUrls: ["./not-stat.component.scss"],
})
export class NotStatComponent implements OnInit {
  constructor() {}
  @Input() title?: string;
  @Input() addPadding?: boolean = false;
  ngOnInit(): void {}
}
