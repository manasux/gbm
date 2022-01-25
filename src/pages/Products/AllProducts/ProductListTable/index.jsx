/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Pagination, Table, Row } from 'antd';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import AddProductAccessory from '../AddProductAccessory';

const ProductListTable = ({
  loading,
  currentPage,
  setViewSize,
  setCurrentPage,
  setStartIndex,
  viewSize,
  columns,
  dataSource,
  totalRecords,
}) => {
  const [addAccessoryModal, setAddAccessoryModal] = useState({
    visible: false,
    product: null,
  });

  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  return (
    <>
      <Table
        size="small"
        scroll={{ x: 1000, y: 160 }}
        columns={columns}
        dataSource={dataSource}
        rowKey={(record) => record.serial_number}
        pagination={false}
        loading={loading}
        onRow={(record) => {
          return {
            onClick: (event) => {
              event.stopPropagation();
              history.push(`/equipments/view/${record.product_id}?task=updateEquipments`);
            }, // mouse leave row
          };
        }}
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
              total={totalRecords}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
              onChange={handleChangePagination}
            />
          </Row>
        )}
        locale={{
          emptyText: <EmptyStateContainer />,
        }}
      />
      {addAccessoryModal.visible && (
        <AddProductAccessory
          visible={addAccessoryModal.visible}
          product={addAccessoryModal.product}
          setVisible={(isVisible) =>
            setAddAccessoryModal({
              visible: isVisible || false,
              product: null,
            })
          }
        />
      )}
    </>
  );
};

export default connect(({ loading, product, user }) => ({
  brandList: product.brandsList,
  typeList: product.ProductTypesList,
  familyList: product.productFamilyList,
  currentUser: user.currentUser,
}))(ProductListTable);
