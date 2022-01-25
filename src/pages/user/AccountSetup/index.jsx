import React, { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Input, Row, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Link, history, connect } from 'umi';
import JWT from 'jwt-decode';
import logo from '@/assets/logo/logo.svg';
import bgImg from '@/assets/background-image.svg';
import UserAuthLayout from '../UserAuthLayout';
import styles from '../index.less';

const AccountSetup = ({
  dispatch,
  loading,
  location: {
    query: { token },
  },
}) => {
  const decodedToken = JWT(token);
  const [form] = Form.useForm();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!token && token?.emailAddress) {
      history.replace('/user/login');
    }
  }, []);

  return (
    <UserAuthLayout>
      <div
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
        className="w-full h-full bg-white flex items-center justify-center my-auto"
      >
        <div className="max-w-sm">
          <div className="">
            <div className="flex justify-center">
              <Row>
                <Col xs={24} sm={24} md={24} lg={0} xl={0}>
                  <img src={logo} alt="Store illustration" className="h-32 self-center" />
                </Col>
              </Row>
            </div>
            <div className="my-6">
              <div className="font-bold text-4xl text-center">
                Welcome {decodedToken.firstName} !
              </div>
              <div className="text-gray-500 text-base text-center">
                Your account has been set for
              </div>
              <div className="text-gray-500 text-base text-center font-bold text-gray-700">
                {decodedToken.emailAddress}
              </div>
              <div className="text-gray-500 text-base text-center text-gray-600 pt-3">
                Done with your setup already?{' '}
                <Link to="/user/login" className={styles.LoginLink}>
                  Login
                </Link>
              </div>
            </div>
            <div className="">
              {error && (
                <div className="my-2">
                  <Alert message="Your link has been expired!" type="error" showIcon closable />
                </div>
              )}
              <Form
                form={form}
                onFieldsChange={() => setError(false)}
                colon={false}
                hideRequiredMark
                layout="vertical"
                onFinish={(val) => {
                  const newVal = val;
                  newVal.email_address = decodedToken.emailAddress;
                  newVal.invite_token = token;
                  dispatch({
                    type: 'user/resetUserPasswordOnAccountCreation',
                    payload: {
                      body: {
                        email_address: val.email_address,
                        password: val.password,
                        confirm_password: val?.confirm_password,
                        invite_token: token,
                      },
                    },
                  }).then((res) => {
                    if (res) {
                      message.success('Account setup success, login now!');
                      history.replace('/user/login');
                    }
                  });
                }}
              >
                <Form.Item
                  name="password"
                  label={<span className="formLabel">Password</span>}
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password!',
                    },
                  ]}
                >
                  <Input.Password
                    size="large"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>
                <Form.Item
                  name="confirm_password"
                  label={<span className="formLabel">Confirm Password</span>}
                  rules={[
                    {
                      required: true,
                      message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        // eslint-disable-next-line prefer-promise-reject-errors
                        return Promise.reject('The two passwords that you entered do not match!');
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    size="large"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>
                <Button loading={loading} size="large" htmlType="submit" type="primary" block>
                  Create Account
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </UserAuthLayout>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['user/resetUserPasswordOnAccountCreation'],
}))(AccountSetup);
