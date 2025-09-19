import { UserModel } from '../../models/user-list-model';

export const userList: UserModel[] = [
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+353-80001',
    status: 'Active',
    roles: 'Super Admins',
    warehouse: 'Cherry Orchard,Rashad Simmons,Todd Cantrell,Baldonnell',
  },
  {
    name: 'Sarah Johnson',
    email: 'alma.lawson@example.com',
    phone: '+353-80002',
    status: 'Active',
    roles: 'Super Admins',
    warehouse: 'Cherry Orchard,Baldonnell,Barrett Street',
  },
  {
    name: 'Maria Smith',
    email: 'curtis.weaver@example.com',
    phone: '+353-80003',
    status: 'Inactive',
    roles: 'Account Manager',
    warehouse: 'Cherry Orchard',
  },
  {
    name: 'James Brown',
    email: 'felicia.reid@example.com',
    phone: '+353-80004',
    status: 'Inactive',
    roles: 'CHS-Orders',
    warehouse: 'Cherry Orchard,Baldonnell,Barrett Street,Celbridge',
  },
  {
    name: 'Emily Davis',
    email: 'felicia.reid@example.com',
    phone: '+353-90453',
    status: 'Pending',
    roles: 'Super Admins,Account Manager,Warehouse Manager,Accounts Admin',
    warehouse: 'Barrett Street',
  },
  {
    name: 'Michael Wilson',
    email: 'jackson.graham@example.com',
    phone: '+353-80005',
    status: 'Active',
    roles:
      'Super Admins,Account Manager,Delivery Operative,Warehouse Picker,Warehouse Manager,CHS-Orders,Supplier Account Manager,Product Technical Support',
    warehouse: 'Cherry Orchard',
  },
];
