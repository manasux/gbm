/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import TextInput from '@/components/FormComponents/TextInput';
import React, { useCallback, useEffect, useState } from 'react';
import { Row, Col, Select, Switch, Checkbox, Table, Pagination, Button } from 'antd';
import SelectInput from '@/components/FormComponents/SelectInput';
import { connect, useParams, useLocation } from 'umi';
import moment from 'moment';
import { getPageQuery } from '@/utils/utils';
import classNames from 'classnames';
import NumberInput from '@/components/FormComponents/NumberInput';
import SelectDate from '@/components/FormComponents/SelectDate';
import { checkExistingProduct } from '@/services/product';
import { debounce } from 'lodash';
import ProductExpiryDetails from '../ProductExpiryDetails';
import UploadFormContent from '../UploadFormContent';
import ProductContractDetails from '../ProductContractDetails';
import styles from '../../index.less';
import UploadDocument from '../UploadDocuments';
import { getPathNames } from '@/utils/utils';
import CheckValidation from '@/components/CheckValidation';
import ListWarranty from '../../ListWarranty';
import AddProductWarranty from '../AddProductWarranty';

const ProductDetailsForm = ({
  productDetail,
  dispatch,
  ProductModel,
  departmentList,
  productFamilyList,
  form,
  products,
  hasWarranty,
  setHasWarranty,
  hasContract,
  setHasContract,
  otherOptions,
  setOtherOptions,
  productBrandList,
  othervalue,
  setothervalue,
  ProductType,
  ProductSubType,
  settings,
  serialNumberFilelist,
  setSerialNumberFilelist,
  installationDateFilelist,
  setInstallationDateFilelist,
  warrantyFilelist,
  setWarrantyFilelist,
  pmsFilelist,
  setPmsFilelist,
  contractPeriodFilelist,
  setContractPeriodFilelist,
  serialNumberContentInfo,
  setSerialNumberContentInfo,
  installationDateContentInfo,
  setInstallationDateContentInfo,
  warrantyContentInfo,
  setWarrantyContentInfo,
  pmsContentInfo,
  setPmsContentInfo,
  contractPeriodContentInfo,
  setContractPeriodContentInfo,
  formWarranty,
  currentUser,
}) => {
  const { serialNumberId } = useParams();
  const { pathname } = useLocation();
  const { task } = getPageQuery();
  // uncomment if issues faced in order to fetch details of the product
  // useEffect(() => {
  //   if (serialNumberId)
  //     dispatch({
  //       type: 'product/getProductData',
  //       payload: { pathParams: { productId: serialNumberId } },
  //     });
  // }, []);
  const [selectedOption, setSelectedOption] = useState({});
  const [showOtherOptionError, setShowOtherOptionError] = useState(false);
  const [uploadContentModel, setUploadContentModel] = useState(false);
  const [docUploadName, setDocUploadName] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [pmsHistory, setPmsHistory] = useState(false);
  const familyDetails = form.getFieldValue('family_info');
  const brandDetails = form.getFieldValue('brand_info');
  const productId = form.getFieldValue('product');
  const productType = form.getFieldValue('type');
  const productSubType = form.getFieldValue('sub_type');
  const [selectionType, setSelectionType] = useState('checkbox');
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);
  const [installationDate, setInstallationDate] = useState(null);
  const [isAddWarrantyVisible, setIsAddWarrantyVisible] = useState(false);

  function disabledDate(current) {
    return current > moment().endOf('day');
  }

  useEffect(() => {
    if (productDetail?.product_id === serialNumberId) {
      if (productDetail?.has_warranty === 'Y') setHasWarranty(true);
      if (productDetail?.after_warranty === 'Y') setHasContract(true);
    }
  }, [productDetail, serialNumberId]);

  const emptyProductDetailsState = useCallback(
    () =>
      dispatch({
        type: 'product/setStates',
        payload: null,
        key: 'productDetail',
      }),
    [],
  );

  useEffect(() => {
    if (pathname === '/equipments/add') {
      emptyProductDetailsState();
    }
  }, [pathname]);

  useEffect(() => {
    if ((productDetail && task === 'updateEquipments') || task === 'cloneProductEquipment') {
      form.setFieldsValue({
        ...productDetail,
        family_info: {
          ...productDetail?.family_info,
          id:
            productDetail?.family_info && productFamilyList?.searchResults
              ? productDetail?.family_info?.id
              : '',
        },
        brand_info: {
          ...productDetail?.brand_info,
          id: productDetail?.brand_info ? productDetail?.brand_info?.id : '',
        },
        product: {
          ...productDetail?.product,
          id: productDetail?.product ? productDetail?.product?.id : '',
        },
        type: {
          ...productDetail?.type,
          id: productDetail?.type ? productDetail?.type?.id : '',
        },
        sub_type: {
          ...productDetail?.sub_type,
          id: productDetail?.sub_type ? productDetail?.sub_type?.id : '',
        },
        model: {
          ...productDetail?.model,
          id: productDetail?.model ? productDetail?.model?.id : '',
        },
        serial_number_details: {
          ...productDetail,
          serial_number: task !== 'cloneProductEquipment' ? productDetail?.serial_number : '',
        },
        installation_details: {
          ...productDetail?.installation_date,
          installation_date: productDetail?.installation_date
            ? moment(productDetail?.installation_date)
            : '',
        },
        warranty_details: {
          ...productDetail?.installation_date,
          warranty: productDetail?.warranty ? productDetail?.warranty : '',
        },
        pms_details: {
          ...productDetail?.pms,
          pms: productDetail?.pms ? productDetail?.pms : '',
        },
        warranty_start_date: productDetail?.warranty_start_date
          ? moment(productDetail?.warranty_start_date)
          : '',
        warranty_end_date: productDetail?.warranty_end_date
          ? moment(productDetail?.warranty_end_date)
          : '',
        contract_details: {
          ...productDetail?.contract_details,
          type_id: productDetail?.contract_details?.type?.name,
          sub_type_id: productDetail?.contract_details?.subType?.name,
          start_date: productDetail?.contract_details?.start_date
            ? moment(productDetail?.contract_details?.start_date)
            : '',
          end_date: productDetail?.contract_details?.end_date
            ? moment(productDetail?.contract_details?.end_date)
            : '',
        },
        product_details: {
          ...productDetail?.price,
          product_price: productDetail?.price,
        },
      });
      setInstallationDate(form?.getFieldValue(['installation_details', 'installation_date']));
    }
  }, [productDetail, productFamilyList]);

  const getProductfamilyList = (value) => {
    dispatch({
      type: 'product/getProductfamilyList',
      payload: {
        query: { keyword: value, verified: true },
      },
    });
  };

  const getProductList = (value) => {
    dispatch({
      type: 'product/getProductList',
      payload: {
        query: {
          brand_id: brandDetails?.id,
          purpose_type_id: 'PRODUCT_EQUIP',
          keyword: value,
          isVerified: true,
        },
      },
    });
  };

  const productTypes = (value) => {
    dispatch({
      type: 'product/getProductTypes',
      payload: {
        query: {
          head_type_id: productId?.id,
          purpose_type_id: 'PRODUCT_EQUIP',
          keyword: value,
          isVerified: true,
        },
      },
    });
  };

  const productSubTypes = (value) => {
    dispatch({
      type: 'product/getProductSubTypes',
      payload: {
        query: {
          type_id: productType?.id,
          purpose_type_id: 'PRODUCT_EQUIP',
          keyword: value,
          isVerified: true,
        },
      },
    });
  };

  const getDepartmentList = (value) => {
    dispatch({
      type: 'department/getAllDepartment',
      payload: {
        query: {
          view_size: '10',
          start_index: '0',
          keyword: value,
          isVerified: true,
        },
      },
    });
  };

  const brandList = (value) => {
    dispatch({
      type: 'product/getProductBrands',
      payload: {
        query: {
          keyword: value,
          family_id: familyDetails?.id,
          purpose_type_id: 'PRODUCT_EQUIP',

          verified: true,
        },
      },
    });
  };

  const findProductModel = (value) => {
    dispatch({
      type: 'product/getProductModel',
      payload: {
        query: {
          sub_type_id: productSubType?.id,
          purpose_type_id: 'PRODUCT_EQUIP',
          keyword: value,
          isVerified: true,
        },
      },
    });
  };

  useEffect(() => {
    getProductfamilyList();
    getDepartmentList();
    brandList();
  }, []);

  useEffect(() => {
    if (familyDetails) brandList();
  }, [familyDetails]);
  useEffect(() => {
    if (brandDetails) getProductList();
  }, [brandDetails]);

  useEffect(() => {
    if (productId) productTypes();
  }, [productId]);
  useEffect(() => {
    if (productType) productSubTypes();
  }, [productType]);

  useEffect(() => {
    if (productSubType) findProductModel();
  }, [productSubType]);
  const brandSearch = debounce(brandList, 400);
  const departmentSearch = debounce(getDepartmentList, 400);

  const familySearch = debounce(getProductfamilyList, 400);

  const debounceSearchProduct = debounce(getProductList, 400);
  const debounceSearchTypes = debounce(productTypes, 400);
  const debounceSearchSubTypes = debounce(productSubTypes, 400);
  const debounceSearchModel = debounce(findProductModel, 400);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {},
  };

  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  return (
    <div>
      <div
        className="px-2 border w-full p-1 rounded-lg text-white flex justify-between"
        style={{ backgroundColor: settings.primaryColor, cursor: 'pointer' }}
      >
        <div className="font-semibold my-1 items-center text-xs">Product Description</div>
      </div>
      <div className=" bg-white rounded-lg mb-4 mb-6">
        <Row gutter={[24, 0]} className="px-6 pt-6">
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <div className={classNames('formLabel', styles.textStyles)}>Product Family</div>
            <SelectInput
              disabled={
                productDetail && productDetail?.is_verified && getPathNames()?.includes('view')
              }
              showSearch="true"
              rules={[{ required: true, message: 'Please enter product family' }]}
              name={['family_info', 'id']}
              placeholder="Select Product Family"
              onSearch={(value) => familySearch(value)}
              setFields={(data) =>
                setOtherOptions([
                  ...otherOptions,
                  {
                    id: 'family_info',
                    brand_info: { label: data, id: 'CT_OTHER' },
                  },
                ])
              }
              type="family"
              showOtherOptionError={showOtherOptionError}
              setShowOtherOptionError={setShowOtherOptionError}
              othervalue={othervalue}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              onClear={() => {
                form.setFieldsValue({
                  brand_info: '',
                  product: '',
                  type: '',
                  sub_type: '',
                  model: '',
                });
              }}
              onChange={() => {
                form.setFieldsValue({
                  brand_info: '',
                  product: '',
                  type: '',
                  sub_type: '',
                  model: '',
                });
              }}
              onSelect={(value) => {
                if (value === 'CT_OTHER') {
                  setSelectedOption((prev) => ({
                    ...prev,
                    family: true,
                  }));
                  form?.setFieldsValue({
                    family_info: { id: value, label: othervalue.family },
                  });
                } else {
                  setSelectedOption((prev) => ({
                    ...prev,
                    family: false,
                  }));
                  setShowOtherOptionError({ family: false });
                  setothervalue((prev) => ({
                    ...prev,
                    family: '',
                  }));
                  form?.setFieldsValue({
                    family_info: { id: value },
                  });
                }
              }}
            >
              {Array.isArray(productFamilyList?.searchResults) &&
                productFamilyList?.searchResults?.map((family) => (
                  <Select.Option key={family?.id} value={family?.id}>
                    {family?.name}
                  </Select.Option>
                ))}
            </SelectInput>
          </Col>

          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <div className={classNames('formLabel', styles.textStyles)}>Choose Company</div>
            <SelectInput
              disabled={
                productDetail && productDetail?.is_verified && getPathNames()?.includes('view')
              }
              onChange={() => {
                form.setFieldsValue({
                  product: '',
                  type: '',
                  sub_type: '',
                  model: '',
                });
              }}
              onClear={() => {
                form.setFieldsValue({
                  product: '',
                  type: '',
                  sub_type: '',
                  model: '',
                });
              }}
              showSearch="true"
              rules={[{ required: true, message: 'Please select the company' }]}
              name={['brand_info', 'id']}
              type="brand"
              showOtherOptionError={showOtherOptionError}
              setShowOtherOptionError={setShowOtherOptionError}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              onSelect={(value) => {
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
                }
              }}
              placeholder="Select Company"
              onSearch={(value) => brandSearch(value)}
              setFields={(data) => {
                setOtherOptions([
                  ...otherOptions,
                  {
                    id: 'brand_info',
                    brand_info: { label: data, id: 'OTHER-SUPPLIER' },
                  },
                ]);
              }}
            >
              {productBrandList?.searchResults?.map((brand) => (
                <Select.Option key={brand?.id} value={brand?.id}>
                  {brand?.name}
                </Select.Option>
              ))}
            </SelectInput>
          </Col>

          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <div className={classNames('formLabel', styles.textStyles)}>Choose Product</div>
            <SelectInput
              disabled={
                productDetail && productDetail?.is_verified && getPathNames()?.includes('view')
              }
              rules={[{ required: true, message: 'Please enter product name' }]}
              name={['product', 'id']}
              placeholder="Select Product"
              showSearch="true"
              setFields={(data) =>
                setOtherOptions([
                  ...otherOptions,
                  {
                    id: 'product',
                    brand_info: { label: data, id: 'PRD_OTHER' },
                  },
                ])
              }
              onChange={() => {
                form.setFieldsValue({ type: '', sub_type: '', model: '' });
              }}
              onClear={() => {
                form.setFieldsValue({ type: '', sub_type: '', model: '' });
              }}
              type=""
              showOtherOptionError={showOtherOptionError}
              setShowOtherOptionError={setShowOtherOptionError}
              othervalue={othervalue}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              onSelect={(value) => {
                if (value === 'PRD_OTHER') {
                  setSelectedOption((prev) => ({
                    ...prev,
                    product: true,
                  }));
                  form?.setFieldsValue({
                    product_name: { id: value, label: othervalue.product },
                  });
                } else {
                  setSelectedOption((prev) => ({
                    ...prev,
                    product: false,
                  }));
                  setShowOtherOptionError({ product: false });
                  form?.setFieldsValue({
                    product_name: { id: value },
                  });
                }
              }}
              onSearch={(value) => debounceSearchProduct(value)}
            >
              {products?.productTypes?.map((prod) => (
                <Select.Option key={prod?.productTypeId} value={prod?.productTypeId}>
                  {prod?.description}
                </Select.Option>
              ))}
            </SelectInput>
          </Col>

          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <div className={classNames('formLabel', styles.textStyles)}>Product Type</div>
            <SelectInput
              disabled={
                productDetail && productDetail?.is_verified && getPathNames()?.includes('view')
              }
              rules={[{ required: true, message: 'Please select the type' }]}
              onChange={() => {
                form.setFieldsValue({ sub_type: '', model: '' });
              }}
              onClear={() => {
                form.setFieldsValue({ sub_type: '', model: '' });
              }}
              name={['type', 'id']}
              placeholder="Select Product type "
              showSearch="true"
              onSearch={(value) => debounceSearchTypes(value)}
              setFields={(data) =>
                setOtherOptions([
                  ...otherOptions,
                  {
                    id: 'type',
                    brand_info: { label: data, id: 'PT_OTHER' },
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
                if (value === 'PT_OTHER') {
                  setSelectedOption((prev) => ({
                    ...prev,
                    productType: true,
                  }));
                  form?.setFieldsValue({
                    type_info: { id: value, label: othervalue.productType },
                  });
                } else {
                  setSelectedOption((prev) => ({
                    ...prev,
                    productType: false,
                  }));
                  setShowOtherOptionError({ productType: false });
                  form?.setFieldsValue({
                    type_info: { id: value },
                  });
                }
              }}
            >
              {Array.isArray(ProductType?.productTypes) &&
                ProductType?.productTypes?.map((product) => (
                  <Select.Option key={product?.productTypeId} value={product?.productTypeId}>
                    {product?.description}
                  </Select.Option>
                ))}
            </SelectInput>
          </Col>
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <div className={classNames('formLabel', styles.textStyles)}>Sub Type</div>
            <SelectInput
              disabled={
                productDetail && productDetail?.is_verified && getPathNames()?.includes('view')
              }
              showSearch="true"
              onSearch={(value) => debounceSearchSubTypes(value)}
              rules={[{ required: true, message: 'Please select the sub-type' }]}
              placeholder="Select Sub Type "
              name={['sub_type', 'id']}
              onChange={() => {
                form.setFieldsValue({ model: '' });
              }}
              onClear={() => {
                form.setFieldsValue({ model: '' });
              }}
              setFields={(data) =>
                setOtherOptions([
                  ...otherOptions,
                  {
                    id: 'Product',
                    brand_info: { label: data, id: 'PSBT_OTHER' },
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
                if (value === 'PSBT_OTHER') {
                  setSelectedOption((prev) => ({
                    ...prev,
                    productSubType: true,
                  }));
                  form?.setFieldsValue({
                    sub_type_details: {
                      sub_type_id: value,
                      label: othervalue.productSubType,
                    },
                  });
                } else {
                  setSelectedOption((prev) => ({
                    ...prev,
                    productSubType: false,
                  }));
                  setShowOtherOptionError({ productSubType: false });
                  form?.setFieldsValue({
                    sub_type_details: { sub_type_id: value },
                  });
                }
              }}
            >
              {Array.isArray(ProductSubType?.productTypes) &&
                ProductSubType?.productTypes?.map((product) => (
                  <Select.Option key={product?.productTypeId} value={product?.productTypeId}>
                    {product?.description}
                  </Select.Option>
                ))}
            </SelectInput>
          </Col>
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <div className={classNames('formLabel', styles.textStyles)}>Model</div>
            <SelectInput
              disabled={
                productDetail && productDetail?.is_verified && getPathNames()?.includes('view')
              }
              rules={[{ required: true, message: 'Please enter model name' }]}
              name={['model', 'id']}
              placeholder="Select Model"
              showSearch="true"
              type="model"
              onSearch={(value) => debounceSearchModel(value)}
              setFields={(data) =>
                setOtherOptions([
                  ...otherOptions,
                  {
                    id: 'model',
                    brand_info: { label: data, id: 'MDL_OTHER' },
                  },
                ])
              }
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
                    model_name: { id: value, label: othervalue.model },
                  });
                } else {
                  setSelectedOption((prev) => ({
                    ...prev,
                    model: false,
                  }));
                  setShowOtherOptionError({ model: false });
                  form?.setFieldsValue({
                    model_name: { id: value },
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
            <div className={classNames('formLabel', styles.textStyles)}>
              Serial No.{' '}
              <span className={classNames(' bg-gray-200 rounded px-2 text-blue-700', styles.info)}>
                <i>i</i>
              </span>
            </div>
            <div className="flex ">
              <div className="w-full">
                <TextInput
                  disabled={
                    productDetail && productDetail?.is_verified && getPathNames()?.includes('view')
                  }
                  rules={[
                    { required: true, message: 'Please enter serial number' },
                    () => ({
                      async validator(rule, value) {
                        if (
                          value === productDetail?.serial_number &&
                          task !== 'cloneProductEquipment'
                        ) {
                          return Promise.resolve();
                        }
                        if (value) {
                          const resp = await checkExistingProduct({
                            product_id: value,
                          });
                          if (resp.exists) {
                            if (
                              !task ||
                              task === 'cloneProductEquipment' ||
                              (task === 'updateEquipments' && value !== productDetail)
                            )
                              // eslint-disable-next-line prefer-promise-reject-errors
                              return Promise.reject(
                                'Product with this serial number already exists',
                              );
                          }
                          return Promise.resolve();
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                  name={['serial_number_details', 'serial_number']}
                  placeholder="Enter Serial No."
                />
              </div>
            </div>
          </Col>

          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <div className={classNames('formLabel', styles.textStyles)}>Department</div>
            <SelectInput
              disabled={
                productDetail && productDetail?.is_verified && getPathNames()?.includes('view')
              }
              rules={[{ required: true, message: 'Please enter department name' }]}
              name={['department_info', 'id']}
              placeholder="Select Department"
              showSearch="true"
              onSearch={(value) => departmentSearch(value)}
              setFields={(data) =>
                setOtherOptions([
                  ...otherOptions,
                  {
                    id: 'department_info',
                    brand_info: { label: data, id: 'DEPT_OTHER' },
                  },
                ])
              }
              type="department"
              showOtherOptionError={showOtherOptionError}
              setShowOtherOptionError={setShowOtherOptionError}
              othervalue={othervalue}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              onSelect={(value) => {
                if (value === 'DEPT_OTHER') {
                  setSelectedOption((prev) => ({
                    ...prev,
                    department: true,
                  }));
                  form?.setFieldsValue({
                    department_info: {
                      id: value,
                      label: othervalue.department,
                    },
                  });
                } else {
                  setSelectedOption((prev) => ({
                    ...prev,
                    department: false,
                  }));
                  setShowOtherOptionError({ department: false });
                  form?.setFieldsValue({
                    department_info: { id: value },
                  });
                }
              }}
            >
              {Array.isArray(departmentList?.departments) &&
                departmentList?.departments?.map((department) => (
                  <Select.Option key={department?.id} value={department?.id}>
                    {department?.name}
                  </Select.Option>
                ))}
            </SelectInput>
          </Col>
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <div className={classNames('formLabel', styles.textStyles)}>
              Installation Date{' '}
              <span className={classNames(' bg-gray-200 rounded px-2 text-blue-700', styles.info)}>
                <i>i</i>
              </span>
            </div>
            <div className="flex ">
              <div className="w-full">
                <SelectDate
                  disabled={
                    productDetail && productDetail?.is_verified && getPathNames()?.includes('view')
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Please select installation date',
                    },
                  ]}
                  name={['installation_details', 'installation_date']}
                  placeholder="Select First Installation Date"
                  disabledDate={disabledDate}
                  onChange={() =>
                    setInstallationDate(
                      form?.getFieldValue(['installation_details', 'installation_date']),
                    )
                  }
                />
              </div>
            </div>
          </Col>

          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <div className={classNames('formLabel', styles.textStyles)}>
              Product Price{' '}
              <span className={classNames(' bg-gray-200 rounded px-2 text-blue-700', styles.info)}>
                <i>i</i>
              </span>
            </div>
            <NumberInput
              isDisabled={
                productDetail && productDetail?.is_verified && getPathNames()?.includes('view')
              }
              rules={[{ required: true, message: 'Please enter product price' }]}
              name={['product_details', 'product_price']}
              placeholder="Product Price"
              form={form}
              min={0}
            />
          </Col>
        </Row>
      </div>
      {task === 'cloneProductEquipment' && (
        <div className="mb-2">
          <Checkbox
            checked={hasWarranty}
            onChange={() => {
              setHasWarranty(!hasWarranty);
            }}
          >
            <span className={classNames('formLabel', styles.textStyles)}>
              Do You want to Clone hasWarranty
            </span>
          </Checkbox>
        </div>
      )}
      <div
        className="px-2 border w-full p-1 rounded-lg text-white flex justify-between"
        onClick={() => {
          if (installationDate && productDetail === null) {
            setHasWarranty(!hasWarranty);
          } else if (installationDate && productDetail?.has_warranty === 'Y') {
            setHasWarranty(!hasWarranty);
          }
        }}
        style={{ backgroundColor: settings.primaryColor, cursor: 'pointer' }}
      >
        <div className="font-semibold my-1 items-center text-xs">
          Has warranty
          <span className={classNames(' ml-1 bg-gray-200 rounded px-2 text-blue-700', styles.info)}>
            <i>i</i>
          </span>
        </div>
        <span className="flex justify-between items-center">
          <CheckValidation show={productDetail?.has_warranty === 'N' && productDetail?.is_verified}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setIsAddWarrantyVisible(true);
                setHasWarranty(true);
              }}
              type="ghost"
              shape="round"
              size="small"
              style={{ color: 'white', borderColor: 'white', marginRight: '24px' }}
            >
              <span className="color-gray-300 mx-2"> Add warranty</span>
            </Button>
          </CheckValidation>
          <Switch
            style={{ background: hasWarranty ? '#3CB371' : '#c9ced6' }}
            size="small"
            checked={hasWarranty}
            onClick={() =>
              productDetail?.has_warranty === 'Y' ? setHasWarranty(!hasWarranty) : ''
            }
            disabled={!installationDate}
          />
        </span>
      </div>
      <div>
        <CheckValidation
          show={productDetail && productDetail?.is_verified && getPathNames()?.includes('view')}
          fallback={
            hasWarranty && (
              <ProductExpiryDetails
                form={form}
                warrantyFilelist={warrantyFilelist}
                setWarrantyFilelist={setWarrantyFilelist}
                pmsFilelist={pmsFilelist}
                setPmsFilelist={setPmsFilelist}
                warrantyContentInfo={warrantyContentInfo}
                setWarrantyContentInfo={setWarrantyContentInfo}
                pmsContentInfo={pmsContentInfo}
                setPmsContentInfo={setPmsContentInfo}
              />
            )
          }
        >
          {hasWarranty && <ListWarranty productDetail={productDetail} />}
        </CheckValidation>
      </div>
      {task === 'cloneProductEquipment' && (
        <div className="mt-4 mb-1">
          <Checkbox
            checked={hasContract}
            onChange={() => {
              setHasContract(!hasContract);
            }}
          >
            <span className={classNames('formLabel', styles.textStyles)}>
              Do You want to Clone After Warranty/Service Contract
            </span>
          </Checkbox>
        </div>
      )}

      <div
        className="mt-2 px-2 border w-full p-1 rounded-lg text-white flex justify-between"
        style={{ backgroundColor: settings.primaryColor, cursor: 'pointer' }}
        onClick={() => installationDate && setHasContract(!hasContract)}
      >
        <div className="font-semibold my-1 text-xs">
          After Warranty/Service Contract{' '}
          <span className={classNames(' ml-1 bg-gray-200 rounded px-2 text-blue-700', styles.info)}>
            <i>i</i>
          </span>
        </div>
        <div className="">
          <Switch
            style={{ background: hasContract ? '#3CB371' : '#c9ced6' }}
            size="small"
            checked={hasContract}
            onClick={setHasContract}
            disabled={!installationDate}
          />
        </div>
      </div>
      <div>
        {hasContract && (
          <ProductContractDetails
            form={form}
            contractPeriodFilelist={contractPeriodFilelist}
            setContractPeriodFilelist={setContractPeriodFilelist}
            contractPeriodContentInfo={contractPeriodContentInfo}
            setContractPeriodContentInfo={setContractPeriodContentInfo}
          />
        )}
      </div>
      <AddProductWarranty
        isAddWarrantyVisible={isAddWarrantyVisible}
        setIsAddWarrantyVisible={setIsAddWarrantyVisible}
        formWarranty={formWarranty}
        setHasWarranty={setHasWarranty}
        form={form}
      />
      {productDetail && task === 'updateEquipments' && (
        <div className="mt-4 flex justify-between">
          <UploadDocument docTypeName="Upload Installation Report" status="main_doc" />

          <UploadDocument docTypeName="Upload Product Invoice" status="main_doc" />

          <UploadDocument docTypeName="Upload Machine's Photo" status="main_doc" />
        </div>
      )}

      <UploadFormContent
        form={form}
        name={docUploadName}
        setUploadContentModel={setUploadContentModel}
        setUploadStatus={setUploadStatus}
        uploadStatus={uploadStatus}
        uploadContentModel={uploadContentModel}
        filelist={
          docUploadName === 'serialNumber' ? serialNumberFilelist : installationDateFilelist
        }
        setFilelist={
          docUploadName === 'serialNumber' ? setSerialNumberFilelist : setInstallationDateFilelist
        }
        contentInfo={
          docUploadName === 'serialNumber' ? serialNumberContentInfo : installationDateContentInfo
        }
        setContentInfo={
          docUploadName === 'serialNumber'
            ? setSerialNumberContentInfo
            : setInstallationDateContentInfo
        }
      />
    </div>
  );
};

export default connect(({ product, department, user, settings }) => ({
  productFamilyList: product.productFamilyList,
  departmentList: department.departmentList,
  productBrandList: product.brandsList,
  currentUser: user.currentUser,
  productDetail: product.productDetail,
  products: product.ProductList,
  ProductType: product.ProductType,
  ProductModel: product.ProductModel,
  ProductSubType: product.ProductSubType,
  pmsHistoryDetails: product.pmsHistory,
  settings,
}))(ProductDetailsForm);
