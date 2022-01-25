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
import { debounce } from 'lodash';
import { useForm } from 'antd/lib/form/Form';
import styles from '../index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

const FilterComplaints = ({
  currentUser,
  dispatch,
  loading,
  setSearchText,
  setFilterdQuery,
  isFilterApplied,
  setIsFilterApplied,
  hospitalList,
}) => {
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const [viewSize, setViewSize] = useState(10);
  const [startIndex, setstartIndex] = useState(0);

  const [form] = useForm();

  const onFinishFilter = (values) => {
    if (form?.getFieldValue('branchId')) {
      const query = { customerId: values?.branchId };
      setFilterdQuery(query);
      setIsRequired(false);
      setShowFilterPopup(false);
      setIsFilterApplied(true);
    } else {
      setIsRequired(true);
    }
  };

  const action = (val) => {
    setSearchText(val);
    setstartIndex(0);
  };
  const debounceSearch = debounce(action, 500);

  useEffect(() => {
    if (showFilterPopup) {
      getBranchList();
    }
  }, [showFilterPopup]);

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

  const clearFilters = () => {
    setFilterdQuery('');
    setIsRequired(false);
    setIsFilterApplied(false);
    form?.resetFields();
  };

  const filterContent = () => (
    <div className="pt-6 relative" style={{ minWidth: 480 }}>
      {isRequired && (
        <p className="text-red-500 text-sm absolute top-0">* Please Select branch to proceed</p>
      )}

      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <Form onFinish={onFinishFilter} form={form}>
            <p className="m-0">Select Branch</p>

            <Form.Item name="branchId">
              <Select
                placeholder="Select Branch"
                className="w-full"
                showSearch
                filterOption={true}
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

            <div className="text-right">
              <Button onClick={() => form.submit()} type="primary" loading={loading}>
                Filter Contracts <ArrowRightOutlined />
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );

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
                    {isFilterApplied ? 'Filter Applied' : 'Filter'}
                    {isFilterApplied ? (
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
          placeholder="Enter keyword to search the contracts"
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
