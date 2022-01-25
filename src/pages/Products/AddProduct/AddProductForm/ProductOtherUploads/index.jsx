import React from 'react';
import { Row, Col, Select } from 'antd';
import SelectInput from '@/components/FormComponents/SelectInput';
import UploadAttachment from '@/components/FormComponents/UploadAttachment';

const { Option } = Select;

const ProductOtherUploads = () => {
  const onSearchHandler = () => {};
  return (
    <div className="bg-white shadow rounded mb-4 border-b">
      <div className="text-blue-900 font-semibold text-xl border-b px-4 py-2">Other Uploads</div>
      <Row gutter={[24, 0]} className="px-6 pt-6">
        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <SelectInput
            rules={[{ required: true, message: 'Please select upload the type' }]}
            label="Upload type"
            placeholder="Select upload type "
            name={['other_document', 'type_id']}
            showSearch="true"
            onSearch={onSearchHandler}
          >
            {Array.isArray([]) &&
              [].map((contract) => (
                <Option key={contract?.id} value={contract?.id}>
                  {contract?.name}
                </Option>
              ))}
          </SelectInput>
        </Col>
        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
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
    </div>
  );
};

export default ProductOtherUploads;
