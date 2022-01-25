import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Input,
  Button,
  Form,
  message,
  Skeleton,
  Pagination,
  Modal,
  Popconfirm,
  Divider,
} from 'antd';
import { RouteContext } from '@ant-design/pro-layout';
import { BuildOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { connect } from 'umi';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';

const Departments = ({
  dispatch,
  addDepartmentLoading,
  updateDepartmentLoading,
  getDepartmentLoading,
  departmentList,
  currentUser,
}) => {
  const [form] = Form.useForm();
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [viewSize, setViewSize] = useState(10);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const getDepartments = () => {
    dispatch({
      type: 'department/getAllDepartment',
      payload: {
        query: { view_size: viewSize, start_index: startIndex, keyword: searchText },
        pathParams: {
          customerId: currentUser?.personal_details?.organization_details?.org_party_id,
        },
      },
    });
  };

  useEffect(() => {
    if (selectedDepartment) {
      form.setFieldsValue({ name: selectedDepartment?.name });
    } else {
      form.resetFields();
    }
  }, [selectedDepartment]);

  const onFinish = (values) => {
    if (selectedDepartment) {
      dispatch({
        type: 'department/updateDepartment',
        payload: {
          pathParams: {
            departmentId: selectedDepartment?.id,
            customerId: currentUser?.personal_details?.organization_details?.org_party_id,
          },
          body: values,
        },
      }).then((res) => {
        if (res) {
          getDepartments();
          message.success('Department updated successfully!');
          setShowAddDepartment(false);
        }
      });
    } else {
      dispatch({
        type: 'department/createDepartment',
        payload: {
          body: values,
          pathParams: {
            customerId: currentUser?.personal_details?.organization_details?.org_party_id,
          },
        },
      }).then((res) => {
        if (res) {
          getDepartments();
          message.success('New department added successfully!');
          setShowAddDepartment(false);
        }
      });
    }
  };

  const deleteDepartment = (departmentId) => {
    dispatch({
      type: 'department/deleteDepartment',
      payload: {
        pathParams: {
          departmentId,
          customerId: currentUser?.personal_details?.organization_details?.org_party_id,
        },
      },
    }).then(() => {
      getDepartments();
      message.success('Department deleted successfully!');
    });
  };

  const action = (val) => setSearchText(val);
  const debounceSearch = debounce(action, 400);

  useEffect(() => {
    if (currentUser) {
      getDepartments();
    }
  }, [searchText, viewSize, startIndex]);

  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  return (
    <div className="container mx-auto">
      <Page
        title="Departments"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Departments',
                path: '/departments',
              },
            ]}
          />
        }
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <RouteContext.Consumer>
              {({ isMobile }) => (
                <div className="container mx-auto">
                  <div className="bg-white rounded shadow">
                    <div className="flex border-b p-4">
                      <Input.Search
                        enterButton
                        onChange={(e) => debounceSearch(e.target.value)}
                        placeholder="Enter keyword to search department"
                        size="large"
                      />
                      <Button
                        className="ml-4"
                        size="large"
                        type="primary"
                        onClick={() => setShowAddDepartment((prev) => !prev)}
                      >
                        Add Department
                      </Button>
                    </div>
                    <Skeleton loading={getDepartmentLoading} active>
                      {departmentList?.departments?.map((listItem) => (
                        <div
                          key={listItem?.id}
                          className="flex items-center px-4 py-2 justify-between border-b"
                        >
                          <div className="flex">
                            <div className="px-3 h-10 w-10 py-2 bg-gray-200 rounded-full">
                              <BuildOutlined className="text-xl" />
                            </div>
                            <div className="pl-3">
                              <div
                                style={{ maxWidth: `calc(100vw - 15rem)` }}
                                className="text-base font-semibold truncate"
                                title={listItem?.name}
                              >
                                {listItem?.name}
                              </div>
                              {listItem?.createdByPartyDetails?.name && (
                                <div className="text-xs text-gray-700 ">
                                  Created by{' '}
                                  <span className="font-semibold cursor-pointer text-blue-800">
                                    {listItem?.createdByPartyDetails?.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-end">
                            <a
                              onClick={() => {
                                setShowAddDepartment(true);
                                setSelectedDepartment(listItem);
                              }}
                            >
                              <EditOutlined /> {!isMobile && 'Edit'}
                            </a>
                            <Divider type="vertical" />
                            <Popconfirm
                              okText="Delete"
                              okType="danger"
                              placement="right"
                              onConfirm={() => deleteDepartment(listItem?.id)}
                              title="Are you sure you want to delete this department?"
                            >
                              <span className="text-red-600 hover:text-red-700 cursor-pointer">
                                <DeleteOutlined /> {!isMobile && 'Delete'}
                              </span>
                            </Popconfirm>
                          </div>
                        </div>
                      ))}
                      {departmentList?.departments?.length === 0 && (
                        <div className="text-center py-10 bg-white">
                          <div className="text-center">
                            <img
                              className="mx-auto"
                              src={SearchNotFound}
                              alt="No address"
                              style={{ height: '150px' }}
                            />
                          </div>
                          <p className="text-lg font-bold text-blue-800 mb-4">
                            No department found yet!
                          </p>

                          <p className="text-sm my-4 ">
                            Let us add some now and they will show up here.
                          </p>
                          <br />
                        </div>
                      )}
                      <div className="py-2 pr-2 flex justify-end">
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
                          total={departmentList?.totalCount}
                          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                          onChange={handleChangePagination}
                        />
                      </div>
                    </Skeleton>
                  </div>

                  <Modal
                    title={selectedDepartment ? 'Edit department' : 'Add department '}
                    visible={showAddDepartment}
                    onCancel={() => {
                      setShowAddDepartment(false);
                      setSelectedDepartment(null);
                    }}
                    afterClose={() => {
                      form.resetFields();
                      setSelectedDepartment(null);
                    }}
                    footer={
                      <div className="flex justify-end">
                        <div>
                          <Button
                            onClick={() => {
                              form.submit();
                            }}
                            loading={
                              selectedDepartment ? updateDepartmentLoading : addDepartmentLoading
                            }
                            type="primary"
                          >
                            {selectedDepartment ? 'Update' : 'Add'}
                          </Button>
                        </div>
                      </div>
                    }
                  >
                    <Form layout="vertical" hideRequiredMark form={form} onFinish={onFinish}>
                      <Form.Item
                        name="name"
                        label={<span className="formLabel">Department name</span>}
                        initialValue={null}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "Department name can't be blank!",
                          },
                        ]}
                      >
                        <Input placeholder="Enter department name" size="large" />
                      </Form.Item>
                    </Form>
                  </Modal>
                </div>
              )}
            </RouteContext.Consumer>
          </Col>
        </Row>
      </Page>
    </div>
  );
};

export default connect(({ loading, department, user }) => ({
  addDepartmentLoading: loading.effects['department/createDepartment'],
  updateDepartmentLoading: loading.effects['department/updateDepartment'],
  getDepartmentLoading: loading.effects['department/getAllDepartment'],
  departmentList: department.departmentList,
  currentUser: user.currentUser,
}))(Departments);
