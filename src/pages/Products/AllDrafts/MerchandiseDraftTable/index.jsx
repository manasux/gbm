import React, { useEffect } from 'react';
import { connect, history, useParams } from 'umi';
import { Pagination, Table, Row } from 'antd';
import moment from 'moment';
import EmptyStateContainer from '@/components/EmptyStateContainer';

const MerchandiseListTable = ({
  storageKey,
  startIndex,
  loading,
  currentPage,
  setViewSize,
  setCurrentPage,
  setStartIndex,
  viewSize,
  currentUser,
  dispatch,
  accessoryDrafts,
  itemDrafts,
  productDetail,
}) => {
  const { productId } = useParams();
  const accessoryColumns = [
    {
      title: 'Serial No.',
      align: 'left',
      dataIndex: 'serial_number',
      render: (_, __, index) => (
        <div className="mx-2">{index < 9 ? `0${index + 1}` : index + 1} </div>
      ),
    },
    {
      title: 'Company',
      align: 'left',
      dataIndex: 'brand_name',
      render: (data) => <div className=" capitalize">{data || '-'}</div>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      align: 'left',
      render: (data) => <div className=" capitalize">{data?.name || '-'}</div>,
    },
    {
      title: 'Model',
      align: 'left',
      dataIndex: 'model',
      render: (data) => <div className=" capitalize">{data?.name}</div>,
    },

    {
      title: 'Installation Date',
      dataIndex: 'installation_date',
      align: 'left',
      render: (data) => <div className=" capitalize">{moment(data).format('DD MMM YYYY')}</div>,
    },
  ];
  const itemColumns = [
    {
      title: 'Serial No.',
      dataIndex: 'serial_number',
      align: 'left',
      render: (_, __, index) => (
        <div className="mx-2">{index < 9 ? `0${index + 1}` : index + 1} </div>
      ),
    },
    {
      title: 'Brand',
      dataIndex: 'brand_name',
      align: 'left',
      render: (data) => <div className="mx-2 capitalize">{data || '-'}</div>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      align: 'left',
      render: (data) => <div className="mx-2 capitalize">{data?.name || '-'}</div>,
    },
    {
      title: 'Sub Type',
      dataIndex: 'sub_type',
      align: 'left',
      render: (data) => <div className="mx-2 capitalize">{data?.name || '-'}</div>,
    },
    {
      title: 'Model',
      align: 'left',
      dataIndex: 'model',
      render: (data) => <div className=" capitalize">{data?.name || '-'}</div>,
    },
    {
      title: 'Serial No.',
      align: 'left',
      dataIndex: 'serial_number',
      render: (data) => <div className=" capitalize">{data || '-'}</div>,
    },

    {
      title: 'Installation Date',
      dataIndex: 'installation_date',
      align: 'left',
      render: (data) => <div className=" capitalize">{moment(data).format('DD MMM YYYY')}</div>,
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'product/allMerchandiseDrafts',
      payload: {
        view_size: viewSize,
        start_index: startIndex,
        is_draft: productDetail?.is_draft,
        is_variant: 'Y',
        parent_product_id: productId,
        assoc_type_id: storageKey,
        customer_id: currentUser?.personal_details?.organization_details?.org_party_id,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewSize, startIndex, storageKey, productId, productDetail?.is_draft]);

  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  return (
    <>
      <div className="bg-white p-1 px-3 rounded-lg shadow">
        <Table
          scroll={{ x: 1000, y: 500 }}
          columns={storageKey === 'PRODUCT_ITEM' ? itemColumns : accessoryColumns}
          dataSource={
            (storageKey === 'PRODUCT_ITEM' ? itemDrafts?.records : accessoryDrafts?.records) || []
          }
          rowKey={(record) => record.serial_number}
          pagination={false}
          loading={loading}
          onRow={(record) => {
            return {
              onClick: (event) => {
                event.stopPropagation();
                history.push(`/hospital/equipments/${record.serial_number}?task=updateEquipments`);
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
                total={
                  storageKey === 'PRODUCT_ITEM'
                    ? itemDrafts?.total_count
                    : accessoryDrafts?.total_count
                }
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
    </>
  );
};

export default connect(({ loading, user, product }) => ({
  loading: loading.effects['product/allproducts'],
  itemDrafts: product.itemDrafts,
  accessoryDrafts: product.accessoryDrafts,
  currentUser: user.currentUser,
  productDetail: product?.productDetail,
}))(MerchandiseListTable);
