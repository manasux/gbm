/* eslint-disable prefer-promise-reject-errors */
import React, { useEffect } from 'react';
import { Col, Form, Input, Row, Select } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Link, connect, history } from 'umi';
import { callApi } from '@/utils/apiUtils';
import styles from '../index.less';
import UserAuthLayout from '../UserAuthLayout';

const SignUp = ({ dispatch, stateCodes }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch({
      type: 'common/getStateCodes',
      payload: {
        pathParams: {
          countryId: 'CAN',
        },
      },
    });
  }, []);

  const onFinish = (body) =>
    dispatch({
      type: 'user/userRegister',
      payload: body,
      cb: (res) => {
        if (res) {
          history.replace('/user/login');
        }
      },
    });

  return (
    <UserAuthLayout>
      <div className="">
        <div className="">
          <p className={styles.DescriptionText}>Create an account</p>
          <p className="text-gray-500 text-base text-center">
            Already have an account?{' '}
            <Link to="/user/login" className={styles.LoginLink}>
              Login
            </Link>
          </p>
        </div>
        <div className="px-16">
          <Form
            form={form}
            colon={false}
            layout="vertical"
            hideRequiredMark
            onFinish={onFinish}
            className={styles.SignUpForm}
          >
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="first_name"
                  label={<span className="formLabel">First name</span>}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your first name!',
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="last_name"
                  label={<span className="formLabel">Last name</span>}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your last name!',
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="email"
              label={<span className="formLabel">Email address</span>}
              rules={[
                {
                  required: true,
                  message: 'Please enter your email address!',
                },
                {
                  type: 'email',
                  message: 'Please enter valid email address!',
                },
                ({ getFieldError }) => ({
                  validator(rule, value) {
                    const a = getFieldError('email');
                    if (a.includes("'email' is not a valid email") || !value || value.length < 2) {
                      return Promise.resolve();
                    }
                    return callApi(
                      {
                        uriEndPoint: {
                          uri: '/user/isExistingLoginId',
                          method: 'GET',
                          version: '/xapi/v1',
                        },
                        query: {
                          user_id: value,
                        },
                      },
                      {
                        disableNotifications: true,
                      },
                    )
                      .then(() => Promise.resolve())
                      .catch(() => Promise.reject('Email already exists. Try again!'));
                  },
                }),
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password!' }]}
              label={<span className="formLabel">Password</span>}
            >
              <Input.Password
                size="large"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name={['address', 'postal_code']}
                  label={<span className="formLabel">Pincode</span>}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your pincode!',
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['address', 'city']}
                  label={<span className={styles.FormLabel}>City</span>}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your city!',
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name={['address', 'state_code']}
              label={<span className={styles.FormLabel}>State</span>}
              rules={[
                {
                  required: true,
                  message: 'Please select your state!',
                },
              ]}
            >
              <Select
                showSearch
                size="large"
                placeholder="Select state"
                optionFilterProp="filter"
                filterOption
              >
                {stateCodes?.map((state) => (
                  <Select.Option filter={state.geoName} key={state.geoId} value={state.geoId}>
                    {state.geoName} ({state.geoCode})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <button type="submit" className={styles.LoginButton}>
              Create an account
            </button>
          </Form>
        </div>
      </div>
    </UserAuthLayout>
  );
};

export default connect(({ common }) => ({
  stateCodes: common.stateCodes,
}))(SignUp);
