/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Pagination, Row, Table } from 'antd';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import moment from 'moment';
import GlobalTable from '../Table';
import { connect } from 'umi';

const PMSTable = ({ globalSearchPMS }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);

  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };
  //   const getFieldName = () => {
  //     switch (tab) {
  //       case "OVERDUE":
  //         return "Days crossed";
  //       case "UPCOMING":
  //         return "Days left";
  //       default:
  //         return "";
  //     }
  //   };
  const pmsColumns = [
    {
      title: <span className="text-xs">PMS no</span>,
      dataIndex: 'pmsNo',
      key: 'pmsNo',
      align: 'left',
      // render: (_, __, index) => (
      //    // <div> {index + 1 + viewSize * (currentPage - 1)}</div>
      // ),
    },
    {
      title: <span className="text-xs">Product</span>,
      dataIndex: 'typeName',
      key: 'typeName',
      align: 'left',
      render: (data) => <div className=" capitalize  text-xs">{data || 'N/A'}</div>,
    },
    {
      title: <span className="text-xs">Type</span>,
      dataIndex: 'headTypeName',
      key: 'headTypeName',
      align: 'left',
      render: (data, record) => <div className="capitalize  text-xs">{data || 'N/A'}</div>,
    },
    {
      title: <span className="text-xs">Model</span>,
      dataIndex: 'modelName',
      key: 'modelName',
      align: 'left',
      render: (data) => <div className="capitalize  text-xs">{data}</div>,
    },
    {
      title: <span className="text-xs">Company</span>,
      dataIndex: 'brandName',
      key: 'brandName',
      align: 'left',
      render: (data) => <div className="capitalize  text-xs">{data}</div>,
    },
    {
      title: <span className="text-xs">PMS date</span>,
      align: 'left',
      key: 'pmsDate',
      dataIndex: 'pmsDate',
      render: (data) => (
        <span className="font-semibold cursor-pointer ">
          {moment(data)?.format('DD MMMM YYYY')}-{moment(data)?.format('LT')}
        </span>
      ),
    },
    {
      title: <span className="text-xs">hhh</span>,
      align: 'left',
      key: 'daysLeft',
      dataIndex: 'daysLeft',
      render: (data) => <div className="capitalize  text-xs">{data || 'N/A'}</div>,
    },
    {
      title: <span className="text-xs">Completed in days</span>,
      align: 'left',
      key: 'daysDiff',
      dataIndex: 'daysDiff',
      render: (data) => <div className="capitalize  text-xs">{data}</div>,
    },
    {
      title: <span className="text-xs"> Status </span>,
      align: 'left',
      key: 'status',
      dataIndex: 'status',
      render: (data, record) => (
        <div className="text-xs text-gray-700 ">
          <span className="font-semibold cursor-pointer text-blue-700 underline capitalize">
            {data}
          </span>
          <div>
            on{' '}
            <span className="font-semibold cursor-pointer ">
              {moment(record?.pmsDate)?.format('DD MMMM YYYY')}-
              {moment(record?.pmsDate)?.format('LT')}
            </span>
          </div>
        </div>
      ),
    },
    // {
    //   title: <span className="text-xs">Call Closed By</span>,
    //   align: "left",
    //   key: "pmsClosedBy",
    //   width: 180,
    //   dataIndex: "pmsClosedBy",
    //   render: (data, record) => (
    //     <div className="text-xs text-gray-700 ">
    //       <span className="font-semibold cursor-pointer text-blue-700 underline">
    //         {data}
    //       </span>
    //       <div>
    //         on{" "}
    //         <span className="font-semibold cursor-pointer ">
    //           {moment(record?.pmsDate)?.format("DD MMMM YYYY")}-
    //           {moment(record?.pmsDate)?.format("LT")}
    //         </span>
    //       </div>
    //     </div>
    //   ),
    // },
    {
      title: <span className="text-xs">PMS done by</span>,
      dataIndex: 'displayName',
      // className: tab === "COMPLETED" ? "" : "hidden",
    },
    {
      title: <span className="text-xs">Last modified by</span>,
      dataIndex: 'displayName',
      // className: tab === "COMPLETED" ? "" : "hidden",
    },
    {
      title: <span className="text-xs">Total PMS</span>,
      dataIndex: 'totalPms',
      render: (data) => <div>{data || 'N/A'}</div>,
      // className: tab === "COMPLETED" ? "" : "hidden",
    },
    {
      title: <span className="text-xs">PMS left</span>,
      dataIndex: 'pmsLeft',
      render: (data) => <div>{data || 'N/A'}</div>,
      // className: tab === "COMPLETED" ? "" : "hidden",
    },
  ];
  return (
    <div className="mt-6">
      <div className="bg-white py-2 px-3 rounded-lg shadow mb-4 bg-blue-600 items-center">
        <span className="px-4 font-semibold text-white">PMS</span>
      </div>
      <GlobalTable
        data={globalSearchPMS?.records}
        columns={pmsColumns?.filter((list) => list.dataIndex !== 'daysLeft')}
        // totalCount={totalCountPMS?.completedCount}
        scroll={{ y: 250, x: 1600 }}
      />
    </div>
  );
};

export default connect(({ product }) => ({
  globalSearchPMS: product?.globalSearchPMS,
}))(PMSTable);
