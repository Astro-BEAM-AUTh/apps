import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step10 } from './step10';

describe('Step10', () => {
  let component: Step10;
  let fixture: ComponentFixture<Step10>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step10]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step10);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
