/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-lonely-if */
import React, { useEffect, useState } from 'react';
import { connect, history, Link, useLocation } from 'umi';
import { Tabs, Button } from 'antd';
import { EyeFilled, InboxOutlined, MailOutlined } from '@ant-design/icons';

const ServiceTabsLayout = ({ children }) => {
  const { TabPane } = Tabs;
  const { pathname } = useLocation();
  const [tab, setTab] = useState('');
  const [onlyoneTabActive, setOnlyoneTabActive] = useState('complaintsActive');
  const reqPath = () => {
    switch (pathname) {
      case '/service/complaints':
        return 'Complaints';
      case '/service/track':
        return 'Track';
      case '/service/buyContact':
        return 'Buy Contact';
      case '/service/pms':
        return 'PMS';
      case '/service/contractOffer':
        return 'Contract';
      case '/service/registerComplaint':
        return 'Register Complaint';
      default:
        return 'Complaints';
    }
  };
  useEffect(() => {
    if (pathname === '/service/registerComplaint') {
      setTab('regcomplaints');
      setOnlyoneTabActive('regcomplaintsActive');
    }
    if (pathname === '/service/complaints') setTab('complaints');
    if (pathname === '/service/track') setTab('track');

    if (pathname === '/service/buyContact') setTab('buyContact');
    if (pathname === '/service/pms') setTab('PMS');
    if (pathname === '/service/contractOffer') setTab('contractOffer');
  }, [pathname]);

  return (
    <>
      <div>{children}</div>
    </>
  );
};

export default connect(() => ({}))(ServiceTabsLayout);

// <TabPane tab={<span className=" font-medium ">Track</span>} key="track" />

// <TabPane tab={<span className=" font-medium "> Buy Contact </span>} key="buyContact" />
