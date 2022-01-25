/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { connect, useParams } from 'umi';
import { Table, Button, Modal, message } from 'antd';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import UploadGlobalDocs from '@/components/UploadGlobalDocs';
import DisplayProductDocumentDetails from '@/components/DisplayProductDocumentDetails';
import DisplayDrawer from '@/components/DisplayDrawer';
import classNames from 'classnames';
import moment from 'moment';
import styles from './index.less';

const DisplayProductDocuments = ({
  val,
  dispatch,
  sharedDoc,
  internalDoc,
  loadInternalDoc,
  loadSharedDoc,
  getInternalDoc,
}) => {
  const { serialNumberId } = useParams();
  const [previewImage, setPreviewImage] = useState('');
  const [displayFrame, setDisplayFrame] = useState(false);
  const [showDocumentUploadModel, setShowDocumentUploadModel] = useState(false);
  const [docStatus, setDocStatus] = useState('');
  const [selectedHierarchy, setSelectedHierarchy] = useState('');
  const [displayDrawer, setDisplayDrawer] = useState(false);
  const [displayDocumentModel, setDisplayDocumentModel] = useState(false);
  const [docTree, setDocTree] = useState('');
  const [isFilter, setIsFilter] = useState('');
  const [revisedDocuments, setRevisedDocuments] = useState([]);
  const [revisedInternalDocuments, setRevisedInternalDocuments] = useState([]);

  const getSharedDocs = () => {
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
  };

  useEffect(() => {
    if (isFilter === 'INTERNAL_DOC' && !displayDocumentModel) getInternalDoc();
    if (isFilter === 'SHARED_DOC' && !displayDocumentModel) getSharedDocs();
  }, [displayDocumentModel]);

  useEffect(() => {
    if (sharedDoc) {
      if (Object?.keys(sharedDoc)?.length > 0) {
        const revisedDataSource = [];
        Object?.keys(sharedDoc)?.map((list) => {
          if (sharedDoc[list]?.length > 0) sharedDoc[list][0].uniqueKeyFactor = list;
          revisedDataSource.push(sharedDoc[list][0]);
          setRevisedDocuments(revisedDataSource);
        });
      }
    }
    if (internalDoc) {
      if (Object?.keys(internalDoc)?.length > 0) {
        if (
          Object?.keys(internalDoc)?.length === 1 &&
          internalDoc[Object?.keys(internalDoc)[0]]?.length === 0
        ) {
          setRevisedInternalDocuments([]);
        } else {
          const revisedInternalDataSource = [];
          Object?.keys(internalDoc)?.map((list) => {
            if (internalDoc[list]?.length > 0) internalDoc[list][0].uniqueKeyFactor = list;
            revisedInternalDataSource.push(internalDoc[list][0]);
            setRevisedInternalDocuments(revisedInternalDataSource);
          });
        }
      }
    }
  }, [sharedDoc, internalDoc, displayDocumentModel]);
  const sharedColumns = [
    {
      title: <span className="text-xs">Serial No.</span>,
      align: 'left',
      dataIndex: 'serial_number',
      render: (_, __, index) => (
        <div className="capitalize text-xs">{index < 9 ? `0${index + 1}` : index + 1} </div>
      ),
    },
    {
      title: <span className="text-xs"> Type</span>,
      dataIndex: 'type',
      align: 'left',
      render: (data) => <div className="mx-2 capitalize text-xs">{data?.name || '-'}</div>,
    },
    {
      title: <span className="text-xs">Sub Type</span>,
      dataIndex: 'sub_type',
      align: 'left',
      render: (data) => <div className="capitalize text-xs">{data?.name || '-'}</div>,
    },
    {
      title: <span className="text-xs">Category</span>,
      dataIndex: 'document_category',
      align: 'left',
      render: (data) => <div className="capitalize text-xs">{data?.name || '-'}</div>,
    },
    {
      title: <span className="text-xs">Doc Date</span>,
      align: 'left',
      dataIndex: 'document_date',
      render: (data) => <div className="capitalize text-xs">{moment(data).format('LL')}</div>,
    },
    {
      title: <span className="text-xs">Document No.</span>,
      align: 'left',
      dataIndex: 'document_number',
      render: (data, record) => <div className="capitalize text-xs">{data || record?.id}</div>,
    },
    {
      title: <span className="text-xs">Title</span>,
      align: 'left',
      width: 150,
      dataIndex: 'description',
      render: (data) => <div className=" capitalize text-xs w-full">{data || '-'}</div>,
    },
    {
      title: <span className="text-xs">Created Date/Time</span>,
      dataIndex: 'created_by_details',
      align: 'left',
      width: 250,
      render: (data, record) => (
        <div className=" capitalize text-xs w-full">
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
      width: 200,
      render: (data, record) => (
        <div className=" capitalize text-xs">
          <div className="font-semibold">{data?.name}</div>
          <div>
            {moment(record?.updated_at).format('LL')}
            <span className="lowercase"> at </span>
            {moment(record?.updated_at).format('LT')}
          </div>
        </div>
      ),
    },
    {
      align: 'right',
      width: 100,
      render: (_, record) => (
        <div className="flex">
          <div className={classNames(styles.btnStyles)}>
            <Button
              ghost
              type="primary"
              shape="round"
              size="large"
              onClick={() => {
                setIsFilter('SHARED_DOC');
                if (record?.document_category?.id === 'ACCESSORY') {
                  setDocTree('ACC_DOC');
                } else {
                  setDocTree('');
                }
                setSelectedHierarchy(record);
                setDisplayDocumentModel(true);
              }}
            >
              Details
            </Button>
          </div>
        </div>
      ),
    },
  ];
  const internalColumns = [
    {
      title: <span className="text-xs">Serial No.</span>,
      dataIndex: 'serial_number',
      align: 'left',
      render: (_, __, index) => (
        <div className="mx-2 capitalize text-xs">{index < 9 ? `0${index + 1}` : index + 1} </div>
      ),
    },
    {
      title: <span className="text-xs">Type</span>,
      dataIndex: 'type',
      align: 'left',
      render: (data) => (
        <div className="mx-2 capitalize text-xs">
          {data?.name === 'Others' ? data?.label : data?.name}
        </div>
      ),
    },
    {
      title: <span className="text-xs">Sub Type</span>,
      dataIndex: 'sub_type',
      align: 'left',
      render: (data) => <div className="mx-2 capitalize text-xs">{data?.name || 'N/A'}</div>,
    },
    {
      title: <span className="text-xs">Category</span>,
      dataIndex: 'document_category',
      align: 'left',
      render: (data) => <div className="mx-2 capitalize text-xs">{data?.name || '-'}</div>,
    },
    {
      title: <span className="text-xs">Doc Date</span>,
      align: 'left',
      dataIndex: 'document_date',
      render: (data) => <div className="mx-2 capitalize text-xs">{moment(data).format('LL')}</div>,
    },
    {
      title: <span className="text-xs">Document No.</span>,
      align: 'left',
      dataIndex: 'document_number',
      render: (data) => <div className="mx-2 capitalize text-xs">{data}</div>,
    },
    {
      title: <span className="text-xs">Title.</span>,
      align: 'left',
      dataIndex: 'description',
      render: (data) => <div className="mx-2 capitalize text-xs">{data || '-'}</div>,
    },
    {
      title: <span className="text-xs">Created Date/Time</span>,
      dataIndex: 'created_by_details',
      align: 'center',
      render: (data, record) => (
        <div className="mx-2 capitalize text-xs">
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
      align: 'center',
      render: (data, record) => (
        <div className="mx-2 capitalize text-xs">
          <div className="font-semibold">{data?.name}</div>
          <div>
            {moment(record?.updated_at).format('LL')}
            <span className="lowercase"> at </span>
            {moment(record?.updated_at).format('LT')}
          </div>
        </div>
      ),
    },
    {
      align: 'right',
      render: (_, record) => (
        <div className="flex" style={{ float: 'right' }}>
          <div className={classNames(styles.btnStyles)}>
            <Button
              ghost
              type="primary"
              shape="round"
              size="large"
              onClick={() => {
                if (record?.document_category?.id === 'ACCESSORY') {
                  setDocTree('ACC_DOC');
                } else {
                  setDocTree('');
                }
                setIsFilter('INTERNAL_DOC');
                setSelectedHierarchy(record);
                setDisplayDocumentModel(true);
              }}
            >
              Details
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
            scroll={{ x: 1500, y: 200 }}
            columns={val === 'SHARED_DOC' ? sharedColumns : internalColumns}
            dataSource={(val === 'SHARED_DOC' ? revisedDocuments : revisedInternalDocuments) || []}
            pagination={false}
            loading={val === 'SHARED_DOC' ? loadSharedDoc : loadInternalDoc}
            rowClassName="cursor-pointer"
            locale={{
              emptyText: <EmptyStateContainer />,
            }}
          />
        </div>
      </div>
      <Modal
        onCancel={() => setDisplayFrame(false)}
        visible={displayFrame}
        width="80%"
        title="Document Preview"
        footer={null}
        bodyStyle={{ margin: 0, padding: 0, height: '75vh' }}
      >
        <iframe
          scrolling="no"
          width="100%"
          height="100%"
          title="Documents Preview"
          src={previewImage}
          className="h-full text-center w-full"
          frameBorder="0"
        />
      </Modal>
      <UploadGlobalDocs
        status={docStatus}
        details="shared_docs"
        docTypeName={
          docStatus === 'shared_docs' ? 'Upload Shared Documents' : 'Upload Internal Documents'
        }
        setShowDocumentModel={setShowDocumentUploadModel}
        showDocumentModel={showDocumentUploadModel}
      />
      <DisplayDrawer
        setDisplayDrawer={setDisplayDrawer}
        displayDrawer={displayDrawer}
        setSelectedHierarchy={setSelectedHierarchy}
        selectedHierarchy={selectedHierarchy}
      />
      <DisplayProductDocumentDetails
        isFilter={isFilter}
        actionStatement={isFilter === 'INTERNAL_DOC' ? 'INTERNAL_DOC' : 'SHARED_DOC'}
        docTree={docTree}
        setDocTree={setDocTree}
        setSelectedHierarchy={setSelectedHierarchy}
        selectedHierarchy={selectedHierarchy}
        visible={displayDocumentModel}
        setVisible={setDisplayDocumentModel}
      />
    </>
  );
};

export default connect(({ loading, product, user }) => ({
  productDetail: product.productDetail,
  sharedDoc: product.sharedDoc,
  internalDoc: product.internalDoc,
  currentUser: user.currentUser,
  loadSharedDoc: loading.effects['product/getSharedDocuments'],
  loadInternalDoc: loading.effects['product/getInternalDocuments'],
}))(DisplayProductDocuments);
