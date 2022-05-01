import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Protected.ComponentComponent } from './protected.component.component';

describe('Protected.ComponentComponent', () => {
  let component: Protected.ComponentComponent;
  let fixture: ComponentFixture<Protected.ComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Protected.ComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Protected.ComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
