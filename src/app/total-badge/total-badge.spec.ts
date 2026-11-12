import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TotalBadge } from './total-badge';

describe('TotalBadge', () => {
  let component: TotalBadge;
  let fixture: ComponentFixture<TotalBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
