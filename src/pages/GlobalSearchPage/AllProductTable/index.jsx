/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Pagination, Row, Table } from 'antd';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import GlobalTable from '../Table';
import { connect } from 'umi';

const AllProductTable = ({ globalSearchAllProducts }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);

  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  //   const activeColumns = [
  //     {
  //       title: "Sr. No.",
  //       dataIndex: "srno",
  //       align: "center",
  //       render: (_, __, index) => (
  //         <div className="w-full px-8 ">
  //           {" "}
  //           {index + 1 + viewSize * (currentPage - 1)}
  //         </div>
  //       ),
  //     },
  //     {
  //       title: <span className="text-xs">Family</span>,
  //       dataIndex: "category_name",
  //       align: "left",
  //       render: (data) => (
  //         <div className="mx-1 capitalize  text-xs">{data || "-"}</div>
  //       ),
  //     },
  //     {
  //       title: <span className="text-xs">Brand</span>,
  //       dataIndex: "brand_name",
  //       align: "left",
  //       render: (data) => (
  //         <div className="mx-1 capitalize  text-xs">{data || "-"}</div>
  //       ),
  //     },
  //     {
  //       title: <span className="text-xs">Name</span>,
  //       align: "left",
  //       dataIndex: "product",
  //       render: (data) => (
  //         <div className="capitalize mx-1 text-xs">{data?.name}</div>
  //       ),
  //     },
  //     {
  //       title: <span className="text-xs">Type</span>,
  //       dataIndex: "type",
  //       align: "left",
  //       render: (data) => (
  //         <div className="mx-1 capitalize  text-xs">{data?.name || "-"}</div>
  //       ),
  //     },
  //     {
  //       title: <span className="text-xs">Model No.</span>,
  //       dataIndex: "model",
  //       align: "left",
  //       render: (data) => (
  //         <div className="mx-2 capitalize  text-xs">{data?.name || "-"}</div>
  //       ),
  //     },
  //     {
  //       title: <span className="text-xs">Department</span>,
  //       dataIndex: "department_name",
  //       align: "left",
  //       render: (data) => (
  //         <div className="mx-2 capitalize  text-xs">{data || "-"}</div>
  //       ),
  //     },
  //     {
  //       title: <span className="text-xs">Sr.No.</span>,
  //       dataIndex: "serial_number",
  //       align: "left",
  //       render: (data) => (
  //         <div className="mx-4 capitalize  text-xs">{data || "-"}</div>
  //       ),
  //     },
  //     {
  //       title: <span className="text-xs">Warranty Detail</span>,
  //       dataIndex: "has_warranty",
  //       align: "left",
  //       render: (data) => (
  //         <div className="mx-4 capitalize  text-xs">
  //           {data === "N" ? "NO" : "YES"}
  //         </div>
  //       ),
  //     },
  //   ];
  const awaitingColumns = [
    {
      title: 'Sr. No.',
      dataIndex: 'srno',
      align: 'center',
      render: (_, __, index) => (
        <div className="w-full px-8 "> {index + 1 + viewSize * (currentPage - 1)}</div>
      ),
    },
    {
      title: <span className="text-xs">Family</span>,
      dataIndex: 'category_name',
      align: 'left',
      render: (data) => <div className="mx-1 capitalize  text-xs">{data || '-'}</div>,
    },
    {
      title: <span className="text-xs">Brand</span>,
      dataIndex: 'brand_name',
      align: 'left',
      render: (data) => <div className="mx-1 capitalize  text-xs">{data || '-'}</div>,
    },
    {
      title: <span className="text-xs">Name</span>,
      align: 'left',
      dataIndex: 'product',
      render: (data) => <div className="capitalize mx-1 text-xs">{data?.name}</div>,
    },
    {
      title: <span className="text-xs">Type</span>,
      dataIndex: 'type',
      align: 'left',
      render: (data) => <div className="mx-1 capitalize  text-xs">{data?.name || '-'}</div>,
    },
    {
      title: <span className="text-xs">Model No.</span>,
      dataIndex: 'model',
      align: 'left',
      render: (data) => <div className="mx-2 capitalize  text-xs">{data?.name || '-'}</div>,
    },
    {
      title: <span className="text-xs">Department</span>,
      dataIndex: 'department_name',
      align: 'left',
      render: (data) => <div className="mx-2 capitalize  text-xs">{data || '-'}</div>,
    },
    {
      title: <span className="text-xs">Sr.No.</span>,
      dataIndex: 'serial_number',
      align: 'left',
      render: (data) => <div className="mx-4 capitalize  text-xs">{data || '-'}</div>,
    },
    {
      title: <span className="text-xs">Warranty Detail</span>,
      dataIndex: 'has_warranty',
      align: 'left',
      render: (data) => (
        <div className="mx-4 capitalize  text-xs">{data === 'N' ? 'NO' : 'YES'}</div>
      ),
    },
  ];
  return (
    <div className="mx-18 mt-2">
      <div className="bg-white py-2 px-3 rounded-lg shadow mb-4 bg-blue-600 items-center">
        <span className="px-4 font-semibold text-white">All products</span>
      </div>
      <GlobalTable
        scroll={{ x: 1000, y: 160 }}
        columns={awaitingColumns}
        data={globalSearchAllProducts?.records}
      />
    </div>
  );
};

export default connect(({ product }) => ({
  globalSearchAllProducts: product?.globalSearchAllProducts,
}))(AllProductTable);
