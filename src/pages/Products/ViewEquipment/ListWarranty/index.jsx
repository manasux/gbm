import React, { useState } from 'react';
import { Button, Table } from 'antd';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import moment from 'moment';

const ListWarranty = ({ productDetail, loading, setIsAddWarrantyVisible }) => {
  const columns = [
    {
      title: <span className="text-gray-800 font-medium text-sm">Warranty Period</span>,
      dataIndex: 'warranty',
      key: 'warranty',
      align: 'left',
      width: 40,
      render: (data, record) => (
        <div className="capitalize  text-sm text-red-600">{data || 'n/a'}</div>
      ),
    },
    {
      title: <span className="text-gray-800 font-medium text-sm">PMS</span>,
      dataIndex: 'pms',
      key: 'pms',
      align: 'center',
      width: 30,
      render: (data) => <div className="capitalize  text-sm text-red-600">{data || 'N/A'}</div>,
    },
    {
      title: <span className="text-gray-800 font-medium text-sm">Start Date</span>,
      dataIndex: 'warranty_start_date',
      key: 'warranty_start_date',
      align: 'left',
      width: 50,
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
      width: 50,
      render: (data) => (
        <div className="capitalize text-blue-800 text-sm">
          {moment(data).format('Do MMMM YYYY') || 'N/A'}
        </div>
      ),
    },
    {
      title: <span className="text-gray-800 font-medium text-sm">Action</span>,
      key: 'action',
      align: 'center',
      width: 50,
      render: (data) => (
        <Button type="primary" size="middle" onClick={() => setIsAddWarrantyVisible(true)}>
          Edit
        </Button>
      ),
    },
  ];
  return (
    <>
      <Table
        loading={loading}
        size="small"
        scroll={{ y: 350, x: 800 }}
        columns={
          productDetail && productDetail?.is_draft
            ? columns
            : columns?.filter((c) => c?.key !== 'action')
        }
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
