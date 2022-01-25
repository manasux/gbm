import { Modal, Button } from 'antd';
import React, { useEffect } from 'react';
import ProductContractDetails from '../ProductContractDetails';
import { connect } from 'umi';
import moment from 'moment';

const AddProductAfterWarranty = ({
  isAddAfterWarrantyVisible,
  setIsAddAfterWarrantyVisible,
  form,
  updateProductLoading,
  modalType,
  productDetail,
  afterWarrantyRecord,
  setAfterWarrantyRecord,
}) => {
  const handleCancel = () => {
    setIsAddAfterWarrantyVisible(false);
    setAfterWarrantyRecord('');
  };

  useEffect(() => {
    if (afterWarrantyRecord && modalType === 'update') {
      form?.setFieldsValue({
        contract_details: {
          ...afterWarrantyRecord,
          type_id: afterWarrantyRecord?.contractType?.id,
          sub_type_id: afterWarrantyRecord?.contractSubType?.id,
          start_date: afterWarrantyRecord?.startDate ? moment(afterWarrantyRecord?.startDate) : '',
          end_date: afterWarrantyRecord?.endDate ? moment(afterWarrantyRecord?.endDate) : '',

          price: afterWarrantyRecord?.price,
        },
      });
    } else {
      form?.setFieldsValue({
        contract_details: {
          type_id: null,
          sub_type_id: null,
          start_date: '',
          end_date: '',
          period: '',
          pms: '',
          price: '',
        },
      });
    }
  }, [afterWarrantyRecord]);
  return (
    <Modal
      title={
        modalType === 'add'
          ? 'Add After Warranty/Service Contract'
          : 'Update After Warranty/Service Contract'
      }
      width={1000}
      visible={isAddAfterWarrantyVisible}
      onCancel={handleCancel}
      footer={
        <div className="flex justify-end">
          <Button onClick={handleCancel} type="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              form.submit();
            }}
            loading={updateProductLoading}
            type="primary"
          >
            {modalType === 'add' ? 'Add' : 'Update'}
          </Button>
        </div>
      }
    >
      <ProductContractDetails
        form={form}
        productDetail={productDetail}
        isAddAfterWarrantyVisible={isAddAfterWarrantyVisible}
        modalType={modalType}
      />
    </Modal>
  );
};

export default connect(({ loading }) => ({
  updateProductLoading: loading.effects['product/updateDraft'],
}))(AddProductAfterWarranty);
