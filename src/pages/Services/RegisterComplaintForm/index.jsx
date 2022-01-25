import SelectInput from '@/components/FormComponents/SelectInput';
import { Button, Col, Row, Form, Select, message } from 'antd';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { connect, history } from 'umi';
import { debounce } from 'lodash';
import TextArea from 'antd/lib/input/TextArea';
import notebook from '../../../assets/file-types/contract@3x.png';
import UploadDocuments from './UploadDocuments';
import styles from '../index.less';
import { EyeFilled } from '@ant-design/icons';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';

const RegisterComplaintForm = ({
  dispatch,
  currentUser,
  verified,
  verifiedAccessory,
  loading,
  userDetail,
}) => {
  // *** Unique list States
  const [selectedBrand, setSelectBrand] = useState();
  const [selectedProduct, setSelectedProduct] = useState();
  const [department, setDepartment] = useState();
  const [selectedAccType, setSelectedAccType] = useState([]);
  // *****

  const [form] = Form.useForm();
  const [brandId, setBrandId] = useState();
  const [categoryId, setCategoryId] = useState('');
  const [productId, setProductId] = useState();
  const [departmentId, setDepartmentId] = useState();
  const [serialNo, setSerialNo] = useState();
  const [encodedData, setEncodedData] = useState([]);
  const [contentInfo, setContentInfo] = useState([]);
  const [filelist, setFilelist] = useState([]);
  const [accSerialNo, setAccSerialNo] = useState();
  const [selectedAccId, setSelectedAccId] = useState();
  const orgId = currentUser?.personal_details?.organizationDetails?.orgPartyId;
  // **** getUniqueListBy() filters the Uniques No. of List From an given array based on the Unique Key.
  function getUniqueListBy(arr, key) {
    return [...new Map(arr?.map((item) => [item[key], item])).values()];
  }
  // *****

  const encodedDataobj = [];

  encodedData?.map((encodeImg, index) =>
    encodedDataobj.push({
      name: contentInfo[index]?.name,
      encoded_file: encodeImg,
    }),
  );

  const brandList = (value) => {
    const data = {};
    if (brandId) {
      data.brand_id = form?.getFieldValue('brand_id');
    }
    if (departmentId) {
      data.department_id = departmentId;
    }
    if (productId) {
      data.head_type_id = productId;
    }
    if (serialNo) {
      data.serialNumber = serialNo;
    }
    dispatch({
      type: 'product/allproducts',
      payload: {
        ...data,
        view_size: 50,
        keyword: value,
        is_variant: 'N',
        status_id: 'VERIFIED',
        customer_id: currentUser?.personal_details?.organizationDetails?.orgPartyId,
      },
    });
  };
  const getAccessoryTypeLists = (val) => {
    const data = {};
    if (selectedAccId) {
      data.type_id = selectedAccId;
    }
    if (accSerialNo) {
      data.serialNumber = accSerialNo;
    }
    dispatch({
      type: 'product/getAccessoryTypesLists',
      payload: {
        ...data,
        view_size: 20,
        start_index: 0,
        keyword: val,
        is_variant: 'Y',
        parent_product_id: verified?.records?.filter(
          (list) => list?.serial_number === form?.getFieldValue('serial_no'),
        )[0]?.product_id,
        assoc_type_id: 'PRODUCT_ACCESSORY',
        is_draft: false,
        customer_id: orgId,
      },
    });
  };
  useEffect(() => {
    if (categoryId === 'ACCESSORY') {
      getAccessoryTypeLists();
    }
  }, [form?.getFieldValue('serial_no'), productId, selectedAccId, accSerialNo, categoryId]);

  useEffect(() => {
    const uniqueCompanyBrands = getUniqueListBy(
      verified?.records?.map((record) => ({
        brand_id: record?.brand_id,
        brand_name: record?.brandName,
        product_id: record?.product_id,
      })),
      'brand_id',
    );
    if (uniqueCompanyBrands?.length > 0) setSelectBrand(uniqueCompanyBrands);

    const uniqueProductList = getUniqueListBy(
      verified?.records?.map((record) => ({
        id: record?.product?.id,
        product_name: record?.product?.name,
      })),
      'id',
    );

    if (uniqueProductList?.length > 0) setSelectedProduct(uniqueProductList);

    const uniqueDepartments = getUniqueListBy(
      verified?.records?.map((record) => ({
        id: record?.department_id,
        department_name: record?.department_name,
      })),
      'id',
    );
    if (uniqueDepartments?.length > 0) setDepartment(uniqueDepartments);
  }, [verified]);
  useEffect(() => {
    const uniqueAccessoryTypes = getUniqueListBy(
      verifiedAccessory?.records?.map((record) => ({
        id: record?.type?.id,
        name: record?.type?.name,
        product_id: record?.product_id,
      })),
      'id',
    );
    if (uniqueAccessoryTypes?.length > 0) setSelectedAccType(uniqueAccessoryTypes);
  }, [verifiedAccessory]);
  useEffect(() => {
    brandList();
  }, [brandId, productId, departmentId, serialNo]);
  // *******Below Code Auto Fill's The Form Based On information of that Selected Item by the User.
  if (brandId) {
    form?.setFieldsValue({
      productName_id: selectedProduct.length > 1 ? '' : selectedProduct && selectedProduct[0]?.id,
      department_id: department.length > 1 ? '' : department[0]?.id,
      serial_no: verified?.records?.length > 1 ? '' : verified?.records[0]?.serial_number,
    });
    if (categoryId === 'ACCESSORY') {
      form?.setFieldsValue({
        accessoryId:
          serialNo &&
          (selectedAccType?.length > 1 ? '' : selectedAccType && selectedAccType[0]?.id),
        acc_serial_no:
          selectedAccType &&
          (verifiedAccessory?.records?.length > 1
            ? ''
            : verifiedAccessory?.records[0]?.serial_number),
      });
    }
  }
  if (productId) {
    form?.setFieldsValue({
      brand_id: selectedBrand && selectedBrand[0]?.brand_id,
      department_id: department.length > 1 ? '' : department && department[0]?.id,
      serial_no: verified?.records?.length > 1 ? '' : verified?.records[0]?.serial_number,
    });
  }
  if (departmentId) {
    form?.setFieldsValue({
      brand_id: selectedBrand && selectedBrand[0]?.brand_id,
      productName_id:
        selectedProduct && selectedProduct?.length > 1
          ? ''
          : selectedProduct && selectedProduct[0]?.id,
      serial_no: verified?.records?.length > 1 ? '' : verified?.records[0]?.serial_number,
    });
  }
  if (serialNo) {
    form?.setFieldsValue({
      brand_id: selectedBrand && selectedBrand[0]?.brand_id,
      productName_id:
        selectedProduct && selectedProduct?.length > 1
          ? ''
          : selectedProduct && selectedProduct[0]?.id,
      department_id: department && department?.length > 1 ? '' : department && department[0]?.id,
    });
    if (categoryId === 'ACCESSORY') {
      form?.setFieldsValue({
        accessoryId: selectedAccType?.length > 1 ? '' : selectedAccType && selectedAccType[0]?.id,
        acc_serial_no:
          verifiedAccessory?.records?.length > 1
            ? ''
            : verifiedAccessory?.records[0]?.serial_number,
      });

      if (selectedAccId) {
        form?.setFieldsValue({
          acc_serial_no:
            verifiedAccessory?.records?.length > 1
              ? ''
              : verifiedAccessory?.records[0]?.serial_number,
        });
      }
    }
  }

  // ************* End of Auto Fill Form Code.

  const searchList = debounce(brandList, 400);
  const accessorySearch = debounce(getAccessoryTypeLists, 400);

  const onFinish = (values) => {
    const data = {};
    const encodedDataInfo = [];

    contentInfo?.map((fileData, index) =>
      encodedDataInfo.push({
        name: fileData?.name,
        encoded_file: filelist[index],
        mime_type_id: fileData?.type,
      }),
    );
    if (categoryId === 'ACCESSORY') {
      data.productId = verifiedAccessory?.records.filter(
        (product) => product?.serial_number === accSerialNo || form?.getFieldValue('acc_serial_no'),
      )[0]?.product_id;
    } else {
      data.productId = selectedBrand?.find(
        (product) => product?.brand_id === brandId || form?.getFieldValue('brand_id'),
      )?.product_id;
    }

    dispatch({
      type: 'product/createProductComplaintsRegistration',
      payload: {
        ...data,
        story: values?.comments,
        documents: encodedDataInfo,
      },
    }).then((res) => {
      if (res) {
        message.success('Complaint Added Successfully');
        history.push('/complaints/all');
      }
    });
  };

  return (
    <div className="mx-12">
      <Page
        title="Register Complaints"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Register Complaints',
                path: '/complaints/register-complaint',
              },
            ]}
          />
        }
        primaryAction={
          <Button
            type="primary"
            className="mr-6"
            icon={<EyeFilled style={{ fontSize: '12px' }} />}
            onClick={() => {
              history.push('/complaints/all');
            }}
          >
            View Complaints
          </Button>
        }
      >
        <div className={`bg-white rounded-lg mx-auto container ${styles.selectStyle}`}>
          <div className="text-xl text-blue-800 font-bold pl-4 pt-8 flex justify-between"></div>
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Row gutter={[24, 0]} className="">
              <Col lg={16} xl={16} md={24} sm={24} xs={24}>
                <Row gutter={[24, 0]} className="p-6">
                  <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                    <div className={classNames('formLabel', styles.textStyles)}>Category</div>

                    <SelectInput
                      rules={[
                        {
                          required: false,
                          message: 'Please Select Category',
                        },
                      ]}
                      requiredMark
                      name="categoryId"
                      placeholder="Product/Category"
                      onClear={() => {
                        form.setFieldsValue({
                          brand_id: '',
                          productName_id: '',
                          department_id: '',
                          serial_no: '',
                          accessoryId: '',
                          accSerialNo: '',
                        });
                        setCategoryId('');
                        setBrandId('');
                        setProductId('');
                        setDepartmentId('');
                        setSerialNo('');
                      }}
                      onSelect={(value) => {
                        setCategoryId(value);
                      }}
                    >
                      <Select.Option key="PRODUCT" value="PRODUCT">
                        Product
                      </Select.Option>
                      <Select.Option key="ACCESSORY" value="ACCESSORY">
                        Accessory
                      </Select.Option>
                    </SelectInput>
                  </Col>

                  <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                    <div className={classNames('formLabel', styles.textStyles)}>Select Brand</div>

                    <SelectInput
                      rules={[
                        {
                          required: false,
                          message: 'Please Select the Brand Name',
                        },
                      ]}
                      showSearch="true"
                      name="brand_id"
                      placeholder="Product Brand"
                      onSearch={(value) => searchList(value)}
                      type="family"
                      disabled={!form?.getFieldValue('categoryId')}
                      onClear={() => {
                        form.setFieldsValue({
                          productName_id: '',
                          department_id: '',
                          serial_no: '',
                          accessoryId: '',
                          acc_serial_no: '',
                        });
                        setBrandId('');
                        setProductId('');
                        setDepartmentId('');
                        setSerialNo('');
                      }}
                      onSelect={(value) => {
                        setBrandId(value);
                      }}
                    >
                      {selectedBrand?.map((brand) => (
                        <Select.Option key={brand?.brand_id} value={brand?.brand_id}>
                          {brand?.brand_name}
                        </Select.Option>
                      ))}
                    </SelectInput>
                  </Col>

                  <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                    <div className={classNames('formLabel', styles.textStyles)}> Product</div>

                    <SelectInput
                      rules={[
                        {
                          required: false,
                          message: 'Please Select the Product Name',
                        },
                      ]}
                      name="productName_id"
                      placeholder="Product Name"
                      showSearch="true"
                      onSearch={(value) => searchList(value)}
                      onClear={() => {
                        form.setFieldsValue({
                          productName_id: '',
                          department_id: '',
                          serial_no: '',
                          accessoryId: '',
                          acc_serial_no: '',
                        });
                        setProductId('');
                        setSerialNo('');
                      }}
                      onSelect={(value) => {
                        setProductId(value);
                      }}
                    >
                      {selectedProduct?.map((product) => (
                        <Select.Option key={product?.id} value={product?.id}>
                          {product?.product_name}
                        </Select.Option>
                      ))}
                    </SelectInput>
                  </Col>

                  <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                    <div className={classNames('formLabel', styles.textStyles)}>Department</div>

                    <SelectInput
                      rules={[
                        {
                          required: false,
                          message: 'Please Select the Department',
                        },
                      ]}
                      name="department_id"
                      placeholder="Select Department"
                      showSearch="true"
                      onSearch={(value) => searchList(value)}
                      onClear={() => {
                        form.setFieldsValue({
                          serial_no: '',
                        });
                        setBrandId(form?.getFieldValue('brand_id'));
                        setDepartmentId('');
                      }}
                      onSelect={(value) => {
                        setDepartmentId(value);
                      }}
                    >
                      {department?.map((depRecord) => (
                        <Select.Option key={depRecord?.id} value={depRecord?.id}>
                          {depRecord?.department_name}
                        </Select.Option>
                      ))}
                    </SelectInput>
                  </Col>

                  <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                    <div className={classNames('formLabel', styles.textStyles)}>
                      Product Serial No.{' '}
                      <span
                        className={classNames(
                          ' bg-gray-200 rounded px-2 text-blue-700',
                          styles.info,
                        )}
                      >
                        <i>i</i>
                      </span>
                    </div>
                    <div className="flex ">
                      <div className="w-full">
                        <SelectInput
                          name="serial_no"
                          rules={[
                            {
                              required: true,
                              message: 'Please Select the Serial No.',
                            },
                          ]}
                          placeholder="Select Serial No."
                          showSearch="true"
                          onSearch={(value) => searchList(value)}
                          type="family"
                          onClear={() => {
                            form.setFieldsValue({
                              accessoryId: '',
                              acc_serial_no: '',
                            });

                            setBrandId(form?.getFieldValue('brand_id'));

                            setSerialNo('');
                            if (categoryId === 'ACCESSORY') {
                              setAccSerialNo('');
                            }
                          }}
                          onSelect={(value) => {
                            setSelectedAccType([]);
                            setSerialNo(value);
                          }}
                        >
                          {verified?.records?.map((record) => (
                            <Select.Option
                              key={record?.serial_number}
                              value={record?.serial_number}
                            >
                              {record?.serial_number}
                            </Select.Option>
                          ))}
                        </SelectInput>
                      </div>
                    </div>
                  </Col>
                  {categoryId === 'ACCESSORY' && (
                    <>
                      <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                        <div className={classNames('formLabel', styles.textStyles)}>Accessory</div>

                        <SelectInput
                          name="accessoryId"
                          rules={[
                            {
                              required: false,
                              message: 'Please Select the Accessory Type',
                            },
                          ]}
                          placeholder="Accessory type"
                          showSearch="true"
                          onSearch={(value) => accessorySearch(value)}
                          type="family"
                          onClear={() => {
                            form.setFieldsValue({
                              acc_serial_no: '',
                            });
                            setSelectedAccId('');
                            setAccSerialNo('');
                          }}
                          onSelect={(value) => {
                            setSelectedAccId(value);
                          }}
                        >
                          {(serialNo || form?.getFieldValue('serial_no')) &&
                            selectedAccType &&
                            verifiedAccessory?.records?.length !== 0 &&
                            selectedAccType?.map((acc) => (
                              <Select.Option key={acc?.id} value={acc?.id}>
                                {acc?.name}
                              </Select.Option>
                            ))}
                        </SelectInput>
                      </Col>

                      <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                        <div className={classNames('formLabel', styles.textStyles)}>
                          Accessory Serial No.{' '}
                          <span
                            className={classNames(
                              ' bg-gray-200 rounded px-2 text-blue-700',
                              styles.info,
                            )}
                          >
                            <i>i</i>
                          </span>
                        </div>
                        <div className="flex ">
                          <div className="w-full">
                            <SelectInput
                              name="acc_serial_no"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please Select the Accessory Serial No.',
                                },
                              ]}
                              placeholder="Select Accessory Serial No."
                              showSearch="true"
                              onSearch={(value) => accessorySearch(value)}
                              type="family"
                              onClear={() => {
                                setAccSerialNo('');
                              }}
                              onSelect={(value) => {
                                setAccSerialNo(value);
                              }}
                            >
                              {(serialNo || form?.getFieldValue('serial_no')) &&
                                selectedAccType &&
                                verifiedAccessory?.records?.length !== 0 &&
                                verifiedAccessory?.records?.map((record) => (
                                  <Select.Option
                                    key={record?.serial_number}
                                    value={record?.serial_number}
                                  >
                                    {record?.serial_number}
                                  </Select.Option>
                                ))}
                            </SelectInput>
                          </div>
                        </div>
                      </Col>
                    </>
                  )}
                  <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                    <div className={classNames('formLabel', styles.textStyles)}>Description</div>
                    <Form.Item
                      required
                      name="comments"
                      rules={[
                        {
                          required: true,
                          message: 'Please Enter Your Description.',
                        },
                      ]}
                    >
                      <TextArea
                        placeholder="Enter Your Description here..."
                        showCount
                        maxLength={100}
                        className={styles.textareaStyle}
                      />
                    </Form.Item>
                  </Col>

                  <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                    <UploadDocuments
                      setEncodedData={setEncodedData}
                      encodedData={encodedData}
                      setContentInfo={setContentInfo}
                      contentInfo={contentInfo}
                      setFilelist={setFilelist}
                      filelist={filelist}
                    />
                  </Col>
                </Row>
              </Col>

              <Col lg={8} xl={8} md={24} sm={24} xs={24}>
                <div className="flex flex-wrap justify-center mt-36">
                  <div className="rounded-full h-60 w-60 flex items-center justify-center bg-blue-100 ">
                    <img
                      src={notebook}
                      alt="..."
                      className=" max-w-full h-20 w-20 align-middle border-none"
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <div className={classNames('flex justify-end pb-6 mr-4', styles.btnStyles)}>
              <div
                className="mx-12 mt-2 cursor-pointer"
                onClick={() => {
                  form.resetFields();
                  history.push(`/complaints/all`);
                }}
              >
                <span className="text-gray-500 ">Cancel</span>
              </div>
              <Button
                loading={loading}
                size="large"
                onClick={() => form.submit()}
                type="primary"
                className="cursor-pointer text-lg font-semibold"
              >
                Register
              </Button>
            </div>
          </Form>
        </div>
      </Page>
    </div>
  );
};

export default connect(({ product, user, department, loading }) => ({
  verified: product?.verified,
  currentUser: user?.currentUser,
  verifiedAccessory: product?.verifiedAccessory,
  loading: loading.effects['product/createProductComplaintsRegistration'],
}))(RegisterComplaintForm);
