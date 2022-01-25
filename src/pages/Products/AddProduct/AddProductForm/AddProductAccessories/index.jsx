/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Select } from 'antd';
import { connect, useParams, useLocation } from 'umi';
import classNames from 'classnames';
import { debounce } from 'lodash';
import moment from 'moment';
import SelectDate from '@/components/FormComponents/SelectDate';
import SelectInput from '@/components/FormComponents/SelectInput';
import TextInput from '@/components/FormComponents/TextInput';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { checkExistingProduct } from '@/services/product';
import styles from '../AddProductMerchandise/index.less';
import UploadFormContent from '../UploadFormContent';

const AddProductAccessories = ({
  status,
  updateAccessoryInfo,
  currentUser,
  dispatch,
  brandSearch,
  typeSearch,
  accessoryProductType,
  merchandiseBrandsList,
  form,
  visible,
  setVisible,
  setShowOtherOptionError,
  othervalue,
  setOtherOptions,
  otherOptions,
  selectedOption,
  setothervalue,
  ProductModel,
  setSelectedOption,
  showOtherOptionError,
  productDetail,
  setAddAccessories,
  accessoryProducts,
}) => {
  const { serialNumberId } = useParams();
  const [selectedType, setSelectedType] = useState('');
  const [companyDetails, setCompanyDetails] = useState('');
  const [uploadContentModel, setUploadContentModel] = useState(false);
  const [docUploadName, setDocUploadName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState();
  const [uploadStatus, setUploadStatus] = useState('');
  const [hasSerialNumber, setHasSerialNumber] = useState(false);
  const [accessoryInstallationDetailsFilelist, setAccessoryInstallationDetailsFilelist] = useState(
    [],
  );
  const { pathname } = useLocation();
  const [
    accessoryInstallationDetailsContentInfo,
    setAccessoryInstallationDetailsContentInfo,
  ] = useState([]);

  const [accSerialNumberFilelist, setaccSerialNumberFilelist] = useState([]);
  const [accSerialNumberContentInfo, setaccSerialNumberContentInfo] = useState([]);

  function disabledDate(current) {
    return current > moment().endOf('day');
  }

  useEffect(() => {
    if (status === 'updateProductAccessories') {
      setCompanyDetails('');
      setSelectedType('');
    }
  }, [status]);

  const getAccessoryType = (value) => {
    dispatch({
      type: 'product/getAccessoryType',
      payload: {
        query: {
          accessoryId: selectedProduct,
          purpose_type_id: 'PRODUCT_ACC',
          keyword: value,
          isVerified: true,
        },
      },
    });
  };
  const getAccessoryProduct = () => {
    dispatch({
      type: 'product/getAccessoryProduct',
      payload: {
        query: {
          brand_id:
            updateAccessoryInfo?.brand_id && !companyDetails
              ? updateAccessoryInfo?.brand_id
              : companyDetails,
          purpose_type_id: 'PRODUCT_ACC',
          isVerified: true,
        },
      },
    });
  };
  const findProductModel = (value) => {
    dispatch({
      type: 'product/getProductModel',
      payload: {
        query: {
          type_id:
            updateAccessoryInfo?.type?.id && !selectedType
              ? updateAccessoryInfo?.type?.id
              : selectedType,
          purpose_type_id: 'PRODUCT_ACC',
          keyword: value,
        },
      },
    });
  };
  useEffect(() => {
    if (selectedType || updateAccessoryInfo?.type?.id) {
      findProductModel();
    }
  }, [selectedType, updateAccessoryInfo]);
  useEffect(() => {
    if (selectedProduct) {
      getAccessoryType();
    }
  }, [selectedProduct]);
  useEffect(() => {
    if (companyDetails || updateAccessoryInfo?.brand_id) {
      getAccessoryProduct();
    }
  }, [companyDetails, updateAccessoryInfo]);

  const modelSearch = debounce(findProductModel, 400);

  const getProductAccessoryDraft = () => {
    dispatch({
      type: 'product/getProductAccessoryDrafts',
      payload: {
        is_draft: productDetail?.is_draft,
        is_variant: 'Y',
        parent_product_id: serialNumberId,
        assoc_type_id: 'PRODUCT_ACCESSORY',
        customer_id: currentUser?.personal_details?.organization_details?.org_party_id,
      },
    });
  };

  useEffect(() => {
    if (updateAccessoryInfo) {
      setSelectedProduct(updateAccessoryInfo?.product?.id);
      form.setFieldsValue({
        ...updateAccessoryInfo,
        brand_info_accessory: {
          id: updateAccessoryInfo?.brand_id ? updateAccessoryInfo?.brand_id : '',
        },
        product_info_accessory: {
          id: updateAccessoryInfo?.product ? updateAccessoryInfo?.product?.id : '',
        },
        type_info_accessory: {
          ...updateAccessoryInfo?.type,
          id: updateAccessoryInfo?.type ? updateAccessoryInfo?.type?.id : '',
        },
        model_name_accessory: {
          ...updateAccessoryInfo.model,
          id: updateAccessoryInfo?.model ? updateAccessoryInfo?.model?.id : '',
        },
        installation_accessory_details: {
          ...updateAccessoryInfo.installation_date,
          installation_date: updateAccessoryInfo.installation_date
            ? moment(updateAccessoryInfo.installation_date)
            : '',
        },
        serial_number_Acc: {
          ...updateAccessoryInfo.serial_number,
          serial_number: updateAccessoryInfo?.serial_number,
        },
      });
    }
  }, [updateAccessoryInfo, visible]);

  const uploadContent = (content) => {
    dispatch({
      type: 'product/uploadContent',
      payload: {
        pathParams: {
          productId: updateAccessoryInfo?.serial_number,
        },
        body: content,
      },
    }).then((res) => {
      if (res?.contentId) {
        dispatch({
          type: 'product/getMerchandiseDocuments',
          payload: {
            pathParams: {
              productId: updateAccessoryInfo?.serial_number,
            },
          },
        });
      }
    });
  };
  const fetchActivities = () => {
    dispatch({
      type: 'product/getActivities',
      payload: {
        pathParams: { productId: serialNumberId || pathname.split('drafts/')[1] },
      },
    });
  };

  const getSharedDocs = () => {
    if (serialNumberId) {
      dispatch({
        type: 'product/getSharedDocuments',
        payload: {
          pathParams: {
            productId: serialNumberId,
          },
          query: {
            document_type: 'SHARED_DOC',
          },
        },
      });
    }
  };
  return (
    <>
      <Form
        form={form}
        onFinish={(values) => {
          const data = {};
          data.customer_id = currentUser?.personal_details?.organization_details?.org_party_id;
          data.brand_info = othervalue?.brand
            ? { id: 'OTHER-SUPPLIER', label: othervalue?.brand }
            : values.brand_info_accessory;
          data.is_variant = true;
          data.parent_product_id = serialNumberId;
          data.product_assoc_type_id = 'PRODUCT_ACCESSORY';
          data.installation_details = {
            ...data.installation_details,
            installation_date: moment(
              values.installation_accessory_details.installation_date,
            ).format(),
            content: values?.installation_accessory_details?.content,
          };

          data.serial_number_details = {
            ...data.serial_number_details,
            serial_number: !hasSerialNumber ? values?.serial_number_Acc.serial_number : '',
          };

          data.type = othervalue.productType
            ? { id: 'PT_OTHER', label: othervalue.productType }
            : values.type_info_accessory;
          data.model = othervalue.model
            ? {
                id: 'MDL_OTHER',
                label: othervalue.model,
              }
            : values.model_name_accessory;
          if (hasSerialNumber) {
            delete data.serial_number_details;
          }
          if (updateAccessoryInfo) {
            if (updateAccessoryInfo?.brand_id === values?.brand_info_accessory?.id)
              delete data?.brand_info;

            if (updateAccessoryInfo?.type?.id === values?.type_info_accessory?.id)
              delete data?.type;

            if (updateAccessoryInfo?.model?.id === values?.model_name_accessory?.id)
              delete data?.model;
            if (
              !values.installation_accessory_details?.installation_date ||
              moment(updateAccessoryInfo?.installation_date).format() ===
                moment(values.installation_accessory_details?.installation_date).format()
            ) {
              delete data.installation_details;
            }
            if (values?.serial_number_Acc?.serial_number === updateAccessoryInfo?.serial_number)
              delete data.serial_number_details;
          }

          if (updateAccessoryInfo) {
            dispatch({
              type: 'product/updateDraft',
              payload: {
                pathParams: { productId: updateAccessoryInfo?.product_id },
                body: { ...data },
              },
            }).then((res) => {
              if (res?.productId) {
                if (form.getFieldValue('accessoryInstallationDetails') !== undefined) {
                  const accessoryInstallationDetailsUploads = Object.keys(
                    form.getFieldValue('accessoryInstallationDetails'),
                  )?.map((d, index) => ({
                    ...form.getFieldValue('accessoryInstallationDetails')[index],
                    document_date:
                      form.getFieldValue('accessoryInstallationDetails')[index]?.document_date !==
                        undefined &&
                      moment(
                        form.getFieldValue('accessoryInstallationDetails')[index]?.document_date,
                      ).format(),
                    encoded_file: accessoryInstallationDetailsFilelist[index],
                    name: accessoryInstallationDetailsContentInfo[index]?.name,
                    product_content_type_id: 'INSTALLATION_DATE',
                  }));
                  uploadContent(accessoryInstallationDetailsUploads);
                }

                if (form.getFieldValue('accessoriesSerialNumber') !== undefined) {
                  const serialNumberUploads = Object.keys(
                    form.getFieldValue('accessoriesSerialNumber'),
                  )?.map((d, index) => ({
                    ...form.getFieldValue('accessoriesSerialNumber')[index],
                    document_date:
                      form.getFieldValue('accessoriesSerialNumber')[index]?.document_date !==
                        undefined &&
                      moment(
                        form.getFieldValue('accessoriesSerialNumber')[index]?.document_date,
                      ).format(),
                    encoded_file: accSerialNumberFilelist[index],
                    name: accSerialNumberContentInfo[index]?.name,
                    product_content_type_id: 'SERIAL_NUMBER',
                  }));
                  uploadContent(serialNumberUploads);
                }

                form.resetFields();
                setAccessoryInstallationDetailsContentInfo([]);
                setaccSerialNumberContentInfo([]);
                setAccessoryInstallationDetailsFilelist([]);
                setaccSerialNumberFilelist([]);
                form?.setFieldsValue({
                  accessoryInstallationDetails: '',
                  accessoriesSerialNumber: '',
                });
                setVisible(false);
                getProductAccessoryDraft();
              }
              fetchActivities();
              getSharedDocs();
            });
          } else {
            dispatch({
              type: 'product/addProductDraftItems',
              payload: data,
            }).then((res) => {
              if (res?.productId) {
                form.resetFields();
                setVisible(false);
                setAddAccessories(true);
                getProductAccessoryDraft();
              }
              setHasSerialNumber(false);
              fetchActivities();
            });
          }
        }}
        colon={false}
      >
        <Row gutter={[24, 0]} className="">
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <div className={classNames('formLabel', styles.textStyles)}>Accessory Name</div>
            <SelectInput
              rules={[{ required: true, message: 'Please select the type' }]}
              name={['product_info_accessory', 'id']}
              placeholder="Select Accessary name "
              showSearch="true"
              onChange={() => {
                form.setFieldsValue({ type_info_accessory: '' });
                form.setFieldsValue({ model_name_accessory: '' });
              }}
              onClear={() => {
                form.setFieldsValue({ type_info_accessory: '' });
                form.setFieldsValue({ model_name_accessory: '' });
              }}
              setFields={(data) =>
                setOtherOptions([
                  ...otherOptions,
                  {
                    id: 'product_info_accessory',
                    brand_info_accessory: { label: data, id: 'PT_OTHER' },
                  },
                ])
              }
              type="product"
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
                    product_info_accessory: { id: value, label: othervalue.product },
                  });
                } else {
                  setSelectedOption((prev) => ({
                    ...prev,
                    product: false,
                  }));
                  setShowOtherOptionError({ product: false });
                  setothervalue((prev) => ({
                    ...prev,
                    product: '',
                  }));
                  form?.setFieldsValue({
                    product_info_accessory: { id: value },
                  });
                }
              }}
            >
              {Array.isArray(accessoryProducts?.productTypes) &&
                accessoryProducts?.productTypes?.map((product) => (
                  <Select.Option key={product?.productTypeId} value={product?.productTypeId}>
                    {product?.description}
                  </Select.Option>
                ))}
            </SelectInput>
          </Col>
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <div className={classNames('formLabel', styles.textStyles)}>Accessory Type</div>
            <SelectInput
              rules={[{ required: true, message: 'Please select the type' }]}
              name={['type_info_accessory', 'id']}
              placeholder="Select Accessary type "
              showSearch="true"
              onChange={() => {
                form.setFieldsValue({ model_name_accessory: '' });
              }}
              onClear={() => {
                form.setFieldsValue({ model_name_accessory: '' });
              }}
              onSearch={(value) => typeSearch(value)}
              setFields={(data) =>
                setOtherOptions([
                  ...otherOptions,
                  {
                    id: 'type_info_accessory',
                    brand_info_accessory: { label: data, id: 'PT_OTHER' },
                  },
                ])
              }
              type="productType"
              showOtherOptionError={showOtherOptionError}
              setShowOtherOptionError={setShowOtherOptionError}
              othervalue={othervalue}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              onSelect={(value) => {
                setSelectedType(value);
                if (value === 'PT_OTHER') {
                  setSelectedOption((prev) => ({
                    ...prev,
                    productType: true,
                  }));
                  form?.setFieldsValue({
                    type_info_accessory: { id: value, label: othervalue.productType },
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
                    type_info_accessory: { id: value },
                  });
                }
              }}
            >
              {selectedProduct &&
                Array.isArray(accessoryProductType?.productTypes) &&
                accessoryProductType?.productTypes?.map((product) => (
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
              name={['model_name_accessory', 'id']}
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
                    model_name_accessory: { id: value, label: othervalue.model },
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
                    model_name_accessory: { id: value },
                  });
                }
              }}
            >
              {Array.isArray(ProductModel?.productTypes) &&
                ProductModel?.productTypes?.map((product) => (
                  <Select.Option key={product?.productTypeId} value={product?.productTypeId}>
                    {product?.description}
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
                  name={['installation_accessory_details', 'installation_date']}
                  placeholder="Select First Installation Date"
                  disabledDate={disabledDate}
                />
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
                          if (value && !updateAccessoryInfo) {
                            const resp = await checkExistingProduct({
                              product_id: value,
                            });
                            if (resp.exists) {
                              // eslint-disable-next-line prefer-promise-reject-errors
                              return Promise.reject('Accessory with serial number already exists');
                            }
                            return Promise.resolve();
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                    name={['serial_number_Acc', 'serial_number']}
                    placeholder="Enter Serial No."
                  />
                </div>
              </div>
            )}
          </Col>
        </Row>
        {!updateAccessoryInfo && (
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
        )}

        <UploadFormContent
          form={form}
          name={docUploadName}
          setUploadContentModel={setUploadContentModel}
          setUploadStatus={setUploadStatus}
          uploadStatus={uploadStatus}
          uploadContentModel={uploadContentModel}
          filelist={
            docUploadName === 'accessoryInstallationDetails'
              ? accessoryInstallationDetailsFilelist
              : accSerialNumberFilelist
          }
          setFilelist={
            docUploadName === 'accessoryInstallationDetails'
              ? setAccessoryInstallationDetailsFilelist
              : setaccSerialNumberFilelist
          }
          contentInfo={
            docUploadName === 'accessoryInstallationDetails'
              ? accessoryInstallationDetailsContentInfo
              : accSerialNumberContentInfo
          }
          setContentInfo={
            docUploadName === 'accessoryInstallationDetails'
              ? setAccessoryInstallationDetailsContentInfo
              : setaccSerialNumberContentInfo
          }
        />
      </Form>
    </>
  );
};

export default connect(({ product, user }) => ({
  accessoryProducts: product.accessoryProducts,
  accessoryProductType: product.accessoryProductType,
  currentUser: user.currentUser,
  ProductModel: product.ProductModel,
  productDetail: product?.productDetail,
}))(AddProductAccessories);
