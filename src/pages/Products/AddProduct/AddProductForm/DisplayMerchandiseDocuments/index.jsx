/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Table, Button, Popconfirm, message, Modal } from 'antd';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import moment from 'moment';
import EditUploadedDocument from '../EditUplaodedDocument';
import styles from './index.less';

const DisplayProductDocuments = ({
  dispatch,
  merchandiseDocuments,
  loadMerchandiseDocuments,
  selectedMerchandise,
}) => {
  const [updateSharedDocument, setUpdateSharedDocument] = useState('');
  const [documentStatus, setDocumentStatus] = useState('');
  const [showDocumentModel, setShowDocumentModel] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [displayFrame, setDisplayFrame] = useState(false);
  useEffect(() => {
    if (selectedMerchandise) {
      dispatch({
        type: 'product/getMerchandiseDocuments',
        payload: {
          pathParams: {
            productId: selectedMerchandise,
          },
        },
      });
    }
  }, [selectedMerchandise]);

  const deleteDocument = (id) => {
    if (id) {
      dispatch({
        type: 'product/deleteUploadedDocuments',
        payload: {
          pathParams: {
            productId: selectedMerchandise,
            contentId: id,
          },
        },
      }).then((res) => {
        if (res) {
          dispatch({
            type: 'product/getMerchandiseDocuments',
            payload: {
              pathParams: {
                productId: selectedMerchandise,
              },
            },
          });
          message.success('Content deleted successfully!');
        }
      });
    }
  };
  const documentColumns = [
    {
      title: 'Serial No.',
      align: 'left',
      dataIndex: 'serial_number',
      render: (_, __, index) => (
        <div className="mx-2">{index < 9 ? `0${index + 1}` : index + 1} </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      align: 'left',
      render: (data) => <div className="capitalize">{data?.name || '-'}</div>,
    },
    {
      title: 'Sub Type',
      dataIndex: 'sub_type',
      align: 'left',
      render: (data) => <div className="capitalize">{data?.name || '-'}</div>,
    },
    {
      title: 'Doc Date',
      dataIndex: 'document_date',
      align: 'left',
      render: (data) => (
        <div className="capitalize">{moment(data).format('DD MMMM YYYY') || '-'}</div>
      ),
    },
    {
      title: 'Document No.',
      dataIndex: 'document_number',
      align: 'left',
      render: (data) => <div className="capitalize">{data || '-'}</div>,
    },
    {
      title: 'Title',
      align: 'left',
      dataIndex: 'description',
      render: (data) => <div className="capitalize">{data || '-'}</div>,
    },
    {
      title: 'Created Date/Time',
      dataIndex: 'created_by_details',
      align: 'center',
      render: (data, record) => (
        <>
          <div className="font-semibold capitalize">{data?.name}</div>
          <div className="">
            {moment(record?.created_at).format('LL')} at {moment(record?.created_at).format('LT')}
          </div>
        </>
      ),
    },
    {
      title: 'Modified Date/Time',
      dataIndex: 'last_modified_by_details',
      align: 'center',
      render: (data, record) => (
        <>
          <div className="font-semibold">{data?.name}</div>
          <div className="lowercase">
            {moment(record?.updated_at).format('LL')} at{' '}
            {moment(record?.updated_at).format('HH:MM')}
          </div>
        </>
      ),
    },
    {
      align: 'right',
      render: (record) => (
        <div className="flex" style={{ float: 'right' }}>
          <div className="ml-2">
            <Button
              type="primary"
              shape="circle"
              size="small"
              onClick={() => {
                setPreviewImage(record?.download_url);
                setDisplayFrame(true);
              }}
            >
              <EyeOutlined />
            </Button>
          </div>
          <div className="ml-2">
            <Button
              type="primary"
              shape="circle"
              size="small"
              disabled={record?.is_modified_by_admin}
            >
              <Popconfirm
                okText="Delete"
                okType="danger"
                placement="right"
                onConfirm={() => deleteDocument(record?.id)}
                title="Are you sure you want to delete this shared document?"
              >
                <span className="cursor-pointer">
                  <DeleteOutlined />
                </span>
              </Popconfirm>
            </Button>
          </div>
          <div className="ml-2">
            <Button
              disabled={record?.is_modified_by_admin}
              type="primary"
              shape="circle"
              size="small"
              onClick={() => {
                setShowDocumentModel(true);
                setDocumentStatus('MERCHANDISE_DOC');
                setUpdateSharedDocument(record);
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
      <div className="mt-5">
        <div className="bg-white rounded-lg p-2">
          <div className="text-blue-600 font-bold mx-2">Uploaded Item/Accessory Documents</div>
          <Table
            className={classNames(styles.tableStyle)}
            scroll={{ x: 1000, y: 500 }}
            columns={documentColumns}
            dataSource={merchandiseDocuments?.contents || []}
            rowKey={(record) => record.serial_number}
            pagination={false}
            loading={loadMerchandiseDocuments}
            rowClassName="cursor-pointer"
            locale={{
              emptyText: <EmptyStateContainer />,
            }}
          />
        </div>
      </div>
      <EditUploadedDocument
        visible={showDocumentModel}
        setVisible={setShowDocumentModel}
        documentStatus={documentStatus}
        setDocumentStatus={setDocumentStatus}
        updateSharedDocument={updateSharedDocument}
        setUpdateSharedDocument={setUpdateSharedDocument}
        selectedMerchandise={selectedMerchandise}
      />
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
    </>
  );
};

export default connect(({ user, product, loading }) => ({
  loadMerchandiseDocuments: loading.effects['product/getMerchandiseDocuments'],
  merchandiseDocuments: product.merchandiseDocuments,
  currentUser: user.currentUser,
}))(DisplayProductDocuments);
