import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserRoleModal } from './create-user-role-modal';

describe('CreateUserRoleModal', () => {
  let component: CreateUserRoleModal;
  let fixture: ComponentFixture<CreateUserRoleModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUserRoleModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUserRoleModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
