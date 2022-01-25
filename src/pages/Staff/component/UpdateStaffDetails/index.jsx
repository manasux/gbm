import { Modal, Button, Row, Col, Form, Input, message } from 'antd';
import { useParams } from 'umi';
import React, { useEffect } from 'react';
import PhoneNumber from '@/components/PhoneNumber';
import Address from '@/components/Address';
import { useUpdateStaff } from '@/query/useMutateStaff';
import { getPhoneObject } from '@/utils/utils';
/**
 *
 * @UpdateStaffDetails - The purpose of this component is to update the Staff's Personal Details
 */

const UpdateStaffDetails = ({ visible, staffDetails, setVisible, refetchStaff }) => {
  const [form] = Form.useForm();

  const { profileId } = useParams();

  const updateStaffMutate = useUpdateStaff();

  const { email } = (staffDetails && staffDetails?.emailAddresses?.find((item) => item)) || {
    email,
  };
  const { countryCode, areaCode, contactNumber, contactMechId } = (staffDetails &&
    staffDetails?.phoneNumbers?.find((item) => item)) || { countryCode, areaCode, contactNumber };
  const address = staffDetails && staffDetails?.postalAddresses?.find((item) => item);

  const setFormFields = () => {
    form?.setFieldsValue({
      firstName: staffDetails?.firstName,
      lastName: staffDetails?.lastName,
      email,
      phones: { countryCode, phone: areaCode + contactNumber },
      addresses: {
        address_line_1: address?.address1,
        address_line_2: address?.address2,
        region: address?.region,
        countryCode: address?.countryGeoId,
        state_code: address?.stateProvinceGeoId,
        city: address?.city,
        postal_code: address?.postalCode,
      },
    });
  };

  useEffect(() => {
    if (staffDetails) {
      setFormFields();
    }
  }, [staffDetails]);

  const onFinish = (values) => {
    const { countryCode, phone } = values?.phones;
    const data = {
      ...values,
      addresses: [
        {
          ...values?.addresses,
          id: address?.contactMechId,
          addressLine1: values?.addresses?.address_line_1,
          addressLine2: values?.addresses?.address_line_2,
          countryCode: values?.addresses?.country_code,
          stateCode: values?.addresses?.state_code,
          postalCode: values?.addresses?.postal_code,
        },
      ],
      phones: [{ ...getPhoneObject(phone, countryCode), id: contactMechId }],
    };
    delete data.email;
    delete data?.addresses[0]?.address_line_1;
    delete data?.addresses[0]?.address_line_2;
    delete data?.addresses[0]?.country_code;
    delete data.addresses[0]?.state_code;
    delete data?.addresses[0]?.postal_code;

    updateStaffMutate
      ?.mutateAsync({ body: data, pathParams: { staffId: profileId } })
      .then((res) => {
        if (res?.responseMessage == 'success') {
          message.success('You have updated your basic details successfully');
          refetchStaff();
        } else {
          message.error('Something went wrong!');
        }
      });
  };

  return (
    <Modal
      title="Update Basic Details"
      visible={visible}
      width={1000}
      onCancel={() => {
        setVisible(false);
      }}
      footer={
        <div className="flex justify-end">
          <div>
            <Button
              type="link"
              onClick={() => {
                setVisible(false);
              }}
            >
              Cancel
            </Button>
          </div>
          <div>
            <Button
              onClick={() => {
                form.submit();
              }}
              type="primary"
              loading={updateStaffMutate?.isLoading}
            >
              Update
            </Button>
          </div>
        </div>
      }
    >
      <Form layout="vertical" hideRequiredMark form={form} onFinish={onFinish}>
        <div className="bg-white rounded">
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                name="firstName"
                label={<span className="formLabel">First Name</span>}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "First name can't be blank!",
                  },
                ]}
                className="m-0 p-0"
              >
                <Input size="large" placeholder="Enter first name" autoFocus />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                name="lastName"
                label={<span className="formLabel">Last Name</span>}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Last name can't be blank!",
                  },
                ]}
              >
                <Input size="large" placeholder="Enter last name" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label={<span className="formLabel">Email</span>} name="email">
                <Input placeholder="Enter email address" size="large" type="email" disabled />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label={<span className="formLabel ">Phone number</span>}>
                <PhoneNumber
                  type="staff"
                  countryCode={['phones', 'countryCode']}
                  rules={[
                    {
                      required: true,
                      message: "Phone number can't be blank and of minimum 10 digits",
                      min: 10,
                      len: 10,
                    },
                  ]}
                  form={form}
                  name={['phones', 'phone']}
                  placeholder="Enter  phone number"
                />
              </Form.Item>
            </Col>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Address form={form} type="addresses" />
            </Col>
          </Row>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateStaffDetails;
