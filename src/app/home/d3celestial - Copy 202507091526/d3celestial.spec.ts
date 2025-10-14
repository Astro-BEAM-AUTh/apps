import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3celestial } from './d3celestial';

describe('D3celestial', () => {
  let component: D3celestial;
  let fixture: ComponentFixture<D3celestial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [D3celestial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(D3celestial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
