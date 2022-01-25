/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import { Pagination, Row, Table } from 'antd';

const GlobalTable = ({ columns, data, scroll }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);

  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  return (
    <div>
      <Table
        size="small"
        scroll={scroll}
        columns={columns}
        dataSource={data}
        // rowSelection={{
        //   type: selectionType,
        //   rowSelection,
        // }}
        //   rowKey={(record) => record.serial_number}
        pagination={false}
        //   onRow={(record) => {
        //     return {
        //       onClick: (event) => {
        //         event.stopPropagation();

        //         history.push(
        //           `/hospital/equipments/${
        //             record?.category === 'Product' ? record?.productId : record?.parentProductId
        //           }?task=updateEquipments`,
        //         );
        //       }, // mouse leave row
        //     };
        //   }}
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
              total
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

export default GlobalTable;
