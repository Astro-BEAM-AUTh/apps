import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step11 } from './step11';

describe('Step11', () => {
  let component: Step11;
  let fixture: ComponentFixture<Step11>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step11]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step11);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
