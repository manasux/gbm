import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useIntl, connect, Link } from 'umi';
import { getMatchMenu } from '@umijs/route-utils';
import Authorized from '@/utils/Authorized';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Result } from 'antd';
import moment from 'moment';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

const CustomLayout = (props) => {
  const {
    settings,
    route = {
      routes: [],
    },
    collapsed,
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  const [sideBarWidth, setSideBarWidth] = useState(collapsed ? 80 : 250);

  const menuDataRef = useRef([]);

  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
        authority: undefined,
      },
    [location.pathname],
  );
  moment.locale('en');

  useEffect(() => {
    setSideBarWidth(collapsed ? 80 : 250);
  }, [collapsed]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <div className="flex">
        <div style={{ width: `${sideBarWidth}px`, transition: '0.2s' }}>
          <Sidebar {...props} {...settings} />
        </div>
        <div className="">
          <div className="bg-white px-4 py-3">
            <Topbar />
          </div>
          <div
            style={{
              height: 'calc(100vh - 68px)',
              width: `calc(100vw - ${sideBarWidth}px)`,
              transition: '0.2s',
            }}
            className="bg-gray-100 pt-2 pb-4 overflow-y-auto overflow-x-hidden"
          >
            <Authorized authority={authorized.authority} noMatch={noMatch}>
              {children}
            </Authorized>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings, global }) => ({ ...settings, collapsed: global.collapsed }))(
  CustomLayout,
);
