import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step12 } from './step12';

describe('Step12', () => {
  let component: Step12;
  let fixture: ComponentFixture<Step12>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step12]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step12);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
