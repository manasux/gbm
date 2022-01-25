/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import EmptyStateContainer from '@/components/EmptyStateContainer';
import {
  Button,
  Pagination,
  Row,
  Table,
  Tabs,
  Dropdown,
  Menu,
  message,
  Input,
  Modal,
  Badge,
  Rate,
} from 'antd';
import classNames from 'classnames';
import { connect, history, Link } from 'umi';
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { DownloadOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { hostname } from '@/utils/apiUtils';
import DisplayDrawer from './DisplayDrawer';
import PMSTable from './PMSTable';
import AppModal from '@/components/AppModal';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import StarRating from '@/components/StarRating';
import FilterPMS from './FilterPMS';

const AllPMS = ({
  dispatch,
  loading,
  currentUser,
  productPMS,
  completedPMS,
  totalCountPMS,
  allPMS,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);
  const [completeCurrentPage, setCompleteCurrentPage] = useState(1);
  const [completeStartIndex, setCompleteStartIndex] = useState(0);
  const [completeViewSize, setCompleteViewSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [selectedPMSRecord, setSelectedPMSRecord] = useState();
  const [excelLoading, setExcelLoading] = useState({});
  const [displayDrawer, setDisplayDrawer] = useState(false);
  const [reminderFeedback, setReminderFeedback] = useState(null);
  const [pmsSubject, setPmsSubject] = useState(null);
  const [communicationData, setCommunicationData] = useState([]);
  const [customerMail, setCustomerMail] = useState([]);
  const [ratingModel, setRatingModel] = useState(false);
  const [tab, setTab] = useState('ALL');
  const [reminder, setReminder] = useState([]);
  const [filterdQuery, setFilterdQuery] = useState('');
  const [complaintFilterType, setComplaintFilterType] = useState(undefined);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isClosedFilterApplied, setIsClosedFilterApplied] = useState(false);

  const { TabPane } = Tabs;

  const firstRender = useRef(true);
  const firstCountRender = useRef(true);

  const showModal = () => {
    setRatingModel(true);
  };
  const handleCancel = () => {
    setRatingModel(false);
  };

  const onRatingFeedback = (experienceRating, workEffortId) => {
    const body = {
      experienceRating,
      workEffortId,
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

  const sendReminder = () => {
    dispatch({
      type: 'product/sendReminders',
      payload: {
        body: {
          to: customerMail,
          communications: communicationData,
          subject: pmsSubject,
          body: reminderFeedback,
        },
      },
    }).then(() => message.success('Sent Reminder'));
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      const selectedRowData = selectedRows;
      const filterRowData = selectedRowData?.map((rowData) => {
        return {
          customerId: rowData?.customerId,
          workEffortId: rowData?.workEffortId,
        };
      });

      setCommunicationData(filterRowData);
      const email = selectedRowData?.map((data) => {
        return data?.customerEmail;
      });
      setCustomerMail(email);
    },
  };

  useEffect(() => {
    if (firstCountRender?.current) {
      dispatch({
        type: 'product/getTotalCountPMS',
        payload: {
          pathParams: {
            customerId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
          },
        },
      });
      firstCountRender.current = false;
    }
  }, []);

  const getCompletedPMS = () => {
    let query = {
      customerId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
      keyword: searchText,
      startIndex: completeStartIndex,
      viewSize: completeViewSize,
      statusId: 'COMPLETED',
    };
    if (isFilterApplied) {
      query = { ...query, ...filterdQuery };
    }
    dispatch({
      type: 'product/getCompletedPMS',
      payload: {
        query,
      },
    }).catch((error) => {
      message.error(error?.data?.message);
    });
  };

  useEffect(() => {
    getCompletedPMS();
  }, [searchText, completeStartIndex, completeViewSize]);

  const getProductPMS = (dispatchType, statusId) => {
    let query = {
      customerId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
      keyword: searchText,
      startIndex,
      viewSize,
      statusId,
    };
    if (isFilterApplied) {
      query = { ...query, ...filterdQuery };
    }
    dispatch({
      type: dispatchType,
      payload: {
        query,
      },
    }).catch((error) => {
      message.error(error?.data?.message);
    });
  };

  useEffect(() => {
    switch (tab) {
      case 'OVERDUE':
        getProductPMS('product/getProductPMS', 'OVERDUE');
        break;
      case 'UPCOMING':
        getProductPMS('product/getProductPMS', 'UPCOMING');
        break;

      default:
        getProductPMS('product/getAllPMS', '');
        break;
    }
  }, [searchText, viewSize, startIndex, tab]);

  useEffect(() => {
    if (firstRender?.current) {
      firstRender.current = false;
      return;
    } else if (isFilterApplied) {
      switch (tab) {
        case 'OVERDUE':
          getProductPMS('product/getOverduePMS', 'OVERDUE');
          break;
        case 'UPCOMING':
          getProductPMS('product/getUpcomingPMS', 'UPCOMING');
          break;

        default:
          getProductPMS('product/getAllPMS', '');
          break;
      }
      getCompletedPMS();
    } else if (!isFilterApplied) {
      switch (tab) {
        case 'OVERDUE':
          getProductPMS('product/getOverduePMS', 'OVERDUE');
          break;
        case 'UPCOMING':
          getProductPMS('product/getUpcomingPMS', 'UPCOMING');
          break;

        default:
          getProductPMS('product/getAllPMS', '');
          break;
      }
      getCompletedPMS();
    }
  }, [isFilterApplied]);

  const getFieldName = () => {
    switch (tab) {
      case 'OVERDUE':
        return 'Days crossed';
      case 'UPCOMING':
        return 'Days left';
      default:
        return '';
    }
  };
  const onProductClickHandler = (record) => {
    history.push(`/pms/equipments/view/${record?.productId}?task=updateEquipments`);
  };

  const pmsColumns = [
    {
      title: <span>PMS no</span>,
      dataIndex: 'formattedPmsNo',
      key: 'pmsNo',
      align: 'left',
      width: 130,
      render: (data, record) => (
        <Badge size="small" count={record?.unseenCount} offset={[8, 0]}>
          <div
            onClick={(event) => {
              event.stopPropagation();
              setSelectedPMSRecord(record);
              setDisplayDrawer(true);
            }}
            className="text-sm text-blue-700 underline cursor-pointer"
          >
            {data || 'N/A'}
          </div>
        </Badge>
      ),
    },

    {
      title: <span>Customer</span>,
      dataIndex: 'customerName',
      key: 'customerName',
      align: 'left',
      width: 100,
      render: (data) => (
        <div className=" capitalize  text-sm font-bold text-green-900">{data || 'N/A'}</div>
      ),
    },

    {
      title: <span>Location</span>,
      dataIndex: 'city',
      key: 'Location',
      align: 'left',
      width: 120,
      render: (data) => <div className="uppercase text-sm text-amber-600">{data || 'N/A'}</div>,
    },

    {
      title: <span>Department Name</span>,
      dataIndex: 'departmentName',
      key: 'departmentName',
      align: 'left',
      width: 140,
      render: (data) => <div className=" capitalize  text-sm text-yellow-700">{data || 'N/A'}</div>,
    },
    {
      title: <span>{getFieldName()}</span>,
      align: 'center',
      key: 'daysDiff',
      dataIndex: 'daysDiff',
      width: 140,
      render: (data) => <div className="capitalize text-sm">{data || 'N/A'}</div>,
    },
    // Starts here For only ALL TAB
    {
      title: <span>Product</span>,
      dataIndex: 'productName',
      key: 'productName',
      align: 'left',
      width: 100,
      render: (data, record) => (
        <div
          onClick={() => onProductClickHandler(record)}
          className="capitalize  text-sm cursor-pointer text-blue-700 underline"
        >
          {data || 'N/A'}
        </div>
      ),
    },
    // Ends here For only ALL TAB

    {
      title: <span>Product</span>, //For Overdue/Upcoming/Completed Tab only
      dataIndex: 'headTypeName',
      key: 'headTypeName',
      align: 'left',
      width: 100,
      render: (data, record) => (
        <div
          onClick={() => onProductClickHandler(record)}
          className=" capitalize  text-sm cursor-pointer text-blue-700 underline"
        >
          {data || 'N/A'}
        </div>
      ),
    },
    {
      title: <span>Type</span>,
      dataIndex: 'typeName',
      key: 'typeName',
      align: 'left',
      width: 100,
      render: (data, record) => (
        <div className="capitalize  text-sm text-blue-700">{data || 'N/A'}</div>
      ),
    },
    {
      title: <span>Model</span>,
      dataIndex: 'modelName',
      key: 'modelName',
      align: 'left',
      width: 100,
      render: (data) => <div className="capitalize text-sm text-blue-700">{data || 'N/A'}</div>,
    },
    {
      title: <span>Company</span>,
      dataIndex: 'brandName',
      key: 'brandName',
      align: 'left',
      width: 150,
      render: (data) => (
        <div className="capitalize font-medium text-sm text-teal-500">{data || 'N/A'}</div>
      ),
    },
    {
      title: <span>PMS date</span>,
      align: 'left',
      key: 'pmsDate',
      dataIndex: 'pmsDate',
      width: 130,
      render: (data) => (
        <p className="m-0 text-sm font-semibold text-gray-600 ">
          {moment(data)?.format('DD MMMM YYYY') || 'N/A'}
        </p>
      ),
    },

    {
      title: <span>PMS done by</span>,
      dataIndex: 'pmsDoneBy',
      key: 'pmsDoneBy',
      width: 110,
      render: (data, record) => (
        <div className="capitalize  text-sm font-medium text-blue-800">
          {data?.displayName || 'N/A'}
        </div>
      ),
    },

    // Starts here For only Completed Table

    {
      title: <span>Status</span>,
      dataIndex: 'pmsTimelyStatus',
      key: 'pmsTimelyStatus',
      align: 'center',
      width: 110,
      render: (data, record) => (
        <div className="capitalize  text-sm font-medium text-blue-800">{data || 'N/A'}</div>
      ),
    },

    {
      title: <span>Completed in days</span>,
      align: 'center',
      key: 'completed',
      dataIndex: 'completed',
      width: 140,
      render: (data, rec) => <div className="capitalize text-sm">{rec?.daysDiff || 'N/A'}</div>,
    },

    // Ends here For only Completed Table

    {
      title: <span>Total PMS</span>,
      dataIndex: 'totalPms',
      key: 'total',
      align: 'center',
      width: 80,
      render: (data) => <div className="capitalize text-sm">{data || 'N/A'}</div>,
    },

    // Starts here For only ALL TAB

    {
      title: <span>PMS Left</span>,
      dataIndex: 'leftCount',
      key: 'leftCount',
      align: 'center',
      width: 80,
      render: (data) => <div className="capitalize text-sm">{data || 'N/A'}</div>,
    },
    {
      title: <span>Completed PMS</span>,
      dataIndex: 'completedCount',
      key: 'completedCount',
      align: 'center',
      width: 120,
      render: (data) => <div className="capitalize text-sm">{data || 'N/A'}</div>,
    },
    {
      title: <span>Total PMS</span>,
      dataIndex: 'totalCount',
      key: 'totalCount',
      align: 'center',
      width: 80,
      render: (data) => <div className="capitalize text-sm">{data || 'N/A'}</div>,
    },

    // Ends here For only ALL TAB

    {
      title: <span>PMS left</span>,
      dataIndex: 'pmsLeft',
      key: 'pmsLeft',
      render: (data) => <div className="capitalize text-sm">{data}</div>,
    },
    {
      title: <span>Rating</span>,
      dataIndex: 'experienceRating',
      key: 'rating',
      align: 'left',
      width: 250,
      render: (data, record) => {
        return (
          <StarRating
            ratingRec={record?.experienceRating}
            recordId={record?.workEffortId}
            onRatingFeedback={onRatingFeedback}
          />
        );
      },
    },
    {
      title: <span>Action</span>,
      key: 'actions',
      align: 'center',
      width: 60,
      render: (data) => (
        <Button type="primary" size="medium">
          Renew
        </Button>
      ),
    },
  ];

  const exportToExcel = (data) => {
    const url = `${hostname()}/xapi/v1/assets/services/export/excel?customerId=${
      currentUser?.personal_details?.organizationDetails?.orgPartyId
    }&statusId=${data || ''}`;
    fetch(`${url}`, {
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
        link.download = `PMS-${data || 'All'}.xls`;
        link.click();
        setExcelLoading({ VERIFIED: false });
      });
  };
  const completeMenu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          setExcelLoading({ VERIFIED: true });
          exportToExcel('COMPLETED');
        }}
      >
        Completed
      </Menu.Item>

      <Menu.Item
        onClick={() => {
          setExcelLoading({ VERIFIED: true });
          exportToExcel('');
        }}
      >
        All PMS
      </Menu.Item>
    </Menu>
  );

  const menu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          setExcelLoading({ VERIFIED: true });
          exportToExcel('OVERDUE');
        }}
      >
        Overdue
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setExcelLoading({ VERIFIED: true });
          exportToExcel('UPCOMING');
        }}
      >
        Upcoming
      </Menu.Item>

      <Menu.Item
        onClick={() => {
          setExcelLoading({ VERIFIED: true });
          exportToExcel('');
        }}
      >
        All PMS
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={classNames('mx-12')}>
      <Page
        title="PMS"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'PMS',
                path: '/pms',
              },
            ]}
          />
        }
      >
        <div className="">
          <FilterPMS
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
                <div className="flex justify-between">
                  {productPMS?.records?.length !== 0 && (
                    <div className="pr-2">
                      <Button
                        // loading={loading}
                        size="medium"
                        type="default"
                        className="cursor-pointer text-lg ml-6 font-semibold"
                        disabled={customerMail?.length === 0 && communicationData?.length === 0}
                        onClick={showModal}
                      >
                        Reminder
                      </Button>
                    </div>
                  )}

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
                </div>
              }
            >
              <TabPane
                tab={
                  <span className="px-4">
                    <Badge size="small" count={totalCountPMS?.allCount} offset={[10, 0]}>
                      All
                    </Badge>
                  </span>
                }
                key="ALL"
              >
                <PMSTable
                  columns={pmsColumns?.filter((list) =>
                    currentUser?.isHeadquarter
                      ? list.dataIndex !== 'status' &&
                        list.dataIndex !== 'displayName' &&
                        list.dataIndex !== 'pmsLeft' &&
                        list?.dataIndex !== 'daysDiff' &&
                        list?.dataIndex !== 'experienceRating' &&
                        list?.dataIndex !== 'formattedPmsNo' &&
                        list?.dataIndex !== 'pmsDate' &&
                        list?.dataIndex !== 'pmsDoneBy' &&
                        list?.dataIndex !== 'totalPms' &&
                        list?.dataIndex !== 'completed' &&
                        list?.dataIndex !== 'pmsTimelyStatus' &&
                        list?.dataIndex !== 'headTypeName' &&
                        list?.key !== 'actions'
                      : list.dataIndex !== 'customerName' &&
                        list.dataIndex !== 'city' &&
                        list.dataIndex !== 'status' &&
                        list.dataIndex !== 'displayName' &&
                        list.dataIndex !== 'pmsLeft' &&
                        list?.dataIndex !== 'daysDiff' &&
                        list?.dataIndex !== 'experienceRating' &&
                        list?.dataIndex !== 'formattedPmsNo' &&
                        list?.dataIndex !== 'pmsDate' &&
                        list?.dataIndex !== 'pmsDoneBy' &&
                        list?.dataIndex !== 'totalPms' &&
                        list?.dataIndex !== 'completed' &&
                        list?.dataIndex !== 'pmsTimelyStatus' &&
                        list?.dataIndex !== 'headTypeName' &&
                        list?.key !== 'actions',
                  )}
                  data={allPMS?.records}
                  totalCount={allPMS?.totalCount}
                  scroll={{ y: 250, x: 1600 }}
                  rowSelection={rowSelection}
                  currentPage={currentPage}
                  startIndex={startIndex}
                  viewSize={viewSize}
                  setCurrentPage={setCurrentPage}
                  setStartIndex={setStartIndex}
                  setViewSize={setViewSize}
                  loading={loading}
                />
              </TabPane>
              <TabPane
                tab={
                  <span className="px-4">
                    <Badge size="small" count={totalCountPMS?.overdueCount} offset={[10, 0]}>
                      Overdue
                    </Badge>
                  </span>
                }
                key="OVERDUE"
              >
                <PMSTable
                  columns={pmsColumns?.filter((list) =>
                    currentUser?.isHeadquarter
                      ? list.dataIndex !== 'status' &&
                        list.dataIndex !== 'displayName' &&
                        list.dataIndex !== 'pmsLeft' &&
                        list?.dataIndex !== 'experienceRating' &&
                        list?.dataIndex !== 'totalCount' &&
                        list?.dataIndex !== 'completedCount' &&
                        list?.dataIndex !== 'leftCount' &&
                        list?.dataIndex !== 'pmsDoneBy' &&
                        list?.dataIndex !== 'completed' &&
                        list?.dataIndex !== 'pmsTimelyStatus' &&
                        list?.dataIndex !== 'productName' &&
                        list?.key !== 'actions'
                      : list.dataIndex !== 'customerName' &&
                        list.dataIndex !== 'city' &&
                        list.dataIndex !== 'status' &&
                        list.dataIndex !== 'displayName' &&
                        list.dataIndex !== 'pmsLeft' &&
                        list?.dataIndex !== 'experienceRating' &&
                        list?.dataIndex !== 'totalCount' &&
                        list?.dataIndex !== 'completedCount' &&
                        list?.dataIndex !== 'leftCount' &&
                        list?.dataIndex !== 'pmsDoneBy' &&
                        list?.dataIndex !== 'completed' &&
                        list?.dataIndex !== 'pmsTimelyStatus' &&
                        list?.dataIndex !== 'productName' &&
                        list?.key !== 'actions',
                  )}
                  data={productPMS?.records}
                  totalCount={productPMS?.totalCount}
                  scroll={{ y: 250, x: 1600 }}
                  rowSelection={rowSelection}
                  currentPage={currentPage}
                  startIndex={startIndex}
                  viewSize={viewSize}
                  setCurrentPage={setCurrentPage}
                  setStartIndex={setStartIndex}
                  setViewSize={setViewSize}
                  loading={loading}
                />
              </TabPane>

              <TabPane
                tab={
                  <span className="px-4">
                    <Badge size="small" count={totalCountPMS?.upcomingCount} offset={[10, 0]}>
                      Upcoming
                    </Badge>
                  </span>
                }
                key="UPCOMING"
              >
                <PMSTable
                  columns={pmsColumns?.filter((list) =>
                    currentUser?.isHeadquarter
                      ? list.dataIndex !== 'status' &&
                        list.dataIndex !== 'displayName' &&
                        list.dataIndex !== 'pmsLeft' &&
                        list?.dataIndex !== 'experienceRating' &&
                        list?.dataIndex !== 'totalCount' &&
                        list?.dataIndex !== 'completedCount' &&
                        list?.dataIndex !== 'leftCount' &&
                        list?.dataIndex !== 'pmsDoneBy' &&
                        list?.dataIndex !== 'completed' &&
                        list?.dataIndex !== 'pmsTimelyStatus' &&
                        list?.dataIndex !== 'productName' &&
                        list?.key !== 'actions'
                      : list.dataIndex !== 'customerName' &&
                        list.dataIndex !== 'city' &&
                        list.dataIndex !== 'status' &&
                        list.dataIndex !== 'displayName' &&
                        list.dataIndex !== 'pmsLeft' &&
                        list?.dataIndex !== 'experienceRating' &&
                        list?.dataIndex !== 'totalCount' &&
                        list?.dataIndex !== 'completedCount' &&
                        list?.dataIndex !== 'leftCount' &&
                        list?.dataIndex !== 'pmsDoneBy' &&
                        list?.dataIndex !== 'completed' &&
                        list?.dataIndex !== 'pmsTimelyStatus' &&
                        list?.dataIndex !== 'productName' &&
                        list?.key !== 'actions',
                  )}
                  data={productPMS?.records}
                  totalCount={productPMS?.totalCount}
                  scroll={{ y: 250, x: 1600 }}
                  rowSelection={rowSelection}
                  currentPage={currentPage}
                  startIndex={startIndex}
                  viewSize={viewSize}
                  setCurrentPage={setCurrentPage}
                  setStartIndex={setStartIndex}
                  setViewSize={setViewSize}
                  loading={loading}
                />
              </TabPane>
            </Tabs>

            <DisplayDrawer
              selectedPMSRecord={selectedPMSRecord}
              setDisplayDrawer={setDisplayDrawer}
              displayDrawer={displayDrawer}
              isTabCompleted={completedPMS?.records}
            />
            <AppModal
              showModal={ratingModel}
              titleName="Reminder"
              setShowModal={handleCancel}
              footer={
                <div className="flex justify-end items-center">
                  <div
                    className="font-semibold pr-2"
                    onClick={() => {
                      setRatingModel(false);
                      setPmsSubject(null);
                      setReminderFeedback(null);
                    }}
                  >
                    Cancel
                  </div>
                  <Button
                    disabled={!pmsSubject || !reminderFeedback}
                    type="primary"
                    onClick={sendReminder}
                  >
                    Save
                  </Button>
                </div>
              }
            >
              <div className="my-4 mx-8">
                <div className="font-semibold text-md mb-2">Subject</div>
                <Input
                  type="text"
                  onChange={(e) => setPmsSubject(e.target.value)}
                  value={pmsSubject}
                  placeholder="Enter subject here..."
                />
                <div className="font-semibold text-md mb-2">Feedback</div>
                <Input.TextArea
                  placeholder="Enter feedback..."
                  showCount
                  onChange={(e) => setReminderFeedback(e.target.value)}
                  maxLength={100}
                  rows={6}
                  value={reminderFeedback}
                  autoFocus
                />
              </div>
            </AppModal>
          </div>
          <div className="bg-white p-1 px-3 rounded-lg shadow">
            <div className="flex justify-between mt-2 mb-2">
              <span className="px-4 font-semibold font-bold">
                <Badge size="small" count={totalCountPMS?.completedCount} offset={[10, 0]}>
                  Completed
                </Badge>
              </span>
              <div>
                <div className="flex justify-between">
                  {completedPMS?.records?.length !== 0 && (
                    <div className="pr-2">
                      <Button
                        // loading={loading}
                        size="medium"
                        type="default"
                        className="cursor-pointer text-lg ml-6 font-semibold"
                        disabled={customerMail?.length === 0 && communicationData?.length === 0}
                        onClick={showModal}
                      >
                        Reminder
                      </Button>
                    </div>
                  )}

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
            </div>
            {/* TODO: */}
            <PMSTable
              data={completedPMS?.records}
              columns={pmsColumns?.filter((list) =>
                currentUser?.isHeadquarter
                  ? list?.title?.props?.children !== 'Days left' &&
                    list?.title?.props?.children !== 'Days Crossed' &&
                    list?.dataIndex !== 'totalCount' &&
                    list?.dataIndex !== 'completedCount' &&
                    list?.dataIndex !== 'leftCount' &&
                    list?.dataIndex !== 'daysDiff' &&
                    list.dataIndex !== 'pmsLeft' &&
                    list?.dataIndex !== 'productName'
                  : list.dataIndex !== 'customerName' &&
                    list.dataIndex !== 'city' &&
                    list?.title?.props?.children !== 'Days left' &&
                    list?.title?.props?.children !== 'Days Crossed' &&
                    list?.dataIndex !== 'totalCount' &&
                    list?.dataIndex !== 'completedCount' &&
                    list?.dataIndex !== 'leftCount' &&
                    list?.dataIndex !== 'daysDiff' &&
                    list.dataIndex !== 'pmsLeft' &&
                    list?.dataIndex !== 'productName',
              )}
              totalCount={completedPMS?.totalCount}
              scroll={{ y: 250, x: 2500 }}
              rowSelection={rowSelection}
              currentPage={completeCurrentPage}
              startIndex={completeStartIndex}
              viewSize={completeViewSize}
              setCurrentPage={setCompleteCurrentPage}
              setStartIndex={setCompleteStartIndex}
              setViewSize={setCompleteViewSize}
              loading={loading}
            />
          </div>
        </div>
      </Page>
    </div>
  );
};

export default connect(({ product, user, loading }) => ({
  allPMS: product?.allPMS,
  productPMS: product.productPMS,
  completedPMS: product.completedPMS,
  totalCountPMS: product.totalCountPMS,
  currentUser: user.currentUser,
  loading:
    loading.effects['product/getProductPMS'] ||
    loading.effects['product/getCompletedPMS'] ||
    loading.effects['product/getAllPMS'],
}))(AllPMS);
