/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import EmptyStateContainer from '@/components/EmptyStateContainer';
import UpdateDeleteHospitalContact from './UpdateDeleteHospitalContact';
import { Pagination, Popconfirm, Row, Table, Tooltip, Form, Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, connect, Link } from 'umi';
import styles from './index.less';
import FilterContacts from './FilterContacts';

import classNames from 'classnames';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';

const AllHospitalContactList = ({ dispatch, currentUser, loading, allhospitalStafsList }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState('');
  const [activeStartIndex, setActiveStartIndex] = useState(0);

  const [form] = Form.useForm();

  const getAllHospiralStafs = () => {
    dispatch({
      type: 'hospital/getAllHospitalStafs',
      payload: {
        viewSize,
        startIndex,
        keyword: searchText,
      },
    });
  };
  useEffect(() => {
    getAllHospiralStafs();
  }, [viewSize, startIndex, searchText]);

  const deleteContact = (record) => {
    dispatch({
      type: 'customer/deleteCustomer',
      payload: {
        pathParams: {
          contactId: record,
        },
      },
    }).then((res) => {
      if (res) {
        message.success('Customer Details Deleted Successfully');
        history.push('/contacts/all');
        getAllHospiralStafs();
      }
    });
  };

  const contactListColumns = [
    {
      title: 'Sr.No',
      dataIndex: 'srno',
      align: 'left',
      width: 100,
      render: (_, __, index) => (
        <div className="capitalize  text-xs font-semibold">
          {' '}
          {index + 1 + viewSize * (currentPage - 1)}
        </div>
      ),
    },
    {
      title: 'Contact Person',
      dataIndex: 'firstName',
      width: 200,
      align: 'left',
      render: (data, staff) => (
        <div className=" capitalize  text-xs font-semibold w-full text-blue-900">{`${data}${' '}${
          staff?.lastName ? staff?.lastName : ''
        }`}</div>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      align: 'left',
      ellipsis: {
        showTitle: false,
      },
      render: (data) => (
        <div className="capitalize  text-xs font-semibold ">
          <Tooltip placement="topLeft" title={data}>
            {data || 'N/A'}
          </Tooltip>
        </div>
      ),
    },

    {
      title: 'Mobile No.',
      dataIndex: 'primaryPhone',
      width: 180,

      align: 'left',
      render: (data, record) => (
        <div className="text-xs font-semibold">
          {record?.primaryPhone?.formattedPhone || '+919963524187'}
        </div>
      ),
    },
    {
      title: 'Designation',
      dataIndex: 'designation',

      align: 'left',
      render: (data) => (
        <div className=" capitalize  text-xs font-semibold w-full">{data || 'N/A'}</div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'primaryEmail',
      width: 250,

      align: 'left',
      render: (data) => (
        <div className="capitalize  text-xs font-semibold underline text-blue-700 truncate ">
          <Tooltip placement="topLeft" title={data}>
            {data || 'N/A'}
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Primary/Not',
      dataIndex: 'primaryContact',
      width: 150,
      align: 'center',
      render: (data) => (
        <div className=" capitalize  text-xs font-semibold">
          {data === 'N' ? (
            <span className="">
              <CheckOutlined style={{ color: '#0066ff', fontSize: '16px' }} />
            </span>
          ) : (
            <span className="text-red-400">
              <CloseOutlined style={{ fontSize: '16px' }} />
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Action',
      align: 'center',
      render: (_, record) => (
        <div className="flex justify-center items-center  w-full ">
          <a
            ghost
            type="primary"
            onClick={() => {
              setSelectedContact(record);
              setShowModal(true);
            }}
          >
            <EditOutlined /> Edit
          </a>
          <Popconfirm
            onConfirm={() => deleteContact(record?.partyId)}
            okText="Delete"
            okType="danger"
            placement="right"
            title={`Are you sure you want to delete this Contact?`}
            className="ml-4"
          >
            <span className="text-red-600 hover:text-red-700 cursor-pointer">
              <DeleteOutlined />
              Delete
            </span>
          </Popconfirm>
        </div>
      ),
    },
  ];
  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  return (
    <div className="mx-12">
      <Page
        title="All Contacts"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'All Contacts',
                path: '/contacts/all',
              },
            ]}
          />
        }
        primaryAction={
          <Link to="/contacts/add">
            <Button type="primary" icon={<PlusOutlined style={{ fontSize: '16px' }} />}>
              Add Contact
            </Button>
          </Link>
        }
      >
        <div className="">
          <div className={currentUser?.isHeadquarter ? 'hidden' : 'block'}>
            <FilterContacts
              setSearchText={setSearchText}
              setActiveStartIndex={setActiveStartIndex}
              setStartIndex={setStartIndex}
            />
          </div>
          <div className=" bg-white shadow rounded px-2">
            <Table
              loading={loading}
              size="small"
              scroll={{ x: 1200, y: 600 }}
              columns={contactListColumns}
              dataSource={allhospitalStafsList?.staff || []}
              className={classNames(styles.tableStyle)}
              rowKey={(record) => record.serial_number}
              pagination={false}
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
                    total={allhospitalStafsList?.totalCount}
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
        </div>
        <UpdateDeleteHospitalContact
          showModal={showModal}
          setShowModal={setShowModal}
          setSelectedContact={setSelectedContact}
          selectedContact={selectedContact}
        />
      </Page>
    </div>
  );
};

export default connect(({ user, hospital, loading }) => ({
  loading: loading.effects['hospital/getAllHospitalStafs'],
  allhospitalStafsList: hospital?.allhospitalStafsList,
}))(AllHospitalContactList);
