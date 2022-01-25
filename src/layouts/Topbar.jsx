/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { BellFilled, QuestionOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, notification } from 'antd';
import { connect, history, useLocation } from 'umi';
import { debounce } from 'lodash';

const Topbar = ({ currentUser, dispatch }) => {
  const [searchText, setSearchText] = useState('');
  const [viewSize, setViewSize] = useState(10);
  const [startIndex, setStartIndex] = useState(0);
  const { pathname } = useLocation();

  const action = (val) => {
    setSearchText(val);
  };

  const debounceSearch = debounce(action, 400);

  useEffect(() => {
    if (pathname === '/search' && !searchText) {
      history.push('/dashboard');
      return;
    }
    if (searchText) {
      dispatch({
        type: 'product/getGlobalSearchAllProducts',
        payload: {
          view_size: viewSize,
          is_variant: 'N',
          keyword: searchText,
          customer_id: currentUser?.personal_details?.organizationDetails?.orgPartyId,
        },
      })
        .then((res) => {
          if (res?.records && res?.records?.length > 0) {
            history.push('/search');
          } else {
            history.push('/dashboard');
          }
        })
        .catch((err) => console.log(`err from main`, err));

      dispatch({
        type: 'product/getGlobalSearchComplaints',
        payload: {
          query: {
            customerId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
            keyword: searchText,
            startIndex,
            viewSize,
          },
        },
      })
        .then((res) => {
          if (res?.records && res?.records?.length > 0) {
            history.push('/search');
          } else {
            history.push('/dashboard');
          }
        })
        .catch((err) => {
          if (err) {
            console.log(`err  from complaints`, err);
          }
        });

      dispatch({
        type: 'product/getGlobalSearchPMS',
        payload: {
          query: {
            customerId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
            keyword: searchText,
            startIndex,
            viewSize,
          },
        },
      })
        .then((res) => {
          if (res?.records && res?.records?.length > 0) {
            history.push('/search');
          } else {
            history.push('/dashboard');
          }
        })
        .catch((err) => {
          if (err) {
            console.log(`err from PMS`, err);
          }
        });
    }
  }, [searchText]);

  return (
    <div className="flex justify-around items-center bg-white px-4 py-2 w-full">
      <div style={{ minWidth: '20rem' }}>
        <Input
          prefix={<SearchOutlined className="mt-1 text-gray-500 mr-3" />}
          size="medium"
          bordered={true}
          className="bg-gray-100"
          placeholder="Search"
          setSearchText={setSearchText}
          searchText={searchText}
          onChange={(e) => debounceSearch(e?.target?.value)}
        />
      </div>

      <div className="relative flex  items-center">
        <div className="px-2 relative cursor-pointer">
          <span className="border-2 border-white absolute right-2 top-0 flex items-center justify-center h-3 w-3 rounded-full bg-red-700 text-white text-xs font-medium -ml-6 mt-1 mr-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 -ml-0 -mt-0" />
            <span className="relative inline-flex rounded-full" />
          </span>
          <div className="flex rounded-full px-2 pt-2 pb-1 bg-gray-100 text-gray-900 items-center mr-2 ">
            <BellFilled className="text-lg text-blue-900 " />
          </div>
        </div>

        <div className="bg-gray-100 cursor-pointer rounded-full pb-1 text-lg text-gray-900 pl-2 pr-2  mr-3">
          <QuestionOutlined />
        </div>
      </div>
    </div>
  );
};

export default connect(({ user }) => ({
  currentUser: user?.currentUser,
}))(Topbar);
