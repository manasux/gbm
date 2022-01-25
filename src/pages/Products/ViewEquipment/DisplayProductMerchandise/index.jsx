import React, { useState } from 'react';
import { connect, useParams } from 'umi';
import { Table, Button, Popconfirm, message } from 'antd';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import UploadGlobalDocs from '@/components/UploadGlobalDocs';
import DisplayDrawer from '@/components/DisplayDrawer';
import DisplayProductDocumentDetails from '@/components/DisplayProductDocumentDetails';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import moment from 'moment';
import styles from './index.less';

const ProductListTable = ({
  itemDrafts,
  accessoryDrafts,
  loadingItem,
  loadingAccessory,
  val,
  dispatch,
  setShowModel,
  setStatus,
  setUpdateItemInfo,
  setUpdateAccessoryInfo,
  currentUser,
  setSelectedMerchandise,
  productDetail,
}) => {
  const { serialNumberId } = useParams();

  const [accessoryDocsInfo, setAccessoryDocsInfo] = useState('');
  const [showDocumentModel, setShowDocumentModel] = useState(false);
  const [selectedHierarchy, setSelectedHierarchy] = useState('');
  const [displayDocumentModel, setDisplayDocumentModel] = useState(false);
  const [accessId, setAccessId] = useState('');
  const [displayDrawer, setDisplayDrawer] = useState(false);
  const [docTree, setDocTree] = useState();
  const [isFilter, setIsFilter] = useState();

  const getSharedDocs = () => {
    if (serialNumberId) {
      dispatch({
        type: 'product/getSharedDocuments',
        payload: {
          pathParams: {
            productId: serialNumberId,
          },
          query: {
            document_type: 'SHARED_DOC',
          },
        },
      });
    }
  };

  const deleteMerchandise = (id) => {
    dispatch({
      type: 'product/deleteMerchandise',
      payload: {
        pathParams: {
          productId: id,
        },
      },
    }).then((res) => {
      if (res?.responseMessage === 'success')
        message.success(`${val === 'PRODUCT_ITEM' ? 'Item' : 'Accessory'} deleted successfully!`);
      if (val === 'PRODUCT_ITEM') {
        dispatch({
          type: 'product/getProductItemDrafts',
          payload: {
            is_draft: productDetail?.is_draft,
            is_variant: 'Y',
            parent_product_id: serialNumberId,
            assoc_type_id: 'PRODUCT_ITEM',
            customer_id: currentUser?.personal_details?.organization_details?.org_party_id,
          },
        });
      } else {
        dispatch({
          type: 'product/getProductAccessoryDrafts',
          payload: {
            is_draft: productDetail?.is_draft,
            is_variant: 'Y',
            parent_product_id: serialNumberId,
            assoc_type_id: 'PRODUCT_ACCESSORY',
            customer_id: currentUser?.personal_details?.organization_details?.org_party_id,
          },
        }).then(() => {
          getSharedDocs();
        });
      }
    });
  };

  const itemColumns = [
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
      render: (data) => <div className="mx-1">{data || '-'}</div>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      align: 'left',
      render: (data) => <div className=" capitalize">{data?.name || '-'}</div>,
    },
    {
      title: 'Sub Type',
      align: 'left',
      dataIndex: 'sub_type',
      render: (data) => <div className=" capitalize">{data?.name || '-'}</div>,
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
      dataIndex: 'draft_id',
      render: (data) => <div className=" capitalize">{data || '-'}</div>,
    },

    {
      title: 'Installation Date/Time',
      dataIndex: 'installation_date',
      align: 'left',
      render: (data) => (
        <div>
          {moment(data).format('LL')}at{moment(data).format('LT')}
        </div>
      ),
    },
    {
      title: 'Created Date/Time',
      dataIndex: 'created_by',
      align: 'center',
      render: (data, record) => (
        <>
          <div className="font-semibold">{data?.name}</div>
          <div>
            {moment(record?.created_at).format('LL')} at {moment(record?.created_at).format('LT')}
          </div>
        </>
      ),
    },
    {
      title: 'Modified Date/Time',
      dataIndex: 'updated_by',
      align: 'center',
      render: (data, record) => (
        <>
          <div className="font-semibold">{data?.name}</div>
          <div>
            {moment(record?.updated_at).format('LLY')} at {moment(record?.updated_at).format('LT')}
          </div>
        </>
      ),
    },
    {
      align: 'right',
      render: (_, record) => (
        <div className="flex" style={{ float: 'right' }}>
          <Button type="primary" disabled={productDetail?.is_verified} shape="circle" size="small">
            <Popconfirm
              okText="Delete"
              okType="danger"
              placement="right"
              onConfirm={() => deleteMerchandise(record?.serial_number)}
              title="Are you sure you want to delete this item?"
            >
              <span className="cursor-pointer">
                <DeleteOutlined />
              </span>
            </Popconfirm>
          </Button>
          <div className="ml-2">
            <Button
              type="primary"
              disabled={productDetail?.is_verified}
              shape="circle"
              size="small"
              onClick={() => {
                setUpdateItemInfo(record);
                setShowModel(true);
                setStatus('updateProductItems');
              }}
            >
              <EditOutlined />
            </Button>
          </div>
        </div>
      ),
    },
  ];
  const accessoryColumns = [
    {
      title: <span className="text-xs">Serial No.</span>,
      dataIndex: 'serial_number',
      align: 'left',
      width: 100,
      render: (_, __, index) => (
        <div className="capitalize text-xs">{index < 9 ? `0${index + 1}` : index + 1} </div>
      ),
    },

    {
      title: <span className="text-xs">Accessory Name</span>,
      dataIndex: 'accessory',
      align: 'left',
      render: (data) => <div className="capitalize text-xs">{data?.name}</div>,
    },
    {
      title: <span className="text-xs">Accessory Type</span>,
      dataIndex: 'type',
      align: 'left',
      render: (data, record) => (
        <div className=" capitalize text-xs">{data?.name || record?.sub_type?.name}</div>
      ),
    },
    {
      title: <span className="text-xs">Model</span>,
      align: 'left',
      dataIndex: 'model',
      render: (data) => <div className=" capitalize text-xs">{data?.name}</div>,
    },
    {
      title: <span className="text-xs">Serial No.</span>,
      align: 'left',
      dataIndex: 'serial_number',
      render: (data) => <div className=" capitalize text-xs">{data || '-'}</div>,
    },

    {
      title: <span className="text-xs">Installation Date/Time</span>,
      dataIndex: 'installation_date',
      align: 'left',
      render: (data) => (
        <div className="text-xs">
          {moment(data).format('LL')} <span className="lowercase">at </span>{' '}
          {moment(data).format('LT')}
        </div>
      ),
    },
    {
      title: <span className="text-xs">Created Date/Time</span>,
      dataIndex: 'created_by',
      align: 'left',
      render: (data, record) => (
        <div className=" capitalize text-xs">
          <div className="font-semibold">{data?.name}</div>
          <div>
            {moment(record?.created_at).format('LL')} <span className="lowercase">at</span>{' '}
            {moment(record?.created_at).format('LT')}
          </div>
        </div>
      ),
    },
    {
      title: <span className="text-xs">Modified Date/Time</span>,
      dataIndex: 'updated_by',
      align: 'left',
      render: (data, record) => (
        <div className="capitalize text-xs">
          <div className="font-semibold">{data?.name}</div>
          <div>
            {moment(record?.updated_at).format('LL')} <span className="lowercase">at</span>{' '}
            {moment(record?.updated_at).format('LT')}
          </div>
        </div>
      ),
    },
    {
      align: 'left',
      render: (_, record) => (
        <div className="flex">
          <div className={classNames(styles.btnStyles)}>
            <Button
              ghost
              type="primary"
              shape="round"
              size="large"
              onClick={() => {
                setDocTree('ACC_DOC');
                setIsFilter('ACC_FILTER');
                setAccessId(record?.product_id);
                setSelectedHierarchy(record);
                setDisplayDocumentModel(true);
              }}
            >
              Details
            </Button>
          </div>

          <div className="ml-2">
            <Button
              type="primary"
              shape="circle"
              size="small"
              onClick={() => {
                setAccessoryDocsInfo(record);
                setShowDocumentModel(true);
              }}
            >
              <span className="cursor-pointer">
                <UploadOutlined />
              </span>
            </Button>
          </div>

          <div className="ml-2">
            <Button
              type="primary"
              disabled={productDetail?.is_verified}
              shape="circle"
              size="small"
            >
              <Popconfirm
                okText="Delete"
                okType="danger"
                placement="right"
                onConfirm={() => deleteMerchandise(record?.product_id)}
                title="Are you sure you want to delete this accessory?"
              >
                <span className="cursor-pointer">
                  <DeleteOutlined />
                </span>
              </Popconfirm>
            </Button>
          </div>
          <div className="ml-2">
            <Button
              type="primary"
              disabled={productDetail?.is_verified}
              shape="circle"
              size="small"
              onClick={() => {
                setUpdateAccessoryInfo(record);
                setShowModel(true);
                setStatus('updateProductAccessories');
              }}
            >
              <EditOutlined />
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div>
        <div className="bg-white rounded-lg p-2">
          <Table
            size="small"
            className={classNames(styles.tableStyle)}
            scroll={{ x: 1700, y: 200 }}
            columns={val === 'PRODUCT_ITEM' ? itemColumns : accessoryColumns}
            dataSource={
              (val === 'PRODUCT_ITEM' ? itemDrafts?.records : accessoryDrafts?.records) || []
            }
            onRow={(record) => {
              return {
                onClick: (event) => {
                  event.stopPropagation();
                  setSelectedMerchandise(record?.serial_number);
                },
              };
            }}
            pagination={false}
            loading={val === 'PRODUCT_ITEM' ? loadingItem : loadingAccessory}
            rowClassName="cursor-pointer"
            // ***may need this Code for future
            // footer={
            //   () => (
            //     // !productDetail?.is_verified && (
            //     <div
            //       className={classNames(styles.uploadbtn)}
            //       style={{ float: 'right', marginTop: val !== 'PRODUCT_ITEM' && '20px' }}
            //     >
            //       <Button
            //         type="primary"
            //         shape="circle"
            //         size="large"
            //         onClick={() => {
            //           setShowModel(true);
            //           setStatus(val === 'PRODUCT_ITEM' ? 'productItems' : 'productAccessories');
            //         }}
            //       >
            //         <PlusOutlined />
            //       </Button>
            //       <div className="text-blue-500" style={{ fontWeight: '500' }}>
            //         {val === 'PRODUCT_ITEM' ? 'Add another item' : 'Add another accessory'}
            //       </div>
            //     </div>
            //   )
            //   // )
            // }
            locale={{
              emptyText: <EmptyStateContainer />,
            }}
          />
        </div>
        <UploadGlobalDocs
          status="accessory_docs"
          details="accessory_docs"
          docTypeName="Add Accessory Documents"
          setShowDocumentModel={setShowDocumentModel}
          showDocumentModel={showDocumentModel}
          setAccessoryDocsInfo={setAccessoryDocsInfo}
          accessoryDocsInfo={accessoryDocsInfo}
        />
      </div>
      <DisplayDrawer
        setDisplayDrawer={setDisplayDrawer}
        displayDrawer={displayDrawer}
        setSelectedHierarchy={setSelectedHierarchy}
        selectedHierarchy={selectedHierarchy}
      />
      <DisplayProductDocumentDetails
        accessId={accessId}
        docTree={docTree}
        setDocTree={setDocTree}
        isFilter={isFilter}
        setSelectedHierarchy={setSelectedHierarchy}
        selectedHierarchy={selectedHierarchy}
        visible={displayDocumentModel}
        setVisible={setDisplayDocumentModel}
      />
    </>
  );
};

export default connect(({ loading, product, user }) => ({
  productDetail: product?.productDetail,
  loadingItem: loading.effects['product/getProductItemDrafts'],
  loadingAccessory: loading.effects['product/getProductAccessoryDrafts'],
  itemDrafts: product.itemDrafts,
  accessoryDrafts: product.accessoryDrafts,
  currentUser: user.currentUser,
}))(ProductListTable);
