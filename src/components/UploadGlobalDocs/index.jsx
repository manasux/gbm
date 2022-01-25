/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { connect, useParams } from 'umi';
import classNames from 'classnames';
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Select,
  DatePicker,
  Input,
  Upload,
  Divider,
  message,
  Popconfirm,
} from 'antd';
import { DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import PNG from '@/assets/file-types/png_doc.svg';
import PDF from '@/assets/file-types/pdf_doc.svg';
import DisplayDrawer from '@/components/DisplayDrawer';
import styles from './index.less';

const UploadGlobalDocs = ({
  setShowDocumentModel,
  showDocumentModel,
  docTypeName,
  dispatch,
  docType,
  docSubType,
  status,
  productDetail,
  accessoryDocsInfo,
  setAccessoryDocsInfo,
  currentUser,
  accessoryDrafts,
  loading,
  setSharedDocuments,
  setInternalDocuments,
  complaintPreview,
  particularPMS,
  selectedPMSRecord,
  subTypeId,
  setPmsAttachments,
  setDocumentSubType,
  fetchPMSComments,
  fetchComplaintComments,
  setComplaintAttachments,
  selectedComplaintRecord,
}) => {
  const [form] = Form.useForm();
  const [docTypeId, setDocTypeId] = useState('');
  const [docCategory, setDocCategory] = useState('');
  const [docFor, setDocFor] = useState('');
  const [accessName, setAccessName] = useState('');
  const [uploadUrl, setUploadUrl] = useState(null);
  const [displayFrame, setDisplayFrame] = useState('');
  const [accessType, setAccessType] = useState('');
  const [contentInfo, setContentInfo] = useState([]);
  const [filelist, setFilelist] = useState([]);
  const [relatedType, setRelatedType] = useState([]);
  const [relatedModel, setRelatedModel] = useState([]);
  const [viewUploadedDocuments, setViewUploadedDocuments] = useState(false);
  const [relatedAccessories, setRelatedAccessories] = useState([]);
  const [otherDocType, setOtherDocType] = useState();

  function disabledDate(current) {
    return current > moment().endOf('day');
  }
  function getUniqueListBy(arr, key) {
    return [...new Map(arr?.map((item) => [item[key], item])).values()];
  }
  useEffect(() => {
    const uniqueAccessoryList = getUniqueListBy(
      accessoryDrafts?.records?.map((record) => ({
        accessory_id: record?.accessory?.id,
        accessory_name: record?.accessory?.name,
      })),
      'accessory_id',
    );
    if (uniqueAccessoryList?.length > 0) setRelatedAccessories(uniqueAccessoryList);

    const uniqueAccessoryTypes = getUniqueListBy(
      accessoryDrafts?.records
        ?.filter((record) => record?.accessory?.id === accessName)
        ?.map((record) => ({
          type_id: record?.type?.id,
          type_name: record?.type?.name,
        })),
      'type_id',
    );
    if (uniqueAccessoryTypes?.length > 0) setRelatedType(uniqueAccessoryTypes);
    const uniqueAccessoryModel = getUniqueListBy(
      accessoryDrafts?.records
        ?.filter((record) => record?.type?.id === accessType)
        ?.map((record) => ({
          model_id: record?.model?.id,
          model_name: record?.model?.name,
        })),
      'model_id',
    );
    if (uniqueAccessoryModel?.length > 0) setRelatedModel(uniqueAccessoryModel);
  }, [accessoryDrafts, showDocumentModel]);
  const { serialNumberId } = useParams();
  const getSubTypeForMainproduct = () => {
    switch (docTypeName) {
      case 'Upload Installation Report':
        return 'INST_REPORT';
      case 'Upload Product Invoice':
        return 'PRD_INVOICE';
      case `Upload Machine's Photo`:
        return 'MCH_PHOTO';

      default:
        break;
    }
  };

  const getDocumentsForMainProduct = () => {
    dispatch({
      type: 'product/getProductDocuments',
      payload: {
        pathParams: {
          productId: productDetail?.product_id,
        },
        query: {
          document_type: 'SHARED_DOC',
          showBasicInfo: true,
        },
      },
    });
  };

  const getSharedDocuments = () => {
    dispatch({
      type: 'product/getSharedDocuments',
      payload: {
        pathParams: {
          productId: productDetail?.product_id,
        },
        query: {
          document_type: 'SHARED_DOC',
          showBasicInfo: false,
        },
      },
    });
  };

  const getInternalDocuments = () => {
    dispatch({
      type: 'product/getInternalDocuments',
      payload: {
        pathParams: {
          productId: productDetail?.product_id,
        },
        query: {
          document_type: 'INTERNAL_DOC',
        },
      },
    });
  };

  const getProductId = (stats, value) => {
    if (stats === 'shared_docs' && value?.doc_category === 'ACCESSORY') {
      const prodIdForAcc = accessoryDrafts?.records?.find(
        (record) =>
          value?.doc_access_name === record?.accessory.id &&
          value?.doc_access_type === record?.type?.id &&
          value?.doc_access_model === record?.model?.id,
      )?.product_id;
      return prodIdForAcc;
    }
    return productDetail?.product_id;
  };

  const addComplaintAttachment = () => {
    const encodedDataComplaint = [];
    contentInfo?.map((fileData, index) =>
      encodedDataComplaint.push({
        subTypeId,
        name: fileData?.name,
        encodedFile: filelist[index],
      }),
    );
    const body = {
      custRequestId: complaintPreview?.response?.id,
      documentDate: form?.getFieldValue('doc_date'),
      description: form?.getFieldValue('doc_title'),
      documentNumber: form?.getFieldValue('doc_number'),
      productId: complaintPreview?.response?.productId,
      partyId: currentUser?.id,
      attachments: encodedDataComplaint?.length > 0 ? encodedDataComplaint : [],
    };

    dispatch({
      type: 'product/addComplaintAttachment',
      payload: {
        pathParams: {
          party_id: currentUser?.personal_details?.organizationDetails?.orgPartyId,
        },
        body,
      },
    })
      .then((res) => {
        if (res?.responseMessage === 'success') {
          message.success('Document uploaded');
          dispatch({
            type: 'product/getComplaintAttachments',
            payload: {
              query: {
                partyId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
                custRequestId: selectedComplaintRecord?.id,
              },
            },
          }).then((res) => {
            if (res) {
              setComplaintAttachments(res?.records);
            }
          });
          setDocumentSubType(undefined);
          fetchComplaintComments();
          setShowDocumentModel(false);
          form.resetFields('');
          setContentInfo([]);
          setFilelist([]);
        }
      })
      .catch((err) => console?.log(err.message));
  };

  const addPmsAttachment = () => {
    const encodedDataPms = [];
    contentInfo?.map((fileData, index) =>
      encodedDataPms.push({
        subTypeId,
        name: fileData?.name,
        encodedFile: filelist[index],
      }),
    );

    const body = {
      workEffortId: selectedPMSRecord?.workEffortId,
      documentDate: form?.getFieldValue('doc_date'),
      description: form?.getFieldValue('doc_title'),
      documentNumber: form?.getFieldValue('doc_number'),
      productId: selectedPMSRecord?.productId,
      partyId: currentUser?.id,
      attachments: encodedDataPms?.length > 0 ? encodedDataPms : [],
    };

    dispatch({
      type: 'product/addPmsAttachment',
      payload: {
        pathParams: {
          party_id: currentUser?.personal_details?.organizationDetails?.orgPartyId,
        },
        body,
      },
    })
      .then((res) => {
        if (res?.responseMessage === 'success') {
          message.success('Document uploaded');
          dispatch({
            type: 'product/getPmsAttachments',
            payload: {
              query: {
                workEffortId: selectedPMSRecord?.workEffortId,
                partyId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
              },
            },
          }).then((res) => {
            if (res) {
              setPmsAttachments(res?.records);
            }
          });
          fetchPMSComments();
          setDocumentSubType(undefined);
          setShowDocumentModel(false);
          form.resetFields('');
          setContentInfo([]);
          setFilelist([]);
        }
      })
      .catch((err) => console?.log(err.message));
  };

  const onFinish = (values) => {
    const formData = new FormData();
    contentInfo?.map((documentAttachment) => {
      formData.append('file', documentAttachment);
    });
    if (status === 'pms') {
      addPmsAttachment();
      return;
    }
    if (status === 'complaint') {
      addComplaintAttachment();
      return;
    }

    if (status === 'main_doc') {
      formData.append('documentCategory', 'PRODUCT');
      formData.append('documentForProduct', productDetail?.model?.id);
      formData.append('subType', getSubTypeForMainproduct());
      formData.append('documentDate', moment(values?.doc_date).format());
      formData.append('description', values?.doc_title);
      formData.append('documentNumber', values?.doc_number);
    }

    if (status === 'accessory_docs') {
      formData.append('documentCategory', 'ACCESSORY');
      formData.append('accessoryName', values?.doc_access_name);
      formData.append('accessoryType', values?.doc_access_type);
      formData.append('accessoryModel', values?.doc_access_model);
      formData.append('serialNumber', accessoryDocsInfo?.serial_number);
      formData.append('subType', values?.doc_sub_type || values?.doc_type);
      formData.append('documentDate', moment(values?.doc_date).format());
      formData.append('description', values?.doc_title);
      formData.append('documentNumber', values?.doc_number);
    }

    if (status === 'shared_docs') {
      if (values?.doc_category === 'ACCESSORY') {
        const serialNumberAcc = accessoryDrafts?.records?.find(
          (record) =>
            values?.doc_access_name === record?.accessory.id &&
            values?.doc_access_type === record?.type?.id &&
            values?.doc_access_model === record?.model?.id,
        )?.serial_number;
        if (serialNumberAcc) {
          formData.append('documentCategory', 'ACCESSORY');
          formData.append('accessoryName', values?.doc_access_name);
          formData.append('accessoryType', values?.doc_access_type);
          formData.append('accessoryModel', values?.doc_access_model);
          formData.append('serialNumber', serialNumberAcc);
        } else {
          message.error('No aceessory created with these details, Please try again');
          return '';
        }
      } else {
        formData.append('documentCategory', 'PRODUCT');
        formData.append('documentForProduct', productDetail?.model?.id);
      }
      formData.append('subType', values?.doc_sub_type || values?.doc_type);
      formData.append('documentDate', moment(values?.doc_date).format());
      formData.append('description', values?.doc_title);
      formData.append('documentNumber', values?.doc_number);
    }
    if (status === 'internal_docs') {
      if (values?.doc_category === 'ACCESSORY') {
        formData.append('documentCategory', values?.doc_category);
        formData.append('accessoryType', values?.doc_access_type);
        formData.append('accessoryModel', values?.doc_access_model);
        formData.append('subType', values?.doc_sub_type || values?.doc_type);
        if (docTypeId === 'OTHER_TYPE') {
          formData.append('label', form?.getFieldValue('other_doc_Type'));
        }
        formData.append('documentDate', moment(values?.doc_date).format());
        formData.append('description', values?.doc_title);
        formData.append('documentNumber', values?.doc_number);
      } else {
        formData.append('documentCategory', values?.doc_category);
        formData.append('subType', values?.doc_sub_type || values?.doc_type);
        if (
          docType?.productContentTypes
            ?.filter((list) => list?.id === docTypeId)[0]
            ?.description.toUpperCase() === 'OTHERS'
        ) {
          formData.append('label', otherDocType);
        }
        formData.append('documentDate', moment(values?.doc_date).format());
        formData.append('description', values?.doc_title);
        formData.append('documentNumber', values?.doc_number);
      }
    }
    dispatch({
      type: 'product/uploadGlobalDocuments',
      payload: {
        pathParams: {
          prodId:
            status === 'accessory_docs' && values?.doc_category === 'ACCESSORY'
              ? accessoryDocsInfo?.product_id
              : getProductId(status, values),
        },
        query: {
          document_type: status !== 'internal_docs' ? 'SHARED_DOC' : 'INTERNAL_DOC',
        },
        body: formData,
      },
    }).then((res) => {
      if (res) {
        setContentInfo([]);
        setFilelist([]);
        form?.resetFields();
        setShowDocumentModel(false);
        setDocFor('');
        setDocTypeId('');
        getDocumentsForMainProduct();
        dispatch({
          type: 'product/getActivities',
          payload: {
            pathParams: { productId: serialNumberId },
          },
        });
        if (status === 'shared_docs') {
          setSharedDocuments(true);
        }
        getSharedDocuments();
        if (status === 'internal_docs') {
          setInternalDocuments(true);
          getInternalDocuments();
        }
      }
    });
  };

  const fileSizeConvertor = (size) => {
    if (size && size / 1024 / 1024 > 0) {
      const newSize = (size / 1024 / 1024).toFixed(2);
      return `${newSize} MB`;
    }
    return null;
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  useEffect(() => {
    if (docCategory === 'PRODUCT') {
      setDocFor('');
      form?.setFieldsValue({
        doc_for: productDetail?.model?.id,
      });
    }
  }, [docCategory]);
  const docTypeList = () => {
    if (showDocumentModel && status !== 'pms' && status !== 'complaint')
      dispatch({
        type: 'product/getDocType',
        payload: {
          query: {
            doc_type_id:
              status === 'shared_docs' || status === 'accessory_docs'
                ? 'SHARED_DOC'
                : 'INTERNAL_DOC',
            view_size: 50,
          },
        },
      });
  };
  const onSubtypeChange = () => {
    if (showDocumentModel) {
      dispatch({
        type: 'product/getDocSubTypesList',
        payload: {
          query: {
            doc_type_id:
              status === 'shared_docs' || status === 'accessory_docs'
                ? 'SHARED_DOC'
                : 'INTERNAL_DOC',
            type_id: docTypeId,
          },
        },
      });
    }
  };

  const fetchAccessoryBrands = () => {
    dispatch({
      type: 'product/getMerchandiseBrands',
      payload: {
        category_id: 'PRODUCT_ACC',
        verified: true,
      },
    });
  };

  const getProductAccessoryDraft = () => {
    dispatch({
      type: 'product/getProductAccessoryDrafts',
      payload: {
        is_draft: productDetail?.is_draft,
        is_variant: 'Y',
        parent_product_id: serialNumberId,
        assoc_type_id: 'PRODUCT_ACCESSORY',
        customer_id: currentUser?.personal_details?.organizationDetails?.orgPartyId,
      },
    });
  };

  useEffect(() => {
    if (docTypeId) onSubtypeChange();
  }, [docTypeId]);

  useEffect(() => {
    docTypeList();
    if (status === 'accessory_docs') setDocFor('PF_TYPE');
  }, [status, showDocumentModel]);

  useEffect(() => {
    if (docCategory === 'ACCESSORY' && status !== 'main_doc') {
      fetchAccessoryBrands();
    }
    if (docCategory === 'ACCESSORY' && status === 'internal_docs') {
      fetchAccessoryBrands();
    }
  }, [docCategory, showDocumentModel]);
  useEffect(() => {
    if (docCategory === 'ACCESSORY' && accessName) {
      getProductAccessoryDraft();
    }
  }, [accessName]);

  useEffect(() => {
    if (docCategory === 'ACCESSORY' && accessType) {
      getProductAccessoryDraft();
    }
  }, [accessType]);

  useEffect(() => {
    if (status === 'accessory_docs' && accessoryDocsInfo) {
      setAccessName(accessoryDocsInfo?.product?.id);
      form?.setFieldsValue({
        doc_category: 'ACCESSORY',
        doc_access_name: accessoryDocsInfo?.accessory?.name,
        doc_access_type: accessoryDocsInfo?.type?.name,
        doc_access_model: accessoryDocsInfo?.model?.name,
      });
    }
  }, [status, accessoryDocsInfo, showDocumentModel]);
  useEffect(() => {
    if (accessoryDocsInfo) {
      getProductAccessoryDraft();
    }
  }, [accessoryDocsInfo]);
  return (
    <div>
      <Modal
        title={
          <div className="mx-1.5 mt-2 font-bold" style={{ fontSize: '1rem' }}>
            {docTypeName}
          </div>
        }
        width={1000}
        className={classNames(styles.modalStyles2, viewUploadedDocuments && styles.modalStyles)}
        centered={!viewUploadedDocuments}
        maskClosable={false}
        visible={showDocumentModel}
        onCancel={() => {
          form?.resetFields();
          setContentInfo([]);
          setFilelist([]);
          setShowDocumentModel(false);
          setRelatedAccessories([]);
          setRelatedType([]);
          setRelatedModel([]);
          setDocumentSubType && setDocumentSubType(undefined);
        }}
        footer={[
          <div className="flex justify-end ">
            <div
              className="mx-12 mt-2 cursor-pointer"
              onClick={() => {
                form?.resetFields();
                setDocTypeId('');
                setContentInfo([]);
                setFilelist([]);
                setShowDocumentModel(!showDocumentModel);
                setViewUploadedDocuments(false);
                setDocumentSubType && setDocumentSubType(undefined);
                setDocFor('');
                if (accessoryDocsInfo) setAccessoryDocsInfo('');
              }}
            >
              <span className="text-gray-600">Cancel</span>
            </div>
            <div className="mb-4 mr-6">
              <Button
                loading={loading}
                size="large"
                onClick={() => {
                  if (filelist?.length > 0) {
                    form?.submit();
                    setViewUploadedDocuments(false);
                  } else {
                    message.error('Please upload atleast one document in order to proceed');
                  }
                }}
                type="primary"
                className="cursor-pointer text-lg font-semibold"
              >
                Save
              </Button>
            </div>
          </div>,
        ]}
      >
        <div className={classNames('m-4 mx-6', styles?.formStyles)}>
          <Form layout="vertical" hideRequiredMark form={form} onFinish={onFinish}>
            <Row gutter={[24, 12]}>
              {status !== 'main_doc' && status !== 'pms' && status !== 'complaint' && (
                <>
                  {' '}
                  <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                    <Form.Item
                      name="doc_category"
                      label={
                        <span className={classNames('formLabel', styles.textStyles)}>
                          Document Category
                        </span>
                      }
                    >
                      <Select
                        disabled={status === 'accessory_docs'}
                        placeholder="Product / Accessory"
                        style={{ width: '100%' }}
                        size="middle"
                        onSelect={(value) => {
                          setDocCategory(value);
                          if (status === 'internal_docs' && value === 'ACCESSORY') {
                            setDocFor(value);
                          }
                        }}
                        onChange={() => {
                          form?.setFieldsValue({
                            doc_for: '',
                            doc_access_company: '',
                            doc_access_type: '',
                            doc_access_model: '',
                          });
                        }}
                      >
                        <Select.Option key="PRODUCT" value="PRODUCT">
                          Product
                        </Select.Option>
                        <Select.Option key="ACCESSORY" value="ACCESSORY">
                          Accessory
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  {(docFor.includes('PF') ||
                    status === 'accessory_docs' ||
                    docFor === 'ACCESSORY' ||
                    docCategory === 'ACCESSORY') && (
                    <>
                      <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                        <Form.Item
                          name="doc_access_name"
                          label={
                            <span className={classNames('formLabel', styles.textStyles)}>
                              Accessory Name
                            </span>
                          }
                        >
                          <Select
                            disabled={status === 'accessory_docs'}
                            placeholder="Accessory Name"
                            style={{ width: '100%' }}
                            size="middle"
                            onSelect={(value) => {
                              setAccessName(value);
                            }}
                            onChange={() => {
                              form?.setFieldsValue({
                                doc_access_type: '',
                                doc_access_model: '',
                              });
                            }}
                          >
                            {relatedAccessories?.map((accessory) => (
                              <>
                                <Select.Option
                                  key={accessory?.accessory_id}
                                  value={accessory?.accessory_id}
                                >
                                  {accessory?.accessory_name}
                                </Select.Option>
                              </>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                        <Form.Item
                          name="doc_access_type"
                          label={
                            <span className={classNames('formLabel', styles.textStyles)}>
                              Accessory Type
                            </span>
                          }
                        >
                          <Select
                            disabled={status === 'accessory_docs'}
                            placeholder="Accessory Type"
                            style={{ width: '100%' }}
                            size="middle"
                            onSelect={(value) => {
                              setAccessType(value);
                            }}
                            onChange={() => {
                              form?.setFieldsValue({
                                doc_access_model: '',
                              });
                            }}
                          >
                            {accessName &&
                              Array.isArray(relatedType) &&
                              relatedType?.map((type) => (
                                <>
                                  <Select.Option key={type?.type_id} value={type?.type_id}>
                                    {type?.type_name}
                                  </Select.Option>
                                </>
                              ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                        <Form.Item
                          name="doc_access_model"
                          label={
                            <span className={classNames('formLabel', styles.textStyles)}>
                              Accessory Model
                            </span>
                          }
                        >
                          <Select
                            disabled={status === 'accessory_docs'}
                            placeholder="Product / Accessory / Model"
                            style={{ width: '100%' }}
                            size="middle"
                          >
                            {accessType &&
                              Array.isArray(relatedModel) &&
                              relatedModel?.map((model) => (
                                <>
                                  <Select.Option key={model?.model_id} value={model?.model_id}>
                                    {model?.model_name}
                                  </Select.Option>
                                </>
                              ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </>
                  )}
                  <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                    <div className={classNames('formLabel', styles.textStyles)}>Document Type</div>
                    <div className="flex w-full ">
                      <div
                        className={classNames(
                          docTypeId === 'OTHER_TYPE' && status === 'internal_docs'
                            ? 'w-1/4'
                            : 'w-full',
                        )}
                      >
                        <Form.Item
                          name="doc_type"
                          rules={[
                            {
                              required: true,
                              message: 'Please select the document type ',
                            },
                          ]}
                        >
                          <Select
                            placeholder="Sales / Service"
                            size="middle"
                            onSelect={(value) => {
                              setDocTypeId(value);
                            }}
                            onChange={() => {
                              form?.setFieldsValue({
                                doc_sub_type: '',
                              });
                            }}
                            allowClear
                          >
                            {Array.isArray(docType?.productContentTypes) &&
                              docType?.productContentTypes?.map((product) => (
                                <Select.Option key={product?.id} value={product?.id}>
                                  {product?.description}
                                </Select.Option>
                              ))}
                          </Select>
                        </Form.Item>
                      </div>

                      {docTypeId === 'OTHER_TYPE' && status === 'internal_docs' && (
                        <div
                          className={classNames(
                            docTypeId === 'OTHER_TYPE' && status === 'internal_docs'
                              ? 'w-3/4'
                              : 'w-0',
                          )}
                        >
                          <Form.Item
                            name="other_doc_Type"
                            rules={[
                              {
                                required: true,
                                message: 'Please Enter Document Type',
                              },
                            ]}
                          >
                            <Input
                              onChange={(e) => {
                                setOtherDocType(e.target.value);
                              }}
                              style={{ width: '100%' }}
                              placeholder="Enter Document Type"
                              allowClear
                            />
                          </Form.Item>
                        </div>
                      )}
                    </div>
                  </Col>
                  {((status === 'internal_docs' && docTypeId !== 'OTHER_TYPE') ||
                    status === 'shared_docs' ||
                    status === 'accessory_docs') && (
                    <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                      <Form.Item
                        name="doc_sub_type"
                        label={
                          <span className={classNames('formLabel', styles.textStyles)}>
                            Document Sub Type
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: 'Please select the document Sub type ',
                          },
                        ]}
                      >
                        <Select
                          placeholder="Sub Type"
                          className="w-full"
                          showSearch
                          allowClear
                          filterOption={false}
                          style={{ width: '100%' }}
                          size="middle"
                        >
                          {Array.isArray(docSubType?.productContentTypes) &&
                            docSubType?.productContentTypes?.map((product) => (
                              <Select.Option key={product?.id} value={product?.id}>
                                {product?.description}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                </>
              )}
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="doc_date"
                  rules={[
                    {
                      required: true,
                      message: 'Please select the document date',
                    },
                  ]}
                  label={
                    <span className={classNames('formLabel', styles.textStyles)}>
                      Document Date
                    </span>
                  }
                >
                  <DatePicker size="middle" style={{ width: '100%' }} disabledDate={disabledDate} />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="doc_title"
                  label={
                    <span className={classNames('formLabel', styles.textStyles)}>
                      Document Title
                    </span>
                  }
                >
                  <Input placeholder="Title" size="middle" />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="doc_number"
                  label={
                    <span className={classNames('formLabel', styles.textStyles)}>
                      Document Number
                    </span>
                  }
                >
                  <Input size="middle" placeholder="#DD12DDD5" />
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <div className={classNames(styles?.globalBox, 'mt-6')}>
            <Upload
              accept=".png,.jpg,.jpeg,.pdf"
              beforeUpload={async (content) => {
                setContentInfo([].concat(content, contentInfo));
                let file;
                await toBase64(content).then((res) => {
                  file = res;
                });
                setFilelist([].concat(file, filelist));

                return false;
              }}
              fileList={[]}
            >
              <Button type="primary" shape="circle" size="large">
                <UploadOutlined className="text-xl font-extrabold" />
              </Button>
            </Upload>
            <div className="text-blue-500 mt-1.5" style={{ fontWeight: '500' }}>
              Upload Document
            </div>
          </div>
          {contentInfo?.length > 0 && (
            <>
              <div className="my-4 font-bold text-sm text-blue-900">Uploaded Documents</div>
              <div className="mt-4" style={{ maxHeight: '20vh', overflow: 'auto' }}>
                {contentInfo?.map((info, index) => (
                  <div>
                    {index !== 0 && <Divider />}

                    <div className="w-full flex justify-between mt-4 ">
                      <div className="flex">
                        <div className="">
                          <img src={info?.type?.includes('pdf') ? PDF : PNG} alt="PNG" />
                        </div>
                        <div className=" mx-6 ">
                          <div className="text-blue-900 text-md font-semibold">{info?.name}</div>
                          <div className="text-gray-600 font-normal text-xs">
                            {moment(new Date().toISOString()).format('LL')} at{' '}
                            {moment(new Date().toISOString()).format('LT')}
                            {fileSizeConvertor(info?.size)}
                          </div>
                          <div className="text-blue-500 font-semibold text-xs">
                            Uploaded by{' '}
                            <span className="underline">
                              {currentUser?.personal_details?.displayName}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex mx-2 " style={{ float: 'right' }}>
                        <div className="mx-2">
                          {' '}
                          <Popconfirm
                            title="Are you sure you want to delete this attachment?"
                            onConfirm={() => {
                              setFilelist(() => filelist?.filter((item, i) => i !== index));

                              setContentInfo(() =>
                                contentInfo?.filter(
                                  (item) => item?.uid !== contentInfo[index]?.uid,
                                ),
                              );
                            }}
                            okText="Delete"
                            cancelText="Cancel"
                            okType="danger"
                          >
                            <Button type="danger" shape="circle" size="small">
                              <DeleteOutlined />
                            </Button>
                          </Popconfirm>
                        </div>

                        <Button
                          type="primary"
                          shape="circle"
                          size="small"
                          onClick={() => {
                            setViewUploadedDocuments(true);
                            setUploadUrl(URL.createObjectURL(info));
                            setDisplayFrame(true);
                          }}
                        >
                          <EyeOutlined />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {uploadUrl && (
                <DisplayDrawer
                  setDisplayDrawer={setDisplayFrame}
                  displayDrawer={displayFrame}
                  selectedHierarchy={null}
                  previewUrl={uploadUrl}
                  viewUploadedDocuments={viewUploadedDocuments}
                  setViewUploadedDocuments={setViewUploadedDocuments}
                />
              )}
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default connect(({ product, user, loading }) => ({
  currentUser: user?.currentUser,
  productDetail: product?.productDetail,
  docType: product?.docType,
  docSubType: product?.docSubType,
  merchandiseBrandsList: product?.merchandiseBrandsList,
  accessoryProductType: product?.accessoryProductType,
  ProductModel: product?.ProductModel,
  accessoryDrafts: product?.accessoryDrafts,
  complaintPreview: product?.ComplaintPreview,
  loading:
    loading?.effects['product/uploadGlobalDocuments'] ||
    loading?.effects['product/addPmsAttachment'] ||
    loading?.effects['product/addComplaintAttachment'],
}))(UploadGlobalDocs);
