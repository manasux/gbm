/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Pagination, Row, Table } from 'antd';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import moment from 'moment';
import GlobalTable from '../Table';
import { connect } from 'umi';

const ComplaintsTable = ({ globalSearchComplaints }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);

  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  const complaintColumns = [
    {
      title: 'Sr. No.',
      dataIndex: 'srno',
      key: 'srno',
      align: 'left',
      width: 100,
      render: (_, __, index) => <div> {index + 1 + viewSize * (currentPage - 1)}</div>,
    },
    {
      title: <span className="text-xs">Complaint No.</span>,
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      width: 120,
      render: (data) => <div className="capitalize  text-xs">{data}</div>,
    },
    {
      title: <span className="text-xs">Product Name</span>,
      dataIndex: 'product',
      key: 'product',
      align: 'left',
      width: 120,
      render: (data) => <div className=" capitalize  text-xs">{data?.name || 'N/A'}</div>,
    },
    {
      title: <span className="text-xs">Product Company</span>,
      dataIndex: 'productCompany',
      key: 'productCompany',
      align: 'left',
      width: 120,
      render: (data, record) => (
        <div className="capitalize  text-xs">
          {data?.name || (record?.category === 'Product' && record?.company?.name)}
        </div>
      ),
    },
    {
      title: <span className="text-xs">Category</span>,
      dataIndex: 'category',
      key: 'category',
      align: 'left',
      width: 120,
      render: (data) => <div className="capitalize  text-xs">{data}</div>,
    },
    {
      title: <span className="text-xs">Contract Status</span>,
      dataIndex: 'warrantyStatus',
      key: 'warrantyStatus',
      align: 'left',
      width: 180,
      render: (data) => <div className="capitalize  text-xs">{data ? 'yes' : 'no'}</div>,
    },
    {
      title: <span className="text-xs">Complaint Raised By</span>,
      align: 'left',
      key: 'createdBy',
      width: 180,
      dataIndex: 'createdBy',

      render: (createdBy, record) => (
        <div className="text-xs text-gray-700 ">
          <span className="font-semibold cursor-pointer text-blue-700 underline">
            {createdBy?.displayName}
          </span>
          <div>
            on{' '}
            <span className="font-semibold cursor-pointer ">
              {moment(record?.createdAt)?.format('DD MMMM YYYY')}-
              {moment(record?.createdAt)?.format('LT')}
            </span>
          </div>
        </div>
      ),
    },

    {
      title: <span className="text-xs">Last Modified By</span>,
      align: 'left',
      dataIndex: 'modifiedBy',
      key: 'modifiedBy',
      width: 200,
      render: (modifiedBy, record) => (
        <div className="text-xs text-gray-700 ">
          <span className="font-semibold cursor-pointer text-blue-700 underline">
            {modifiedBy?.displayName}
          </span>
          <div>
            on{' '}
            <span className="font-semibold cursor-pointer ">
              {moment(record?.lastUpdatedAt)?.format('DD MMMM YYYY')}-
              {moment(record?.lastUpdatedAt)?.format('LT')}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: <span className="text-xs">No.of Days</span>,
      dataIndex: 'numberOfDays',
      key: 'numberOfDays',
      width: 120,
      align: 'left',
      render: (data) => <div className="capitalize  text-xs">{`${data} Days`}</div>,
    },
  ];
  return (
    <div className="mt-6">
      <div className="bg-white py-2 px-3 rounded-lg shadow mb-4 bg-blue-600 items-center">
        <span className="px-4 font-semibold text-white">Complaints</span>
      </div>
      <GlobalTable
        data={globalSearchComplaints?.records}
        columns={complaintColumns}
        scroll={{ y: 250, x: 1600 }}
      />
    </div>
  );
};

export default connect(({ product }) => ({
  globalSearchComplaints: product?.globalSearchComplaints,
}))(ComplaintsTable);
