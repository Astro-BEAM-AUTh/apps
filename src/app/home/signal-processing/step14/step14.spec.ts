import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step14 } from './step14';

describe('Step14', () => {
  let component: Step14;
  let fixture: ComponentFixture<Step14>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step14]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step14);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
