/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { connect, useParams } from 'umi';
import { Table, Button, message, Switch } from 'antd';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import DisplayDrawer from '@/components/DisplayDrawer';
import DisplayProductDocumentDetails from '@/components/DisplayProductDocumentDetails';
import classNames from 'classnames';
import moment from 'moment';
import CheckValidation from '@/components/CheckValidation';
import styles from './index.less';

const DisplayUploadedDocuments = ({
  productDocumentDetail,
  dispatch,
  productDocuments,
  loadProductDocuments,
  setSharedDocuments,
  setPassMainProductDocuments,
  settings,
  hasWarranty,
  setHasWarranty,
}) => {
  const { serialNumberId } = useParams();
  const [selectedHierarchy, setSelectedHierarchy] = useState('');
  const [displayDrawer, setDisplayDrawer] = useState(false);
  const [isFilter, setIsFilter] = useState('');
  const [mainProductDocuments, setMainProductDocuments] = useState([]);
  const [displayDocumentModel, setDisplayDocumentModel] = useState(false);
  const [installationDate, setInstallationDate] = useState(null);
  const [showApproval, setShowApproval] = useState(false);

  useEffect(() => {
    if (productDocumentDetail?.product_id === serialNumberId) {
      if (productDocumentDetail?.has_warranty === 'Y') setHasWarranty(true);
      // if (productDocumentDetail?.after_warranty === 'Y') setHasContract(true);
    }
  }, [productDocumentDetail, serialNumberId]);

  const getProductMainDocuments = () => {
    dispatch({
      type: 'product/getProductDocuments',
      key: 'productDocumentDetail',
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
        key: 'productDocumentDetail',
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
      render: (data) => <div className="mx-2 capitalize text-xs">{data?.name || 'n/a'}</div>,
    },
    {
      title: <span className="text-xs">Sub Type</span>,
      dataIndex: 'subType',
      align: 'left',
      render: (data) => <div className="mx-2 capitalize text-xs">{data?.name || 'n/a'}</div>,
    },
    {
      title: <span className="text-xs">Doc Date.</span>,
      dataIndex: 'documentDate',
      align: 'left',
      render: (data) => (
        <div className="mx-2 capitalize text-xs">
          {(data && moment(data).format('DD MMMM YYYY')) || 'n/a'}
        </div>
      ),
    },
    {
      title: <span className="text-xs">Document No.</span>,
      dataIndex: 'documentNumber',
      align: 'left',
      render: (data) => <div className="mx-2 capitalize text-xs">{data || 'n/a'}</div>,
    },
    {
      title: <span className="text-xs">Title</span>,
      align: 'left',
      dataIndex: 'description',
      render: (data) => <div className="mx-2 capitalize text-xs">{data || 'n/a'}</div>,
    },
    {
      title: <span className="text-xs">Created Date/Time</span>,
      dataIndex: 'createdByDetails',
      align: 'left',
      render: (data, record) => {
        return (
          <div className="mx-2 capitalize text-xs w-full">
            <div className="font-semibold">{data?.name}</div>
            <div>
              {(record?.createdDate && moment(record?.createdDate).format('LL')) || 'n/a'}
              <span className="lowercase"> at </span>
              {(record?.createdDate && moment(record?.createdDate).format('LT')) || 'n/a'}
            </div>
          </div>
        );
      },
    },
    {
      title: <span className="text-xs">Modified Date/Time</span>,
      dataIndex: 'lastModifiedByDetails',
      align: 'left',
      render: (data, record) => (
        <div className="mx-2 capitalize text-xs w-full">
          <div className="font-semibold">{data?.name}</div>
          <div>
            {(record?.updatedAt && moment(record?.updatedAt).format('LL')) || 'n/a'}{' '}
            <span className="lowercase"> at </span>
            {(record?.updatedAt && moment(record?.updatedAt).format('LT')) || 'n/a'}
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
            <div
              className="px-2 border w-full p-1 rounded-lg text-white flex justify-between"
              style={{ backgroundColor: settings.primaryColor, cursor: 'pointer' }}
              onClick={() => setShowApproval(!showApproval)}
            >
              <div className="font-semibold my-1 items-center text-xs">
                Uploaded Documents
                <span
                  className={classNames(
                    ' ml-1 bg-gray-200 rounded px-2 text-blue-700 info___G9R8T',
                    styles.info,
                  )}
                >
                  <i>i</i>
                </span>
              </div>
              <span className="flex justify-between items-center">
                <Switch
                  style={{
                    background: showApproval ? '#3CB371' : '#c9ced6',
                  }}
                  size="small"
                  checked={showApproval}
                  onChange={setShowApproval}
                  onClick={() =>
                    productDocumentDetail?.has_warranty === 'Y' ? setHasWarranty(!hasWarranty) : ''
                  }
                  // disabled={!installationDate}
                />
              </span>
            </div>
            {showApproval && (
              <div className="bg-white rounded-lg p-2">
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
            )}
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

export default connect(({ user, product, loading, settings }) => ({
  productDetail: product.productDetail,
  loadProductDocuments: loading.effects['product/getProductDocuments'],
  productDocuments: product.productDocuments,
  currentUser: user.currentUser,
  settings,
}))(DisplayUploadedDocuments);
