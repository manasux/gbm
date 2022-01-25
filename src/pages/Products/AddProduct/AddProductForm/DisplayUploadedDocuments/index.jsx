/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { connect, useParams } from 'umi';
import { Table, Button, message } from 'antd';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import DisplayDrawer from '@/components/DisplayDrawer';
import DisplayProductDocumentDetails from '@/components/DisplayProductDocumentDetails';
import classNames from 'classnames';
import moment from 'moment';
import styles from './index.less';

const DisplayUploadedDocuments = ({
  dispatch,
  productDocuments,
  loadProductDocuments,
  setSharedDocuments,
  setPassMainProductDocuments,
}) => {
  const { serialNumberId } = useParams();
  const [selectedHierarchy, setSelectedHierarchy] = useState('');
  const [displayDrawer, setDisplayDrawer] = useState(false);
  const [isFilter, setIsFilter] = useState('');
  const [mainProductDocuments, setMainProductDocuments] = useState([]);
  const [displayDocumentModel, setDisplayDocumentModel] = useState(false);

  const getProductMainDocuments = () => {
    dispatch({
      type: 'product/getProductDocuments',
      payload: {
        pathParams: {
          productId: serialNumberId,
        },
        query: {
          document_type: 'SHARED_DOC',
          showBasicInfo: true,
        },
      },
    }).then(() => {
      dispatch({
        type: 'product/getSharedDocuments',
        payload: {
          pathParams: {
            productId: serialNumberId,
          },
          query: {
            document_type: 'SHARED_DOC',
            showBasicInfo: false,
          },
        },
      });
    });
  };

  useEffect(() => {
    if (serialNumberId) {
      getProductMainDocuments();
    }
  }, [serialNumberId, displayDocumentModel]);
  // Need this code
  const deleteDocument = (id) => {
    if (id) {
      dispatch({
        type: 'product/deleteUploadedDocuments',
        payload: {
          pathParams: {
            productId: serialNumberId,
            contentId: id,
          },
        },
      })
        .then((res) => {
          if (res) {
            dispatch({
              type: 'product/getProductDocuments',
              payload: {
                pathParams: {
                  productId: serialNumberId,
                },
                query: {
                  showBasicInfo: true,
                },
              },
            });
            message.success('Content deleted successfully!');
          }
        })
        .then(() => {
          dispatch({
            type: 'product/getSharedDocuments',
            payload: {
              pathParams: {
                productId: serialNumberId,
              },
              query: {
                document_type: 'SHARED_DOC',
                showBasicInfo: false,
              },
            },
          });
        });
    }
  };
  const documentColumns = [
    {
      title: <span className="text-xs">Serial No.</span>,
      align: 'left',
      dataIndex: 'serial_number',
      render: (_, __, index) => (
        <div className="mx-2 capitalize text-xs">{index < 9 ? `0${index + 1}` : index + 1} </div>
      ),
    },
    {
      title: <span className="text-xs">Type</span>,
      dataIndex: 'type',
      align: 'left',
      render: (data) => <div className="mx-2 capitalize text-xs">{data?.name || '-'}</div>,
    },
    {
      title: <span className="text-xs">Sub Type</span>,
      dataIndex: 'sub_type',
      align: 'left',
      render: (data) => <div className="mx-2 capitalize text-xs">{data?.name || '-'}</div>,
    },
    {
      title: <span className="text-xs">Doc Date.</span>,
      dataIndex: 'document_date',
      align: 'left',
      render: (data) => (
        <div className="mx-2 capitalize text-xs">{moment(data).format('DD MMMM YYYY') || '-'}</div>
      ),
    },
    {
      title: <span className="text-xs">Document No.</span>,
      dataIndex: 'document_number',
      align: 'left',
      render: (data) => <div className="mx-2 capitalize text-xs">{data || '-'}</div>,
    },
    {
      title: <span className="text-xs">Title</span>,
      align: 'left',
      dataIndex: 'description',
      render: (data) => <div className="mx-2 capitalize text-xs">{data || '-'}</div>,
    },
    {
      title: <span className="text-xs">Created Date/Time</span>,
      dataIndex: 'created_by_details',
      align: 'left',
      render: (data, record) => (
        <div className="mx-2 capitalize text-xs w-full">
          <div className="font-semibold">{data?.name}</div>
          <div>
            {moment(record?.created_at).format('LL')}
            <span className="lowercase"> at </span>
            {moment(record?.created_at).format('LT')}
          </div>
        </div>
      ),
    },
    {
      title: <span className="text-xs">Modified Date/Time</span>,
      dataIndex: 'last_modified_by_details',
      align: 'left',
      render: (data, record) => (
        <div className="mx-2 capitalize text-xs w-full">
          <div className="font-semibold">{data?.name}</div>
          <div>
            {moment(record?.updated_at).format('LL')} <span className="lowercase"> at </span>
            {moment(record?.updated_at).format('LT')}
          </div>
        </div>
      ),
    },
    {
      align: 'right',
      render: (record) => (
        <div className="flex" style={{ marginLeft: '1rem' }}>
          <div className={classNames(styles.btnStyle)}>
            <Button
              ghost
              size="large"
              type="primary"
              shape="round"
              onClick={() => {
                setSelectedHierarchy(record);
                setDisplayDocumentModel(true);
                setIsFilter('MAIN_FILTER');
              }}
            >
              Details
            </Button>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (productDocuments) {
      const documentsArray = [];
      Object.keys(productDocuments)?.map((item) => {
        productDocuments[item][0].uniqueKeyFactor = item;
        documentsArray.push(productDocuments[item][0]);
      });
      setMainProductDocuments(documentsArray);
      setPassMainProductDocuments(documentsArray);
    } else {
      setMainProductDocuments([]);
      setPassMainProductDocuments([]);
    }
  }, [productDocuments, displayDocumentModel]);
  return (
    <>
      {mainProductDocuments?.length > 0 && (
        <>
          <div>
            <div className="bg-white rounded-lg p-2">
              <div className="text-blue-600 font-bold mx-2">Uploaded Documents</div>{' '}
              <Table
                size="small"
                className={classNames(styles.tableStyle)}
                scroll={{ x: 1000, y: 500 }}
                columns={documentColumns}
                dataSource={mainProductDocuments}
                pagination={false}
                loading={loadProductDocuments}
                rowClassName="cursor-pointer"
                locale={{
                  emptyText: <EmptyStateContainer />,
                }}
              />
            </div>
          </div>

          <DisplayDrawer
            setDisplayDrawer={setDisplayDrawer}
            displayDrawer={displayDrawer}
            setSelectedHierarchy={setSelectedHierarchy}
            selectedHierarchy={selectedHierarchy}
          />
          <DisplayProductDocumentDetails
            setSharedDocuments={setSharedDocuments}
            isFilter={isFilter}
            actionStatement="SHARED_DOC"
            setSelectedHierarchy={setSelectedHierarchy}
            selectedHierarchy={selectedHierarchy}
            visible={displayDocumentModel}
            setVisible={setDisplayDocumentModel}
          />
        </>
      )}
    </>
  );
};

export default connect(({ user, product, loading }) => ({
  productDetail: product.productDetail,
  loadProductDocuments: loading.effects['product/getProductDocuments'],
  productDocuments: product.productDocuments,
  currentUser: user.currentUser,
}))(DisplayUploadedDocuments);
