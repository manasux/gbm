import React, { useState, useEffect } from 'react';
import NumberInput from '@/components/FormComponents/NumberInput';
import { Modal, Row, Col, Form, Button } from 'antd';
import SelectDate from '@/components/FormComponents/SelectDate';
import styles from './index.less';
import ProductExpiryDetails from '../ProductExpiryDetails';
import moment from 'moment';
import { connect } from 'umi';

const AddProductWarranty = ({
  productDetail,
  isAddWarrantyVisible,
  setIsAddWarrantyVisible,
  setHasWarranty,
  form,
  updateProductLoading,
}) => {
  useEffect(() => {
    if (isAddWarrantyVisible && productDetail && productDetail?.has_warranty === 'Y') {
      form?.setFieldsValue({
        warranty_details: { warranty: productDetail?.warranty },
        pms_details: { pms: productDetail?.pms },
        warranty_start_date: moment(productDetail?.warranty_start_date),
        warranty_end_date: moment(productDetail?.warranty_end_date),
      });
    }
  }, [productDetail, isAddWarrantyVisible]);
  const handleCancel = () => {
    setIsAddWarrantyVisible(false);
    setHasWarranty(false);
  };

  return (
    <Modal
      title={productDetail?.has_warranty === 'N' ? 'Add Warranty' : 'Update Warranty'}
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
            {productDetail?.has_warranty === 'N' ? 'Add' : 'Update'}
          </Button>
        </div>
      }
    >
      <ProductExpiryDetails form={form} />
    </Modal>
  );
};

export default connect(({ loading }) => ({
  updateProductLoading: loading.effects['product/updateDraft'],
}))(AddProductWarranty);
