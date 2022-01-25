import React, { useState } from 'react';
import { Button, Table } from 'antd';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import moment from 'moment';

const ListAfterWarranty = ({
  productDetail,
  loading,
  setIsAddAfterWarrantyVisible,
  setAfterWarrantyModalType,
  setAfterWarrantyRecord,
}) => {
  const columns = [
    {
      title: <span className="text-gray-800 font-medium text-sm">Contract Type</span>,
      dataIndex: ['contractType', 'name'],
      key: 'contractType',
      align: 'left',
      width: 100,
      render: (data, record) => (
        <div className="capitalize  text-sm text-amber-600">{data || 'n/a'}</div>
      ),
    },
    {
      title: <span className="text-gray-800 font-medium text-sm">Sub Type</span>,
      dataIndex: ['contractSubType', 'name'],
      key: 'subType',
      align: 'left',
      width: 100,
      render: (data, record) => (
        <div className="capitalize  text-sm text-amber-600">{data || 'N/A'}</div>
      ),
    },
    {
      title: <span className="text-gray-800 font-medium text-sm">Contract Period</span>,
      dataIndex: 'period',
      key: 'contractPeriod',
      align: 'center',
      width: 100,
      render: (data) => <div className="capitalize  text-sm text-red-600">{data || 'N/A'}</div>,
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
      dataIndex: 'startDate',
      key: 'warranty_start_date',
      align: 'left',
      width: 100,
      render: (data, record) => (
        <div className="capitalize  text-sm text-blue-800">
          {(data && moment(data).format('Do MMMM YYYY')) || 'N/A'}
        </div>
      ),
    },
    {
      title: <span className="text-gray-800 font-medium text-sm">End Date</span>,
      dataIndex: 'endDate',
      key: 'warranty_end_date',
      align: 'left',
      width: 100,
      render: (data, record) => (
        <div className="capitalize  text-sm text-blue-800">
          {(data && moment(data).format('Do MMMM YYYY')) || 'N/A'}
        </div>
      ),
    },
    {
      title: <span className="text-gray-800 font-medium text-sm">Contract Price</span>,
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      width: 100,
      render: (data) => <div className="capitalize text-sm text-green-800">{data || 'N/A'}</div>,
    },
    {
      title: <span className="text-gray-800 font-medium text-sm">Action</span>,
      key: 'action',
      align: 'center',
      width: 100,
      render: (data, record) => (
        <Button
          type="primary"
          size="middle"
          onClick={() => {
            setAfterWarrantyModalType('update');
            setIsAddAfterWarrantyVisible(true);
            setAfterWarrantyRecord(record);
          }}
        >
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
        scroll={{ y: 350, x: 1200 }}
        columns={productDetail ? columns : columns?.filter((c) => c?.key !== 'action')}
        dataSource={
          (productDetail?.contractsDetails?.length > 0 && productDetail?.contractsDetails) || []
        }
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
