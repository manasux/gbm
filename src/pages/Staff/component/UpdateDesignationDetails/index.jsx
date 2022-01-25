import { Modal, Button, Row, Col, Form, Select, Input, message } from 'antd';
import React, { useEffect } from 'react';
import { useGetSupervisors } from '@/query/useCompany';
import { useParams } from 'umi';
import { useUpdateStaff } from '@/query/useMutateStaff';

const { Option } = Select;
/**
 *
 * @UpdateDesignationDetails - The purpose of this component is to update the Designation's  Details
 */

const UpdateDesignationDetails = ({ visible, info, setVisible, refetchStaff }) => {
  const [form] = Form.useForm();
  const getSupervisors = useGetSupervisors({ payload: {} });
  const { profileId } = useParams();

  //Initailizing update mutate
  const updateStaffMutate = useUpdateStaff();

  // Designation and Role Section Details
  const { manager, partyAttributes } = (info && info) || { manager: '', partyAttributes: '' };

  useEffect(() => {
    if (partyAttributes && manager) {
      form.setFieldsValue({
        designation: partyAttributes?.find((item) => item?.attrName === 'DESIGNATION')?.attrValue,
        division: partyAttributes?.find((item) => item?.attrName === 'DIVISION')?.attrValue,
        manager: { id: manager?.id },
      });
    }
  }, [partyAttributes, manager, form]);

  const { data: supervisors } = getSupervisors;

  const onFinish = (values) => {
    const data = { ...values };
    // Calling update mutate
    updateStaffMutate
      ?.mutateAsync({ body: data, pathParams: { staffId: profileId } })
      .then((res) => {
        if (res?.responseMessage == 'success') {
          message.success('You have updated your designation and role details successfully');
          refetchStaff();
        } else {
          message.error('Something went wrong!');
        }
      });
  };

  return (
    <Modal
      title="Update Designation and Role"
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
              //   loading={}
            >
              Update
            </Button>
          </div>
        </div>
      }
    >
      <Form layout="vertical" hideRequiredMark form={form} onFinish={onFinish}>
        <div className="bg-white rounded">
          <div className="bg-white shadow rounded p-4">
            <Row gutter={24}>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="designation"
                  label={<span className="formLabel">Designation (Optional)</span>}
                >
                  <Input placeholder="Enter designation" size="large" />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="division"
                  label={<span className="formLabel">Division (Optional)</span>}
                >
                  <Input placeholder="Enter division" size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name={['manager', 'id']}
              label={<span className="formLabel">Supervisor (Optional)</span>}
            >
              <Select className="w-full" size="large" placeholder="Select supervisor ">
                {supervisors?.result?.map((item) => (
                  <Option key={item?.id} value={item?.partyId}>
                    {item?.toName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateDesignationDetails;
