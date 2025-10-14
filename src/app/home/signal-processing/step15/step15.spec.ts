import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step15 } from './step15';

describe('Step15', () => {
  let component: Step15;
  let fixture: ComponentFixture<Step15>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step15]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step15);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
