import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-protected-component',
  templateUrl: './protected-component.component.html',
  styleUrls: ['./protected-component.component.css']
})
export class ProtectedComponentComponent implements OnInit {
  message;
  constructor() {
    this.message = 'Protected endpoint!';
  }

  ngOnInit(): void {
  }

}
