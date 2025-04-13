import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedStatsComponent } from './seed-stats.component';

describe('SeedStatsComponent', () => {
  let component: SeedStatsComponent;
  let fixture: ComponentFixture<SeedStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeedStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
