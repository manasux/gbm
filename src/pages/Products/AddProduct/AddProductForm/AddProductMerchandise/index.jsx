/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import { Modal, Button, Form } from 'antd';
import classNames from 'classnames';
import AddProductItem from '../AddProductItem';
import AddProductAccessories from '../AddProductAccessories';
import styles from './index.less';

const AddProductMerchandise = ({
  visible,
  setVisible,
  status,
  dispatch,
  loadItem,
  loadAccessory,
  updateItemInfo,
  setUpdateItemInfo,
  setUpdateAccessoryInfo,
  updateAccessoryInfo,
  setAddAccessories,
  productDetail,
}) => {
  const [form] = Form.useForm();
  const [showOtherOptionError, setShowOtherOptionError] = useState(false);
  const [selectedOption, setSelectedOption] = useState({});
  const [otherOptions, setOtherOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [companyDetails, setCompanyDetails] = useState('');
  const [othervalue, setothervalue] = useState({});

  const itemBrand = form.getFieldValue('brand_info_item');

  const reqTitle = () => {
    switch (status) {
      case 'productAccessories':
        return 'Add Accessories';
      case 'updateProductItems':
        return 'Edit Item';
      case 'updateProductAccessories':
        return 'Edit Accessory';
      case 'productItems':
        return 'Add Item';
      default:
        break;
    }
  };

  const reqButtonTitle = () => {
    switch (status) {
      case 'productAccessories':
        return 'Add ';
      case 'updateProductItems':
        return 'Update ';
      case 'updateProductAccessories':
        return 'Update ';
      case 'productItems':
        return 'Add ';
      default:
        break;
    }
  };

  const getProductAccessoryList = (value) => {
    dispatch({
      type: 'product/getAccessoryProduct',
      payload: {
        query: {
          keyword: value,
          head_type_id: productDetail?.product?.id,
          purpose_type_id: 'PRODUCT_ACC',
          isVerified: true,
        },
      },
    });
  };

  const productSubTypes = (value) => {
    dispatch({
      type: 'product/getItemSubType',
      payload: {
        query: {
          type_id:
            updateItemInfo?.type?.id && !selectedProduct
              ? updateItemInfo?.type?.id
              : selectedProduct,
          purpose_type_id: 'PRODUCT_ITEM',
          keyword: value,
        },
      },
    });
  };

  const getTypeList = (value) => {
    dispatch({
      type: 'product/getItemType',
      payload: {
        query: {
          brand_id:
            updateItemInfo?.brand_id && !companyDetails ? updateItemInfo?.brand_id : companyDetails,
          purpose_type_id: 'PRODUCT_ITEM',
          keyword: value,
        },
      },
    });
  };
  useEffect(() => {
    if (selectedProduct || updateItemInfo?.type?.id) productSubTypes();
  }, [selectedProduct, updateItemInfo]);

  useEffect(() => {
    if (visible) getProductAccessoryList();
  }, [visible]);

  useEffect(() => {
    if (itemBrand || updateItemInfo?.brand_id) getTypeList();
  }, [itemBrand, updateItemInfo]);
  const accessorySearch = debounce(getProductAccessoryList, 400);
  const typeSearch = debounce(getTypeList, 400);
  const subTypeSearch = debounce(productSubTypes, 400);

  useEffect(() => {
    if (status === 'updateProductItems') {
      setCompanyDetails('');
      setSelectedProduct('');
    }
  }, [status]);
  return (
    <Modal
      title={reqTitle()}
      width={1000}
      centered
      maskClosable={false}
      visible={visible}
      className={styles.modalStyles}
      onCancel={() => {
        form.resetFields();
        setVisible(false);
        setUpdateItemInfo('');
        setUpdateAccessoryInfo('');
      }}
      footer={[
        <div className={classNames('flex justify-end pb-3', styles.btnStyles)} key="footer">
          <div
            className="mx-12 mt-2 cursor-pointer"
            onClick={() => {
              form.resetFields();
              setUpdateItemInfo();
              setVisible(false);
              setUpdateAccessoryInfo();
            }}
          >
            <span className="text-gray-500">Cancel</span>
          </div>
          <div className="mr-4">
            <Button
              loading={status === 'productItems' ? loadItem : loadAccessory}
              size="large"
              onClick={() => form.submit()}
              type="primary"
              className="cursor-pointer text-lg font-semibold"
            >
              {reqButtonTitle()}
            </Button>
          </div>
        </div>,
      ]}
    >
      <div className={styles.container}>
        <div className="px-4">
          {(status === 'productItems' || status === 'updateProductItems') && (
            <AddProductItem
              status={status}
              subTypeSearch={subTypeSearch}
              setSelectedProduct={setSelectedProduct}
              setVisible={setVisible}
              visible={visible}
              setothervalue={setothervalue}
              othervalue={othervalue}
              otherOptions={otherOptions}
              setOtherOptions={setOtherOptions}
              setShowOtherOptionError={setShowOtherOptionError}
              showOtherOptionError={showOtherOptionError}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              form={form}
              typeSearch={typeSearch}
              setCompanyDetails={setCompanyDetails}
              updateItemInfo={updateItemInfo}
            />
          )}
          {(status === 'productAccessories' || status === 'updateProductAccessories') && (
            <AddProductAccessories
              status={status}
              setVisible={setVisible}
              form={form}
              visible={visible}
              accessorySearch={accessorySearch}
              typeSearch={typeSearch}
              setothervalue={setothervalue}
              othervalue={othervalue}
              otherOptions={otherOptions}
              setOtherOptions={setOtherOptions}
              setShowOtherOptionError={setShowOtherOptionError}
              showOtherOptionError={showOtherOptionError}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              updateAccessoryInfo={updateAccessoryInfo}
              setAddAccessories={setAddAccessories}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default connect(({ loading, product }) => ({
  loadItem: loading.effects['product/addProductDraftItems'],
  loadAccessory: loading.effects['product/addProductDraftItems'],
  productDetail: product?.productDetail,
}))(AddProductMerchandise);
