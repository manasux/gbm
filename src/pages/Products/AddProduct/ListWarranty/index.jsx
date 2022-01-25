import React, { useState } from 'react';
import { Table } from 'antd';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import moment from 'moment';

const ListWarranty = ({ productDetail, loading }) => {
  const columns = [
    {
      title: <span className="text-gray-800 font-medium text-sm">Warranty Period</span>,
      dataIndex: 'warranty',
      key: 'warranty',
      align: 'left',
      width: 50,
      render: (data, record) => (
        <div className="capitalize  text-sm text-red-600">{data || 'n/a'}</div>
      ),
    },
    {
      title: <span className="text-gray-800 font-medium text-sm">PMS</span>,
      dataIndex: 'pms',
      key: 'pms',
      align: 'center',
      width: 50,
      render: (data) => <div className="capitalize  text-sm text-red-600">{data || 'N/A'}</div>,
    },
    {
      title: <span className="text-gray-800 font-medium text-sm">Start Date</span>,
      dataIndex: 'warranty_start_date',
      key: 'warranty_start_date',
      align: 'left',
      width: 100,
      render: (data) => (
        <div className="capitalize text-blue-800 text-sm">
          {moment(data).format('Do MMMM YYYY') || 'N/A'}
        </div>
      ),
    },
    {
      title: <span className="text-gray-800 font-medium text-sm">End Date</span>,
      dataIndex: 'warranty_end_date',
      key: 'warranty_end_date',
      align: 'left',
      width: 100,
      render: (data) => (
        <div className="capitalize text-blue-800 text-sm">
          {moment(data).format('Do MMMM YYYY') || 'N/A'}
        </div>
      ),
    },
  ];
  return (
    <>
      <Table
        loading={loading}
        size="small"
        scroll={{ y: 350, x: 1000 }}
        columns={columns}
        dataSource={[productDetail] || []}
        pagination={false}
        rowClassName="cursor-pointer"
        locale={{
          emptyText: <EmptyStateContainer />,
        }}
      />
    </>
  );
};

export default ListWarranty;
