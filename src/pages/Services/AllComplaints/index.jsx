/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import EmptyStateContainer from '@/components/EmptyStateContainer';
import { Button, Pagination, Row, Table, Tabs, Dropdown, Menu, Badge, message } from 'antd';
import { connect, history, useLocation, Link } from 'umi';
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import {
  DownloadOutlined,
  EyeFilled,
  EyeOutlined,
  InboxOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import DisplayDrawer from '@/components/DisplayDrawer';
import FilterComplaints from './FilterComplaints';
import ComplaintsTable from './ComplaintsTable';
import { hostname } from '@/utils/apiUtils';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import StarRating from '@/components/StarRating';
import style from '../index.less';

const Complaints = ({
  Allcomplaints,
  dispatch,
  loading,
  currentUser,
  completedComplaint,
  totalCount,
}) => {
  const { pathname } = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);
  const [completeCurrentPage, setCompleteCurrentPage] = useState(1);
  const [completeStartIndex, setCompleteStartIndex] = useState(0);
  const [completeViewSize, setCompleteViewSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [displayDrawer, setDisplayDrawer] = useState(false);
  const [excelLoading, setExcelLoading] = useState({});
  const [selectedComplaintRecord, setSelectedComplaintRecord] = useState();
  const [filterdQuery, setFilterdQuery] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isClosedFilterApplied, setIsClosedFilterApplied] = useState(false);
  const [complaintFilterType, setComplaintFilterType] = useState(undefined);

  const [tab, setTab] = useState('CRQ_OPEN');
  const { TabPane } = Tabs;

  const firstTabsRender = useRef(true);
  const firstRender = useRef(true);

  const getFinishedComplaints = () => {
    dispatch({
      type: 'product/getFinishedComplaints',
      payload: {
        query: {
          statusId: 'CRQ_CLOSED',
          customerId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
          keyword: searchText,
          startIndex: completeStartIndex,
          viewSize: completeViewSize,
        },
      },
    });
  };

  const getProductComplaints = () => {
    let query = {
      keyword: searchText,
      startIndex,
      viewSize,
      statusId: tab,
      customerId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
      isHeadQuarter: true,
    };
    if (isFilterApplied && (complaintFilterType === tab || complaintFilterType === undefined)) {
      query = { ...query, ...filterdQuery };
    }
    dispatch({
      type: 'product/getProductComplaints',
      payload: {
        query,
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: 'product/getTotalCountComplaints',
      payload: {
        query: {
          customerId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
        },
      },
    });
    getFinishedComplaints();
  }, [searchText, completeStartIndex, completeViewSize]);

  useEffect(() => {
    if (firstRender?.current) {
      firstRender.current = false;
      return;
    } else if (
      isClosedFilterApplied &&
      (complaintFilterType === undefined || complaintFilterType === 'CRQ_CLOSED')
    ) {
      dispatch({
        type: 'product/getFinishedComplaints',
        payload: {
          query: {
            statusId: 'CRQ_CLOSED',
            customerId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
            keyword: searchText,
            startIndex: completeStartIndex,
            viewSize: completeViewSize,
            ...filterdQuery,
          },
        },
      });
    } else if (!isClosedFilterApplied) {
      getFinishedComplaints();
    }
  }, [searchText, completeStartIndex, completeViewSize, isClosedFilterApplied]);

  useEffect(() => {
    if (firstTabsRender?.current) {
      firstTabsRender.current = false;
      return;
    } else if (
      isFilterApplied &&
      (complaintFilterType === undefined || complaintFilterType !== 'CRQ_CLOSED')
    ) {
      dispatch({
        type: 'product/getProductComplaints',
        payload: {
          query: {
            keyword: searchText,
            startIndex,
            viewSize,
            statusId: tab,
            customerId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
            ...filterdQuery,
          },
        },
      });
    } else if (!isFilterApplied) {
      getProductComplaints();
    }
  }, [searchText, viewSize, startIndex, isFilterApplied]);

  useEffect(() => {
    setSelectedComplaintRecord('');
    getProductComplaints();
  }, [searchText, viewSize, startIndex, tab]);

  const onRatingFeedback = (experienceRating, custRequestId) => {
    const body = {
      experienceRating,
      custRequestId,
    };

    dispatch({
      type: 'product/addRatingFeedback',
      payload: {
        pathParams: {
          partyId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
        },
        body,
      },
    }).then(() => {
      message.success('Feedback Submitted Successfully');
    });
  };

  const onProductClickHandler = (record) => {
    history.push(`/complaints/equipments/view/${record?.productId}?task=updateEquipments`);
  };

  const complaintColumns = [
    {
      title: <span>Complaint No.</span>,
      dataIndex: 'formattedComplaintNo',
      align: 'left',
      width: 80,
      render: (data, record) => {
        return (
          <Badge size="small" count={record?.unseenCount} offset={[8, 0]}>
            <div
              onClick={(event) => {
                event.stopPropagation();
                setSelectedComplaintRecord(record);
                setDisplayDrawer(true);
              }}
              className="text-sm text-blue-700 underline"
            >
              {data || 'N/A'}
            </div>
          </Badge>
        );
      },
    },
    {
      title: 'Serial. No.',
      dataIndex: 'serialNumber',
      width: 80,
      align: 'left',
      render: (data) => <div className="capitalize  text-sm">{data || 'N/A'}</div>,
    },
    {
      title: 'Product Name',
      dataIndex: 'product',
      width: 90,
      align: 'left',
      render: (data, record) => (
        <div
          onClick={() => onProductClickHandler(record)}
          className="capitalize  text-sm cursor-pointer text-blue-700 underline"
        >
          {data?.name || 'N/A'}
        </div>
      ),
    },
    {
      title: 'Product Company',
      dataIndex: 'productCompany',
      width: 90,
      align: 'left',
      render: (data, record) => (
        <div className="capitalize font-medium text-sm text-teal-500" style={{ color: '#38b2ac' }}>
          {data?.name || (record?.category === 'Product' && record?.company?.name)}
        </div>
      ),
    },
    {
      title: <span>Department Name</span>,
      dataIndex: 'department',
      key: 'department',
      align: 'left',
      width: 110,
      render: (data) => (
        <div className="capitalize  text-sm text-yellow-700">{data?.name || 'N/A'}</div>
      ),
    },
    {
      title: 'Contract Status',
      dataIndex: 'warrantyStatus',
      align: 'center',
      width: 80,
      render: (data) => <div className="capitalize text-sm">{data ? 'Yes' : 'No'}</div>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      align: 'left',
      width: 50,
      render: (data) => <div className="capitalize text-green-800 text-sm">{data}</div>,
    },
    {
      title: 'Complaint Raised By',
      align: 'left',
      dataIndex: 'createdBy',
      width: 100,
      render: (createdBy, record) => (
        <div className="flex flex-col text-sm">
          <p className="m-0 font-semibold capitalize cursor-pointer text-blue-800 underline">
            {createdBy?.displayName}
          </p>
          <div>
            on{' '}
            <p className="m-0 inline font-semibold cursor-pointer text-gray-800">
              {moment(record?.createdAt)?.format('DD MMMM YYYY')}
              at {moment(record?.createdAt)?.format('LT')}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Last Modified By',
      align: 'left',
      dataIndex: 'modifiedBy',
      width: 100,
      render: (modifiedBy, record) => (
        <div className="text-sm">
          <span className="font-semibold capitalize cursor-pointer text-blue-800  underline">
            {modifiedBy?.displayName}
          </span>
          <div>
            on{' '}
            <p className="m-0 inline font-semibold cursor-pointer text-gray-800 ">
              {moment(record?.lastUpdatedAt)?.format('DD MMMM YYYY')}
              at {moment(record?.lastUpdatedAt)?.format('LT')}
            </p>
          </div>
        </div>
      ),
    },

    {
      title: ' No.of Days',
      width: 80,
      dataIndex: 'numberOfDays',
      align: 'center',
      render: (data) => <div className="capitalize  text-sm">{`${data} Days`}</div>,
    },
    {
      title: <span className="text-xs">Rating</span>,
      dataIndex: 'rating',
      align: 'left',
      width: 160,
      render: (data, record) => {
        return (
          <StarRating
            ratingRec={record?.experienceRating}
            recordId={record?.id}
            onRatingFeedback={onRatingFeedback}
          />
        );
      },
    },
  ];

  const exportToExcel = (data) => {
    const urll = `${hostname()}/xapi/v1/customers/complaints/export?customerId=${
      currentUser?.personal_details?.organizationDetails?.orgPartyId
    }&statusId=${data || ''}`;
    fetch(`${urll}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accessToken: localStorage.getItem('accessToken'),
      },
    })
      .then((resp) => resp.arrayBuffer())
      .then((response) => {
        const file = new Blob([response], { type: 'application/octet-stream' });
        // process to auto download it
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = `Complaints-${data || 'All'}.xls`;
        link.click();
        setExcelLoading({ VERIFIED: false });
        setExcelLoading({ PENDING: false });
      });
  };
  const completeMenu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          setExcelLoading({ VERIFIED: true });
          exportToExcel('CRQ_CLOSED');
        }}
      >
        Closed
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setExcelLoading({ VERIFIED: true });
          exportToExcel('');
        }}
      >
        All Complaints
      </Menu.Item>
    </Menu>
  );
  const menu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          setExcelLoading({ VERIFIED: true });
          exportToExcel('CRQ_OPEN');
        }}
      >
        Open
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setExcelLoading({ VERIFIED: true });
          exportToExcel('CRQ_INPROGRESS');
        }}
      >
        In Progress
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setExcelLoading({ VERIFIED: true });
          exportToExcel('CRQ_HOLD');
        }}
      >
        On Hold
      </Menu.Item>

      <Menu.Item
        onClick={() => {
          setExcelLoading({ VERIFIED: true });
          exportToExcel('');
        }}
      >
        All Complaints
      </Menu.Item>
    </Menu>
  );

  const getTabButtons = () => {
    switch (pathname) {
      case '/complaints/all':
        return (
          <div className="flex justify-end w-64">
            <Link to="/complaints/register-complaint">
              <Button type="primary" icon={<InboxOutlined style={{ fontSize: '20px' }} />}>
                Register Complaint
              </Button>
            </Link>
          </div>
        );
      default:
        return '';
    }
  };

  return (
    <div className="mx-12">
      <Page
        title="Complaints"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'All Complaints',
                path: '/complaints/all',
              },
            ]}
          />
        }
        primaryAction={getTabButtons()}
      >
        <FilterComplaints
          setSearchText={setSearchText}
          setStartIndex={setStartIndex}
          setCompleteStartIndex={setCompleteStartIndex}
          setFilterdQuery={setFilterdQuery}
          setComplaintFilterType={setComplaintFilterType}
          complaintFilterType={complaintFilterType}
          setIsFilterApplied={setIsFilterApplied}
          setIsClosedFilterApplied={setIsClosedFilterApplied}
          isFilterApplied={isFilterApplied}
          isClosedFilterApplied={isClosedFilterApplied}
          setTab={setTab}
        />

        <div className="bg-white p-1 px-3 rounded-lg shadow mb-4">
          <Tabs
            activeKey={tab}
            className=""
            onTabClick={(val) => {
              setTab(val);
              setSearchText('');
              setViewSize(10);
              setStartIndex(0);
              setCurrentPage(1);
            }}
            tabBarExtraContent={
              <>
                <Dropdown overlay={menu}>
                  <Button
                    ghost
                    type="primary"
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <div className="px-2">
                      {excelLoading.VERIFIED ? (
                        <LoadingOutlined className="text-lg" />
                      ) : (
                        <DownloadOutlined className="text-lg" />
                      )}{' '}
                      <span className=" ml-2 text-blue-600 font-semibold capitalize">
                        Download Excel
                      </span>
                    </div>
                  </Button>
                </Dropdown>
              </>
            }
          >
            <TabPane
              tab={
                <span className="px-4">
                  <Badge size="small" count={totalCount?.CRQ_OPEN} offset={[10, 0]}>
                    Open
                  </Badge>
                </span>
              }
              key="CRQ_OPEN"
            >
              <ComplaintsTable
                loading={loading}
                data={Allcomplaints?.records}
                columns={complaintColumns?.filter((item) => item?.dataIndex !== 'rating')}
                scroll={{ y: 250, x: 1600 }}
                totalCount={Allcomplaints?.total_count}
                setStartIndex={setStartIndex}
                setCurrentPage={setCurrentPage}
                startIndex={startIndex}
                setViewSize={setViewSize}
                viewSize={viewSize}
                currentPage={currentPage}
              />
            </TabPane>

            <TabPane
              tab={
                <span className="px-4">
                  <Badge size="small" count={totalCount?.CRQ_INPROGRESS} offset={[10, 0]}>
                    In Progress
                  </Badge>
                </span>
              }
              key="CRQ_INPROGRESS"
            >
              <ComplaintsTable
                loading={loading}
                data={Allcomplaints?.records}
                columns={complaintColumns?.filter((item) => item?.dataIndex !== 'rating')}
                scroll={{ y: 250, x: 1600 }}
                totalCount={Allcomplaints?.total_count}
                setStartIndex={setStartIndex}
                setCurrentPage={setCurrentPage}
                startIndex={startIndex}
                setViewSize={setViewSize}
                viewSize={viewSize}
                currentPage={currentPage}
              />
            </TabPane>
            <TabPane
              tab={
                <span className="px-4">
                  <Badge size="small" count={totalCount?.CRQ_HOLD} offset={[10, 0]}>
                    Hold
                  </Badge>
                </span>
              }
              key="CRQ_HOLD"
            >
              <ComplaintsTable
                loading={loading}
                data={Allcomplaints?.records}
                columns={complaintColumns?.filter((item) => item?.dataIndex !== 'rating')}
                scroll={{ y: 250, x: 1600 }}
                totalCount={Allcomplaints?.total_count}
                setStartIndex={setStartIndex}
                setCurrentPage={setCurrentPage}
                startIndex={startIndex}
                setViewSize={setViewSize}
                viewSize={viewSize}
                currentPage={currentPage}
              />
            </TabPane>
          </Tabs>

          <DisplayDrawer
            status="viewComplaint"
            selectedComplaintRecord={selectedComplaintRecord}
            setDisplayDrawer={setDisplayDrawer}
            displayDrawer={displayDrawer}
          />
        </div>
        <div className="bg-white p-1 px-3 rounded-lg shadow">
          <div className="flex justify-between items-center mt-2 mb-2">
            {' '}
            <span className="px-4 font-semibold">
              <Badge size="small" count={totalCount?.CRQ_CLOSED} offset={[10, 0]}>
                Closed
              </Badge>
            </span>
            <div>
              <Dropdown overlay={completeMenu}>
                <Button
                  ghost
                  type="primary"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <div className="px-2">
                    {excelLoading.VERIFIED ? (
                      <LoadingOutlined className="text-lg" />
                    ) : (
                      <DownloadOutlined className="text-lg" />
                    )}{' '}
                    <span className=" ml-2 text-blue-600 font-semibold capitalize">
                      Download Excel
                    </span>
                  </div>
                </Button>
              </Dropdown>
            </div>
          </div>

          <ComplaintsTable
            loading={loading}
            data={completedComplaint?.records}
            columns={complaintColumns}
            scroll={{ y: 250, x: 1600 }}
            totalCount={completedComplaint?.total_count}
            setStartIndex={setCompleteStartIndex}
            setCurrentPage={setCompleteCurrentPage}
            setViewSize={setCompleteViewSize}
            viewSize={completeViewSize}
            currentPage={completeCurrentPage}
          />
        </div>
      </Page>
    </div>
  );
};

export default connect(({ product, user, loading }) => ({
  Allcomplaints: product.ProductComplaint,
  completedComplaint: product.completedComplaint,
  currentUser: user?.currentUser,
  totalCount: product?.totalCount,
  loading:
    loading.effects['product/getProductComplaints'] ||
    loading.effects['product/getFinishedComplaints'],
}))(Complaints);
