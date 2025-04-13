import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HitnrunComponent } from './hitnrun.component';

describe('HitnrunComponent', () => {
  let component: HitnrunComponent;
  let fixture: ComponentFixture<HitnrunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HitnrunComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HitnrunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
