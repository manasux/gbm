// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'en-US',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
        {
          name: 'signup',
          path: '/user/signup',
          component: './user/signup',
        },
        {
          name: 'inviteUser',
          path: '/user/forgotpassword',
          component: './user/ForgotPassword',
        },
        {
          name: 'resetPassword',
          path: '/user/resetpassword',
          component: './user/ResetPassword',
        },
        {
          name: 'inviteUser',
          path: '/user/invitedUserLogin',
          component: './user/acceptInvitation',
        },
        {
          name: 'accountSetup',
          path: '/user/accountsetup',
          component: './user/AccountSetup',
        },
      ],
    },

    {
      path: '/privacy-policy',
      name: 'privacyPolicy',
      component: './Policy',
    },
    {
      path: '/server-unreachable',
      name: 'serverUnderMaintenance',
      hideInMenu: true,
      component: './ServerDown',
    },
    {
      path: '/',
      component: '../layouts/UserLayout',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              path: '/',
              redirect: '/dashboard',
            },
            {
              path: '/dashboard',
              name: 'dashboard',
              icon: 'dashboard',
              headerName: 'DashBorad',
              component: './Dashboard',
            },
            {
              path: '/complaints',
              name: 'complaints',
              icon: 'ReadOutlined',
              routes: [
                {
                  path: '/complaints/all',
                  name: 'allcomplaints',
                  component: './Services/AllComplaints',
                },
                {
                  path: '/complaints/register-complaint',
                  name: 'registerComplaint',
                  component: './Services/RegisterComplaintForm',
                },
                {
                  path: '/complaints/equipments/view/:serialNumberId',
                  name: 'viewProduct',
                  hideInMenu: true,
                  component: './Products/ViewEquipment',
                },
              ],
            },
            {
              path: '/pms',
              name: 'pms',
              icon: 'ReadOutlined',
              routes: [
                {
                  path: '/pms',
                  name: 'allPms',
                  component: './Services/AllPMS',
                  hideInMenu: true,
                },
                {
                  path: '/pms/equipments/view/:serialNumberId',
                  name: 'viewProduct',
                  hideInMenu: true,
                  component: './Products/ViewEquipment',
                },
              ],
            },
            {
              path: '/contracts',
              name: 'contracts',
              icon: 'form',
              routes: [
                {
                  path: '/contracts',
                  name: 'allContracts',
                  component: './AllContracts',
                  hideInMenu: true,
                },
                {
                  path: '/contracts/equipments/view/:serialNumberId',
                  name: 'viewProduct',
                  component: './Products/ViewEquipment',
                  hideInMenu: true,
                },
              ],
            },
            {
              path: '/equipments',
              name: 'equipments',
              icon: 'ApartmentOutlined',
              routes: [
                {
                  path: '/equipments/all',
                  name: 'allEquipments',
                  component: './Products/AllProducts',
                },
                {
                  path: '/equipments/add',
                  name: 'addProduct',
                  component: './Products/AddProduct',
                },
                {
                  path: '/equipments/view/:serialNumberId',
                  name: 'viewProduct',
                  hideInMenu: true,
                  component: './Products/ViewEquipment',
                },
              ],
            },

            {
              path: '/branch-profile',
              name: 'hospitalProfile',
              icon: 'BankOutlined',
              component: './Hospitals/HospitalBranchProfile',
            },
            {
              path: '/branches',
              name: 'branches',
              icon: 'ProjectOutlined',
              authority: ['headquarter'],
              routes: [
                {
                  path: '/branches/all',
                  name: 'allBranches',
                  component: './Hospitals/AllHospitalsProfileList',
                },
                {
                  path: '/branches/profile/:profileId',
                  name: 'branchProfile',
                  component: './Hospitals/HospitalBranchProfile',
                  hideInMenu: true,
                },
                {
                  path: '/branches/stats/:profileId',
                  name: 'branchStats',
                  component: './Hospitals/HospitalStats',
                  hideInMenu: true,
                },
                {
                  path: '/branches/add-branch',
                  name: 'addBranch',
                  component: './Hospitals/AddHospitalProfile',
                },
              ],
            },
            {
              path: '/requests',
              name: 'requests',
              icon: 'solution',
              hideInMenu: true,
              routes: [
                {
                  path: '/requests/all',
                  name: 'allrequests',
                  component: './Requests/AllRequests',
                },
                {
                  path: '/requests/create',
                  name: 'create-request',
                  component: './Requests/CreateRequest',
                },
              ],
            },

            // {
            //   path: '/service',
            //   name: 'service',
            //   component: '../layouts/ServiceTabsLayout',
            //   routes: [
            //     {
            //       path: '/service/complaints',
            //       name: 'allComplaints',
            //       component: './Services/AllComplaints',
            //     },
            //     {
            //       path: '/service/pms',
            //       name: 'allPms',
            //       component: './Services/AllPMS',
            //     },
            //     {
            //       path: '/service/registerComplaint',
            //       name: 'registerComplaint',
            //       component: './Services/RegisterComplaintForm',
            //     },
            //   ],
            // },

            {
              path: '/contacts',
              name: 'contacts',
              icon: 'TeamOutlined',
              routes: [
                {
                  path: '/contacts/all',
                  name: 'allContacts',
                  component: './Hospitals/AllHospitalContactList',
                },
                {
                  path: '/contacts/add',
                  name: 'addContact',
                  component: './Hospitals/AddHospitalContact',
                },
              ],
            },

            // Commented till code is reviewed

            // {
            //   path: '/hospital',
            //   name: 'hospital',
            //   component: '../layouts/TabsLayout',
            //   routes: [
            //     {
            //       path: '/hospital/equipment/all',
            //       name: 'allEquipments',
            //       component: './Products/AllProducts',
            //     },
            //     {
            //       path: '/hospital/contacts/all',
            //       name: 'allContacts',
            //       component: './Hospitals/AllHospitalContactList',
            //     },
            //     {
            //       path: '/hospital/contacts/listAdd',
            //       name: 'addContacts',
            //       component: './Hospitals/AddHospitalContact',
            //     },

            //     {
            //       path: '/hospital/profile',
            //       name: 'profile',
            //       component: './Hospitals/AllHospitalsProfileList',
            //     },
            //     {
            //       path: '/hospital/branchprofile/:profileId',
            //       name: 'profile',
            //       component: './Hospitals/HospitalBranchProfile',
            //     },
            //     {
            //       path: '/hospital/profile/listAdd',
            //       name: 'addProfile',
            //       component: './Hospitals/AddHospitalProfile',
            //     },
            //     {
            //       path: '/hospital/equipment/add',
            //       name: 'addEquipments',
            //       component: './Products/AddProduct',
            //     },

            //     {
            //       path: '/hospital/equipments/:serialNumberId',
            //       name: 'updateEquipments',
            //       hideInMenu: true,
            //       component: './Products/AddProduct',
            //     },
            //   ],
            // },
            {
              path: '/departments',
              name: 'departments',
              icon: 'profile',
              hideInMenu: true,
              component: './Departments',
            },
            {
              path: '/staff',
              name: 'staff',
              // hideInMenu: true,
              icon: 'user',
              routes: [
                {
                  name: 'staff-list',
                  path: '/staff/list',
                  component: './Staff/StaffList',
                },
                {
                  name: 'staff-invite',
                  path: '/staff/invite',
                  component: './Staff/InviteStaff',
                },
                {
                  name: 'staffDetails',
                  path: '/staff/:profileId/profile',
                  component: './Staff/StaffDetails',
                  hideInMenu: true,
                },
                {
                  name: 'staffUpdate',
                  path: '/teachers/:staffId',
                  component: './Staff/component/UpdateStaffDetails',
                  hideInMenu: true,
                },
              ],
            },
            {
              path: '/user-profile',
              name: 'user-profile',
              component: './UserProfile',
              hideInMenu: true,
            },
            // *** global Search Component path
            {
              name: 'Search',
              path: '/search',
              hideInMenu: true,
              component: './GlobalSearchPage',
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
