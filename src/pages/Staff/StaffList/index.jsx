import React, { useState, useEffect } from 'react';
import { Tabs, Button, Avatar, Space, Tag } from 'antd';
import { connect, Link } from 'umi';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import { PlusSquareOutlined } from '@ant-design/icons';
import StaffListTable from './StaffListTable';
import CheckValidation from '@/components/CheckValidation';
import { getIntials } from '@/utils/utils';
import moment from 'moment';
import { useEnableDisableStaff } from '@/query/useMutateStaff';

const { TabPane } = Tabs;

const StaffList = (props) => {
  const { staffList, dispatch, currentUser } = props;
  const [acceptedKeyword, setAcceptedKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);
  const [tab, setTab] = useState('ACTIVE');
  const enableDisableStaffMutate = useEnableDisableStaff();

  useEffect(() => {
    if (tab === 'INACTIVE') {
      dispatch({
        type: 'staff/getStaffList',
        payload: {
          query: {
            view_size: viewSize,
            start_index: startIndex,
            keyword: acceptedKeyword,
            isActive: false,
          },
          pathParams: {
            type: 'accepted',
          },
        },
      });
    } else {
      dispatch({
        type: 'staff/getStaffList',
        payload: {
          query: {
            view_size: viewSize,
            start_index: startIndex,
            keyword: acceptedKeyword,
          },
          pathParams: {
            type: getStaffType(),
          },
        },
      });
    }
  }, [viewSize, startIndex, tab, acceptedKeyword, dispatch]);

  const getStaffType = () => {
    switch (tab) {
      case 'ACTIVE':
        return 'accepted';
      case 'AWAITING':
        return 'pending';

      default:
        return '';
    }
  };

  const columns = [
    {
      title: 'Sr. No.',
      dataIndex: 'srno',
      align: 'center',
      width: 100,
      render: (_, __, index) => (
        <span className="text-black">{index + 1 + viewSize * (currentPage - 1)}</span>
      ),
    },
    {
      title: 'Staff ID',
      dataIndex: 'partyId',
      width: 80,
      align: 'center',
      render: (data) => <p className="m-0 font-medium text-sm text-blue-800">{data}</p>,
    },
    {
      title: 'Name',
      dataIndex: 'toName',
      width: 300,
      render: (name, record) => (
        <div className="flex items-center">
          <Avatar className="bg-blue-800 w-8 uppercase" style={{ backgroundColor: '#005be7' }}>
            {name && getIntials(name)}
          </Avatar>
          <div className="ml-2">
            <div className="font-bold truncate capitalize text-emerald-900" title={name && name}>
              {name && name}
            </div>
            <div>{record?.roleTypeId && <Tag color="blue">{record?.roleTypeId}</Tag>}</div>

            <div className="text-black font-medium">
              Requested on{' '}
              <span className="text-gray-700 font-sm">{moment(record.createdAt).format('LL')}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (data) => <p className="m-0 underline text-blue-600">{data}</p>,
    },
    {
      title: 'Phone',
      render: (data, record) => (
        <p className="m-0 text-black font-medium">
          {record?.phone?.countryCode} {record?.phone?.areaCode + record?.phone?.phone}
        </p>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'city',
      render: (data) => (
        <p className="m-0 uppercase font-medium text-sm text-green-800">{data || 'n/a'}</p>
      ),
    },
    {
      title: 'Invited',
      dataIndex: 'invited',
      width: 300,
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar className="bg-blue-800 w-8 uppercase" style={{ backgroundColor: '#005be7' }}>
            {record?.partyFrom?.name && getIntials(record?.partyFrom?.name)}
          </Avatar>
          <div className="ml-2">
            <div className="font-medium">
              Invited by{' '}
              <span className="font-medium text-teal-500">{record?.partyFrom?.name}</span>
            </div>
            <div className="font-medium">
              on{' '}
              <span className="text-gray-700 font-sm">
                {moment(record.lastInvitedOn).format('LL')}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'active',
      align: 'center',
      render: (text, record) => {
        return (
          <Button
            type="danger"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              enableDisableStaffMutate?.mutateAsync({
                pathParams: {
                  partyId: record?.partyId,
                  staffStatus: 'deactivate',
                },
              });
            }}
          >
            Deactivate
          </Button>
        );
      },
    },
    {
      title: 'Action',
      key: 'inactive',
      align: 'center',
      render: (text, record) => (
        <Button
          type="primary"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            enableDisableStaffMutate?.mutateAsync({
              pathParams: {
                partyId: record?.partyId,
                staffStatus: 'reactivate',
              },
            });
          }}
        >
          Activate
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto">
      <Page
        title="All Staff"
        PrevNextNeeded="N"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'All Staff',
                path: '/staff/list',
              },
            ]}
          />
        }
        primaryAction={
          <Link
            to={{
              pathname: '/staff/invite',
            }}
          >
            <Button icon={<PlusSquareOutlined />} type="primary" id="open-invite-staff">
              Invite Staff
            </Button>
          </Link>
        }
      >
        <div className="bg-white shadow rounded">
          <Tabs
            defaultActiveKey="ACTIVE"
            className=""
            onTabClick={(val) => {
              setTab(val);
              setCurrentPage(1);
              setViewSize(10);
              setStartIndex(0);
              setAcceptedKeyword('');
            }}
          >
            <TabPane tab={<span className="px-4">Active</span>} key="ACTIVE">
              <StaffListTable
                viewSize={viewSize}
                totalRecords={staffList?.totalCount}
                currentPage={currentPage}
                setViewSize={setViewSize}
                setCurrentPage={setCurrentPage}
                setStartIndex={setStartIndex}
                setKeyword={setAcceptedKeyword}
                columns={columns?.filter((c) => c?.key !== 'inactive')}
              />
            </TabPane>
            <TabPane tab="Awaiting Response" key="AWAITING">
              <StaffListTable
                awaiting
                setKeyword={setAcceptedKeyword}
                viewSize={viewSize}
                totalRecords={staffList?.totalCount}
                currentPage={currentPage}
                setViewSize={setViewSize}
                setCurrentPage={setCurrentPage}
                setStartIndex={setStartIndex}
                columns={columns?.filter((c) => c?.key !== 'inactive' && c?.key !== 'active')}
              />
            </TabPane>
            <TabPane tab={<span className="px-4">Inactive</span>} key="INACTIVE">
              <StaffListTable
                viewSize={viewSize}
                totalRecords={staffList?.totalCount}
                currentPage={currentPage}
                setViewSize={setViewSize}
                setCurrentPage={setCurrentPage}
                setStartIndex={setStartIndex}
                setKeyword={setAcceptedKeyword}
                columns={columns?.filter((c) => c?.key !== 'active')}
              />
            </TabPane>
          </Tabs>
        </div>
      </Page>
    </div>
  );
};
export default connect(({ staff, user }) => ({
  currentUser: user?.currentUser,
  staffList: staff.staffList,
}))(StaffList);
