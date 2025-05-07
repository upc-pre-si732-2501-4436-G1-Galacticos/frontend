import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerManagementComponent } from './planner-management.component';

describe('PlannerManagementComponent', () => {
  let component: PlannerManagementComponent;
  let fixture: ComponentFixture<PlannerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlannerManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlannerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
