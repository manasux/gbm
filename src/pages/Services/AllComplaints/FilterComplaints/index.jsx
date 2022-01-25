/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Input, Button, Popover, Select, Form, Row, Col, DatePicker } from 'antd';
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  DownOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import { debounce } from 'lodash';
import { useForm } from 'antd/lib/form/Form';

const { Option } = Select;
const { RangePicker } = DatePicker;

const FilterComplaints = ({
  currentUser,
  dispatch,
  loading,
  brandList,
  productFamilyList,
  ProductList,
  ProductType,
  customerList,
  setSearchText,
  setCompleteStartIndex,
  setStartIndex,
  setFilterdQuery,
  setIsClosedFilterApplied,
  setComplaintFilterType,
  complaintFilterType,
  isFilterApplied,
  isClosedFilterApplied,
  setIsFilterApplied,
  setTab,
  hospitalList,
}) => {
  console.log(`hospitalList`, hospitalList);
  const [familyDetails, setFamilyDetails] = useState();
  const [brandDetails, setBrandDetails] = useState();
  const [productNameDetails, setProductNameDetails] = useState();
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const [viewSize, setViewSize] = useState(10);
  const [startIndex, setstartIndex] = useState(0);
  const [onStartDateChange, setOnStartDateChange] = useState();
  const [onEndDateChange, setOnEndDateChange] = useState();

  const [form] = useForm();

  const onFinishFilter = (values) => {
    if (form?.getFieldValue('familyId') || form?.getFieldValue('branchId')) {
      setFilterdQuery({ ...values, startDate: onStartDateChange, endDate: onEndDateChange });
      setIsRequired(false);
      switch (complaintFilterType) {
        case undefined:
          setIsFilterApplied(true);
          setIsClosedFilterApplied(true);
          break;
        case 'CRQ_CLOSED':
          setIsClosedFilterApplied(true);

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

  const action = (val) => {
    setSearchText(val);
    setstartIndex(0);
    setCompleteStartIndex(0);
  };

  useEffect(() => {
    if (showFilterPopup) {
      getProductfamilyList();
      getBranchList();
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

  const startDateChange = (date) => {
    console.log(`Start date`, date?.format());
    setOnStartDateChange(date?.format());
  };

  const EndDateChange = (date) => {
    console.log(`End Date: `, date);
    setOnEndDateChange(date?.format());
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
          <Form onFinish={onFinishFilter} form={form} colon={false} hideRequiredMark>
            <div className={currentUser?.isHeadquarter ? 'formLabel text-left block' : 'hidden'}>
              Choose Branch
            </div>
            <div className={currentUser?.isHeadquarter ? 'block' : 'hidden'}>
              <Form.Item name="branchId">
                <Select
                  placeholder="Select Branch"
                  className="w-full"
                  showSearch
                  allowClear
                  onClear={() => {
                    // form?.setFieldsValue({
                    //   brand_id: '',
                    //   head_type_id: '',
                    //   type_id: '',
                    //   sub_type_id: '',
                    // });
                  }}
                  filterOption={false}
                  onSearch={(text) => onBranchSearch(text)}
                  onSelect={(value) => {
                    value && setIsRequired(false);
                  }}
                >
                  {hospitalList?.records.map((branch) => (
                    <Select.Option key={branch?.id} value={branch?.id}>
                      <p className="m-0 capitalize text-sm font-medium text-blue-700">
                        {branch?.companyName}
                      </p>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className={classNames('formLabel text-left mt-2')}>Product Family</div>
            <Form.Item name="familyId">
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
            <Form.Item name="brandId">
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
            <Form.Item name="headTypeId">
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
            <Form.Item name="typeId">
              <Select
                placeholder="Select product type"
                className="w-full"
                showSearch
                allowClear
                onClear={getProductTypes}
                filterOption={false}
                onSearch={(text) => onTypeSearch(text)}
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
              <div className={classNames('formLabel text-left mr-2')}>Complaint Type</div>
              <Select
                placeholder="Select complaint type"
                className="w-full"
                allowClear
                onClear={() => setComplaintFilterType(undefined)}
                onChange={(value) => {
                  setComplaintFilterType(value);
                  value !== 'CRQ_CLOSED' && value ? setTab(value) : setTab('CRQ_OPEN');
                }}
                value={complaintFilterType}
              >
                <Select.Option value={'CRQ_OPEN'}>
                  <p className="m-0 uppercase text-sm font-medium text-black">Open</p>
                </Select.Option>
                <Select.Option value={'CRQ_CLOSED'}>
                  <p className="m-0 uppercase text-sm font-medium text-black">Closed</p>
                </Select.Option>
                <Select.Option value={'CRQ_INPROGRESS'}>
                  <p className="m-0 uppercase text-sm font-medium text-black">In Progress</p>
                </Select.Option>
                <Select.Option value={'CRQ_HOLD'}>
                  <p className="m-0 uppercase text-sm font-medium text-black">On Hold</p>
                </Select.Option>
              </Select>
            </div>
            <Form.Item>
              <div className="mb-10 flex">
                <Col className="w-full">
                  <div className={classNames('formLabel text-left mr-2')}>Start Date</div>
                  {/* TODO: */}
                  <DatePicker className="w-full" onChange={startDateChange} />
                </Col>
                <Col className="w-full ml-5">
                  <div className={classNames('formLabel text-left mr-2')}>End Date</div>
                  <DatePicker className="w-full" onChange={EndDateChange} />
                </Col>
              </div>
            </Form.Item>

            <div className="text-right">
              <Button onClick={() => form.submit()} type="primary" loading={loading}>
                Filter Complaints <ArrowRightOutlined />
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );

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

  const getBranchList = (value) => {
    dispatch({
      type: 'hospital/allHospital',
      payload: {
        query: {
          parentId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
          roleTypeId: 'BRANCH',
          view_size: viewSize,
          start_index: startIndex,
          keyword: value,
        },
      },
    });
  };

  const debounceSearch = debounce(action, 500);
  const clearFilters = () => {
    setFilterdQuery('');
    switch (complaintFilterType) {
      case undefined:
        setIsFilterApplied(false);
        setIsClosedFilterApplied(false);
        break;

      case 'CRQ_CLOSED':
        setIsClosedFilterApplied(false);
        break;

      default:
        setIsFilterApplied(false);
        break;
    }
    setComplaintFilterType(undefined);
    form?.resetFields();
  };

  return (
    <div className="w-full">
      <div className="mb-2">
        <Input
          addonBefore={
            <div className="w-full">
              <div className="">
                <Popover
                  visible={showFilterPopup}
                  placement="bottomRight"
                  content={filterContent()}
                  title={
                    <div className="flex items-center justify-between">
                      <div className="text-blue-900 font-semibold py-2">
                        Filter complaints where
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
                  onVisibleChange={(visible) => {
                    setShowFilterPopup(visible);
                  }}
                >
                  <Button type="primary" size="middle">
                    {isFilterApplied || isClosedFilterApplied ? 'Filter Applied' : 'Filter'}
                    {isFilterApplied || isClosedFilterApplied ? (
                      <CheckCircleOutlined style={{ fontSize: '20px' }} />
                    ) : (
                      <DownOutlined style={{ fontSize: '10px' }} />
                    )}
                  </Button>
                </Popover>
              </div>
            </div>
          }
          addonAfter={
            <Button type="primary" size="middle">
              <SearchOutlined />
            </Button>
          }
          size="middle"
          onChange={(e) => debounceSearch(e.target.value)}
          placeholder="Enter company name to search the complaint"
          allowClear
        />
      </div>
    </div>
  );
};

export default connect(({ loading, product, customer, user, hospital }) => ({
  loading:
    loading.effects['product/getProductComplaints'] ||
    loading.effects['product/getFinishedComplaints'],
  brandList: product.brandsList,
  currentUser: user.currentUser,
  productFamilyList: product.productFamilyList,
  hospitalList: hospital?.hospitalList,
  ProductList: product.ProductList,
  ProductType: product.ProductType,
  customerList: customer.customerList,
}))(FilterComplaints);
