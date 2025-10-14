import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step9 } from './step9';

describe('Step9', () => {
  let component: Step9;
  let fixture: ComponentFixture<Step9>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step9]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step9);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
