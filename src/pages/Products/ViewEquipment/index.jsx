import Breadcrumbs from '@/components/BreadCrumbs';
import Page from '@/components/Page';
import {
  CheckCircleFilled,
  ClockCircleFilled,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  SmileOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { connect, history, useParams, useLocation } from 'umi';
import moment from 'moment';
import {
  Button,
  Form,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Table,
  Tooltip,
  Switch,
  Rate,
  Tabs,
  Badge,
  message,
  notification,
} from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ProductDetailsForm from './ProductDetailsForm';
import { getPageQuery } from '@/utils/utils';
import DisplayUploadedDocuments from './DisplayUploadedDocuments';
import styles from './index.less';
import DisplayHistory from './DisplayHistory';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import ProductUpdateDetails from './ProductUpdateDetails';
import FilterSharedDoc from '@/components/FilterDocument';
import DisplayProductMerchandise from './DisplayProductMerchandise';
import DisplayProductDocuments from './DisplayProductDocuments';
import DisplayApproval from './DisplayApproval';
import ProductResultList from './ProductResultList';
import Table1 from './PmsDetailTable';
import classNames from 'classnames';
import CheckValidation from '@/components/CheckValidation';
import PMSTable from './PMSTable';
import UploadGlobalDocs from '@/components/UploadGlobalDocs';
import AddProductMerchandise from './AddProductMerchandise';
import AddDocuments from './AddDocuments';

const ViewEquipment = ({
  dispatch,
  createProductLoading,
  updateProductLoading,
  currentUser,
  accessoryDrafts,
  sharedDoc,
  internalDoc,
  productDetail,
  pmsHistory,
  activities,
  approvalHistory,
  productResultList,
  productPMS,
  completedPMS,
  totalCountPMS,
  loading,
}) => {
  const { serialNumberId } = useParams();
  const { TabPane } = Tabs;
  const [tab, setTab] = useState('OVERDUE');
  const { pathname, query } = useLocation();
  const [hasWarranty, setHasWarranty] = useState(false);
  const [updateItemInfo, setUpdateItemInfo] = useState('');
  const [hasContract, setHasContract] = useState(false);
  const [otherUploads, setOtherUploads] = useState(false);
  const [otherOptions, setOtherOptions] = useState([]);
  const [showApproval, setShowApproval] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showModel, setShowModel] = useState('');
  const [status, setStatus] = useState('');
  const { Option } = Select;
  const [sharedDocuments, setSharedDocuments] = useState(false);
  const [addAccessories, setAddAccessories] = useState(false);
  const [internalDocuments, setInternalDocuments] = useState(false);
  const [showDocumentModel, setShowDocumentModel] = useState(false);
  const [showDocumentUploadModel, setShowDocumentUploadModel] = useState(false);
  const [docStatus, setDocStatus] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [documentStatus, setDocumentStatus] = useState('');
  const [othervalue, setothervalue] = useState({});
  const [updateAccessoryInfo, setUpdateAccessoryInfo] = useState('');
  const [updateSharedDocument, setUpdateSharedDocument] = useState('');
  const [updateInternalDocument, setUpdateInternalDocument] = useState('');
  const [serialNumberFilelist, setSerialNumberFilelist] = useState([]);
  const [installationDateFilelist, setInstallationDateFilelist] = useState([]);
  const [warrantyFilelist, setWarrantyFilelist] = useState([]);
  const [pmsFilelist, setPmsFilelist] = useState([]);
  const [contractPeriodFilelist, setContractPeriodFilelist] = useState([]);
  const [serialNumberContentInfo, setSerialNumberContentInfo] = useState([]);
  const [installationDateContentInfo, setInstallationDateContentInfo] = useState([]);
  const [warrantyContentInfo, setWarrantyContentInfo] = useState([]);
  const [pmsContentInfo, setPmsContentInfo] = useState([]);
  const [contractPeriodContentInfo, setContractPeriodContentInfo] = useState([]);
  const [selectedMerchandise, setSelectedMerchandise] = useState();
  const [searchTextForShared, setSearchTextForShared] = useState('');
  const [accessoryFilter, setAccessoryFilter] = useState('');
  const [passMainProductDocuments, setPassMainProductDocuments] = useState([]);
  const [form] = Form.useForm();
  const { task, productId } = getPageQuery();
  const [searchTextForInternal, setSearchTextForInternal] = useState('');
  const [selectionType, setSelectionType] = useState('checkbox');
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
  const [historyStartIndex, setHistoryStartIndex] = useState(0);
  const [historyViewSize, setHistoryViewSize] = useState(10);
  const [isAddWarrantyVisible, setIsAddWarrantyVisible] = useState(false);
  const [isAddAfterWarrantyVisible, setIsAddAfterWarrantyVisible] = useState(false);
  const [isPMSDetails, setIsPMSDetails] = useState(true);
  const [isHistoryDetails, setIsHistoryDetails] = useState(true);
  const [afterWarrantyModalType, setAfterWarrantyModalType] = useState(null);
  const [afterWarrantyRecord, setAfterWarrantyRecord] = useState(null);

  useEffect(() => {
    dispatch({
      type: 'product/getTotalCountPMS',
      payload: {
        pathParams: {
          customerId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
        },
      },
    });
  }, [currentUser]);

  const getBreadCrumb = () => {
    switch (pathname.split('/')[1]) {
      case 'complaints':
        return {
          name: 'All Complaints',
          url: '/complaints/all',
        };
      case 'pms':
        return {
          name: 'PMS',
          url: '/pms',
        };
      case 'contracts':
        return {
          name: 'Contracts',
          url: '/contracts',
        };
      default:
        return {
          name: 'All Equipments',
          url: '/equipments/all',
        };
    }
  };

  const getProductPMS = (dispatchType, statusId) => {
    dispatch({
      type: dispatchType,
      payload: {
        query: {
          customerId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
          startIndex,
          viewSize,
          statusId,
        },
      },
    }).catch((error) => {
      message.error(error?.data?.message);
    });
  };

  useEffect(() => {
    switch (tab) {
      case 'COMPLETED':
        getProductPMS('product/getCompletedPMS', 'COMPLETED');
        break;
      case 'UPCOMING':
        getProductPMS('product/getProductPMS', 'UPCOMING');
        break;

      default:
        getProductPMS('product/getProductPMS', 'OVERDUE');
        break;
    }
  }, [viewSize, startIndex, tab]);

  const getProductData = () => {
    const data = {};
    if (task === 'updateEquipments' && serialNumberId) {
      data.productId = serialNumberId;
    }
    if (task === 'cloneProductEquipment' && productId) {
      data.productId = productId;
    }
    dispatch({
      type: 'product/getProductData',
      payload: { pathParams: { ...data } },
    }).then((res) => res);
  };
  useEffect(() => {
    if (task === 'updateEquipments' && serialNumberId) {
      getProductData();
    }
  }, [serialNumberId]);

  useEffect(() => {
    if (task === 'cloneProductEquipment' && productId) {
      getProductData();
    }
  }, [productId]);

  const fetchHistory = (value) => {
    dispatch({
      type: 'product/getActivities',
      payload: {
        pathParams: {
          productId: serialNumberId || pathname.split('drafts/')[1],
        },
        query: { sectionId: value },
      },
    });
  };

  const getSharedDocs = (data) => {
    if (serialNumberId) {
      dispatch({
        type: 'product/getSharedDocuments',
        payload: {
          pathParams: {
            productId: serialNumberId,
          },
          query: {
            document_type: 'SHARED_DOC',
            keyword: searchTextForShared,
            ...data,
          },
        },
      });
    }
  };

  const getAccessoryDocs = () => {
    dispatch({
      type: 'product/getProductAccessoryDrafts',
      payload: {
        is_draft: productDetail?.is_draft,
        is_variant: 'Y',
        parent_product_id: serialNumberId,
        assoc_type_id: 'PRODUCT_ACCESSORY',
        customer_id: currentUser?.personal_details?.organizationDetails?.orgPartyId,
        keyword: accessoryFilter,
      },
    });
  };
  useEffect(() => {
    dispatch({
      type: 'product/getActivities',
      payload: {
        pathParams: {
          productId: serialNumberId || pathname.split('drafts/')[1],
        },
      },
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: 'product/getApprovalHistory',
      payload: {
        pathParams: { productId: serialNumberId },
      },
    });
    dispatch({
      type: 'product/getProductResultList',
      payload: {
        query: {
          productId: serialNumberId,
          statusId: 'CRQ_CLOSED',
        },
      },
    });
  }, [serialNumberId]);

  const getInternalDoc = (data) => {
    dispatch({
      type: 'product/getInternalDocuments',
      payload: {
        pathParams: {
          productId: serialNumberId,
        },
        query: {
          document_type: 'INTERNAL_DOC',
          keyword: searchTextForInternal,
          ...data,
        },
      },
    });
  };

  useEffect(() => {
    getSharedDocs();
  }, [searchTextForShared]);
  useEffect(() => {
    getInternalDoc();
  }, [searchTextForInternal]);
  useEffect(() => {
    getAccessoryDocs();
  }, [accessoryFilter]);
  useEffect(() => {
    if (task === 'updateEquipments') {
      dispatch({
        type: 'product/getProductItemDrafts',
        payload: {
          is_draft: productDetail?.is_draft,
          is_variant: 'Y',
          parent_product_id: serialNumberId,
          assoc_type_id: 'PRODUCT_ITEM',
          customer_id: currentUser?.personal_details?.organizationDetails?.orgPartyId,
        },
      });

      getAccessoryDocs();
      getSharedDocs();
      getInternalDoc();
    }
  }, [productDetail?.is_draft]);
  useEffect(() => {
    // *** Logic to open Table List Automatically if Data is More than 1. ****
    accessoryDrafts?.total_count > 0 ? setAddAccessories(true) : setAddAccessories(false);
    if (sharedDoc) {
      Object?.keys(sharedDoc)?.length > 0 ? setSharedDocuments(true) : setSharedDocuments(false);
    }
    if (internalDoc) {
      Object?.keys(internalDoc)?.length > 0
        ? setInternalDocuments(true)
        : setInternalDocuments(false);
    }
    if (activities) {
      Object?.keys(activities)?.length > 0 ? setShowHistory(true) : setShowHistory(false);
    }
    if (approvalHistory) {
      Object?.keys(approvalHistory)?.length > 0 ? setShowApproval(true) : setShowApproval(false);
    }
    if (productResultList) {
      Object?.keys(productResultList)?.length > 0 ? setShowRating(true) : setShowRating(false);
    }
  }, [accessoryDrafts?.total_count, sharedDoc]);

  const handleSubmit = () => {
    if (productDetail?.product_id && productDetail?.serial_number) {
      if (passMainProductDocuments?.length > 0) {
        dispatch({
          type: 'product/createPendingEquipment',
          payload: {
            pathParams: {
              mainId: productDetail?.product_id,
            },
          },
        }).then((res) => {
          if (res?.productId) {
            notification.open({
              message: 'Great Job!',
              description: <div>You have successfully added the equipment for Approval.</div>,
              icon: <SmileOutlined style={{ color: '#108ee9' }} />,
            });
            history.push(`/equipments/all`);
          } else {
            message.error('Product with this serial number has already been submitted');
          }
        });
      } else {
        message.warning(
          'Please upload atleast one product document to submit your product for approval.',
        );
      }
    }
  };
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
  const pmsColumns = [
    {
      title: <span>PMS no</span>,
      dataIndex: 'formattedPmsNo',
      key: 'pmsNo',
      align: 'left',
      width: 120,
      render: (data, record) => (
        <Badge size="small" count={record?.unseenCount} offset={[8, 0]}>
          <p className="m-0 text-sm text-blue-700">{data || 'N/A'}</p>
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
      title: <span>Product</span>,
      dataIndex: 'typeName',
      key: 'typeName',
      align: 'left',
      width: 100,
      render: (data, record) => (
        <p className="m-0 capitalize  text-sm text-blue-700">{data || 'N/A'}</p>
      ),
    },
    {
      title: <span>Type</span>,
      dataIndex: 'headTypeName',
      key: 'headTypeName',
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
        <div className="capitalize font-medium text-sm" style={{ color: '#38b2ac' }}>
          {data || 'N/A'}
        </div>
      ),
    },
    {
      title: <span>PMS date</span>,
      align: 'left',
      key: 'pmsDate',
      dataIndex: 'pmsDate',
      width: 120,
      render: (data) => (
        <p className="m-0 text-sm font-semibold text-gray-600 ">
          {moment(data)?.format('DD MMMM YYYY') || 'N/A'}
        </p>
      ),
    },

    {
      title: <span>{getFieldName()}</span>,
      align: 'center',
      key: 'daysDiff',
      dataIndex: 'daysDiff',
      width: 140,
      render: (data) => <div className="capitalize text-sm">{data || 'N/A'}</div>,
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
      title: <span>Days</span>,
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

    // Start here For only PMS History

    {
      title: <span>Status</span>,
      dataIndex: 'statusId',
      key: 'statusId',
      align: 'center',
      width: 110,
      render: (data, record) => (
        <div className="capitalize  text-sm font-medium text-blue-800">{data || 'N/A'}</div>
      ),
    },
    // End here For only PMS History

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
      width: 160,
      render: (data) => (
        <div className=" capitalize  text-sm">{<Rate disabled value={data} /> || 'N/A'}</div>
      ),
    },
  ];

  useEffect(() => {
    if (serialNumberId) {
      dispatch({
        type: 'product/getPmsHistory',
        payload: {
          query: {
            customerId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
            productId: serialNumberId,
          },
        },
      });
    }
  }, [serialNumberId]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {},
  };

  const handleDelete = () => {
    dispatch({
      type: 'product/deleteProduct',
      payload: {
        pathParams: {
          productId: serialNumberId,
        },
      },
    }).then(() => {
      message.success('Draft deleted successfuly');
      history.push(`/equipments/add`);
    });
  };
  const myRef = useRef(null);

  const uploadContent = (content) => {
    dispatch({
      type: 'product/uploadContent',
      payload: {
        pathParams: {
          productId: serialNumberId,
        },
        body: content,
      },
    }).then((res) => {
      if (res?.contentId) {
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
        dispatch({
          type: 'product/getProductDocuments',
          payload: {
            pathParams: {
              productId: serialNumberId,
            },
          },
        });
      }
    });
  };

  const recallProduct = () => {
    dispatch({
      type: 'product/recallProduct',
      payload: {
        pathParams: {
          productId: serialNumberId,
        },
        query: {
          status_id: 'RECALLED',
        },
      },
    }).then((res) => {
      getProductData();
      if (res?.message) {
        message.success('Product equipment has been recalled successfully');
      }
    });
  };
  const getButtonType = () => {
    switch (task) {
      case 'cloneProductEquipment':
        return 'Clone';
      case 'updateEquipments':
        return 'Update';
      default:
        return 'Save as draft';
    }
  };
  const getToolTipTitle = () => {
    switch (task) {
      case 'cloneProductEquipment':
        return 'create copy of this product';
      case 'updateEquipments':
        return 'update this product';
      default:
        return 'to save your product as draft';
    }
  };
  const getBtnLoading = () => {
    switch (task) {
      case 'cloneProductEquipment':
        return createProductLoading;
      case 'updateEquipments':
        return updateProductLoading;
      default:
        return createProductLoading;
    }
  };
  return (
    <div className="mx-12">
      <Page
        title={'Product Name with detail'}
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: getBreadCrumb()?.name,
                path: getBreadCrumb()?.url,
              },
              {
                name: `${productDetail?.product?.name}`,
                path: `${pathname}?task=updateEquipments`,
              },
            ]}
          />
        }
        primaryAction={
          !productDetail?.is_verified && task === 'updateEquipments' ? (
            <div className="flex flex-col ">
              <div className="flex items-center">
                {productDetail?.is_draft ? (
                  <ExclamationCircleOutlined
                    style={{
                      color: 'rgb(0 91 231)',
                      marginRight: '10px',
                      fontSize: '16px',
                    }}
                  />
                ) : (
                  <ClockCircleFilled
                    style={{
                      color: 'rgb(0 91 231)',
                      marginRight: '10px',
                      fontSize: '16px',
                    }}
                  />
                )}
                <span className="sm:text-sm text-lg text-gray-500 font-semibold w-full">
                  {`Your product ${' '}${
                    productDetail?.is_draft
                      ? 'is in draft,submit your product for the approval.'
                      : 'has been submitted for the approval.'
                  } `}
                </span>
              </div>
              <div className="font-bold w-full ml-7">Your PMS is overdue by 28 days</div>
            </div>
          ) : productDetail?.is_verified && task === 'updateEquipments' ? (
            <div className="flex flex-col justify-center">
              <div className="flex  items-center w-56">
                <CheckCircleFilled
                  style={{
                    color: 'rgb(0 91 231)',
                    fontSize: '16px',
                    marginTop: '4px',
                  }}
                />
                <span className="sm:text-sm ml-2 text-lg text-gray-500 font-semibold">
                  Your product is approved
                </span>
              </div>
              <div className="font-bold w-56 ml-6">Your PMS is overdue by 28 days</div>
            </div>
          ) : (
            ''
          )
        }
      >
        <Form
          colon={false}
          hideRequiredMark
          layout="horizontal"
          form={form}
          onFinish={(values) => {
            if (isAddWarrantyVisible) {
              const {
                pms_details,
                warranty_end_date,
                warranty_start_date,
                warranty_details,
              } = values;
              const data = {
                has_warranty: 'Y',
                pms_details,
                warranty_end_date,
                warranty_start_date,
                warranty_details,
              };
              dispatch({
                type: 'product/updateDraft',
                payload: {
                  pathParams: { productId: productDetail?.product_id },
                  body: {
                    ...data,
                  },
                },
              }).then((res) => {
                if (res?.responseMessage === 'success') {
                  message?.success('You have successfully updated your warranty details');
                  setIsAddWarrantyVisible(false);
                } else {
                  message?.error('Something went wrong!');
                }
              });
            }

            if (isAddAfterWarrantyVisible) {
              const { contract_details } = values;

              let afterWarrantydata = {
                contract_details: { ...contract_details, type_id: contract_details?.sub_type_id },
                after_warranty: 'Y',
              };

              delete afterWarrantydata.contract_details.sub_type_id;

              if (afterWarrantyModalType === 'update') {
                afterWarrantydata = {
                  ...afterWarrantydata,
                  contract_details: {
                    ...afterWarrantydata?.contract_details,
                    id: afterWarrantyRecord?.id,
                  },
                };
                delete afterWarrantydata.after_warranty;
              }

              dispatch({
                type: 'product/updateAfterWarrantyDraft',
                payload: {
                  pathParams: { productId: productDetail?.product_id },
                  body: {
                    ...afterWarrantydata,
                  },
                },
              }).then((res) => {
                if (res?.responseMessage === 'success') {
                  message?.success('You have successfully updated your after warranty details');
                  setIsAddAfterWarrantyVisible(false);
                  getProductData();
                } else {
                  message?.error('Something went wrong!');
                }
              });
            }
          }}
        >
          <div className="mb-8">
            <ProductDetailsForm
              serialNumberContentInfo={serialNumberContentInfo}
              setSerialNumberContentInfo={setSerialNumberContentInfo}
              installationDateContentInfo={installationDateContentInfo}
              setInstallationDateContentInfo={setInstallationDateContentInfo}
              warrantyContentInfo={warrantyContentInfo}
              setWarrantyContentInfo={setWarrantyContentInfo}
              pmsContentInfo={pmsContentInfo}
              setPmsContentInfo={setPmsContentInfo}
              contractPeriodContentInfo={contractPeriodContentInfo}
              setContractPeriodContentInfo={setContractPeriodContentInfo}
              setInstallationDateFilelist={setInstallationDateFilelist}
              installationDateFilelist={installationDateFilelist}
              serialNumberFilelist={serialNumberFilelist}
              setSerialNumberFilelist={setSerialNumberFilelist}
              form={form}
              getProductData={getProductData}
              hasWarranty={hasWarranty}
              setHasWarranty={setHasWarranty}
              hasContract={hasContract}
              setHasContract={setHasContract}
              setOtherOptions={setOtherOptions}
              otherOptions={otherOptions}
              othervalue={othervalue}
              setothervalue={setothervalue}
              otherUploads={otherUploads}
              setOtherUploads={setOtherUploads}
              warrantyFilelist={warrantyFilelist}
              setWarrantyFilelist={setWarrantyFilelist}
              pmsFilelist={pmsFilelist}
              setPmsFilelist={setPmsFilelist}
              contractPeriodFilelist={contractPeriodFilelist}
              setContractPeriodFilelist={setContractPeriodFilelist}
              isAddWarrantyVisible={isAddWarrantyVisible}
              setIsAddWarrantyVisible={setIsAddWarrantyVisible}
              setIsAddAfterWarrantyVisible={setIsAddAfterWarrantyVisible}
              isAddAfterWarrantyVisible={isAddAfterWarrantyVisible}
              loading={loading}
              setAfterWarrantyModalType={setAfterWarrantyModalType}
              afterWarrantyModalType={afterWarrantyModalType}
              setAfterWarrantyRecord={setAfterWarrantyRecord}
              afterWarrantyRecord={afterWarrantyRecord}
            />
          </div>
          <DisplayUploadedDocuments
            setPassMainProductDocuments={setPassMainProductDocuments}
            setSharedDocuments={setSharedDocuments}
          />

          <div className={'flex justify-between'}>
            <div className={`flex justify-start my-6 ${styles.btnStyles}`}>
              <Tooltip
                title={
                  <div className="flex items-center justify-center">
                    <span className="mr-2">
                      <InfoCircleOutlined />
                    </span>
                    <span className="text-xs">Click to create copy of this product</span>
                  </div>
                }
              >
                <Button
                  loading={createProductLoading}
                  size="large"
                  onClick={() =>
                    history.push(
                      `/equipments/add?task=cloneProductEquipment&productId=${productDetail?.product_id}`,
                    )
                  }
                  type="primary"
                  className="cursor-pointer text-lg font-semibold"
                >
                  Clone
                </Button>
              </Tooltip>
            </div>

            <div className={`flex justify-end my-6 ${styles.btnStyles}`}>
              <div
                className="mx-12 mt-2 cursor-pointer"
                onClick={() => {
                  form.resetFields();
                  history.push(`/equipments/all`);
                }}
              >
                <span className="text-gray-500">Cancel</span>
              </div>
              <Tooltip
                title={
                  <div className="flex justify-center items-center">
                    <span className="mr-2">
                      <InfoCircleOutlined />
                    </span>
                    <span className="text-xs">{`Click to ${getToolTipTitle()}`}</span>
                  </div>
                }
              >
                <Button
                  size="large"
                  loading={getBtnLoading()}
                  onClick={() => form.submit()}
                  type="primary"
                  className="cursor-pointer text-lg font-semibold"
                >
                  {getButtonType()}
                </Button>
              </Tooltip>
            </div>
          </div>
        </Form>
        {task === 'updateEquipments' && (
          <>
            <div className="">
              <ProductUpdateDetails productDetail={productDetail} />
            </div>

            <div className="mb-6">
              <div
                className="mt-6 px-2 border w-full p-1 rounded-lg text-white flex justify-between"
                style={{ backgroundColor: '#005be7', cursor: 'pointer' }}
                onClick={() => setAddAccessories(!addAccessories)}
              >
                <div className="font-semibold ">Accessories</div>
                <div className="flex justify-between items-center">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowModel(true);
                      setStatus('productAccessories');
                    }}
                    type="ghost"
                    shape="round"
                    size="small"
                    style={{
                      color: 'white',
                      borderColor: 'white',
                      marginRight: '24px',
                    }}
                  >
                    <span className="color-gray-300"> Add Accessories</span>
                  </Button>
                  <Switch
                    className="p-2"
                    style={{
                      background: addAccessories ? '#3CB371' : '#c9ced6',
                    }}
                    size="small"
                    checked={addAccessories}
                    onChange={setAddAccessories}
                  />
                </div>
              </div>
              <div>
                {addAccessories && (
                  <>
                    <FilterSharedDoc
                      status="accessory_filter"
                      setAccessoryFilter={setAccessoryFilter}
                    />
                    {Array.isArray(accessoryDrafts?.records) &&
                    accessoryDrafts?.records?.length > 0 ? (
                      <div className="bg-white rounded-lg text-center mb-6">
                        <DisplayProductMerchandise
                          setSelectedMerchandise={setSelectedMerchandise}
                          selectedMerchandise={selectedMerchandise}
                          val="PRODUCT_ACCESSORY"
                          setStatus={setStatus}
                          setShowModel={setShowModel}
                          setUpdateAccessoryInfo={setUpdateAccessoryInfo}
                          setIfilter
                        />
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg text-center mb-6 pb-4">
                        <EmptyStateContainer />

                        <Button
                          type="primary"
                          shape="circle"
                          size="large"
                          onClick={() => {
                            setShowModel(true);
                            setStatus('productAccessories');
                          }}
                        >
                          <PlusOutlined />
                        </Button>
                        <div className="text-blue-500" style={{ fontWeight: '500' }}>
                          Add accessories
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div
                className="mt-6 px-2 border w-full p-1 rounded-lg text-white flex justify-between"
                style={{ backgroundColor: '#005be7', cursor: 'pointer' }}
                onClick={() => setSharedDocuments(!sharedDocuments)}
              >
                <div className="font-semibold ">Shared Documents</div>
                <div className="flex justify-between items-center">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();

                      setDocStatus('shared_docs');
                      setShowDocumentUploadModel(true);
                    }}
                    type="ghost"
                    shape="round"
                    size="small"
                    style={{
                      color: 'white',
                      borderColor: 'white',
                      marginRight: '24px',
                    }}
                  >
                    <span className="color-gray-300"> Upload Document</span>
                  </Button>
                  <Switch
                    className="p-2"
                    style={{
                      background: sharedDocuments ? '#3CB371' : '#c9ced6',
                    }}
                    size="small"
                    checked={sharedDocuments}
                    onChange={setSharedDocuments}
                  />
                </div>
              </div>
              <div>
                {sharedDocuments && (
                  <>
                    <FilterSharedDoc
                      typeofDoc="SHARED_DOC"
                      setSearchTextForShared={setSearchTextForShared}
                      getSharedDocs={getSharedDocs}
                    />

                    {sharedDoc && Object?.keys(sharedDoc)?.length > 0 ? (
                      <div className="bg-white rounded-lg text-center mb-6">
                        <DisplayProductDocuments
                          searchTextForShared={searchTextForShared}
                          val="SHARED_DOC"
                          docTree="SHARED_DOC"
                          setShowDocumentModel={setShowDocumentModel}
                          setDocumentStatus={setDocumentStatus}
                          setUpdateSharedDocument={setUpdateSharedDocument}
                        />
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg text-center mb-6 pb-4">
                        <EmptyStateContainer />

                        <Button
                          type="primary"
                          shape="circle"
                          size="large"
                          onClick={() => {
                            setDocStatus('shared_docs');
                            setShowDocumentUploadModel(true);
                          }}
                        >
                          <UploadOutlined />
                        </Button>
                        <div className="text-blue-500" style={{ fontWeight: '500' }}>
                          Upload Document
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div
                className="mt-6 px-2 border w-full p-1 rounded-lg text-white flex justify-between"
                style={{ backgroundColor: '#005be7', cursor: 'pointer' }}
                onClick={() => setInternalDocuments(!internalDocuments)}
              >
                <div className="font-semibold">Internal Documents</div>
                <div className="flex justify-between items-center">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDocStatus('internal_docs');
                      setShowDocumentUploadModel(true);
                    }}
                    type="ghost"
                    shape="round"
                    size="small"
                    style={{
                      color: 'white',
                      borderColor: 'white',
                      marginRight: '24px',
                    }}
                  >
                    <span className="color-gray-300"> Upload Document</span>
                  </Button>
                  <Switch
                    className="p-2"
                    style={{
                      background: internalDocuments ? '#3CB371' : '#c9ced6',
                    }}
                    size="small"
                    checked={internalDocuments}
                    onChange={setInternalDocuments}
                  />
                </div>
              </div>
              <div>
                {internalDocuments && (
                  <>
                    <FilterSharedDoc
                      typeofDoc="INTERNAL_DOC"
                      getInternalDoc={getInternalDoc}
                      setSearchTextForInternal={setSearchTextForInternal}
                      getSharedDocs={getSharedDocs}
                    />
                    {internalDoc && Object.keys(internalDoc)?.length > 0 ? (
                      <div className="bg-white rounded-lg text-center mb-6">
                        <DisplayProductDocuments
                          getInternalDoc={getInternalDoc}
                          val="INTERNAL_DOC"
                          setShowDocumentModel={setShowDocumentModel}
                          setDocumentStatus={setDocumentStatus}
                          setUpdateInternalDocument={setUpdateInternalDocument}
                        />
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg text-center mb-6 pb-4">
                        <EmptyStateContainer />

                        <Button
                          type="primary"
                          shape="circle"
                          size="large"
                          onClick={() => {
                            setDocStatus('internal_docs');
                            setShowDocumentUploadModel(true);
                          }}
                        >
                          <UploadOutlined />
                        </Button>
                        <div className="text-blue-500" style={{ fontWeight: '500' }}>
                          Upload Document
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div
              className="mt-4 px-2 border w-full p-1 rounded-lg text-white flex justify-between"
              style={{ backgroundColor: '#005be7', cursor: 'pointer' }}
              onClick={() => setShowApproval(!showApproval)}
            >
              <div className="font-semibold ">Approval History</div>

              <div className=" flex">
                <div className={classNames(styles?.selectStyle, `w-full  flex justify-between`)}>
                  <div className="mx-6">
                    <Popconfirm
                      title="Are you sure you want to recall this product equipment?"
                      onConfirm={recallProduct}
                      okText="Recall"
                      cancelText="Cancel"
                      okType="primary"
                    >
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        type="ghost"
                        shape="round"
                        size="small"
                        style={{ color: 'white', borderColor: 'white' }}
                      >
                        <span className="color-gray-300"> Recall</span>
                      </Button>
                    </Popconfirm>
                  </div>

                  <div style={{ marginTop: '0.5px' }}>
                    <Switch
                      className={classNames('p-2')}
                      style={{
                        background: showApproval ? '#3CB371' : '#c9ced6',
                      }}
                      size="small"
                      checked={showApproval}
                      onChange={setShowApproval}
                    />
                  </div>
                </div>
              </div>
            </div>
            {showApproval && (
              <div className="bg-white rounded-lg mb-6">
                <DisplayApproval />
              </div>
            )}

            {/* Result card */}
            <div
              className="mt-4 px-2 border w-full p-1 rounded-lg text-white flex justify-between items-center"
              style={{ backgroundColor: '#005be7', cursor: 'pointer' }}
              onClick={() => setShowRating(!showRating)}
            >
              <div className="flex items-center">
                <div className="font-semibold ">Complaints History</div>
                <div className="ml-4">
                  <Rate value={productResultList?.complaintsRatingsAverage} disabled />
                </div>
              </div>

              <div className={classNames(styles?.selectStyle)}>
                <div style={{ marginTop: '0.5px' }}>
                  <Switch
                    className={classNames('p-2')}
                    style={{ background: showRating ? '#3CB371' : '#c9ced6' }}
                    size="small"
                    checked={showRating}
                    onChange={setShowRating}
                  />
                </div>
              </div>
            </div>
            {showRating && (
              <div className="bg-white rounded-lg">
                <ProductResultList />
              </div>
            )}
            {/* End of Result card */}

            {/* Start of PMS Details */}

            <div
              className="p-2 mt-6 font-semibold text-sm text-white  rounded-lg flex justify-between items-center"
              style={{ backgroundColor: '#005be7', cursor: 'pointer' }}
              onClick={() => setIsPMSDetails(!isPMSDetails)}
            >
              <p className="m-0">PMS Details</p>

              <Switch
                className={classNames('p-2')}
                style={{ background: isPMSDetails ? '#3CB371' : '#c9ced6' }}
                size="small"
                checked={isPMSDetails}
                onClick={() => setIsPMSDetails(!isPMSDetails)}
              />
            </div>
            <CheckValidation show={isPMSDetails}>
              <div className="bg-white  px-3 rounded-lg text-white shadow">
                <Tabs
                  activeKey={tab}
                  className=""
                  onTabClick={(val) => {
                    setTab(val);
                    setViewSize(10);
                    setStartIndex(0);
                    setCurrentPage(1);
                  }}
                >
                  <TabPane
                    tab={
                      <span className="px-4">
                        <Badge size="small" count={totalCountPMS?.overdueCount} offset={[8, 0]}>
                          Overdue
                        </Badge>
                      </span>
                    }
                    key="OVERDUE"
                  >
                    <PMSTable
                      columns={pmsColumns?.filter(
                        (list) =>
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
                          list?.dataIndex !== 'statusId', // statusId is used in case of PMS History only
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
                        <Badge size="small" count={totalCountPMS?.upcomingCount} offset={[8, 0]}>
                          Upcoming
                        </Badge>
                      </span>
                    }
                    key="UPCOMING"
                  >
                    <PMSTable
                      columns={pmsColumns?.filter(
                        (list) =>
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
                          list?.dataIndex !== 'statusId', // statusId is used in case of PMS History only
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
                        <Badge size="small" count={totalCountPMS?.completedCount} offset={[8, 0]}>
                          Completed
                        </Badge>
                      </span>
                    }
                    key="COMPLETED"
                  >
                    <PMSTable
                      data={completedPMS?.records}
                      columns={pmsColumns?.filter(
                        (list) =>
                          list?.dataIndex !== 'totalCount' &&
                          list?.dataIndex !== 'completedCount' &&
                          list?.dataIndex !== 'leftCount' &&
                          list?.dataIndex !== 'daysDiff' &&
                          list.dataIndex !== 'pmsLeft' &&
                          list?.dataIndex !== 'statusId', // statusId is used in case of PMS History only,
                      )}
                      totalCount={completedPMS?.totalCount}
                      scroll={{ y: 250, x: 2000 }}
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
              </div>
            </CheckValidation>

            {/* End of PMS Details */}

            {/* Start of PMS History */}
            <CheckValidation show={productDetail?.is_verified}>
              <div
                className="p-2 mt-6 font-semibold text-sm text-white  rounded-lg flex justify-between items-center"
                style={{ backgroundColor: '#005be7', cursor: 'pointer' }}
                onClick={() => setIsHistoryDetails(!isHistoryDetails)}
              >
                <p className="m-0">PMS History</p>
                <div className="flex items-center">
                  <p className="m-0 inline-block mx-2">
                    Total PMS:{' '}
                    <span className="text-green-400">{pmsHistory?.stats?.totalCount}</span>
                  </p>
                  <p className="m-0 inline-block mx-2">
                    PMS Left: <span className="text-red-400">{pmsHistory?.stats?.leftCount}</span>
                  </p>
                  <div className="ml-4 flex items-center">
                    <Switch
                      className="p-2"
                      style={{ background: isHistoryDetails ? '#3CB371' : '#c9ced6' }}
                      size="small"
                      checked={isHistoryDetails}
                      onClick={() => setIsHistoryDetails(!isHistoryDetails)}
                    />
                  </div>
                </div>
              </div>
              {isHistoryDetails && (
                <div className="mb-6 text-xs bg-white rounded-lg">
                  <PMSTable
                    data={pmsHistory?.records}
                    columns={pmsColumns?.filter(
                      (list) =>
                        list?.dataIndex !== 'customerName' &&
                        list?.dataIndex !== 'totalCount' &&
                        list?.dataIndex !== 'completedCount' &&
                        list?.dataIndex !== 'leftCount' &&
                        list?.dataIndex !== 'daysDiff' &&
                        list?.dataIndex !== 'city' &&
                        list?.dataIndex !== 'departmentName' &&
                        list?.dataIndex !== 'typeName' &&
                        list?.dataIndex !== 'headTypeName' &&
                        list?.dataIndex !== 'modelName' &&
                        list?.dataIndex !== 'experienceRating' &&
                        list.dataIndex !== 'pmsLeft' &&
                        list?.dataIndex !== 'pmsTimelyStatus', //pmsTimely Status is used in case of Completed PMS only
                    )}
                    totalCount={pmsHistory?.totalCount}
                    scroll={{ y: 250, x: 1000 }}
                    rowSelection={rowSelection}
                    currentPage={historyCurrentPage}
                    startIndex={historyStartIndex}
                    viewSize={historyViewSize}
                    setCurrentPage={setHistoryCurrentPage}
                    setStartIndex={setHistoryStartIndex}
                    setViewSize={setHistoryViewSize}
                    loading={loading}
                  />
                </div>
              )}
            </CheckValidation>
            {/* End of PMS History */}

            <div
              ref={myRef}
              className="mt-4 px-2 border w-full p-1 rounded-lg text-white flex justify-between"
              style={{ backgroundColor: '#005be7', cursor: 'pointer' }}
              onClick={() => setShowHistory(!showHistory)}
            >
              <div className="font-semibold ">Browsing History</div>

              <div className="flex">
                <div className={classNames(styles?.selectStyle)}>
                  <Select
                    size="small"
                    suffixIcon={
                      <span
                        className={classNames(' bg-blue-700 rounded-lg px-2 text-gray-100')}
                        style={{ borderRadius: '50% 50%', marginTop: '0.1rem' }}
                      >
                        <i>i</i>
                      </span>
                    }
                    style={{ width: 200 }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    onSelect={(value) => {
                      fetchHistory(value);
                    }}
                    placeholder="Filter"
                  >
                    <Option value="BASIC_INFO">Product Description</Option>
                    <Option value="HAS_WARRANTY">Has Warranty</Option>
                    <Option value="AFTER_WARRANTY">After Warranty</Option>
                    <Option value="SHARED_DOC">Shared Documents</Option>
                    <Option value="INTERNAL_DOC">Internal Documents</Option>
                    <Option value="">All</Option>
                  </Select>
                </div>

                <div style={{ marginTop: '0.5px', marginLeft: '1rem' }}>
                  <Switch
                    className={classNames('p-2')}
                    style={{ background: showHistory ? '#3CB371' : '#c9ced6' }}
                    size="small"
                    checked={showHistory}
                    onChange={setShowHistory}
                  />
                </div>
              </div>
            </div>
            {showHistory && (
              <div className="bg-white rounded-lg mb-6">
                <DisplayHistory />
              </div>
            )}
            {productDetail?.is_draft && (
              <div className={classNames('flex justify-end my-6', styles.btnStyles)}>
                <div className="mx-12 mt-2 cursor-pointer">
                  <Popconfirm
                    placement="leftTop"
                    title={`Are you sure you want to delete this draft.`}
                    onConfirm={handleDelete}
                    okText="Yes"
                    cancelText="No"
                  >
                    <span className="text-gray-500">Delete</span>
                  </Popconfirm>
                </div>
                <div
                  className="mx-12 mt-2 cursor-pointer"
                  onClick={() => {
                    form.resetFields();
                    history.push(`/equipments/all`);
                  }}
                >
                  <span className="text-gray-500">Cancel</span>
                </div>
                <Tooltip
                  title={
                    <div className="flex justify-center items-center">
                      <span className="mr-2">
                        <InfoCircleOutlined />
                      </span>
                      <span className="text-xs">{`Submit your product for approval`}</span>
                    </div>
                  }
                >
                  <div className="ml-4">
                    <Button
                      size="large"
                      type="primary"
                      className="cursor-pointer text-lg font-semibold"
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </div>
                </Tooltip>
              </div>
            )}
          </>
        )}
      </Page>
      <div className={classNames('mx-10')}>
        <UploadGlobalDocs
          status={docStatus}
          docTypeName={
            docStatus === 'shared_docs' ? 'Upload Shared Documents' : 'Upload Internal Documents'
          }
          setShowDocumentModel={setShowDocumentUploadModel}
          showDocumentModel={showDocumentUploadModel}
          setSharedDocuments={setSharedDocuments}
          setInternalDocuments={setInternalDocuments}
        />
        <AddProductMerchandise
          visible={showModel}
          setAddAccessories={setAddAccessories}
          setVisible={setShowModel}
          status={status}
          setUpdateItemInfo={setUpdateItemInfo}
          updateItemInfo={updateItemInfo}
          updateAccessoryInfo={updateAccessoryInfo}
          setUpdateAccessoryInfo={setUpdateAccessoryInfo}
        />
        <AddDocuments
          updateSharedDocument={updateSharedDocument}
          setUpdateSharedDocument={setUpdateSharedDocument}
          visible={showDocumentModel}
          setVisible={setShowDocumentModel}
          documentStatus={documentStatus}
          setUpdateInternalDocument={setUpdateInternalDocument}
          updateInternalDocument={updateInternalDocument}
        />
      </div>
    </div>
  );
};

export default connect(({ loading, user, product }) => ({
  totalCountPMS: product.totalCountPMS,
  productPMS: product.productPMS,
  completedPMS: product.completedPMS,
  itemDrafts: product?.itemDrafts,
  accessoryDrafts: product?.accessoryDrafts,
  currentUser: user?.currentUser,
  productDetail: product?.productDetail,
  createProductLoading: loading.effects['product/createProduct'],
  updateProductLoading: loading.effects['product/updateDraft'],
  loading: loading.effects['product/getProductData'],
  sharedDoc: product?.sharedDoc,
  internalDoc: product?.internalDoc,
  ProductModel: product.ProductModel,
  pmsHistory: product.pmsHistory,
  activities: product?.activities,
  approvalHistory: product.approvalHistory,
  productResultList: product.productResultList,
}))(ViewEquipment);
