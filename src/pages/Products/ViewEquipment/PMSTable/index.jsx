/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import EmptyStateContainer from '@/components/EmptyStateContainer';
import { Pagination, Row, Table } from 'antd';
import React, { useState } from 'react';

const PMSTable = ({
  columns,
  data,
  scroll,
  totalCount,
  currentPage,
  viewSize,
  setCurrentPage,
  setStartIndex,
  setViewSize,
  rowSelection,
  loading,
}) => {
  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  return (
    <div>
      <Table
        loading={loading}
        size="small"
        scroll={scroll}
        columns={columns}
        dataSource={data}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        rowKey={(record) => record?.pmsNo}
        pagination={false}
        footer={() => (
          <Row className="mt-2" type="flex" justify="end">
            <Pagination
              key={`page-${currentPage}`}
              showSizeChanger
              pageSizeOptions={['10', '25', '50', '100']}
              onShowSizeChange={(e, p) => {
                setViewSize(p);
                setCurrentPage(1);
                setStartIndex(0);
              }}
              defaultCurrent={1}
              current={currentPage}
              pageSize={viewSize}
              total={totalCount}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
              onChange={handleChangePagination}
            />
          </Row>
        )}
        locale={{
          emptyText: <EmptyStateContainer />,
        }}
      />
    </div>
  );
};

export default PMSTable;
