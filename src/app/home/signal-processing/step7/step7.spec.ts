import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step7 } from './step7';

describe('Step7', () => {
  let component: Step7;
  let fixture: ComponentFixture<Step7>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step7]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step7);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
