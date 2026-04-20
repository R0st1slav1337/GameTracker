import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualAddingComponent } from './manual-adding.component';

describe('ManualAddingComponent', () => {
  let component: ManualAddingComponent;
  let fixture: ComponentFixture<ManualAddingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualAddingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualAddingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
