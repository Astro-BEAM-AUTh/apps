import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step8 } from './step8';

describe('Step8', () => {
  let component: Step8;
  let fixture: ComponentFixture<Step8>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step8]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step8);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
