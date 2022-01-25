import { Button, Input, Form, DatePicker, Col, Row, message } from 'antd';

import React from 'react';
import moment from 'moment';
import { connect } from 'umi';
import NumberInput from '@/components/NumberInput';

const BasicDetailsForm = ({ dispatch, updateProfileLoading, currentUser }) => {
  const [form] = Form.useForm();

  return (
    <div className="bg-white rounded shadow">
      <Form
        form={form}
        layout="vertical"
        onFinish={(value) =>
          dispatch({
            type: 'user/updateCurrent',
            payload: {
              pathParams: {
                teacherId: currentUser?.id,
              },
              body: value,
            },
          }).then(() => message.success('Profile updated successfully!'))
        }
        hideRequiredMark
        colon={false}
      >
        <div className="w-full py-4">
          <div className="flex items-center justify-between mb-4 px-4 border-b">
            <div className="py-2">
              <div className="text-gray-600 uppercase font-medium text-sm">Account Email</div>
              <div className="text-blue-900 text-lg font-semibold">
                {currentUser?.personal_details?.primary_email}
              </div>
            </div>
            <div className=" text-right">
              <div className="text-gray-600 uppercase font-medium text-sm">Program</div>
              <div className="text-blue-900 text-lg font-semibold">CD-IELTS (General)</div>
            </div>
          </div>
          <div className="px-4">
            <Row gutter={24}>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="first_name"
                  initialValue={currentUser?.personal_details?.first_name}
                  label={<span className="formLabel">First Name</span>}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "First name can't be blank!",
                    },
                  ]}
                >
                  <Input size="large" autoFocus />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  initialValue={currentUser?.personal_details?.last_name}
                  name="last_name"
                  label={<span className="formLabel">Last Name</span>}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Last name can't be blank!",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="aadhar_number"
                  initialValue={currentUser?.personal_details?.aadhar_number}
                  label={<span className="formLabel ">Aadhar Number</span>}
                >
                  <NumberInput
                    rules={[
                      {
                        required: true,
                        message: 'Please check adhar number!',
                        min: 16,
                      },
                    ]}
                    size="large"
                    style={{ width: '100%' }}
                    form={form}
                    name="aadhar_number"
                    maxlength={16}
                  />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  initialValue={moment(currentUser?.personal_details?.birth_date)}
                  name="birth_date"
                  label={<span className="formLabel ">Date Of Birth</span>}
                  rules={[
                    {
                      required: true,
                      message: "DOB can't be blank!",
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    size="large"
                    placeholder="Select Date of Birth"
                  />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  initialValue={currentUser?.personal_details?.qualification}
                  label={<span className="formLabel">Qualification</span>}
                  name="qualification"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Qualification can't be blank!",
                    },
                    //   { validator: checkIsExistingEmail },
                  ]}
                >
                  <Input size="large" type="text" />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="joining_date"
                  initialValue={moment(currentUser?.personal_details?.joining_date)}
                  label={<span className="formLabel">Select Joining Date</span>}
                  rules={[
                    {
                      required: true,
                      message: "Joining date can't be blank!",
                    },
                  ]}
                >
                  <DatePicker
                    className="w-full"
                    size="large"
                    placeholder="Select Joining Date"
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            <Button
              type="primary"
              size="large"
              className="Button"
              htmlType="submit"
              block
              loading={updateProfileLoading}
            >
              Update
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default connect(({ common, user, loading }) => ({
  stateCodes: common.stateCodes,
  currentUser: user.currentUser,
  updateProfileLoading: loading.effects['user/updateCurrent'],
}))(BasicDetailsForm);
