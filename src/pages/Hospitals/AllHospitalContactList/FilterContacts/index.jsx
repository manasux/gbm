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
// import classNames from 'classnames';
import { debounce } from 'lodash';
import { useForm } from 'antd/lib/form/Form';

const { Option } = Select;
const { RangePicker } = DatePicker;

const FilterContacts = ({
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

  setFilterdQuery,
  setIsClosedFilterApplied,
  setComplaintFilterType,
  complaintFilterType,
  isFilterApplied,
  isClosedFilterApplied,
  setIsFilterApplied,

  hospitalList,
}) => {
  console.log(`hospitalList`, hospitalList);
  const [branchDetails, setBranchDetails] = useState();
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const [viewSize, setViewSize] = useState(10);
  const [startIndex, setstartIndex] = useState(0);

  const [form] = useForm();

  const onFinishFilter = (values) => {
    if (form?.getFieldValue('branchId')) {
      console.log(`values`, values);
      setFilterdQuery(values);
      setIsRequired(false);
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
      getBranchList();
    }
  }, [showFilterPopup]);

  const filterContent = () => (
    <div className="pt-6 relative" style={{ minWidth: 480 }}>
      {isRequired && (
        <p className="text-red-500 text-sm absolute top-0">
          * Please select Branch Name to proceed
        </p>
      )}

      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <Form onFinish={onFinishFilter} form={form} colon={false} hideRequiredMark>
            {/* className={currentUser?.isHeadquarter ? 'formLabel text-left block' : 'hidden'} */}
            <div>Choose Branch</div>
            {/* className={currentUser?.isHeadquarter ? 'block' : 'hidden'} */}
            <div>
              <Form.Item name="branchId">
                <Select
                  placeholder="Select Branch"
                  className="w-full"
                  showSearch
                  allowClear
                  onClear={() => {
                    setBranchDetails('');
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
                    setBranchDetails(value);
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

  const getBranchList = (value) => {
    dispatch({
      type: 'hospital/allHospital',
      payload: {
        query: {
          parentId: branchDetails,
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
}))(FilterContacts);
