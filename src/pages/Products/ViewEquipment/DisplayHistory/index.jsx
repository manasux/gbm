/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { connect, useParams, useLocation } from 'umi';
import { Table } from 'antd';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import classNames from 'classnames';
import styles from './index.less';

const DisplayHistory = ({ dispatch, activities, loading }) => {
  const { pathname } = useLocation();

  const { serialNumberId } = useParams();
  useEffect(() => {
    dispatch({
      type: 'product/getActivities',
      payload: {
        pathParams: { productId: serialNumberId || pathname.split('drafts/')[1] },
      },
    });
  }, []);

  const historyColumns = [
    {
      title: <span className="text-xs">Activity performed by</span>,
      align: 'left',
      dataIndex: 'author',
      render: (data) => (
        <div className="mx-2 capitalize text-xs">
          Modified by
          <span className="mx-1 text-blue-600 underline"> {data?.displayName || '-'}</span>
        </div>
      ),
    },
    {
      title: <span className="text-xs">Section Name</span>,
      align: 'left',
      dataIndex: 'section',
      render: (data) => (
        <div className="mx-2 capitalize text-xs">
          {data === 'Basic Information' ? 'Product Description' : data}
        </div>
      ),
    },
    {
      title: <span className="text-xs">Task Name</span>,
      align: 'left',
      dataIndex: 'description',
      render: (data) => <div className="mx-2 capitalize text-xs">{data}</div>,
    },
    {
      title: <span className="text-xs">Date/Time</span>,
      align: 'center',
      dataIndex: 'endDate',
      render: (data) => <div className="mx-2 capitalize text-xs">{data}</div>,
    },
  ];

  return (
    <>
      <div>
        <div className="bg-white rounded-lg p-2">
          <Table
            loading={loading}
            className={classNames(styles.tableStyle)}
            scroll={{ x: 1000, y: 200 }}
            columns={historyColumns}
            dataSource={activities?.records || []}
            rowKey={(record) => record.serial_number}
            pagination={false}
            rowClassName="cursor-pointer"
            locale={{
              emptyText: <EmptyStateContainer />,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default connect(({ user, product, loading }) => ({
  currentUser: user.currentUser,
  activities: product.activities,
  loading: loading.effects['product/getActivities'],
}))(DisplayHistory);
