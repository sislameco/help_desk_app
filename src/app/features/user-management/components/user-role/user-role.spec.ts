import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRole } from './user-role';

describe('UserRoleManagement', () => {
  let component: UserRole;
  let fixture: ComponentFixture<UserRole>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRole],
    }).compileComponents();

    fixture = TestBed.createComponent(UserRole);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
// Renamed to user-role.spec.ts
