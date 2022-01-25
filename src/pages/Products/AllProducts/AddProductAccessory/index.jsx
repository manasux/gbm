import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Form, Switch, Select } from 'antd';
import { connect, useParams } from 'umi';
import { PlusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { debounce } from 'lodash';
import TextInput from '@/components/FormComponents/TextInput';
import UploadAttachment from '@/components/FormComponents/UploadAttachment';
import NumberInput from '@/components/FormComponents/NumberInput';
import SelectDate from '@/components/FormComponents/SelectDate';
import SelectInput from '@/components/FormComponents/SelectInput';
import { checkExistingProduct } from '@/services/product';
import styles from './styles.less';

const AddProductAccessory = ({
  loading,
  visible,
  setVisible,
  product,
  dispatch,
  contractTypeList,
}) => {
  const [form] = Form.useForm();
  const [hasWarranty, setHasWarranty] = useState(false);
  const [hasContract, setHasContract] = useState(false);
  const [otherUploads, setOtherUploads] = useState(false);

  const getContractTypeList = (value) => {
    dispatch({
      type: 'product/getContractTypeList',
      payload: {
        keyword: value,
      },
    });
  };

  useEffect(() => {
    getContractTypeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contractTypeSearch = debounce(getContractTypeList, 400);

  const onSearchHandler = () => {};

  const { id: productId } = useParams();

  return (
    <Modal
      title={`Add product accessory - ${product?.serial_number || productId}`}
      width={720}
      centered
      maskClosable={false}
      visible={visible}
      onCancel={() => {
        setVisible(false);
      }}
      footer={[
        <Button
          key="submit"
          type="primary"
          icon={<PlusCircleOutlined />}
          loading={loading}
          onClick={() => form.submit()}
        >
          Add Accessory
        </Button>,
      ]}
    >
      <div className={styles.container}>
        <div className="p-4">
          <Form form={form} colon={false}>
            <div className="text-blue-900 font-semibold text-base mb-2">Basic details</div>
            <Row gutter={12}>
              <Col lg={16} xl={16} md={24} sm={24} xs={24}>
                <TextInput
                  rules={[{ required: true, message: 'Please enter model number' }]}
                  label="Model number"
                  name={['model_details', 'model_number']}
                  placeholder="Enter model number"
                />
              </Col>

              <Col lg={8} xl={8} md={24} sm={24} xs={24}>
                <UploadAttachment
                  setFields={(id) => {
                    const ids = form?.getFieldValue(['model_details', 'content']);
                    form?.setFieldsValue({
                      model_details: { content: ids ? ids.concat(id) : [id] },
                    });
                  }}
                  name={['model_details', 'content']}
                  multiple
                />
              </Col>
              <Col lg={16} xl={16} md={24} sm={24} xs={24}>
                <SelectDate
                  rules={[{ required: true, message: 'Please select installation date' }]}
                  label="Installation date"
                  name={['"installation_details', 'installation_date']}
                  placeholder="Installation date"
                />
              </Col>
              <Col lg={8} xl={8} md={24} sm={24} xs={24}>
                <UploadAttachment
                  setFields={(id) => {
                    const ids = form?.getFieldValue(['installation_details', 'content']);
                    form?.setFieldsValue({
                      installation_details: { content: ids ? ids.concat(id) : [id] },
                    });
                  }}
                  name={['installation_details', 'content']}
                  multiple
                />
              </Col>
              <Col lg={16} xl={16} md={24} sm={24} xs={24}>
                <TextInput
                  rules={[
                    { required: true, message: 'Please enter model number' },
                    () => ({
                      async validator(rule, value) {
                        if (value) {
                          const resp = await checkExistingProduct({
                            product_id: value,
                          });
                          if (resp.exists) {
                            // eslint-disable-next-line prefer-promise-reject-errors
                            return Promise.reject('Product with serial number already exists');
                          }
                          return Promise.resolve();
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                  label="Serial number"
                  name={['serial_number_details', 'serial_number']}
                  placeholder="Enter serial number"
                />
              </Col>
              <Col lg={8} xl={8} md={24} sm={24} xs={24}>
                <UploadAttachment
                  setFields={(id) => {
                    const ids = form?.getFieldValue(['serial_number_details', 'content']);
                    form?.setFieldsValue({
                      serial_number_details: { content: ids ? ids.concat(id) : [id] },
                    });
                  }}
                  name={['serial_number_details', 'content']}
                  multiple
                />
              </Col>
            </Row>
            <div className="font-medium mb-4">
              <Switch
                size="small"
                onChange={(checked) => {
                  setHasWarranty(checked);
                }}
              />
              {'  '}
              Has warranty?
            </div>
            {/* HasWarrantyForm */}
            <div>
              {hasWarranty && (
                <>
                  <div className="text-blue-900 font-semibold text-base">Warranty details</div>
                  <Row gutter="12">
                    <Col lg={16} xl={16} md={24} sm={24} xs={24}>
                      <NumberInput
                        rules={[{ required: true, message: 'Please enter number of years' }]}
                        label="Warranty"
                        name={['warranty_details', 'warranty']}
                        placeholder="Enter number of years"
                        form={form}
                      />
                    </Col>
                    <Col lg={8} xl={8} md={24} sm={24} xs={24}>
                      <UploadAttachment
                        setFields={(id) => {
                          const ids = form?.getFieldValue(['warranty_details', 'content']);
                          form?.setFieldsValue({
                            warranty_details: { content: ids ? ids.concat(id) : [id] },
                          });
                        }}
                        name={['warranty_details', 'content']}
                        multiple
                      />
                    </Col>
                    <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                      <Row gutter={24}>
                        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                          <SelectDate
                            rules={[{ required: true, message: 'Please select start date' }]}
                            label="Start date"
                            name="warranty_start_date"
                            placeholder="Warranty start date"
                            onChange={(date) => {
                              const warranty = form.getFieldsValue([
                                'warranty_details',
                                'warranty',
                              ]);

                              form?.setFieldsValue({
                                warranty_end_date: moment(date).add(
                                  warranty?.warranty_details?.warranty,
                                  'years',
                                ),
                              });
                            }}
                          />
                        </Col>
                        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                          <SelectDate
                            rules={[{ required: true, message: 'Please select end date' }]}
                            label="End date"
                            name="warranty_end_date"
                            placeholder="Warranty end date"
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={16} xl={16} md={24} sm={24} xs={24}>
                      <NumberInput
                        rules={[{ required: true, message: 'Please enter PMS number' }]}
                        label="PMS (per year)"
                        name={['pms_details', 'pms']}
                        placeholder="Enter PMS number"
                        setFields={(id) => {
                          form?.setFieldsValue({
                            pms_details: { pms: id },
                          });
                        }}
                      />
                    </Col>
                    <Col lg={8} xl={8} md={24} sm={24} xs={24}>
                      <UploadAttachment
                        setFields={(id) => {
                          const ids = form?.getFieldValue(['pms_details', 'content']);
                          form?.setFieldsValue({
                            pms_details: { content: ids ? ids.concat(id) : [id] },
                          });
                        }}
                        name={['pms_details', 'content']}
                        multiple
                      />
                    </Col>
                  </Row>
                </>
              )}
            </div>
            <div className="font-medium mb-4">
              <Switch
                size="small"
                onChange={(checked) => {
                  setHasContract(checked);
                }}
              />{' '}
              Has contract?
            </div>

            {/* HasContract form */}

            <div>
              {hasContract && (
                <>
                  <div className="text-blue-900 font-semibold text-base mb-2">Contract details</div>
                  <Row gutter="12">
                    <Col lg={16} xl={16} md={24} sm={24} xs={24}>
                      <SelectInput
                        rules={[{ required: true, message: 'Please select the type' }]}
                        label="Contract type"
                        placeholder="Select contract type "
                        name={['contract_details', 'type_id']}
                        showSearch="true"
                        onSearch={contractTypeSearch}
                      >
                        {Array.isArray(contractTypeList?.searchResults) &&
                          contractTypeList?.searchResults?.map((contract) => (
                            <Select.Option key={contract?.id} value={contract?.id}>
                              {contract?.name}
                            </Select.Option>
                          ))}
                      </SelectInput>
                    </Col>
                    <Col lg={8} xl={8} md={24} sm={24} xs={24}>
                      <UploadAttachment
                        setFields={(id) => {
                          // just uncomment the following code to send array of content_ids to server, server yet to configure this.
                          const ids = form?.getFieldValue(['contract_details', 'type_content_ids']);
                          form?.setFieldsValue({
                            contract_details: { type_content_ids: ids ? ids.concat(id) : [id] },
                          });
                          // form?.setFieldsValue({
                          //   contract_details: { type_content_id: id },
                          // });
                        }}
                        name={['contract_details', 'type_content_ids']}
                        multiple
                      />
                    </Col>
                    <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                      <NumberInput
                        rules={[{ required: true, message: 'Please enter year' }]}
                        label="Contract period"
                        name={['contract_details', 'period']}
                        placeholder="Enter number of years"
                        form={form}
                      />
                    </Col>
                    <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                      <Row gutter={24}>
                        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                          <SelectDate
                            rules={[{ required: true, message: 'Please select start date' }]}
                            label="Start date"
                            name={['contract_details', 'start_date']}
                            placeholder="Contract start date"
                            onChange={(date) => {
                              const contract = form.getFieldsValue(['contract_details', 'period']);
                              form?.setFieldsValue({
                                contract_details: {
                                  end_date: moment(date).add(
                                    contract?.contract_details?.period,
                                    'years',
                                  ),
                                },
                              });
                            }}
                          />
                        </Col>
                        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                          <SelectDate
                            rules={[{ required: true, message: 'Please select end date' }]}
                            label="End date"
                            name={['contract_details', 'end_date']}
                            placeholder="Contract end date"
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={16} xl={16} md={24} sm={24} xs={24}>
                      <NumberInput
                        rules={[{ required: true, message: 'Please enter PMS number' }]}
                        label="PMS (per year)"
                        name={['contract_details', 'pms']}
                        placeholder="Enter PMS number"
                        form={form}
                      />
                    </Col>
                    <Col lg={8} xl={8} md={24} sm={24} xs={24}>
                      <UploadAttachment
                        setFields={(id) => {
                          // just uncomment the following code to send array of content_ids to server, server yet to configure this.
                          const ids = form?.getFieldValue(['contract_details', 'pms_content_ids']);
                          form?.setFieldsValue({
                            contract_details: { pms_content_ids: ids ? ids.concat(id) : [id] },
                          });
                          // form?.setFieldsValue({
                          //   contract_details: { pms_content_id: id },
                          // });
                        }}
                        name={['contract_details', 'pms_content_ids']}
                        multiple
                      />
                    </Col>
                  </Row>
                </>
              )}
            </div>
            {/* Other documents upload */}
            <div className="font-medium mb-4">
              <Switch
                size="small"
                onChange={(checked) => {
                  setOtherUploads(checked);
                }}
              />{' '}
              Has other document uploads?
            </div>
            <div>
              {otherUploads && (
                <>
                  <div className="text-blue-900 font-semibold text-base mb-2">Contract details</div>
                  <Row gutter="12">
                    <Col lg={16} xl={16} md={24} sm={24} xs={24}>
                      <SelectInput
                        rules={[{ required: true, message: 'Please select upload the type' }]}
                        label="Upload type"
                        placeholder="Select upload type "
                        name={['other_document', 'type_id']}
                        showSearch
                        onSearch={onSearchHandler}
                      >
                        {[].map((contract) => (
                          <Select.Option key={contract?.id} value={contract?.id}>
                            {contract?.name}
                          </Select.Option>
                        ))}
                      </SelectInput>
                    </Col>
                    <Col lg={8} xl={8} md={24} sm={24} xs={24}>
                      <UploadAttachment
                        setFields={() => {
                          // just uncomment the following code to send array of content_ids to server, server yet to configure this.
                          // const ids = form?.getFieldValue(['contract_details', 'type_content_ids']);
                          // form?.setFieldsValue({
                          //   contract_details: { type_content_ids: ids ? ids.concat(id) : [id] },
                          // });
                          // form?.setFieldsValue({
                          //   contract_details: { type_content_id: id },
                          // });
                        }}
                        name={['other_documents', 'content_id']}
                        multiple
                      />
                    </Col>
                  </Row>
                </>
              )}
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default connect(({ product }) => ({
  contractTypeList: product.contractTypeList,
}))(AddProductAccessory);
