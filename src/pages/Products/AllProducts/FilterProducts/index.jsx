/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Row, Popover, Col, Form, Select, Button } from 'antd';
import { debounce } from 'lodash';
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  DownOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';

const { Option } = Select;

const FilterProducts = ({
  loading,
  setSearchText,
  dispatch,
  brandList,
  productFamilyList,
  ProductList,
  ProductType,
  customerList,
  setProductFilterType,
  productFilterType,
  setFilterdQuery,
  isFilterApplied,
  setIsFilterApplied,
  setTab,
  isDraftFilterApplied,
  setIsDraftFilterApplied,
}) => {
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [familyDetails, setFamilyDetails] = useState();
  const [brandDetails, setBrandDetails] = useState();
  const [productNameDetails, setProductNameDetails] = useState();
  const [productType, setProductType] = useState('');
  const [isRequired, setIsRequired] = useState(false);
  const [form] = Form.useForm();
  const action = (val) => setSearchText(val);
  const debounceSearch = debounce(action, 400);

  const onFinishSearch = (values) => {
    if (form?.getFieldValue('family_id')) {
      setFilterdQuery(values);
      setIsRequired(false);
      switch (productFilterType) {
        case undefined:
          setIsFilterApplied(true);
          setIsDraftFilterApplied(true);
          break;
        case 'DRAFT':
          setIsDraftFilterApplied(true);

          break;

        default:
          setIsFilterApplied(true);

          break;
      }
      setShowFilterPopup(false);
    } else {
      setIsRequired(true);
    }
  };

  const getBrandList = (value) => {
    dispatch({
      type: 'product/getProductBrands',
      payload: {
        query: { keyword: value, family_id: familyDetails },
      },
    });
  };

  const getProductList = (value) => {
    dispatch({
      type: 'product/getProductList',
      payload: {
        query: { keyword: value, brand_id: brandDetails, purpose_type_id: 'PRODUCT_EQUIP' },
      },
    });
  };

  const getProductTypes = (value) => {
    dispatch({
      type: 'product/getProductTypes',
      payload: {
        query: {
          keyword: value,
          head_type_id: productNameDetails,
          purpose_type_id: 'PRODUCT_EQUIP',
        },
      },
    });
  };

  const productSubTypes = (value) => {
    dispatch({
      type: 'product/getProductSubTypes',
      payload: {
        query: {
          type_id: productType?.id,
          purpose_type_id: 'PRODUCT_EQUIP',
          keyword: value,
        },
      },
    });
  };

  const getProductfamilyList = (value) => {
    dispatch({
      type: 'product/getProductfamilyList',
      payload: {
        query: {
          keyword: value,
        },
      },
    });
  };

  useEffect(() => {
    if (showFilterPopup) {
      getProductfamilyList();
    }
  }, [showFilterPopup]);

  useEffect(() => {
    if (familyDetails) {
      getBrandList();
    }
  }, [familyDetails]);

  useEffect(() => {
    if (brandDetails) {
      getProductList();
    }
  }, [brandDetails]);
  useEffect(() => {
    if (productNameDetails) {
      getProductTypes();
    }
  }, [productNameDetails]);

  const onBrandSearch = debounce(getBrandList, 400);

  const onFamilySearch = debounce(getProductfamilyList, 400);

  const onProductSearch = debounce(getProductList, 400);

  const onTypeSearch = debounce(getProductTypes, 400);

  const clearFilters = () => {
    setFilterdQuery('');
    switch (productFilterType) {
      case undefined:
        setIsFilterApplied(false);
        setIsDraftFilterApplied(false);
        break;
      case 'DRAFT':
        setIsDraftFilterApplied(false);
        break;

      default:
        setIsFilterApplied(false);
        break;
    }
    setProductFilterType(undefined);
    form?.resetFields();
  };

  const filterContent = () => (
    <div className="pt-6 relative" style={{ minWidth: 480 }}>
      {isRequired && (
        <p className="text-red-500 text-sm absolute top-0">
          * Please select product family to proceed
        </p>
      )}

      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <Form onFinish={onFinishSearch} form={form} colon={false} hideRequiredMark>
            <div className={classNames('formLabel text-left mt-2')}>Product Family</div>
            <Form.Item name="family_id">
              <Select
                placeholder="Select product family"
                className="w-full"
                showSearch
                allowClear
                onClear={() => {
                  setFamilyDetails('');
                  setBrandDetails('');
                  getBrandList();
                  getProductList();
                  form?.setFieldsValue({
                    brand_id: '',
                    head_type_id: '',
                    type_id: '',
                    sub_type_id: '',
                  });
                }}
                filterOption={false}
                onSearch={(text) => onFamilySearch(text)}
                onSelect={(value) => {
                  value && setIsRequired(false);
                  setFamilyDetails(value);
                }}
              >
                {productFamilyList?.searchResults.map((family) => (
                  <Select.Option key={family.id} value={family.id}>
                    <p className="m-0 capitalize text-sm font-medium text-blue-700">
                      {family?.name?.replace(/[_]/g, ' ')?.toLowerCase()}
                    </p>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <div className={classNames('formLabel text-left')}>Product Brand</div>
            <Form.Item name="brand_id">
              <Select
                placeholder="Select product brand"
                className="w-full"
                showSearch
                allowClear
                onClear={() => {
                  setBrandDetails('');
                  getProductList();
                  form?.setFieldsValue({
                    head_type_id: '',
                  });
                }}
                filterOption={false}
                onSearch={(text) => onBrandSearch(text)}
                onSelect={(value) => {
                  setBrandDetails(value);
                }}
                disabled={!familyDetails}
              >
                {familyDetails &&
                  brandList?.searchResults.map((brand) => (
                    <Select.Option key={brand.id} value={brand.id}>
                      <p className="m-0 capitalize text-sm font-medium text-blue-700">
                        {brand?.name?.replace(/[_]/g, ' ')?.toLowerCase()}
                      </p>
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <div className={classNames('formLabel text-left')}>Product Name</div>
            <Form.Item name="head_type_id">
              <Select
                placeholder="Select product name"
                className="w-full"
                showSearch
                allowClear
                onClear={() => {
                  setProductNameDetails('');
                  getProductList();
                  form.setFieldsValue({
                    type_id: '',
                  });
                }}
                filterOption={false}
                onSelect={(value) => {
                  setProductNameDetails(value);
                }}
                onSearch={(text) => onProductSearch(text)}
                disabled={!brandDetails}
              >
                {brandDetails &&
                  ProductList?.productTypes?.map((pType) => (
                    <Select.Option key={pType.productTypeId} value={pType.productTypeId}>
                      <p className="m-0 uppercase text-sm text-blue-700">
                        {pType?.description?.replace(/[_]/g, ' ')?.toLowerCase()}
                      </p>
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <div className={classNames('formLabel text-left mr-2')}>Product Type</div>
            <Form.Item name="type_id">
              <Select
                placeholder="Select product type"
                className="w-full"
                showSearch
                allowClear
                onClear={getProductTypes}
                filterOption={false}
                onSearch={(text) => onTypeSearch(text)}
                onSelect={(value) => {
                  setProductType(value);
                }}
                disabled={!productNameDetails}
              >
                {productNameDetails &&
                  ProductType?.productTypes?.map((pType) => (
                    <Select.Option key={pType.productTypeId} value={pType.productTypeId}>
                      <p className="m-0 uppercase text-sm text-blue-700">
                        {pType?.description?.replace(/[_]/g, ' ')?.toLowerCase()}
                      </p>
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <div className="mb-10">
              <div className={classNames('formLabel text-left mr-2')}>Product Status</div>
              <Select
                placeholder="Select product status"
                className="w-full"
                allowClear
                onClear={() => setProductFilterType(undefined)}
                onChange={(value) => {
                  setProductFilterType(value);
                  value !== 'DRAFT' && value ? setTab(value) : setTab('VERIFIED');
                }}
                value={productFilterType}
              >
                <Select.Option value={'VERIFIED'}>
                  <p className="m-0 uppercase text-sm font-medium text-black">Approved</p>
                </Select.Option>
                <Select.Option value={'PENDING'}>
                  <p className="m-0 uppercase text-sm font-medium text-black">Pending</p>
                </Select.Option>
                <Select.Option value={'REJECTED'}>
                  <p className="m-0 uppercase text-sm font-medium text-black">Rejected</p>
                </Select.Option>
                <Select.Option value={'DRAFT'}>
                  <p className="m-0 uppercase text-sm font-medium text-black">DRAFT</p>
                </Select.Option>
              </Select>
            </div>
            <div className="text-right">
              <Button onClick={() => form.submit()} type="primary" loading={loading}>
                Filter Products <ArrowRightOutlined />
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );

  return (
    <div className="w-full">
      <div className="">
        <Popover
          visible={showFilterPopup}
          placement="bottomRight"
          content={filterContent()}
          title={
            <div className="flex items-center justify-between">
              <div className="text-blue-900 font-semibold py-2">Filter products where</div>
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
                      form?.resetFields();
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
          onVisibleChange={(visible) => {
            setShowFilterPopup(visible);
          }}
        >
          <Button type="primary" size="middle">
            {isFilterApplied || isDraftFilterApplied ? 'Filter Applied' : 'Filter'}
            {isFilterApplied || isDraftFilterApplied ? (
              <CheckCircleOutlined style={{ fontSize: '20px' }} />
            ) : (
              <DownOutlined style={{ fontSize: '10px' }} />
            )}
          </Button>
        </Popover>
      </div>
    </div>
  );
};

export default connect(({ loading, product, user, customer }) => ({
  loading: loading.effects['product/allproducts'],
  brandList: product.brandsList,
  productFamilyList: product.productFamilyList,
  ProductList: product.ProductList,
  ProductType: product.ProductType,
  customerList: customer.customerList,
}))(FilterProducts);
