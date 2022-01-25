/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import EmptyStateContainer from '@/components/EmptyStateContainer';
import { Table, Row, Pagination } from 'antd';
import React, { useState } from 'react';

const ComplaintsTable = ({
  loading,
  columns,
  data,
  scroll,
  totalCount,
  setStartIndex,
  setCurrentPage,
  setViewSize,
  viewSize,
  currentPage,
}) => {
  const [selectionType, setSelectionType] = useState('checkbox');

  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {},
  };
  return (
    <div>
      <Table
        loading={loading}
        size="small"
        scroll={scroll}
        columns={columns}
        dataSource={data}
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        rowKey={(record) => record?.id}
        pagination={false}
        rowClassName="cursor-pointer"
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

export default ComplaintsTable;
