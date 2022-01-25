/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import logo from '@/assets/logo/sidebar_logo.png';
import logosmall from '@/assets/logo/logo-small.svg';
import Icon, { CaretDownOutlined, CaretUpOutlined, LeftOutlined } from '@ant-design/icons';
import CustomTooltip from '@/components/CustomTooltip';
import { Link, history } from 'umi';
import classNames from 'classnames';
import { routes } from './routes';
import styles from './Sidebar.less';

const Sidebar = (props) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [displaySubRoutes, setDisplaySubRoutes] = useState({});
  const activeClass = 'bg-white pt-2 px-6 flex items-center rounded-lg cursor-pointer py-1';
  const inactiveClass = 'pt-2 px-6 flex items-center rounded-lg cursor-pointer py-1';
  const { primaryColor, collapsed, dispatch, location } = props;

  const collapseSideBar = () => {
    dispatch({
      type: 'global/setStates',
      payload: !collapsed,
      key: 'collapsed',
    });
  };

  return (
    <div
      style={{ backgroundColor: primaryColor }}
      className="h-screen overflow-y-auto overflow-x-hidden text-white"
    >
      <div className="border-b mx-2">
        <img
          src={collapsed ? logosmall : logo}
          className={classNames(collapsed ? '' : 'px-10 py-3', 'h-20')}
          alt="Logo"
        />
      </div>
      <div className="flex justify-end">
        <div
          onClick={() => collapseSideBar()}
          className="flex justify-center items-center pt-2 w-6 h-6 border bg-white text-gray-700 font-bold z-50 -mr-3 absolute shadow text-xs -mt-3 rounded-full cursor-pointer"
        >
          <LeftOutlined rotate={collapsed ? 180 : 0} />
        </div>
      </div>
      <div className="py-4">
        {routes.map((route) => (
          <div
            key={route?.name}
            className={classNames(
              'py-1 font-medium text-sm delay-100',
              collapsed ? 'mx-2' : 'mx-6',
            )}
          >
            <CustomTooltip show={collapsed} overlay={route?.name} placement="right">
              {route && route?.routes?.length > 0 ? (
                <>
                  <div
                    onClick={() => {
                      setDisplaySubRoutes({
                        [route.id]: !displaySubRoutes[route.id],
                      });
                      history.push(route.path);
                    }}
                    style={{
                      color: location.pathname.includes(route.id) ? '#fff' : '#fff',
                    }}
                    className={classNames('flex justify-between items-center`', inactiveClass)}
                  >
                    <div className="flex">
                      {/* <Icon component={route.icon} className="mt-1" />{' '} */}
                      {route.icon}
                      <div className={classNames('delay-100 ml-3 pb-1', collapsed ? 'hidden' : '')}>
                        {route.name}
                      </div>
                    </div>
                    <div className="mt-1">
                      {displaySubRoutes[route.id] ? <CaretUpOutlined /> : <CaretDownOutlined />}
                    </div>
                  </div>
                  {displaySubRoutes[route.id] &&
                    route?.routes?.map((item) => (
                      <div className="text-gray-900" key={item?.id}>
                        <Link
                          to={item?.path}
                          style={{
                            color: location.pathname.includes(item.id) ? primaryColor : '#fff',
                            transitionDuration: 'background-color 5s ease-out',
                          }}
                          className={classNames(
                            location.pathname.includes(item.id)
                              ? `${activeClass} ${styles.activecard}`
                              : inactiveClass,
                          )}
                        >
                          <div
                            className={classNames(
                              'delay-100 ml-6 pb-1 ',
                              collapsed ? 'hidden' : '',
                            )}
                          >
                            {item?.name}
                          </div>
                        </Link>
                      </div>
                    ))}
                </>
              ) : (
                <Link
                  to={route.path}
                  onClick={() => setActiveTab(route.name)}
                  style={{
                    color: location.pathname.includes(route.id) ? primaryColor : '#fff',
                    transitionDuration: 'background-color 5s ease-out',
                  }}
                  className={classNames(
                    location.pathname.includes(route.id)
                      ? `${activeClass} ${styles.activecard}`
                      : inactiveClass,
                  )}
                >
                  {/* <Icon component={route.icon} className="text-sm" />{' '} */}
                  {route.icon}
                  <div
                    className={classNames('delay-100 ml-3 pb-1 text-sm', collapsed ? 'hidden' : '')}
                  >
                    {route.name}
                  </div>
                </Link>
              )}
            </CustomTooltip>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
