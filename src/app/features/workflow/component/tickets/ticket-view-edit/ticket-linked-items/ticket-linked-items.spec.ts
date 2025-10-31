import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketLinkedItems } from './ticket-linked-items';

describe('TicketLinkedItems', () => {
  let component: TicketLinkedItems;
  let fixture: ComponentFixture<TicketLinkedItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketLinkedItems],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketLinkedItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
