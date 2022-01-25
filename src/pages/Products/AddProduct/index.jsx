/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable radix */
import React, { useState, useEffect, useRef } from 'react';
import { connect, history, useParams, useLocation } from 'umi';
import moment from 'moment';
import classNames from 'classnames';
import { getPageQuery } from '@/utils/utils';
import {
  Form,
  Button,
  Switch,
  Select,
  notification,
  message,
  Popconfirm,
  Tooltip,
  Rate,
  Table,
  Row,
  Pagination,
  Tabs,
  Badge,
} from 'antd';
import {
  CheckCircleFilled,
  ClockCircleFilled,
  DownloadOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
  SmileOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import UploadGlobalDocs from '@/components/UploadGlobalDocs';
import AddDocuments from './AddProductForm/AddDocuments';
import DisplayProductMerchandise from './DisplayProductMerchandise';
import AddProductMerchandise from './AddProductForm/AddProductMerchandise';
import DisplayProductDocuments from './AddProductForm/DisplayProductDocuments';
import DisplayHistory from './AddProductForm/DisplayHistory';
import styles from './index.less';
import ProductUpdateDetails from './ProductUpdateDetails';
import ProductDetailsForm from './AddProductForm/ProductDetailsForm';
import DisplayUploadedDocuments from './AddProductForm/DisplayUploadedDocuments';
import Table1 from './PmsDetailTable';
import DisplayApproval from './AddProductForm/DisplayApproval';
import FilterSharedDoc from '../../../components/FilterDocument';
import ProductResultList from './ProductResultList';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import { getPathNames } from '@/utils/utils';

/**
 *
 * @AddProduct - The purpose of this component is to show the full page of add product.
 */

const AddProduct = ({
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
}) => {
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
  const [formWarranty] = Form.useForm();
  const { task, productId } = getPageQuery();
  const [searchTextForInternal, setSearchTextForInternal] = useState('');
  const [selectionType, setSelectionType] = useState('checkbox');
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);
  const { serialNumberId } = useParams();

  useEffect(() => {
    dispatch({
      type: 'product/getTotalCountPMS',
      payload: {
        pathParams: {
          customerId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
        },
      },
    });
    getProductPMS();
  }, [currentUser]);

  const getCompletedPMS = () => {
    dispatch({
      type: 'product/getCompletedPMS',
      payload: {
        query: {
          customerId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
          // keyword: searchText,       TODO
          // startIndex: completeStartIndex,    TODO
          // viewSize: completeViewSize,      TODO
          statusId: 'COMPLETED',
        },
      },
    }).catch((error) => {
      message.error(error?.data?.message);
    });
  };

  const getProductPMS = () => {
    dispatch({
      type: 'product/getProductPMS',
      payload: {
        query: {
          customerId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
          // keyword: searchText,
          // startIndex,
          // viewSize,      TODO
          statusId: tab === 'UPCOMING' ? tab : 'OVERDUE',
        },
      },
    }).catch((error) => {
      message.error(error?.data?.message);
    });
  };

  useEffect(() => {
    if (tab === 'UPCOMING' || tab === 'OVERDUE') {
      getProductPMS();
    } else {
      getCompletedPMS();
    }
  }, [currentUser, tab]);

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

  const columns = [
    {
      title: 'PMS No',
      dataIndex: 'formattedPmsNo',
      key: 'formattedPmsNo',
      render: (data) => <span className="font-semibold cursor-pointer ">{data || 'N/A'}</span>,
    },
    {
      title: 'Company',
      dataIndex: 'brandName',
      key: 'brandName',
      render: (data) => (
        <span className="font-semibold cursor-pointer capitalize">{data || 'N/A'}</span>
      ),
    },
    {
      title: 'PMS Date',
      dataIndex: 'startDate',
      render: (data) => (
        <span className="font-semibold cursor-pointer ">
          {moment(data)?.format('DD MMMM YYYY')}-{moment(data)?.format('LT')}
        </span>
      ),
      key: 'date',
    },
    {
      title: 'Days',
      dataIndex: 'daysDiff',
      key: 'days',
      render: (data) => (
        <span className="font-semibold cursor-pointer capitalize">{data || 'N/A'}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'statusId',
      key: 'status',
      render: (data) => (
        <span className="font-semibold cursor-pointer capitalize">{data || 'N/A'}</span>
      ),
    },
    {
      title: 'PMS Done by',
      dataIndex: 'pmsDoneBy',
      key: 'pmsDoneBy',
      render: (data) => <div>{data?.displayName || 'N/A'}</div>,
    },
    {
      title: 'Last Modified by',
      dataIndex: 'lastModified',
      key: 'lastModified',
      render: (data) => <div>{data || 'N/A'}</div>,
    },
    {
      title: 'Total PMS',
      dataIndex: 'totalPms',
      key: 'totalPms',
      render: (data) => <div>{data || 'N/A'}</div>,
    },
    {
      title: 'PMS Left',
      dataIndex: 'pmsLeft',
      key: 'pmsLeft',
      render: (data) => <div>{data}</div>,
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

  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
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
        title={getPathNames()?.includes('add') ? 'Add Equipment' : 'Product Name with detail'}
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: getPathNames()?.includes('add') ? 'Add Equipment' : 'Product',
                path: getPathNames()?.includes('add')
                  ? '/equipments/add'
                  : `/equipments/view/${serialNumberId}?task=updateEquipments`,
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
            const data = values;
            if (task === 'updateEquipments') {
              delete data.product_name;
              if (productDetail?.family_info?.id !== values.family_info.id) {
                data.family_info = othervalue.productType
                  ? { id: 'CT_OTHER', label: othervalue.family }
                  : values.family_info;
              } else {
                delete data?.family_info;
              }
              if (values.brand_info?.id !== productDetail?.brand_info?.id) {
                data.brand_info = othervalue.brand
                  ? { id: 'OTHER-SUPPLIER', label: othervalue.brand }
                  : values.brand_info;
              } else {
                delete data?.brand_info;
              }
              if (values?.product.id !== productDetail?.product?.id) {
                data.product = othervalue.productType
                  ? { id: 'PRD_OTHER', label: othervalue.product }
                  : values.product;
              } else {
                delete data?.product;
              }
              if (values?.type?.id !== productDetail?.type?.id) {
                data.type = othervalue.productType
                  ? { id: 'PT_OTHER', label: othervalue.productType }
                  : values.type;
              } else {
                delete data?.type;
              }
              if (values.sub_type.id !== productDetail?.sub_type?.id) {
                data.sub_type = othervalue.productSubType
                  ? {
                      id: 'PSBT_OTHER',
                      label: othervalue.productSubType,
                    }
                  : values.sub_type;
              } else {
                delete data?.sub_type;
              }
              if (values?.model?.id !== productDetail?.model?.id) {
                data.model = othervalue.model
                  ? {
                      id: 'MDL_OTHER',
                      label: othervalue.model,
                    }
                  : values.model;
              } else {
                delete data.model;
              }
              if (values?.department_info?.id !== productDetail?.department_info?.id) {
                data.department_info = othervalue.department
                  ? { id: 'DEPT_OTHER', label: othervalue.department }
                  : values.department_info;
              } else {
                delete data?.department_info;
              }

              if (values?.product_details?.product_price === productDetail?.price)
                delete data?.product_details;

              if (
                moment(values?.installation_details?.installation_date).format('LL') ===
                moment(productDetail.installation_date).format('LL')
              )
                delete data?.installation_details;
              else {
                data.installation_details = {
                  ...data.installation_details,
                  installation_date: moment(values.installation_details.installation_date).format(),
                };
              }

              data.customer_id = currentUser?.personal_details?.organizationDetails?.orgPartyId;
              if (productDetail?.has_warranty === 'N') data.has_warranty = hasWarranty ? 'Y' : 'N';
              if (productDetail?.after_warranty === 'N')
                data.after_warranty = hasContract ? 'Y' : 'N';

              if (!data?.pms_details?.pms) delete data?.pms_details;
              if (parseInt(data?.pms_details?.pms) === productDetail.pms) delete data?.pms_details;
              if (!values?.warranty_details?.warranty) delete data?.warranty_details;
              if (parseInt(values?.warranty_details?.warranty) === productDetail?.warranty)
                delete data?.warranty_details;
              if (
                !values.warranty_start_date ||
                moment(productDetail.warranty_start_date).format() ===
                  moment(values.warranty_start_date).format()
              ) {
                delete data.warranty_start_date;
              } else {
                data.warranty_start_date = values?.warranty_start_date
                  ? moment(values.warranty_start_date).format()
                  : null;
              }
              if (
                !values.warranty_end_date ||
                moment(productDetail.warranty_end_date).format() ===
                  moment(values.warranty_end_date).format()
              ) {
                delete data.warranty_end_date;
              } else {
                data.warranty_end_date = values?.warranty_end_date
                  ? moment(values.warranty_end_date).format()
                  : null;
              }

              if (productDetail?.price !== values?.product_details?.product_price) {
                data.price = values?.product_details?.product_price;
              } else {
                delete data.price;
              }
              data.contract_details = {
                ...data.contract_details,
                type_id: values?.contract_details?.sub_type_id
                  ? values?.contract_details?.sub_type_id
                  : values?.contract_details?.type_id,
                end_date: values?.contract_details?.end_date
                  ? moment(values?.contract_details?.end_date).format()
                  : null,
                start_date: values?.contract_details?.start_date
                  ? moment(values?.contract_details?.start_date).format()
                  : null,
              };
              if (values?.contract_details?.period === productDetail?.contract_details?.period)
                delete data?.contract_details?.period;
              if (values?.contract_details?.pms === productDetail?.contract_details?.pms)
                delete data?.contract_details?.pms;
              if (values?.contract_details?.price === productDetail?.contract_details?.price)
                delete data?.contract_details?.price;
              if (
                !values.contract_details?.start_date ||
                moment(productDetail?.contract_details?.start_date).format() ===
                  moment(values.contract_details?.start_date).format()
              ) {
                delete data.contract_details.start_date;
              }
              if (
                !values.contract_details?.end_date ||
                moment(productDetail?.contract_details?.end_date).format() ===
                  moment(values.contract_details?.end_date).format()
              ) {
                delete data.contract_details.end_date;
              }
              if (values?.serial_number_details?.serial_number !== productDetail?.serial_number) {
                data.serial_number_details = {
                  ...data.serial_number_details,
                  serial_number: values?.serial_number_details?.serial_number,
                };
              } else {
                delete data?.serial_number_details;
              }

              delete data?.contract_details?.price_content_ids;
              delete data?.contract_details?.sub_type_id;

              if (
                data?.contract_details?.type_id === productDetail?.contract_details?.type?.name ||
                data?.contract_details?.type_id === productDetail?.contract_details?.subType?.name
              )
                delete data?.contract_details?.type_id;
              if (Object.keys(data?.contract_details).length > 0) data.after_warranty = 'Y';
              else delete data.contract_details;

              dispatch({
                type: 'product/updateDraft',
                payload: {
                  pathParams: { productId: productDetail?.product_id },
                  body: {
                    ...data,
                    customer_ids: currentUser?.personal_details?.organizationDetails?.orgPartyId,
                  },
                },
              }).then((res) => {
                if (res?.productId) {
                  if (form.getFieldValue('serialNumber') !== undefined) {
                    const serialNumberUploads = Object.keys(
                      form.getFieldValue('serialNumber'),
                    )?.map((d, index) => ({
                      ...form.getFieldValue('serialNumber')[index],
                      document_date:
                        form.getFieldValue('serialNumber')[index]?.document_date !== undefined &&
                        moment(form.getFieldValue('serialNumber')[index]?.document_date).format(),
                      encoded_file: serialNumberFilelist[index],
                      name: serialNumberContentInfo[index]?.name,
                      product_content_type_id: 'SERIAL_NUMBER',
                    }));
                    uploadContent(serialNumberUploads);
                  }

                  if (form.getFieldValue('installationDate') !== undefined) {
                    const installationDateUploads = Object.keys(
                      form.getFieldValue('installationDate'),
                    ).map((d, index) => ({
                      ...form.getFieldValue('installationDate')[index],
                      document_date:
                        form.getFieldValue('installationDate')[index]?.document_date !==
                          undefined &&
                        moment(
                          form.getFieldValue('installationDate')[index]?.document_date,
                        ).format(),
                      encoded_file: installationDateFilelist[index],
                      name: installationDateContentInfo[index]?.name,
                      product_content_type_id: 'INSTALLATION_DATE',
                    }));
                    uploadContent(installationDateUploads);
                  }

                  if (form.getFieldValue('warrantyPeriod') !== undefined) {
                    const warrantyPeriodUploads = Object.keys(
                      form.getFieldValue('warrantyPeriod'),
                    )?.map((d, index) => ({
                      ...form.getFieldValue('warrantyPeriod')[index],
                      document_date:
                        form.getFieldValue('warrantyPeriod')[index]?.document_date !== undefined &&
                        moment(form.getFieldValue('warrantyPeriod')[index]?.document_date).format(),
                      encoded_file: warrantyFilelist[index],
                      name: warrantyContentInfo[index]?.name,
                      product_content_type_id: 'WARRANTY',
                    }));
                    uploadContent(warrantyPeriodUploads);
                  }

                  if (form.getFieldValue('pmsPeriod') !== undefined) {
                    const pmsUploads = Object.keys(form.getFieldValue('pmsPeriod')).map(
                      (d, index) => ({
                        ...form.getFieldValue('pmsPeriod')[index],
                        document_date:
                          form.getFieldValue('pmsPeriod')[index]?.document_date !== undefined &&
                          moment(form.getFieldValue('pmsPeriod')[index]?.document_date).format(),
                        encoded_file: pmsFilelist[index],
                        name: pmsContentInfo[index]?.name,
                        product_content_type_id: 'PMS',
                      }),
                    );
                    uploadContent(pmsUploads);
                  }

                  if (form.getFieldValue('contractPrice') !== undefined) {
                    const contractPriceUploads = Object.keys(
                      form.getFieldValue('contractPrice'),
                    ).map((d, index) => ({
                      ...form.getFieldValue('contractPrice')[index],
                      document_date:
                        form.getFieldValue('contractPrice')[index]?.document_date !== undefined &&
                        moment(form.getFieldValue('contractPrice')[index]?.document_date).format(),
                      file: contractPeriodFilelist[index],
                      encoded_file: contractPeriodFilelist[index],
                      name: contractPeriodContentInfo[index]?.name,
                      product_content_type_id: 'CONTRACT_PRICE',
                    }));
                    uploadContent(contractPriceUploads);
                  }

                  notification.open({
                    message: 'Great Job!',
                    description: <div>You have successfully updated the equipment.</div>,
                    icon: <SmileOutlined style={{ color: '#108ee9' }} />,
                  });
                  setShowHistory(true);
                  setSerialNumberContentInfo([]);
                  setInstallationDateContentInfo([]);
                  setSerialNumberFilelist([]);
                  setInstallationDateFilelist([]);
                  setWarrantyFilelist([]);
                  setPmsFilelist([]);
                  setWarrantyContentInfo([]);
                  setPmsContentInfo([]);
                  setContractPeriodFilelist([]);
                  setContractPeriodContentInfo([]);

                  form?.setFieldsValue({
                    serialNumber: '',
                    installationDate: '',
                    warrantyPeriod: '',
                    pmsPeriod: '',
                    contractPrice: '',
                  });
                  dispatch({
                    type: 'product/getActivities',
                    payload: {
                      pathParams: { productId: serialNumberId },
                    },
                  });
                  if (serialNumberId)
                    dispatch({
                      type: 'product/getProductData',
                      payload: { pathParams: { productId: serialNumberId } },
                    });
                }
              });
            }

            if (pathname === '/equipments/add') {
              delete data.product_name;

              data.brand_info = othervalue.brand
                ? { id: 'OTHER-SUPPLIER', label: othervalue.brand }
                : values.brand_info;
              data.department_info = othervalue.department
                ? { id: 'DEPT_OTHER', label: othervalue.department }
                : values.department_info;
              data.has_warranty = hasWarranty ? 'Y' : 'N';
              data.after_warranty = hasContract ? 'Y' : 'N';
              data.is_variant = false;
              data.price = values?.product_details?.product_price;
              data.installation_details = {
                ...data.installation_details,
                installation_date: moment(values.installation_details.installation_date).format(),
              };
              data.warranty_end_date = values?.warranty_end_date
                ? moment(values.warranty_end_date).format()
                : null;
              data.warranty_start_date = values?.warranty_start_date
                ? moment(values.warranty_start_date).format()
                : null;
              data.family_info = othervalue.productType
                ? { id: 'CT_OTHER', label: othervalue.family }
                : values.family_info;
              data.product = othervalue.productType
                ? { id: 'PRD_OTHER', label: othervalue.product }
                : values.product;
              data.type = othervalue.productType
                ? { id: 'PT_OTHER', label: othervalue.productType }
                : values.type;
              data.sub_type = othervalue.productSubType
                ? {
                    id: 'PSBT_OTHER',
                    label: othervalue.productSubType,
                  }
                : values.sub_type;
              data.model = othervalue.model
                ? {
                    id: 'MDL_OTHER',
                    label: othervalue.model,
                  }
                : values.model;
              data.customer_id = currentUser?.personal_details?.organizationDetails?.orgPartyId;
              data.contract_details = {
                ...data.contract_details,
                type_id: values?.contract_details?.sub_type_id
                  ? values?.contract_details?.sub_type_id
                  : values?.contract_details?.type_id,
                end_date: values?.contract_details?.end_date
                  ? moment(values?.contract_details?.end_date).format()
                  : null,
                start_date: values?.contract_details?.start_date
                  ? moment(values?.contract_details?.start_date).format()
                  : null,
              };
              delete data?.contract_details?.sub_type_id;

              dispatch({
                type: 'product/createDraft',
                payload: data,
              }).then((response) => {
                if (response?.res?.productId) {
                  notification.open({
                    message: 'Great Job!',
                    description: <div>You have successfully added the equipment as a draft.</div>,
                    icon: <SmileOutlined style={{ color: '#108ee9' }} />,
                  });
                  history.push(
                    `/equipments/view/${response?.res?.productId}?task=updateEquipments`,
                  );
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
              formWarranty={formWarranty}
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
            />
          </div>
          {pathname !== '/equipments/add' && (
            <>
              <DisplayUploadedDocuments
                setPassMainProductDocuments={setPassMainProductDocuments}
                setSharedDocuments={setSharedDocuments}
              />
            </>
          )}
          <div className={classNames(pathname !== '/equipments/add' && 'flex justify-between')}>
            {pathname !== '/equipments/add' && (
              <div className={classNames('flex justify-start my-6', styles.btnStyles)}>
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
            )}
            <div className={classNames('flex justify-end my-6', styles.btnStyles)}>
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
                    <span className="color-gray-300"> Add accessories</span>
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
                      background: sharedDocuments ? '#3CB3701' : '#c9ced6',
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

                    {Object.keys(sharedDoc)?.length > 0 ? (
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
                <div className="font-semibold ">Result card</div>
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
              <div className="bg-white rounded-lg mb-6">
                <ProductResultList />
              </div>
            )}
            {/* End of Result card */}

            {/* Start of PMS Details */}

            <div className="bg-white mt-4 px-3 rounded-lg shadow">
              <div className="pl-2 pt-2 pb-2 font-semibold text-sm">PMS Details</div>
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
                      <Badge size="small" count={0}>
                        Overdue
                      </Badge>
                    </span>
                  }
                  key="OVERDUE"
                >
                  <Table1
                    columns={columns?.filter(
                      (list) =>
                        list.dataIndex !== 'status' &&
                        list.dataIndex !== 'displayName' &&
                        list.dataIndex !== 'pmsLeft' &&
                        list.dataIndex !== 'daysDiff',
                    )}
                    data={productPMS?.records}
                    totalCount={totalCountPMS?.overdueCount}
                    scroll={{ y: 250, x: 1600 }}
                  />
                </TabPane>

                <TabPane
                  tab={
                    <span className="px-4">
                      <Badge size="small" count={0}>
                        Upcoming
                      </Badge>
                    </span>
                  }
                  key="UPCOMING"
                >
                  <Table1
                    columns={columns?.filter(
                      (list) =>
                        list.dataIndex !== 'status' &&
                        list.dataIndex !== 'displayName' &&
                        list.dataIndex !== 'pmsLeft' &&
                        list.dataIndex !== 'daysDiff',
                    )}
                    data={productPMS?.records}
                    totalCount={totalCountPMS?.upcomingCount}
                    scroll={{ y: 250, x: 1600 }}
                  />
                </TabPane>

                <TabPane
                  tab={
                    <span className="px-4">
                      <Badge size="small" count={0}>
                        Completed
                      </Badge>
                    </span>
                  }
                  key="COMPLETED"
                >
                  <Table1
                    columns={columns?.filter((list) => list.dataIndex !== 'daysLeft')}
                    data={completedPMS?.records}
                    totalCount={totalCountPMS?.overdueCount}
                    scroll={{ y: 250, x: 1600 }}
                  />
                </TabPane>
              </Tabs>
            </div>

            {/* End of PMS Details */}

            {/* Start of PMS History */}
            {!pathname.includes('add') && (
              <div className="mt-4 my-1 text-xs bg-white rounded-lg">
                <div className="pl-2 pt-2 pb-2 font-semibold text-sm">PMS History</div>
                <div className="m-4">
                  <Table
                    size="small"
                    scroll={{ y: 250, x: 1600 }}
                    columns={columns}
                    dataSource={pmsHistory?.records}
                    pagination={false}
                    rowSelection={{
                      type: selectionType,
                      rowSelection,
                    }}
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
                          // total={totalCountPMS?.completedCount || 5}
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
            )}
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
  sharedDoc: product?.sharedDoc,
  internalDoc: product?.internalDoc,
  ProductModel: product.ProductModel,
  pmsHistory: product.pmsHistory,
  activities: product?.activities,
  approvalHistory: product.approvalHistory,
  productResultList: product.productResultList,
}))(AddProduct);
