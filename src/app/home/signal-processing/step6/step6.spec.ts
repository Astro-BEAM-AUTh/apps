import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step6 } from './step6';

describe('Step6', () => {
  let component: Step6;
  let fixture: ComponentFixture<Step6>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step6]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step6);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
