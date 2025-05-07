import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietsManagementComponent } from './diets-management.component';

describe('DietsManagementComponent', () => {
  let component: DietsManagementComponent;
  let fixture: ComponentFixture<DietsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DietsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DietsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
