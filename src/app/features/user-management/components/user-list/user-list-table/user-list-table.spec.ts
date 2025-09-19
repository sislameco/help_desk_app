import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListTable } from './user-list-table';

describe('UserListTable', () => {
  let component: UserListTable;
  let fixture: ComponentFixture<UserListTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListTable],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
