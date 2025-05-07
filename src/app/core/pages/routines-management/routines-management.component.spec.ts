import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutinesManagementComponent } from './routines-management.component';

describe('RoutinesManagementComponent', () => {
  let component: RoutinesManagementComponent;
  let fixture: ComponentFixture<RoutinesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutinesManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutinesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
