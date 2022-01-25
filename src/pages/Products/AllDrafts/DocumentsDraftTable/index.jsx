/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { connect, useParams } from 'umi';
import { Table, Button } from 'antd';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import moment from 'moment';
import styles from './index.less';

const DisplayProductDocuments = ({ storageKey, sharedDoc, internalDoc, dispatch }) => {
  const { productId } = useParams();
  useEffect(() => {
    dispatch({
      type: 'product/getDocuments',
      payload: {
        pathParams: {
          productId,
        },
        query: {
          document_type: storageKey,
        },
      },
    });
  }, []);

  const sharedColumns = [
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
      title: 'Title',
      align: 'left',
      dataIndex: 'description',
      render: (data) => <div className="capitalize">{data || '-'}</div>,
    },
    {
      title: 'Last Modified',
      align: 'left',
      dataIndex: 'created_date',
      render: (data) =>
        (
          <div>
            on {moment(data).format('DD MMMM YYYY')} - {moment(data).format('HH:MM:SS')}
          </div>
        ) || '-',
    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      align: 'center',
      render: (data) => <div className=" ml-12">{data || '-'}</div>,
    },
    {
      align: 'right',
      render: () => (
        <div className="flex" style={{ float: 'right' }}>
          <div className="ml-2">
            <Button type="primary" shape="circle" size="small">
              <EyeOutlined />
            </Button>
          </div>
          <div className="ml-2">
            <Button type="primary" shape="circle" size="small">
              <DeleteOutlined />
            </Button>
          </div>
          <div className="ml-2">
            <Button type="primary" shape="circle" size="small">
              <EditOutlined />
            </Button>
          </div>
        </div>
      ),
    },
  ];
  const internalColumns = [
    {
      title: 'Serial No.',
      dataIndex: 'serial_number',
      align: 'left',
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
      title: 'Title',
      align: 'left',
      dataIndex: 'description',
      render: (data) => <div className="capitalize">{data || '-'}</div>,
    },
    {
      title: 'Last Modified',
      align: 'left',
      dataIndex: 'created_date',
      render: (data) =>
        (
          <div>
            on {moment(data).format('DD MMMM YYYY')} - {moment(data).format('HH:MM:SS')}
          </div>
        ) || '-',
    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      align: 'center',
      render: (data) => <div className=" ml-12">{data || '-'}</div>,
    },
    {
      align: 'right',
      render: () => (
        <div className="flex" style={{ float: 'right' }}>
          <div className="ml-2">
            <Button type="primary" shape="circle" size="small">
              <EyeOutlined />
            </Button>
          </div>
          <div className="ml-2">
            <Button type="primary" shape="circle" size="small">
              <DeleteOutlined />
            </Button>
          </div>
          <div className="ml-2">
            <Button type="primary" shape="circle" size="small">
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
            className={classNames(styles.tableStyle)}
            scroll={{ x: 1000, y: 500 }}
            columns={storageKey === 'SHARED_DOC' ? sharedColumns : internalColumns}
            dataSource={
              (storageKey === 'SHARED_DOC' ? sharedDoc?.contents : internalDoc?.contents) || []
            }
            rowKey={(record) => record.serial_number}
            pagination={false}
            // loading={storageKey === 'SHARED_DOC' ? loadSharedDoc : loadInternalDoc}
            rowClassName="cursor-pointer"
            locale={{
              emptyText: <EmptyStateContainer />,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default connect(({ loading, product, user }) => ({
  sharedDoc: product.sharedDoc,
  internalDoc: product.internalDoc,
  currentUser: user.currentUser,
  loadSharedDoc: loading.effects['product/getDocuments'],
  loadInternalDoc: loading.effects['product/getDocuments'],
}))(DisplayProductDocuments);
