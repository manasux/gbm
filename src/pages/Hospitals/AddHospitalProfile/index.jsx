import React, { useState } from 'react';
import AddHospitalProfileForm from './AddHospitalProfileForm';
import { connect, history } from 'umi';
import { Button, Form, notification } from 'antd';
import HospitalImageUpload from '../HospitalImageUpload';
import { getFormatedPhoneObject } from '@/utils/utils';
import { SmileOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import styles from './index.less';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';

const AddHospitalProfile = ({ dispatch, loading, currentUser }) => {
  const [showShipping, setShowShipping] = useState(false);
  const [fileContents, setFileContents] = useState([]);
  const [form] = Form.useForm();

  return (
    <div className="mx-12">
      <Page
        title="Add Branch"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Add Branch',
                path: '/branches/add-branch',
              },
            ]}
          />
        }
      >
        <div className="bg-gray-100">
          <HospitalImageUpload />
          <Form
            layout="vertical"
            colon={false}
            // autoComplete="off"
            onFinish={(values) => {
              const data = values;

              data.billingAddress = {
                ...data?.billingAddress,
                countryCode: data?.billingAddress?.countryCode?.split(' ')[0],
                stateCode: data?.billingAddress?.stateCode?.split(' ')[0],
                isBillingAddressPrimary: showShipping,
              };

              if (!showShipping) {
                data.shippingAddress = {
                  ...data?.shippingAddress,
                  countryCode: data.shippingAddress?.countryCode?.split(' ')[0],
                  stateCode: data?.shippingAddress?.stateCode?.split(' ')[0],
                  isShippingAddressPrimary: !showShipping,
                };
              } else {
                data.shippingAddress = {
                  ...data?.billingAddress,
                  isShippingAddressPrimary: !showShipping,
                };
                delete data.shippingAddress.isBillingAddressPrimary;
              }

              data.contacts = {
                ...data?.contacts,
                roleTypeId: 'CT_ADMIN',
                phone: getFormatedPhoneObject(data?.contacts?.phone, data?.contacts?.countryCode),
              };
              data.companyPhone = getFormatedPhoneObject(
                data?.companyPhone?.phone,
                data?.companyPhone?.countryCode,
              );

              data.contents = [
                ...fileContents?.map((content) => {
                  delete content.viewInfo;
                  return content;
                }),
              ];

              delete data.amountPaid;
              delete data.subscriptionType;
              delete data.subsPeriod;
              delete data.noOfUSers;

              data.contacts = [data?.contacts];
              data.parentId = currentUser?.personal_details?.organizationDetails?.orgPartyId;

              dispatch({
                type: 'hospital/createHospital',
                payload: data,
              }).then((res) => {
                if (res?.status === 'ok') {
                  notification.open({
                    message: 'Great Job!',
                    description: (
                      <div>
                        You have successfully added the Hospital <strong>{data.companyName}</strong>
                        .
                      </div>
                    ),
                    icon: <SmileOutlined style={{ color: '#108ee9' }} />,
                  });
                  form.resetFields();
                  history.push(`/branches/all`);
                } else {
                  notification.error({
                    message: 'Oops! Something went wrong.',
                    description: 'Please check the customer details!',
                  });
                }
              });
            }}
            form={form}
          >
            <AddHospitalProfileForm
              showShipping={showShipping}
              setShowShipping={setShowShipping}
              setFileContents={setFileContents}
              fileContents={fileContents}
              form={form}
            />
            <div className={'px-10'}>
              <div className="flex justify-end px-6">
                <Button
                  size="middle"
                  type="gost"
                  onClick={() => {
                    form.resetFields();
                    history.push(`/hospital/profile`);
                  }}
                >
                  <span className="text-blue-500 font-semibold ">Cancel</span>
                </Button>
                <Button
                  style={{ marginLeft: '1.5rem' }}
                  loading={loading}
                  size="middle"
                  onClick={() => form.submit()}
                  type="primary"
                  className="cursor-pointer text-lg font-semibold"
                >
                  Save
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </Page>
    </div>
  );
};

export default connect(({ loading, user, customer }) => ({
  currentUser: user?.currentUser,
  loading: loading.effects['hospital/createHospital'],
}))(AddHospitalProfile);
