/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
/* eslint-disable no-lonely-if */
import React, { useState, useEffect } from 'react';
import { connect, history, Link, useLocation } from 'umi';
import { Tabs, Button } from 'antd';
import { getPageQuery } from '@/utils/utils';
import {
  CheckCircleFilled,
  ClockCircleFilled,
  DoubleLeftOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const TabsLayout = ({ children, currentUser, productDetail }) => {
  const { TabPane } = Tabs;
  const [addProduct, displayAddProduct] = useState(true);
  const { pathname, query } = useLocation();
  const { task } = getPageQuery();
  const [tab, setTab] = useState('');

  useEffect(() => {
    if (pathname.includes('add') || query?.task || pathname.includes('drafts')) {
      displayAddProduct(false);
    } else {
      displayAddProduct(true);
    }
  }, [pathname]);

  const reqPath = () => {
    switch (pathname) {
      case '/hospital/equipment/all':
        return 'My Equipments';
      case '/hospital/contacts/all':
        return 'Hospital Contacts';
      case '/hospital/department':
        return 'Hospital Department';
      case '/hospital/profile':
        return 'Hospital Profile List';
      case '/hospital/equipment/add':
        return 'Add Equipments';
      case '/hospital/contacts/listAdd':
        return 'Add Contacts';
      case '/hospital/department/add':
        return 'Add Department';
      case '/hospital/profile/listAdd':
        return 'Add Hospital Profile';
      default:
        if (pathname?.includes('drafts')) {
          return 'My Drafts';
        }
        if (task === 'hospitalbranch') {
          return 'Hospital Branch';
        }
        break;
    }
  };
  useEffect(() => {
    if (pathname === '/hospital/equipment/all') {
      setTab('equipment');
    }
    if (pathname === '/hospital/contacts/all') {
      setTab('contacts');
    }
    if (pathname === '/hospital/contacts/listAdd') {
      setTab('contacts');
    }

    if (pathname === '/hospital/equipment/add') {
      setTab('equipment');
    }
    if (pathname === '/hospital/profile') {
      setTab('profile');
    }
    if (pathname === '/hospital/profile/listAdd') {
      setTab('profile');
    }
    if (task === 'hospitalbranch') {
      setTab('profile');
    }
    if (task === 'updateEquipments') {
      setTab('equipment');
    }
  }, [pathname]);

  const getActionBtn = () => {
    switch (pathname) {
      case '/hospital/equipment/all':
        return (
          <div className="flex justify-end w-64">
            <Link to="/hospital/equipment/add">
              <Button type="primary" icon={<PlusOutlined style={{ fontSize: '16px' }} />}>
                Add Products
              </Button>
            </Link>
          </div>
        );
      case '/hospital/contacts/all':
        return (
          <div className="flex justify-end w-64">
            <Link to="/hospital/contacts/listAdd">
              <Button type="primary" icon={<PlusOutlined style={{ fontSize: '16px' }} />}>
                Add Contacts
              </Button>
            </Link>
          </div>
        );
      case '/hospital/profile':
        return (
          <div className="flex justify-end w-64">
            <Link to="/hospital/profile/listAdd">
              <Button type="primary" icon={<PlusOutlined style={{ fontSize: '16px' }} />}>
                Add Hospital
              </Button>
            </Link>
          </div>
        );
      case '/hospital/profile/listAdd':
        return (
          <div className="flex justify-end w-64">
            <Link to="/hospital/profile">
              <Button type="primary" icon={<DoubleLeftOutlined style={{ fontSize: '16px' }} />}>
                go to hospital profiles
              </Button>
            </Link>
          </div>
        );
      case '/hospital/branchprofile/':
        return (
          <div className="flex justify-end w-64">
            <Link to="/hospital/profile">
              <Button type="primary" icon={<EyeOutlined style={{ fontSize: '16px' }} />}>
                Hospital Profiles
              </Button>
            </Link>
          </div>
        );
      case '/hospital/contacts/listAdd':
        return (
          <div className="flex justify-end w-64">
            <Link to="/hospital/contacts/all">
              <Button type="primary" icon={<DoubleLeftOutlined style={{ fontSize: '16px' }} />}>
                go to hospital contacts
              </Button>
            </Link>
          </div>
        );

      default:
        if (task === 'hospitalbranch') {
          return (
            <div className="flex justify-end w-64">
              <Link to="/hospital/profile">
                <Button type="primary" icon={<DoubleLeftOutlined style={{ fontSize: '16px' }} />}>
                  go to hospital profiles
                </Button>
              </Link>
            </div>
          );
        }
        break;
    }
  };
  return (
    <>
      <div
        className="flex justify-between items-center sm:text-xs md-text-lg lg:text-xl  font-semibold mb-4 mx-12"
        style={{ color: '#111642' }}
      >
        {reqPath()}
        {task && task === 'updateEquipments' && 'Product Name with detail'}
      </div>
      <div className="flex justify-between mb-4 border-b px-6 mx-6">
        <Tabs
          activeKey={tab}
          className="w-full "
          onTabClick={(key) => {
            if (key === 'equipment') {
              history.replace(`/hospital/equipment/all`);
            }
            if (key === 'contacts') {
              history.replace(`/hospital/contacts/all`);
            }
            if (key === 'profile') {
              history.replace(`/hospital/profile`);
            }
            setTab(key);
          }}
          style={{ color: '#111642' }}
          tabBarExtraContent={getActionBtn()}
        >
          <TabPane
            tab={<span className="font-medium "> Hospital Equipments</span>}
            key="equipment"
          />
          <TabPane tab={<span className=" font-medium ">Hospital Contacts</span>} key="contacts" />

          <TabPane tab={<span className=" font-medium ">Hospital Profile</span>} key="profile" />
        </Tabs>
        {!productDetail?.is_verified && task === 'updateEquipments' && (
          <div className="flex flex-col ">
            <div className="flex items-center">
              {productDetail?.is_draft ? (
                <ExclamationCircleOutlined
                  style={{
                    color: 'rgb(0 91 231)',
                    marginRight: '10px',
                    fontSize: '16px',
                  }}
                />
              ) : (
                <ClockCircleFilled
                  style={{
                    color: 'rgb(0 91 231)',
                    marginRight: '10px',
                    fontSize: '16px',
                  }}
                />
              )}
              <span className="sm:text-sm text-lg text-gray-500 font-semibold w-full">
                {`Your product ${' '}${
                  productDetail?.is_draft
                    ? 'is in draft,submit your product for the approval.'
                    : 'has been submitted for the approval.'
                } `}
              </span>
            </div>
            <div className="font-bold w-full ml-7">Your PMS is overdue by 28 days</div>
          </div>
        )}
        {productDetail?.is_verified && task === 'updateEquipments' && (
          <div className="flex flex-col justify-center">
            <div className="flex  items-center w-56">
              <CheckCircleFilled
                style={{
                  color: 'rgb(0 91 231)',
                  fontSize: '16px',
                  marginTop: '4px',
                }}
              />
              <span className="sm:text-sm ml-2 text-lg text-gray-500 font-semibold">
                Your product is approved
              </span>
            </div>
            <div className="font-bold w-56 ml-6">Your PMS is overdue by 28 days</div>
          </div>
        )}
      </div>
      <div className="mx-6">{children}</div>
    </>
  );
};

export default connect(({ user, product }) => ({
  currentUser: user?.currentUser,
  productDetail: product?.productDetail,
}))(TabsLayout);
