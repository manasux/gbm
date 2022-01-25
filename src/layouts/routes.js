/* eslint-disable no-unused-vars */
const {
  DashboardIcon,
  BlogIcon,
  RepairIcon,
  SaleIcon,
  ClipboardIcon,
  NewsPaperIcon,
  HospitalIcon,
  ChatIcon,
  LoanIcon,
  RoundUserIcon,
  UserAvatar,
  AdminIcon,
  RecycleIcon,
  ContactIcon,
  Package,
} = require('@/utils/AppIcons');
import {
  AuditOutlined,
  BranchesOutlined,
  ContactsOutlined,
  DashboardOutlined,
  FormOutlined,
  GoldOutlined,
  ReadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Form from 'rc-field-form/es/Form';

export const routes = [
  {
    id: '/dashboard',
    name: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardOutlined style={{ fontSize: '1rem', fontWeight: 'bold' }} />,
  },
  {
    id: '/complaints',
    name: 'Complaints',
    icon: <ReadOutlined style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '2px' }} />,
    routes: [
      {
        id: '/complaints/all',
        path: '/complaints/all',
        name: 'All Complaints',
      },
      {
        id: '/complaints/register-complaint',
        path: '/complaints/register-complaint',
        name: 'Register Complaints',
      },
    ],
  },
  {
    id: '/pms',
    path: '/pms',
    name: 'PMS',
    icon: <ReadOutlined style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '2px' }} />,
  },
  {
    id: '/contracts',
    name: 'Contracts',
    path: '/contracts',
    icon: <FormOutlined />,
  },

  {
    id: '/equipments',
    name: 'Equipments',
    icon: <GoldOutlined style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '2px' }} />,
    routes: [
      {
        id: '/equipments/all',
        path: '/equipments/all',
        name: 'All Equipments',
      },
      {
        id: '/equipments/add',
        path: '/equipments/add',
        name: 'Add Equipments',
      },
    ],
  },
  {
    id: '/branch-profile/',
    name: 'Hospital Profile',
    path: '/branch-profile',
    icon: <HospitalIcon />,
  },

  {
    id: '/contacts',
    name: 'Contacts',
    icon: <ContactsOutlined style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '2px' }} />,
    routes: [
      {
        id: '/contacts/all',
        path: '/contacts/all',
        name: 'All Contacts',
      },
      {
        id: '/contacts/add',
        path: '/contacts/add',
        name: 'Add Contact',
      },
    ],
  },

  {
    id: '/branches',
    name: 'Branches',
    icon: <AuditOutlined />,
    routes: [
      {
        id: '/branches/all',
        path: '/branches/all',
        name: 'All Branches',
      },
      {
        id: '/branches/add-branch',
        path: '/branches/add-branch',
        name: 'Add Branch',
      },
    ],
  },

  // {
  //   id: "/service/complaints",
  //   name: "Service",
  //   icon: <RepairIcon />,
  //   routes: [
  //     {
  //       id: "/service/complaints",
  //       name: "Complaints",
  //       path: "/service/complaints",
  //     },
  //     {
  //       id: "/service/pms",
  //       name: "PMS",
  //       path: "/service/pms",
  //     },
  //     {
  //       id: "/service/contractOffer",
  //       name: "Contract",
  //       path: "/service/contractOffer",
  //       icon: <Form />
  //     },
  //   ],
  // },
  // *** comment it for now
  // {
  //   id: 'sales',
  //   name: 'Sales',
  //   path: '/sales',
  //   icon: SaleIcon,
  // },
  // {
  //   id: 'tasks',
  //   name: 'My Tasks',
  //   path: '/tasks',
  //   icon: ClipboardIcon,
  // },
  // {
  //   id: 'reports',
  //   name: 'Reports',
  //   path: '/reports',
  //   icon: NewsPaperIcon,
  // },

  // Commented till code is reviewed

  {
    name: 'Hospital',
    icon: <HospitalIcon />,
    routes: [
      {
        id: '/hospital/equipment/all',
        name: 'Hospital Details',
        path: '/hospital/equipment/all',
        // icon: <ReadOutlined />,
      },
      {
        id: '/hospital/equipment/add',
        name: 'Add Equipments',
        path: '/hospital/equipment/add',
        // icon: <ReadOutlined />,
      },
    ],
  },

  // *** comment it for now
  // {
  //   id: 'chat',
  //   name: 'Chat',
  //   path: '/chat',
  //   icon: ChatIcon,
  // },
  // {
  //   id: 'loans',
  //   name: 'Loans',
  //   path: '/loans',
  //   icon: LoanIcon,
  // },
  // {
  //   id: 'accounts',
  //   name: 'Accounts',
  //   path: '/accounts',
  //   icon: RoundUserIcon,
  // },
  // {
  //   id: 'admin',
  //   name: 'Admin',
  //   path: '/admin',
  //   icon: UserAvatar,
  // },
  // {
  //   id: 'settings',
  //   name: 'Settings',
  //   path: '/settings',
  //   icon: AdminIcon,
  // },
  // {
  //   id: 'recycle',
  //   name: 'Recycle Bin',
  //   path: '/recycle-bin',
  //   icon: RecycleIcon,
  // },
  // {
  //   id: 'contactus',
  //   name: 'Contact',
  //   path: '/contactus',
  //   icon: ContactIcon,
  // },
];
