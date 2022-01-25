import React, { useState } from 'react';
import { Table } from 'antd';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import moment from 'moment';

const ListAfterWarranty = ({ productDetail, loading }) => {
  const columns = [
    {
      title: <span className="text-gray-800 font-medium text-sm">Contract Type</span>,
      dataIndex: ['contract_details', 'type', 'name'],
      key: 'contractType',
      align: 'left',
      width: 140,
      render: (data, record) => (
        <div className="capitalize  text-sm text-amber-600">{data || 'n/a'}</div>
      ),
    },
    {
      title: <span className="text-gray-800 font-medium text-sm">Sub Type</span>,
      dataIndex: ['contract_details', 'subType', 'name'],
      key: 'subType',
      align: 'left',
      width: 140,
      render: (data, record) => (
        <div className="capitalize  text-sm text-amber-600">{data || 'N/A'}</div>
      ),
    },
    {
      title: <span className="text-gray-800 font-medium text-sm">Contract Period</span>,
      dataIndex: ['contract_details', 'period'],
      key: 'contractPeriod',
      align: 'center',
      width: 140,
      render: (data) => <div className="capitalize  text-sm text-red-600">{data || 'N/A'}</div>,
    },
    {
      title: <span className="text-gray-800 font-medium text-sm">PMS</span>,
      dataIndex: ['contract_details', 'pms'],
      key: 'pms',
      align: 'center',
      width: 140,
      render: (data) => <div className="capitalize  text-sm text-red-600">{data || 'N/A'}</div>,
    },
    {
      title: <span className="text-gray-800 font-medium text-sm">Start Date</span>,
      dataIndex: ['contract_details', 'start_date'],
      key: 'warranty_start_date',
      align: 'left',
      width: 140,
      render: (data, record) => (
        <div className="capitalize  text-sm text-blue-800">
          {moment(data).format('Do MMMM YYYY') || 'N/A'}
        </div>
      ),
    },
    {
      title: <span className="text-gray-800 font-medium text-sm">End Date</span>,
      dataIndex: ['contract_details', 'end_date'],
      key: 'warranty_end_date',
      align: 'left',
      width: 140,
      render: (data, record) => (
        <div className="capitalize  text-sm text-blue-800">
          {moment(data).format('Do MMMM YYYY') || 'N/A'}
        </div>
      ),
    },
    {
      title: <span className="text-gray-800 font-medium text-sm">Contract Price</span>,
      dataIndex: ['contract_details', 'price'],
      key: 'price',
      align: 'center',
      width: 140,
      render: (data) => <div className="capitalize text-sm text-green-800">{data || 'N/A'}</div>,
    },
  ];
  return (
    <>
      <Table
        loading={loading}
        size="small"
        scroll={{ y: 350, x: 1200 }}
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

export default ListAfterWarranty;
