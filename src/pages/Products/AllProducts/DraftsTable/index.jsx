import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Pagination, Table, Row } from 'antd';
import EmptyStateContainer from '@/components/EmptyStateContainer';

const ProductListTable = ({
  currentDraftPage,
  viewDraftSize,
  setStartDraftIndex,
  setCurrentDraftPage,
  loading,
  drafts,
  columns,
}) => {
  function handleChangePagination(current) {
    setStartDraftIndex(viewDraftSize * (current - 1));
    setCurrentDraftPage(current);
  }

  return (
    <>
      <Table
        size="small"
        scroll={{ x: 1000, y: 160 }}
        columns={columns}
        dataSource={drafts?.records}
        rowKey={(record) => record.serial_number}
        pagination={false}
        loading={loading}
        onRow={(record) => {
          return {
            onClick: (event) => {
              event.stopPropagation();
              history.push(`/equipments/view/${record?.product_id}?task=updateEquipments`);
            }, // mouse leave row
          };
        }}
        rowClassName="cursor-pointer"
        footer={() => (
          <Row className="mt-2" type="flex" justify="end">
            <Pagination
              key={`page-${currentDraftPage}`}
              showSizeChanger
              pageSizeOptions={['10', '25', '50', '100']}
              onShowSizeChange={(e, p) => {
                setViewDraftSize(p);
                setCurrentDraftPage(1);
                setStartDraftIndex(0);
              }}
              defaultCurrent={1}
              current={currentDraftPage}
              pageSize={viewDraftSize}
              total={drafts?.totalCount}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
              onChange={handleChangePagination}
            />
          </Row>
        )}
        locale={{
          emptyText: <EmptyStateContainer />,
        }}
      />
    </>
  );
};

export default connect(({ loading, product, user }) => ({
  loading: loading.effects['product/alldrafts'],
  currentUser: user.currentUser,
}))(ProductListTable);
