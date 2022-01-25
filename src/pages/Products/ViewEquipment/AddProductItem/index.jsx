/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Select, Checkbox } from 'antd';
import { connect, useParams } from 'umi';
import classNames from 'classnames';
import moment from 'moment';
import { debounce } from 'lodash';
import { UploadOutlined } from '@ant-design/icons';
import TextInput from '@/components/FormComponents/TextInput';
import SelectDate from '@/components/FormComponents/SelectDate';
import SelectInput from '@/components/FormComponents/SelectInput';
import { checkExistingProduct } from '@/services/product';
import styles from '../AddProductMerchandise/index.less';
import UploadFormContent from '../UploadFormContent';

const AddProductItem = ({
  visible,
  subTypeSearch,
  setVisible,
  currentUser,
  setSelectedProduct,
  brandSearch,
  typeSearch,
  itemProductType,
  merchandiseBrandsList,
  itemProductSubType,
  dispatch,
  form,
  setCompanyDetails,
  ProductModel,
  setShowOtherOptionError,
  othervalue,
  setOtherOptions,
  otherOptions,
  selectedOption,
  setothervalue,
  setSelectedOption,
  showOtherOptionError,
  updateItemInfo,
  productDetail,
}) => {
  const [selectedSubModel, setSelectedSubModel] = useState('');
  const { serialNumberId } = useParams();
  const [hasSerialNumber, setHasSerialNumber] = useState(false);
  const [uploadContentModel, setUploadContentModel] = useState(false);
  const [docUploadName, setDocUploadName] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [itemInstallationDetailsFilelist, setItemInstallationDetailsFilelist] = useState([]);
  const [itemSerialNumberFilelist, setItemSerialNumberFilelist] = useState([]);
  const [itemInstallationDetailsContentInfo, setItemInstallationDetailsContentInfo] = useState([]);
  const [itemSerialNumberContentInfo, setItemSerialNumberContentInfo] = useState([]);

  function disabledDate(current) {
    return current > moment().endOf('day');
  }

  const findProductModel = (value) => {
    if (selectedSubModel || updateItemInfo?.sub_type?.id) {
      dispatch({
        type: 'product/getProductModel',
        payload: {
          query: {
            sub_type_id:
              updateItemInfo?.sub_type?.id && !selectedSubModel
                ? updateItemInfo?.sub_type?.id
                : selectedSubModel,
            purpose_type_id: 'PRODUCT_ITEM',
            keyword: value,
          },
        },
      });
    }
  };

  useEffect(() => {
    if (updateItemInfo?.sub_type?.id) {
      setSelectedSubModel('');
    }
  }, [updateItemInfo]);
  const getProductItemDraft = () => {
    dispatch({
      type: 'product/getProductItemDrafts',
      payload: {
        is_draft: productDetail?.is_draft,
        is_variant: 'Y',
        parent_product_id: serialNumberId,
        assoc_type_id: 'PRODUCT_ITEM',
        customer_id: currentUser?.personal_details?.organization_details?.org_party_id,
      },
    });
  };

  const uploadContent = (content) => {
    dispatch({
      type: 'product/uploadContent',
      payload: {
        pathParams: {
          productId: updateItemInfo?.serial_number,
        },
        body: content,
      },
    }).then((res) => {
      if (res?.contentId) {
        dispatch({
          type: 'product/getMerchandiseDocuments',
          payload: {
            pathParams: {
              productId: updateItemInfo?.serial_number,
            },
          },
        });
      }
    });
  };
  useEffect(() => findProductModel(), [selectedSubModel, updateItemInfo]);
  const modelSearch = debounce(findProductModel, 400);

  useEffect(() => {
    if (updateItemInfo) {
      form.setFieldsValue({
        ...updateItemInfo,
        brand_info_item: {
          id: updateItemInfo?.brand_id ? updateItemInfo?.brand_id : '',
        },
        type_info_item: {
          ...updateItemInfo?.type,
          id: updateItemInfo?.type ? updateItemInfo?.type?.id : '',
        },
        sub_type_item: {
          ...updateItemInfo.sub_type,
          sub_type_id: updateItemInfo?.sub_type ? updateItemInfo?.sub_type?.id : '',
        },
        model_name_item: {
          ...updateItemInfo.model,
          id: updateItemInfo?.model ? updateItemInfo?.model?.id : '',
        },
        installation_item_details: {
          ...updateItemInfo.installation_date,
          installation_date: updateItemInfo.installation_date
            ? moment(updateItemInfo.installation_date)
            : '',
        },
        serial_number_item: {
          ...updateItemInfo.draft_id,
          serial_number: updateItemInfo?.draft_id,
        },
      });
    }
  }, [updateItemInfo, visible]);

  return (
    <>
      <Form
        form={form}
        onFinish={(values) => {
          const data = {};
          data.customer_id = currentUser?.personal_details?.organization_details?.org_party_id;
          data.brand_info = othervalue.brand
            ? { id: 'OTHER-SUPPLIER', label: othervalue.brand }
            : values?.brand_info_item;
          data.is_variant = true;
          data.parent_product_id = serialNumberId;
          data.product_assoc_type_id = 'PRODUCT_ITEM';
          data.installation_details = {
            ...data.installation_details,
            installation_date: moment(
              values?.installation_item_details?.installation_date,
            ).format(),
            content: values?.installation_item_details?.content,
          };
          data.serial_number_details = {
            ...data.serial_number_details,
            serial_number: !hasSerialNumber ? values?.serial_number_item.serial_number : '',
            content: !hasSerialNumber ? values?.serial_number_item?.content : '',
          };
          data.type = othervalue.productType
            ? { id: 'PT_OTHER', label: othervalue.productType }
            : values?.type_info_item;
          data.sub_type = othervalue.productSubType
            ? {
                sub_type_id: 'PSBT_OTHER',
                label: othervalue.productSubType,
                content_id: values.sub_type_item?.content_id,
              }
            : values?.sub_type_item;
          data.model = othervalue.model
            ? {
                id: 'MDL_OTHER',
                label: othervalue.model,
              }
            : values.model_name_item;

          if (hasSerialNumber) {
            delete data.serial_number_details;
          }

          if (updateItemInfo) {
            if (updateItemInfo?.brand_id === values?.brand_info_item?.id) delete data?.brand_info;

            if (updateItemInfo?.type?.id === values?.type_info_item?.id) delete data?.type;

            if (updateItemInfo?.sub_type?.id === values?.sub_type_item?.sub_type_id)
              delete data.sub_type;

            if (updateItemInfo?.model?.id === values?.model_name_item?.id) delete data?.model;
            if (
              !values.installation_item_details?.installation_date ||
              moment(updateItemInfo?.installation_date).format() ===
                moment(values.installation_item_details?.installation_date).format()
            ) {
              delete data.installation_details;
            }
            if (values?.serial_number_item?.serial_number === updateItemInfo?.draft_id)
              delete data.serial_number_details;
          }

          if (updateItemInfo) {
            dispatch({
              type: 'product/updateDraft',
              payload: {
                pathParams: { productId: updateItemInfo?.serial_number },
                body: { ...data },
              },
            }).then((res) => {
              if (res?.productId) {
                if (form.getFieldValue('itemInstallationDetails') !== undefined) {
                  const installationDetailsUploads = Object.keys(
                    form.getFieldValue('itemInstallationDetails'),
                  )?.map((d, index) => ({
                    ...form.getFieldValue('itemInstallationDetails')[index],
                    document_date:
                      form.getFieldValue('itemInstallationDetails')[index]?.document_date !==
                        undefined &&
                      moment(
                        form.getFieldValue('itemInstallationDetails')[index]?.document_date,
                      ).format(),
                    encoded_file: itemInstallationDetailsFilelist[index],
                    name: itemInstallationDetailsContentInfo[index]?.name,
                    product_content_type_id: 'INSTALLATION_DATE',
                  }));
                  uploadContent(installationDetailsUploads);
                }

                if (form.getFieldValue('itemSerialNumber') !== undefined) {
                  const serialNumberUploads = Object.keys(
                    form.getFieldValue('itemSerialNumber'),
                  )?.map((d, index) => ({
                    ...form.getFieldValue('itemSerialNumber')[index],
                    document_date:
                      form.getFieldValue('itemSerialNumber')[index]?.document_date !== undefined &&
                      moment(form.getFieldValue('itemSerialNumber')[index]?.document_date).format(),
                    encoded_file: itemSerialNumberFilelist[index],
                    name: itemSerialNumberContentInfo[index]?.name,
                    product_content_type_id: 'SERIAL_NUMBER',
                  }));
                  uploadContent(serialNumberUploads);
                }
                form.resetFields();
                setItemInstallationDetailsContentInfo([]);
                setItemSerialNumberContentInfo([]);
                setItemInstallationDetailsFilelist([]);
                setItemSerialNumberFilelist([]);
                form?.setFieldsValue({
                  itemInstallationDetails: '',
                  itemSerialNumber: '',
                });
                setVisible(false);
                getProductItemDraft();
              }
              setHasSerialNumber(false);
            });
          } else {
            dispatch({
              type: 'product/addProductDraftItems',
              payload: data,
            }).then((res) => {
              if (res?.productId) {
                form.resetFields();
                setVisible(false);
                getProductItemDraft();
              }
              setHasSerialNumber(false);
            });
          }
        }}
        colon={false}
      >
        <Row gutter={[24, 0]} className="">
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <div className={classNames('formLabel', styles.textStyles)}>Choose Company</div>
            <SelectInput
              showSearch="true"
              rules={[{ required: true, message: 'Please select the company' }]}
              name={['brand_info_item', 'id']}
              type="brand"
              showOtherOptionError={showOtherOptionError}
              setShowOtherOptionError={setShowOtherOptionError}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              onClear={() => {
                form.setFieldsValue({ type_info_item: '', sub_type_item: '', model_name_item: '' });
              }}
              onChange={() => {
                form.setFieldsValue({ type_info_item: '', sub_type_item: '', model_name_item: '' });
              }}
              onSelect={(value) => {
                setCompanyDetails(value);
                if (value === 'OTHER-SUPPLIER') {
                  setSelectedOption((prev) => ({
                    ...prev,
                    brand: true,
                  }));
                } else {
                  setSelectedOption((prev) => ({
                    ...prev,
                    brand: false,
                  }));
                  setShowOtherOptionError({ brand: false });
                  setothervalue((prev) => ({
                    ...prev,
                    brand: '',
                  }));
                }
              }}
              placeholder="Select Company"
              onSearch={(value) => brandSearch(value)}
              setFields={(data) => {
                setOtherOptions([
                  ...otherOptions,
                  {
                    id: 'brand_info_item',
                    brand_info_item: { label: data, id: 'OTHER-SUPPLIER' },
                  },
                ]);
              }}
            >
              {merchandiseBrandsList?.searchResults?.map((brand) => (
                <Select.Option key={brand?.id} value={brand?.id}>
                  {brand?.name}
                </Select.Option>
              ))}
            </SelectInput>
          </Col>
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <div className={classNames('formLabel', styles.textStyles)}>Product Type</div>
            <SelectInput
              rules={[{ required: true, message: 'Please select the type' }]}
              name={['type_info_item', 'id']}
              placeholder="Select Product type "
              showSearch="true"
              onSearch={(value) => typeSearch(value)}
              setFields={(data) =>
                setOtherOptions([
                  ...otherOptions,
                  {
                    id: 'type_info_item',
                    brand_info_item: { label: data, id: 'PT_OTHER' },
                  },
                ])
              }
              type="productType"
              onClear={() => {
                form.setFieldsValue({ sub_type_item: '', model_name_item: '' });
              }}
              onChange={() => {
                form.setFieldsValue({ sub_type_item: '', model_name_item: '' });
              }}
              showOtherOptionError={showOtherOptionError}
              setShowOtherOptionError={setShowOtherOptionError}
              othervalue={othervalue}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              onSelect={(value) => {
                setSelectedProduct(value);

                if (value === 'PT_OTHER') {
                  setSelectedOption((prev) => ({
                    ...prev,
                    productType: true,
                  }));
                  form?.setFieldsValue({
                    type_info_item: { id: value, label: othervalue.productType },
                  });
                } else {
                  setSelectedOption((prev) => ({
                    ...prev,
                    productType: false,
                  }));
                  setShowOtherOptionError({ productType: false });
                  setothervalue((prev) => ({
                    ...prev,
                    productType: '',
                  }));
                  form?.setFieldsValue({
                    type_info_item: { id: value },
                  });
                }
              }}
            >
              {Array.isArray(itemProductType?.productTypes) &&
                itemProductType?.productTypes?.map((product) => (
                  <Select.Option key={product?.productTypeId} value={product?.productTypeId}>
                    {product?.description}
                  </Select.Option>
                ))}
            </SelectInput>
          </Col>
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <div className={classNames('formLabel', styles.textStyles)}>Sub Type</div>
            <SelectInput
              showSearch="true"
              onSearch={(value) => subTypeSearch(value)}
              rules={[{ required: true, message: 'Please select the sub-type' }]}
              placeholder="Select Sub Type "
              name={['sub_type_item', 'sub_type_id']}
              onClear={() => {
                form.setFieldsValue({ model_name_item: '' });
              }}
              onChange={() => {
                form.setFieldsValue({ model_name_item: '' });
              }}
              setFields={(data) =>
                setOtherOptions([
                  ...otherOptions,
                  {
                    id: 'Product',
                    brand_info_item: { label: data, id: 'PSBT_OTHER' },
                  },
                ])
              }
              type="productSubType"
              showOtherOptionError={showOtherOptionError}
              setShowOtherOptionError={setShowOtherOptionError}
              othervalue={othervalue}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              onSelect={(value) => {
                setSelectedSubModel(value);
                if (value === 'PSBT_OTHER') {
                  setSelectedOption((prev) => ({
                    ...prev,
                    productSubType: true,
                  }));
                  form?.setFieldsValue({
                    sub_type_item: { sub_type_id: value, label: othervalue.productSubType },
                  });
                } else {
                  setSelectedOption((prev) => ({
                    ...prev,
                    productSubType: false,
                  }));
                  setShowOtherOptionError({ productSubType: false });
                  setothervalue((prev) => ({
                    ...prev,
                    productSubType: '',
                  }));
                  form?.setFieldsValue({
                    sub_type_item: { sub_type_id: value },
                  });
                }
              }}
            >
              {Array.isArray(itemProductSubType?.productTypes) &&
                itemProductSubType?.productTypes?.map((product) => (
                  <Select.Option key={product?.productTypeId} value={product?.productTypeId}>
                    {product?.description}
                  </Select.Option>
                ))}
            </SelectInput>
          </Col>
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <div className={classNames('formLabel', styles.textStyles)}>Model</div>
            <SelectInput
              rules={[{ required: true, message: 'Please enter model name' }]}
              name={['model_name_item', 'id']}
              placeholder="Select Model"
              showSearch="true"
              onSearch={(value) => modelSearch(value)}
              type="model"
              showOtherOptionError={showOtherOptionError}
              setShowOtherOptionError={setShowOtherOptionError}
              othervalue={othervalue}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              onSelect={(value) => {
                if (value === 'MDL_OTHER') {
                  setSelectedOption((prev) => ({
                    ...prev,
                    model: true,
                  }));
                  form?.setFieldsValue({
                    model_name_item: { id: value, label: othervalue.model },
                  });
                } else {
                  setSelectedOption((prev) => ({
                    ...prev,
                    model: false,
                  }));
                  setShowOtherOptionError({ model: false });
                  setothervalue((prev) => ({
                    ...prev,
                    model: '',
                  }));
                  form?.setFieldsValue({
                    model_name_item: { id: value },
                  });
                }
              }}
            >
              {ProductModel?.productTypes?.map((model) => (
                <Select.Option key={model?.productTypeId} value={model?.productTypeId}>
                  {model?.description}
                </Select.Option>
              ))}
            </SelectInput>
          </Col>
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <div className={classNames('formLabel', styles.textStyles)}>Installation Date</div>
            <div className="flex ">
              <div className="w-full">
                <SelectDate
                  rules={[{ required: true, message: 'Please select installation date' }]}
                  name={['installation_item_details', 'installation_date']}
                  placeholder="Select First Installation Date"
                  disabledDate={disabledDate}
                />
              </div>
              <div className="">
                <div
                  className="hover:bg-gray-300  bg-blue-600 font-medium px-3 pt-2 pb-1 cursor-pointer rounded-lg border-gray-400 border border-dashed text-center"
                  onClick={() => {
                    setUploadContentModel(true);
                    setUploadStatus('uploadItemInstallationDetails');
                    setDocUploadName('itemInstallationDetails');
                  }}
                >
                  <UploadOutlined
                    style={{ color: 'white', fontSize: '1.4rem' }}
                    className="font-bold "
                  />
                </div>
              </div>
            </div>
          </Col>
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <div className="flex justify-between">
              {!hasSerialNumber && (
                <div className={classNames('formLabel', styles.textStyles)}>Serial No.</div>
              )}
            </div>

            {!hasSerialNumber && (
              <div className="flex ">
                <div className="w-full">
                  <TextInput
                    rules={[
                      { required: true, message: 'Please enter serial number' },
                      () => ({
                        async validator(rule, value) {
                          // eslint-disable-next-line no-restricted-globals
                          if (value && !updateItemInfo) {
                            const resp = await checkExistingProduct({
                              product_id: value,
                            });
                            if (resp.exists) {
                              // eslint-disable-next-line prefer-promise-reject-errors
                              return Promise.reject('Item with serial number already exists');
                            }
                            return Promise.resolve();
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                    name={['serial_number_item', 'serial_number']}
                    placeholder="Enter Serial No."
                  />
                </div>

                <div className="">
                  <div
                    className="w-full hover:bg-gray-300  bg-blue-600 font-medium px-3 pt-2 pb-1 cursor-pointer rounded-lg border-gray-400 border border-dashed text-center"
                    onClick={() => {
                      setUploadContentModel(true);
                      setUploadStatus('uploadItemSerialNumber');
                      setDocUploadName('itemSerialNumber');
                    }}
                  >
                    <UploadOutlined
                      style={{ color: 'white', fontSize: '1.4rem' }}
                      className="font-bold "
                    />
                  </div>
                </div>
              </div>
            )}
          </Col>
        </Row>
        <Checkbox
          checked={hasSerialNumber}
          onChange={() => {
            setHasSerialNumber(!hasSerialNumber);
          }}
        >
          <span className={classNames('formLabel', styles.textStyles)}>
            Don&apos;t have serial number
          </span>
        </Checkbox>
        <UploadFormContent
          form={form}
          name={docUploadName}
          setUploadContentModel={setUploadContentModel}
          setUploadStatus={setUploadStatus}
          uploadStatus={uploadStatus}
          uploadContentModel={uploadContentModel}
          filelist={
            docUploadName === 'itemInstallationDetails'
              ? itemInstallationDetailsFilelist
              : itemSerialNumberFilelist
          }
          setFilelist={
            docUploadName === 'itemInstallationDetails'
              ? setItemInstallationDetailsFilelist
              : setItemSerialNumberFilelist
          }
          contentInfo={
            docUploadName === 'itemInstallationDetails'
              ? itemInstallationDetailsContentInfo
              : itemSerialNumberContentInfo
          }
          setContentInfo={
            docUploadName === 'itemInstallationDetails'
              ? setItemInstallationDetailsContentInfo
              : setItemSerialNumberContentInfo
          }
        />
      </Form>
    </>
  );
};

export default connect(({ product, user }) => ({
  currentUser: user.currentUser,
  merchandiseBrandsList: product.merchandiseBrandsList,
  itemProductType: product.itemProductType,
  itemProductSubType: product.itemProductSubType,
  ProductModel: product.ProductModel,
  productDetail: product?.productDetail,
}))(AddProductItem);
