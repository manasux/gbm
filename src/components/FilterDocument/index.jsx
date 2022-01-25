/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  ArrowRightOutlined,
  CheckCircleFilled,
  CloseOutlined,
  DownOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Col, Input, Popover, Row, Select, Form, DatePicker } from 'antd';
import { connect, useParams } from 'umi';
import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { debounce } from 'lodash';
import styles from './index.less';

const { RangePicker } = DatePicker;
const FilterDocument = ({
  getSharedDocs,
  dispatch,
  docType,
  docSubType,
  setSearchTextForShared,
  status,
  setAccessoryFilter,
  productDetail,
  docTree,
  typeofDoc,
  merchandiseBrandsList,
  accessoryProductType,
  ProductModel,
  currentUser,
  selectedHierarchy,
  isFilter,
  visible,
  getInternalDocuments,
  setSearchTextForInternal,
  getInternalDoc,
}) => {
  const [form] = Form.useForm();
  const [docTypeId, setDocTypeId] = useState('');
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const { serialNumberId } = useParams();
  const [brandId, setBrandId] = useState('');
  const [typeId, setTypeId] = useState('');
  const debounceAccessorySearch = debounce((val) => setAccessoryFilter(val), 400);
  const debounceSearch = debounce((val) => setSearchTextForShared(val), 400);
  const debounceInternalSearch = debounce((val) => setSearchTextForInternal(val), 400);
  const [buttonText, setButtonText] = useState(false);

  const docTypeList = () => {
    if (showFilterPopup) {
      dispatch({
        type: 'product/getDocType',
        payload: {
          query: {
            doc_type_id:
              typeofDoc === 'INTERNAL_DOC' || isFilter === 'INTERNAL_DOC'
                ? 'INTERNAL_DOC'
                : 'SHARED_DOC',
          },
        },
      });
    }
  };

  const getDocSubTypesList = (data) => {
    dispatch({
      type: 'product/getDocSubTypesList',
      payload: {
        query: {
          ...data,
        },
      },
    });
  };
  function disabledDate(current) {
    return current > moment().endOf('day');
  }
  const onSubtypeChange = () => {
    const data = {};
    if (docTypeId) {
      data.doc_type_id =
        typeofDoc === 'INTERNAL_DOC' || isFilter === 'INTERNAL_DOC' ? 'INTERNAL_DOC' : 'SHARED_DOC';
      data.type_id = docTypeId;
    }

    getDocSubTypesList(data);
  };

  const getAccessoryType = () => {
    dispatch({
      type: 'product/getAccessoryType',
      payload: {
        query: {
          brand_id: brandId,
          purpose_type_id: 'PRODUCT_ACC',
          isVerified: true,
        },
      },
    });
  };

  useEffect(() => {
    if (brandId) getAccessoryType();
    if (docTypeId) onSubtypeChange();
    if (serialNumberId) docTypeList();
    if (isFilter === 'MAIN_PROD' && selectedHierarchy?.uniqueKeyFactor) {
      const data = {};
      data.doc_type_id = 'SHARED_DOC';
      data.type_id = 'SERVICE';
      getDocSubTypesList(data);
      form.setFieldsValue({
        doc_type: 'SERVICE',
        doc_sub_type: selectedHierarchy?.uniqueKeyFactor,
      });
    }
  }, [brandId, docTypeId, showFilterPopup, isFilter, selectedHierarchy]);

  useEffect(() => {
    form?.resetFields();
    setButtonText(false);
  }, [visible]);
  const getSharedDocuments = (data) => {
    dispatch({
      type: 'product/getSharedDocuments',
      payload: {
        pathParams: {
          productId:
            docTree === 'ACC_DOC' && isFilter !== 'SHARED_DOC'
              ? selectedHierarchy?.product_id
              : productDetail?.product_id,
        },
        query: {
          document_type: 'SHARED_DOC',
          subTypeId: selectedHierarchy?.uniqueKeyFactor || '',
          ...data,
        },
      },
    });
  };
  const getProductDocumentsFilter = (data) => {
    dispatch({
      type: 'product/getProductDocuments',
      payload: {
        pathParams: {
          productId: serialNumberId,
        },
        query: {
          showBasicInfo: true,
          ...data,
        },
      },
    });
  };

  const getAccessoryDocs = (value) => {
    const data = {};
    if (value?.brand_id) {
      data.brand_id = value?.brand_id;
    }
    if (value?.access_type) {
      data.type_id = value?.access_type;
    }
    if (value?.access_model) {
      data.model_id = value?.access_model;
    }
    dispatch({
      type: 'product/getProductAccessoryDrafts',
      payload: {
        is_draft: productDetail?.is_draft,
        is_variant: 'Y',
        parent_product_id: serialNumberId,
        assoc_type_id: 'PRODUCT_ACCESSORY',
        customer_id: currentUser?.personal_details?.organization_details?.org_party_id,
        ...data,
      },
    });
  };
  const clearFilters = () => {
    form.resetFields();
    if (status === 'accessory_filter') {
      getAccessoryDocs();
    } else if (isFilter === 'INTERNAL_DOC') {
      getInternalDocuments();
    } else if (typeofDoc === 'INTERNAL_DOC') {
      getInternalDoc();
    } else {
      getSharedDocuments();
    }
    if (
      !Object.keys(form.getFieldsValue()).find((item) => form.getFieldsValue()[item] !== undefined)
    ) {
      setButtonText(false);
    }

    getProductDocumentsFilter();
  };

  if (typeofDoc === 'Machinery Photo') {
    form?.setFieldsValue({
      doc_type: 'Service',
      doc_sub_type: 'Machinery Photograph',
    });
  }
  const getMainProductDocument = (data) => {
    dispatch({
      type: 'product/getSharedDocuments',
      payload: {
        pathParams: {
          productId: productDetail?.product_id,
        },
        query: {
          document_type: 'SHARED_DOC',
          ...data,
        },
      },
    });
  };
  const onFinish = (values) => {
    if (
      Object.keys(form.getFieldsValue()).find((item) => form.getFieldsValue()[item] !== undefined)
    )
      setButtonText(true);
    else {
      setButtonText(false);
    }
    const data = {};
    if (form?.getFieldValue('doc_type')) {
      data.subTypeId = values?.doc_type;
    }

    if (form?.getFieldValue('doc_sub_type')) {
      data.subTypeId = values?.doc_sub_type;
    }
    if (form?.getFieldValue('doc_date')) {
      data.documentFromDate = values?.doc_date[0].toISOString();
      data.documentToDate = values?.doc_date[1].toISOString();
    }
    if (form?.getFieldValue('doc_year')) {
      data.documentYear = values?.doc_year.toISOString();
    }

    // eslint-disable-next-line no-constant-condition
    if (isFilter === 'INTERNAL_DOC') {
      dispatch({
        type: 'product/getInternalDocuments',
        payload: {
          pathParams: {
            productId: serialNumberId,
          },
          query: {
            document_type: 'INTERNAL_DOC',
            subTypeId: visible ? selectedHierarchy?.uniqueKeyFactor : '',
            ...data,
          },
        },
      });
    }
    if (typeofDoc === 'SHARED_DOC') {
      getSharedDocs(data);
    }
    if (typeofDoc === 'INTERNAL_DOC' || isFilter === 'INTERNAL_DOC') {
      getInternalDoc(data);
    }
    if (typeofDoc === 'Document Preview') {
      dispatch({
        type: 'product/getSharedDocuments',
        payload: {
          pathParams: {
            productId:
              docTree === 'ACC_DOC' && isFilter !== 'SHARED_DOC'
                ? selectedHierarchy?.product_id
                : productDetail?.product_id,
          },
          query: {
            document_type: 'SHARED_DOC',
            subTypeId: selectedHierarchy?.uniqueKeyFactor,
            ...data,
          },
        },
      });
    }
    if (
      typeofDoc === 'Machinery Photo' ||
      typeofDoc === 'Installation Report' ||
      typeofDoc === 'Product Invoice'
    ) {
      getMainProductDocument(data);
    }

    setShowFilterPopup(false);
  };

  const onFinishAccessoryFilters = (values) => {
    if (
      Object.keys(form.getFieldsValue()).find((item) => form.getFieldsValue()[item] !== undefined)
    )
      setButtonText(true);
    else {
      setButtonText(false);
    }
    getAccessoryDocs(values);
    setShowFilterPopup(false);
  };
  const filterContent = () => (
    <div style={{ minWidth: 480 }}>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <Form onFinish={onFinish} form={form} colon={false} hideRequiredMark>
            <span className={classNames(styles.textStyles)}>Document Type</span>
            <Form.Item name="doc_type">
              <Select
                allowClear
                placeholder="Sales / Service"
                style={{ width: '100%' }}
                size="medium"
                onSelect={(value) => {
                  setDocTypeId(value);
                }}
                onChange={() => {
                  form?.setFieldsValue({
                    doc_sub_type: '',
                  });
                }}
                disabled={
                  typeofDoc === 'Machinery Photo' ||
                  typeofDoc === 'Installation Report' ||
                  typeofDoc === 'Product Invoice'
                }
              >
                {docType &&
                  Array.isArray(docType?.productContentTypes) &&
                  docType?.productContentTypes?.map((product) => (
                    <Select.Option key={product?.id} value={product?.id}>
                      {product?.description}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <span className={classNames('formLabel', styles.textStyles)}>Document Sub Type</span>
            <Form.Item name="doc_sub_type">
              <Select
                placeholder="Sub Type"
                className="w-full"
                showSearch
                allowClear
                style={{ width: '100%' }}
                size="medium"
                disabled={
                  typeofDoc === 'Machinery Photo' ||
                  typeofDoc === 'Installation Report' ||
                  typeofDoc === 'Product Invoice'
                }
              >
                {Array.isArray(docSubType?.productContentTypes) &&
                  docSubType?.productContentTypes?.map((product) => (
                    <Select.Option key={product?.id} value={product?.id}>
                      {product?.description}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Row>
              <Col xl={18} lg={18} md={18} sm={18} xs={18}>
                <span className={classNames('formLabel', styles.textStyles)}>Document Date</span>

                <Form.Item name="doc_date">
                  <RangePicker disabledDate={disabledDate} />
                </Form.Item>
              </Col>
              <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                <span className={classNames('formLabel', styles.textStyles)}>Document Year</span>
                <Form.Item name="doc_year">
                  <DatePicker picker="year" />
                </Form.Item>
              </Col>
            </Row>

            <div className="text-right">
              <Button onClick={() => form.submit()} type="primary">
                Filter Documents <ArrowRightOutlined />
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );

  const filterAccessory = () => (
    <div style={{ minWidth: 480 }}>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <Form onFinish={onFinishAccessoryFilters} form={form} colon={false} hideRequiredMark>
            <span className={classNames(styles.textStyles)}>Choose Company</span>
            <Form.Item name="brand_id">
              <Select
                allowClear
                placeholder="Select company"
                style={{ width: '100%' }}
                size="medium"
                onSelect={(value) => {
                  setBrandId(value);
                }}
                onChange={() => {
                  setBrandId();
                  setTypeId();
                  form?.setFieldsValue({
                    access_type: undefined,
                    access_model: undefined,
                  });
                }}
                onClear={() => {
                  setButtonText(false);
                  getAccessoryDocs();
                  setBrandId();
                  setTypeId();
                  form?.setFieldsValue({
                    access_type: undefined,
                    access_model: undefined,
                  });
                }}
              >
                {merchandiseBrandsList?.searchResults?.map((brand) => (
                  <Select.Option key={brand?.id} value={brand?.id}>
                    {brand?.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <span className={classNames('formLabel', styles.textStyles)}>
              Choose Accessory Type
            </span>
            <Form.Item name="access_type">
              <Select
                placeholder="Accessory Type"
                className="w-full"
                showSearch
                allowClear
                onClear={() => {
                  setTypeId();
                  form?.setFieldsValue({
                    access_model: undefined,
                  });
                }}
                onChange={() => {
                  setTypeId();
                  form?.setFieldsValue({
                    access_model: undefined,
                  });
                }}
                onSelect={(value) => {
                  setTypeId(value);
                }}
                style={{ width: '100%' }}
                size="medium"
              >
                {brandId &&
                  Array.isArray(accessoryProductType?.productTypes) &&
                  accessoryProductType?.productTypes?.map((product) => (
                    <Select.Option key={product?.productTypeId} value={product?.productTypeId}>
                      {product?.description}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <span className={classNames('formLabel', styles.textStyles)}>
              Choose Accessory Model
            </span>
            <Form.Item name="access_model">
              <Select
                placeholder="Accessory Model"
                className="w-full"
                showSearch
                allowClear
                style={{ width: '100%' }}
                size="medium"
              >
                {brandId &&
                  typeId &&
                  Array.isArray(ProductModel?.productTypes) &&
                  ProductModel?.productTypes?.map((product) => (
                    <Select.Option key={product?.productTypeId} value={product?.productTypeId}>
                      {product?.description}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <div className="text-right">
              <Button onClick={() => form.submit()} type="primary">
                Filter Accessory <ArrowRightOutlined />
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );

  return (
    <div className="mt-3 w-full" style={{ padding: '5px', backgroundColor: 'white' }}>
      <div className="mb-3">
        <Input
          className={classNames(styles.filterInput)}
          addonBefore={
            <Popover
              visible={showFilterPopup}
              placement="bottomRight"
              content={status === 'accessory_filter' ? filterAccessory() : filterContent()}
              title={
                <div className="flex items-center justify-between">
                  <div className="text-blue-900 font-semibold py-2">
                    {status !== 'accessory_filter' ? 'Filter Documents' : 'Filter Accessory'}
                  </div>
                  <div className="flex">
                    <div className="mx-2">
                      <Button
                        type="default"
                        onClick={() => {
                          clearFilters();
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                    <div>
                      <Button
                        type="default"
                        onClick={() => {
                          setShowFilterPopup(false);
                        }}
                      >
                        <CloseOutlined /> Close
                      </Button>
                    </div>
                  </div>
                </div>
              }
              trigger="click"
              onVisibleChange={(visibleState) => {
                setShowFilterPopup(visibleState);
              }}
            >
              <Button type="primary" size="medium" className={classNames(styles.btnStyling)}>
                {!buttonText ? `Filter` : 'Filter Applied'}
                {!buttonText ? (
                  <DownOutlined style={{ fontSize: '10px' }} />
                ) : (
                  <CheckCircleFilled style={{ fontSize: '1rem' }} />
                )}
              </Button>
            </Popover>
          }
          addonAfter={
            <Button type="primary" size="medium">
              <SearchOutlined />
            </Button>
          }
          size="medium"
          onChange={(e) => {
            if (status === 'accessory_filter') {
              debounceAccessorySearch(e?.target?.value);
            } else if (typeofDoc === 'INTERNAL_DOC' || isFilter === 'INTERNAL_DOC') {
              debounceInternalSearch(e?.target?.value);
            } else {
              debounceSearch(e?.target?.value);
            }
          }}
          placeholder={
            status === 'accessory_filter'
              ? 'Enter serial number to search'
              : 'Enter title or number to search the Document'
          }
          allowClear
        />
      </div>
    </div>
  );
};

export default connect(({ product, user }) => ({
  docType: product.docType,
  docSubType: product.docSubType,
  productDetail: product.productDetail,
  merchandiseBrandsList: product.merchandiseBrandsList,
  accessoryProductType: product.accessoryProductType,
  ProductModel: product.ProductModel,
  currentUser: user.currentUser,
}))(FilterDocument);
