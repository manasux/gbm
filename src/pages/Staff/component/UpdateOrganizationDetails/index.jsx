import { Modal, Button, Row, Col, Form, Select, Input, message } from 'antd';
import React, { useEffect } from 'react';
import { useUpdateStaff } from '@/query/useMutateStaff';
import Address from '@/components/Address';
import { useParams } from 'umi';

const { Option } = Select;
/**
 *
 * @UpdateOrganisationDetails - The purpose of this component is to update the Organisation's  Details
 */

const UpdateOrganisationDetails = ({ visible, info, setVisible, refetchStaff }) => {
  const [form] = Form.useForm();
  const { profileId } = useParams();

  //Initializing update mutate
  const updateStaffMutate = useUpdateStaff();

  // Organisation Details
  const { organization } = (info && info) || { organization: '' };

  const setFormValues = () => {
    form.setFieldsValue({
      organization: {
        ...organization,
      },
      orgAddress: {
        ...organization?.orgAddress,
        address_line_1: organization?.orgAddress?.addressLine1,
        address_line_2: organization?.orgAddress?.addressLine2,
        country_code: organization?.orgAddress?.countryCode,
        state_code: organization?.orgAddress?.stateCode,
        postal_code: organization?.orgAddress?.postalCode,
      },
    });
  };

  useEffect(() => {
    if (organization && visible) {
      setFormValues();
    }
  }, [organization, visible]);

  const onFinish = (values) => {
    const data = {
      organization: {
        ...values?.organization,
        orgPartyId: organization?.orgPartyId,
        orgAddress: {
          ...values?.orgAddress,
          id: organization?.orgAddress?.contactMechId,
          addressLine1: values?.orgAddress?.address_line_1,
          addressLine2: values?.orgAddress?.address_line_2,
          countryCode: values?.orgAddress?.country_code,
          stateCode: values?.orgAddress?.state_code,
          postalCode: values?.orgAddress?.postal_code,
        },
      },
    };
    delete data.orgAddress;

    // Calling update mutate
    updateStaffMutate
      ?.mutateAsync({ body: data, pathParams: { staffId: profileId } })
      .then((res) => {
        if (res?.responseMessage == 'success') {
          message.success('You have updated your organisation details successfully');
          refetchStaff();
        } else {
          message.error('Something went wrong!');
        }
      });
  };

  return (
    <Modal
      title="Update Organisation Details"
      visible={visible}
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
      <Form layout="vertical" hideRequiredMark form={form} onFinish={onFinish} autoComplete="off">
        <div className="bg-white rounded">
          <div className="bg-white shadow rounded p-4">
            <Row gutter={24}>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name={['organization', 'organizationName']}
                  label={<span className="formLabel">Name</span>}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Organization name can't be blank!",
                    },
                  ]}
                >
                  <Input placeholder="Enter organisation details" size="large" />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name={['organization', 'securityAmount']}
                  label={<span className="formLabel">Security Amount</span>}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Security amount can't be blank!",
                    },
                    {
                      message: 'Please enter a valid amount!',
                      pattern: /^\d+$/,
                    },
                  ]}
                >
                  <Input placeholder="Enter security Amount" size="large" type="number" />
                </Form.Item>
              </Col>
            </Row>
            <Address form={form} type="orgAddress" />
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateOrganisationDetails;
