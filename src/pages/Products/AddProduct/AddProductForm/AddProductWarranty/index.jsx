import React, { useState } from 'react';
import NumberInput from '@/components/FormComponents/NumberInput';
import { Modal, Row, Col, Form, Button } from 'antd';
import SelectDate from '@/components/FormComponents/SelectDate';
import styles from './index.less';
import ProductExpiryDetails from '../ProductExpiryDetails';
import moment from 'moment';
import { connect } from 'umi';

const AddProductWarranty = ({
  isAddWarrantyVisible,
  setIsAddWarrantyVisible,
  setHasWarranty,
  formWarranty,
  form,
  updateProductLoading,
}) => {
  const [warrantyValue, setWarrantyValue] = useState(1);

  const handleCancel = () => {
    setIsAddWarrantyVisible(false);
    formWarranty?.setFieldsValue({
      warranty_start_date: '',
      warranty_end_date: '',
    });
    setHasWarranty(false);
  };

  return (
    <Modal
      title="Add Warranty"
      width={1000}
      visible={isAddWarrantyVisible}
      onCancel={handleCancel}
      footer={
        <div className="flex justify-end">
          <Button onClick={handleCancel} type="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              form?.submit();
            }}
            loading={updateProductLoading}
            type="primary"
          >
            Add
          </Button>
        </div>
      }
    >
      <ProductExpiryDetails form={form} />
    </Modal>
  );
};
const mapStateToProps = ({ loading }) => ({
  updateProductLoading: loading?.effects['product/updateDraft'],
});

export default connect(mapStateToProps)(AddProductWarranty);
