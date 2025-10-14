import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step13 } from './step13';

describe('Step13', () => {
  let component: Step13;
  let fixture: ComponentFixture<Step13>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step13]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step13);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
