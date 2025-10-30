import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSpecification } from './ticket-specification';

describe('TicketSpecification', () => {
  let component: TicketSpecification;
  let fixture: ComponentFixture<TicketSpecification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketSpecification],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketSpecification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
