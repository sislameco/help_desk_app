import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTicketModal } from './add-edit-ticket-modal';

describe('AddEditTicketModal', () => {
  let component: AddEditTicketModal;
  let fixture: ComponentFixture<AddEditTicketModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditTicketModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditTicketModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
