import React, { useState, useEffect } from 'react';
import {
  Col,
  Input,
  Row,
  Form,
  Checkbox,
  Menu,
  Dropdown,
  Upload,
  Button,
  Divider,
  Popconfirm,
} from 'antd';
import Address from '@/components/Address';
import PhoneNumber from '@/components/PhoneNumber';
import styles from './index.less';
import classNames from 'classnames';
import AddPoc from '../AddPocForm';
import { callApi } from '@/utils/apiUtils';
import moment from 'moment';
import { connect } from 'umi';
import { DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import PNG from '@/assets/file-types/png_doc.svg';
import PDF from '@/assets/file-types/pdf_doc.svg';
import DisplayAppDocuments from '@/components/DisplayAppDocuments';

const AddHospitalProfileForm = ({
  form,
  showShipping,
  setShowShipping,
  customerRecord,
  dispatch,
  currentUser,
  fileContents,
  setFileContents,
}) => {
  const [bedsListVisible, setBedsListVisible] = useState(false);
  const [otherDocsVisible, setOtherDocsVisible] = useState(false);
  const [viewDocInfo, setViewDocInfo] = useState('');
  const [isModalDisplay, setIsModalDisplay] = useState(false);

  const bedsList = [
    {
      id: '1',
      name: '1',
    },
    {
      id: '2',
      name: '2',
    },
    {
      id: '3',
      name: '3',
    },
    {
      id: '4',
      name: '4',
    },
    {
      id: '5',
      name: '5',
    },
    {
      id: '6',
      name: '6',
    },
  ];
  const menuForBedsInfo = (
    <Menu style={{ maxHeight: 250, overflow: 'auto' }}>
      {bedsList?.map((item) => (
        <Menu.Item key={item?.id}>
          <a
            href
            onClick={() => {
              setBedsListVisible(false);

              form?.setFieldsValue({
                noOfBeds: item?.id,
              });
            }}
          >
            {item?.name}
          </a>
        </Menu.Item>
      ))}
    </Menu>
  );
  const otherDocs = [
    {
      id: '0',
      name: 'Licence',
    },
    {
      id: '1',
      name: 'Voter ID',
    },
  ];
  const menuForOtherDocuments = (
    <Menu style={{ maxHeight: 250, overflow: 'auto' }}>
      {otherDocs?.map((item) => (
        <Menu.Item key={item?.id}>
          <a
            href
            onClick={() => {
              setOtherDocsVisible(false);

              form?.setFieldsValue({
                documentName: item?.name,
              });
            }}
          >
            {item?.name}
          </a>
        </Menu.Item>
      ))}
    </Menu>
  );
  useEffect(() => {
    dispatch({
      type: 'customer/getCustomer',
      payload: {
        pathParams: {
          customerId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
        },
      },
    })?.then((res) => {
      if (res) {
        const { planId, planName, totalYears, grandTotal } = res?.subscription || {
          planId: '',
          planName: '',
          totalYears: '',
          grandTotal: '',
        };

        dispatch({
          type: 'customer/getSubscriptionPlans',
        }).then((res) => {
          if (res?.length > 0) {
            form?.setFieldsValue({
              subscriptionType: planName,
              noOfUSers: res?.find((item) => item?.id === planId)?.numberOfUser,
              subsPeriod: totalYears,
              amountPaid: grandTotal,
            });
          }
        });
      }
    });
  }, []);
  const { subscription } = customerRecord || { subscription: '' };

  const fileSizeConvertor = (size) => {
    if (size && size / 1024 / 1024 > 0) {
      const newSize = (size / 1024 / 1024).toFixed(2);
      return `${newSize} MB`;
    }
    return null;
  };
  const getDocumentName = (typeId) => {
    switch (typeId) {
      case 'OTHER_DOCUMENT':
        return (
          <p className="capitalize m-0">{form?.getFieldValue('documentName')?.toLowerCase()}</p>
        );
      case 'GST_NUM':
        return <p className="capitalize m-0">GST</p>;

      default:
        return <p className="capitalize m-0">{typeId?.replace('_', ' ').toLowerCase()}</p>;
    }
  };
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const getUploadControl = (typeId) => (
    <Upload
      size="middle"
      multiple
      className="mb-6"
      beforeUpload={async (content) => {
        let file;
        await toBase64(content)
          .then((res) => {
            file = {
              encodedFile: res,
              name: content?.name,
              typeId,
              viewInfo: { url: URL.createObjectURL(content), createdAt: Date?.now() },
            };

            setFileContents((prev) => [...prev, file]);
          })
          .catch(() => {});

        return false;
      }}
      fileList={[]}
    >
      <Button type="primary" size="medium">
        <UploadOutlined className="text-xl font-extrabold" />
      </Button>
    </Upload>
  );

  return (
    <div className={classNames(styles?.styledemo)}>
      <div className=" mt-8 mb-6 px-10">
        <div className="px-6 pt-6">
          <div className="text-blue-900 font-semibold text-xl">Hospital Overview</div>
          <div className="text-gray-600">
            <p className="mt-4">The basic overview of the Hopital details.</p>
          </div>
        </div>
        {/* *** Customer Overview Section */}
        <Row gutter={[24]} className="px-6 pt-6">
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <Form.Item
              name="companyName"
              label={<span className="formLabel">Organization Name</span>}
              rules={[{ required: true, message: 'Please Enter Organization Name!' }]}
            >
              <Input size="middle" placeholder="Enter organization name" autoFocus />
            </Form.Item>
          </Col>
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <Dropdown
              visible={bedsListVisible}
              onVisibleChange={() => {
                setBedsListVisible(!bedsListVisible);
              }}
              overlay={menuForBedsInfo}
              placement="bottomCenter"
            >
              <Form.Item
                name="noOfBeds"
                label={<span className="formLabel">No. of Beds</span>}
                rules={[
                  {
                    required: true,
                    whitespace: false,
                    message: 'Please select no. of beds!',
                    pattern: /^[0-9]/,
                  },
                ]}
              >
                <Input
                  onFocus={() => {
                    setBedsListVisible(true);
                  }}
                  placeholder="Select or enter hospital beds"
                  size="middle"
                />
              </Form.Item>
            </Dropdown>
          </Col>
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <Form.Item
              label={<span className="formLabel">Hospital Email</span>}
              name="companyEmail"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Hospital email can't be blank!",
                },
                ({ getFieldError }) => ({
                  validator(rule, value) {
                    const a = getFieldError('email');
                    if (a.includes("'email' is not a valid email") || !value || value.length < 2) {
                      return Promise.resolve();
                    }
                    return (
                      callApi(
                        {
                          uriEndPoint: {
                            uri: '/user/isExistingLoginId',
                            method: 'GET',
                            version: '/xapi/v1',
                          },
                          query: {
                            user_id: value,
                          },
                        },
                        {
                          disableNotifications: true,
                        },
                      )
                        .then(() => Promise.resolve())
                        // eslint-disable-next-line prefer-promise-reject-errors
                        .catch(() => Promise.reject('Email already exists. Try again!'))
                    );
                  },
                }),
                {
                  message: 'Please enter a valid email address!',
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                },
              ]}
            >
              <Input size="middle" placeholder="Enter hospital email address" type="email" />
            </Form.Item>
          </Col>

          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <Form.Item label={<span className="formLabel ">Hospital Phone Number</span>}>
              <PhoneNumber
                countryCode={['companyPhone', 'countryCode']}
                rules={[
                  {
                    required: true,
                    message: "Hospital phone number can't be blank!",
                    min: 10,
                    len: 10,
                  },
                ]}
                form={form}
                name={['companyPhone', 'phone']}
                placeholder="Enter hospital phone number"
              />
            </Form.Item>
          </Col>
        </Row>
        {/* ***End Of Customer Overview Section *** */}
        <AddPoc form={form} />
        <div className="px-6 pt-6">
          <div className="text-blue-900 font-semibold text-xl">Billing Address</div>
          <div className="text-gray-600">
            <p className="mt-4">The billing address of this hospital.</p>
          </div>
        </div>
        <Address form={form} type="billingAddress" />
        <Row gutter={[24]} className="px-6 pt-6">
          {/* May need this code ***********************/}
          {/* <Col lg={24} xl={24} md={24} sm={24} xs={24}>
            <div className="mt-8">
              <Checkbox
                checked={billingAddress}
                onChange={() => {
                  setBillingAddress(!billingAddress);
                }}
              >
                <span className={classNames('formLabel')}>Billing Address Same as above</span>
              </Checkbox>
            </div>
          </Col> */}
          <Col lg={24} xl={24} md={24} sm={24} xs={24}>
            <div className="font-medium mt-4">
              <Checkbox
                checked={showShipping}
                onChange={() => {
                  setShowShipping(!showShipping);
                  if (!showShipping) {
                    form.setFieldsValue({
                      shippingAddress: {
                        addressLine_1: '',
                        addressLine_2: '',
                        region: '',
                        city: '',
                        countryCode: '+91',
                        postalCode: '',
                        stateCode: '',
                      },
                    });
                  }
                }}
              >
                Delivery address same as billing address.
              </Checkbox>
            </div>
          </Col>
        </Row>
        {!showShipping && (
          <div className="">
            <div className="px-6 pt-6">
              <div className="text-blue-900 font-semibold text-xl">Delivery Address</div>
              <div className="text-gray-600">
                <p className="mt-4">The delivery address of this hospital.</p>
              </div>
            </div>
            <Address form={form} type="shippingAddress" />
          </div>
        )}
        <div className="px-6 pt-6 mb-6">
          <div className="text-blue-900 font-semibold text-xl">Additional Information</div>
          <div className="text-gray-600">
            <p className="mt-1">Permanent Account Number, GST No. etc.. of the hospital.</p>
          </div>
        </div>
        <Row gutter={[24]} className="px-6">
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <div className={`${styles?.uploadStyles}`}>
              <Form.Item
                name="panNumber"
                label={<span className="formLabel ">Permanent Account Number</span>}
                rules={[
                  {
                    required: false,
                    message: 'Please enter a valid pan number!',
                    pattern: /^[a-zA-Z0-9]+$/,
                  },
                ]}
              >
                <Input placeholder="Enter permanent account number" size="middle" />
              </Form.Item>
              {getUploadControl('PAN_CARD')}
            </div>
          </Col>
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <div className={`${styles?.uploadStyles}`}>
              <Form.Item
                name="gstNumber"
                label={<span className="formLabel ">GST Number</span>}
                rules={[
                  {
                    required: false,
                    message: 'Please enter a valid GST number!',
                    pattern: /^[a-zA-Z0-9]+$/,
                  },
                ]}
              >
                <Input placeholder="Enter GST number" size="middle" />
              </Form.Item>
              {getUploadControl('GST_NUM')}
            </div>
          </Col>
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <div className={`${styles?.uploadStyles}`}>
              <Dropdown
                visible={otherDocsVisible}
                onVisibleChange={() => {
                  setOtherDocsVisible(!otherDocsVisible);
                }}
                overlay={menuForOtherDocuments}
                placement="bottomCenter"
              >
                <Form.Item
                  name={'documentName'}
                  label={<span className="formLabel">Other Document</span>}
                  rules={[
                    {
                      required: false,
                      message: 'Please enter a valid document name!',
                      pattern: /^[a-zA-Z0-9]/,
                    },
                  ]}
                >
                  <Input
                    onFocus={() => {
                      setOtherDocsVisible(true);
                    }}
                    placeholder="Select or enter document name"
                    size="middle"
                  />
                </Form.Item>
              </Dropdown>
              {getUploadControl('OTHER_DOCUMENT')}
            </div>
          </Col>
        </Row>

        {fileContents?.length > 0 && (
          <>
            <div className="my-4 font-bold text-sm text-blue-900 px-6">Uploaded Documents</div>

            <Row gutter={[24]} className="px-6">
              {fileContents?.map((info, index) => (
                <Col key={info?.uid} lg={12} xl={12} md={24} sm={24} xs={24}>
                  <div className={`w-full flex justify-between p-4 bg-white`}>
                    <div className="flex">
                      <div className="self-center">
                        <img src={info?.type?.includes('pdf') ? PDF : PNG} alt="PNG" />
                      </div>
                      <div className=" mx-6 ">
                        <div className="text-blue-900 text-md font-semibold">{info?.name}</div>
                        <div className="capitalize text-blue-800">
                          {getDocumentName(info?.typeId)}
                        </div>
                        <div className="text-gray-600 font-normal text-xs">
                          {moment(new Date().toISOString()).format('LL')} at{' '}
                          {moment(new Date().toISOString()).format('LT')} -{' '}
                          {fileSizeConvertor(info?.size)}
                        </div>
                        <div className="text-blue-800 font-semibold text-xs">
                          Uploaded by{' '}
                          <span className="underline">
                            {currentUser?.personal_details?.displayName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col-reverse justify-around">
                      <Popconfirm
                        title="Are you sure you want to delete this attachment?"
                        onConfirm={() => {
                          setFileContents(() => fileContents?.filter((item, i) => i !== index));
                        }}
                        okText="Delete"
                        cancelText="Cancel"
                        okType="danger"
                      >
                        <Button type="danger" shape="circle" size="small">
                          <DeleteOutlined />
                        </Button>
                      </Popconfirm>

                      <Button
                        type="primary"
                        shape="circle"
                        size="small"
                        onClick={() => {
                          setViewDocInfo(info);
                          setIsModalDisplay(true);
                        }}
                      >
                        <EyeOutlined />
                      </Button>
                    </div>
                  </div>
                  <Divider />
                </Col>
              ))}
            </Row>
          </>
        )}

        <Row gutter={[24]} className="px-6 pt-6">
          <Col lg={24} xl={24} md={24} sm={24} xs={24}>
            <div className="flex items-center flex-auto text-xs uppercase font-semibold py-2">
              <span className=" bg-yellow-400 text-yellow-900 rounded-full rounded-r-none pr-2 pl-4 py-1">
                Renews On
              </span>
              <span className=" bg-gray-400 text-blue-900 rounded-full rounded-l-none pl-2  pr-4 py-1">
                {moment(subscription?.endDate).format('LL')}
              </span>
            </div>
          </Col>
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <Form.Item
              name="subscriptionType"
              label={<span className="formLabel ">Subscription Type</span>}
            >
              <Input
                disabled
                placeholder="Subscription type"
                size="middle"
                style={{ color: 'gray', borderColor: 'gray' }}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <Form.Item name="noOfUSers" label={<span className="formLabel ">Number of Users</span>}>
              <Input
                disabled
                placeholder="Number of users"
                size="middle"
                style={{ color: 'gray', borderColor: 'gray' }}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <Form.Item
              name="subsPeriod"
              label={<span className="formLabel ">Subscription Period</span>}
            >
              <Input
                disabled
                placeholder="Select subscription period"
                size="middle"
                style={{ color: 'gray', borderColor: 'gray' }}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xl={12} md={24} sm={24} xs={24}>
            <Form.Item name="amountPaid" label={<span className="formLabel ">Amount Paid</span>}>
              <Input
                disabled
                placeholder="Amount paid"
                size="middle"
                style={{ color: 'gray', borderColor: 'gray' }}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
      <DisplayAppDocuments
        showModal={isModalDisplay}
        setViewDocInfo={setViewDocInfo}
        titleName={<div className="capitalize">{viewDocInfo?.name}</div>}
        subtitle={
          <div>
            {moment(viewDocInfo?.viewInfo?.createdAt).format('LL')} at{' '}
            {moment(viewDocInfo?.viewInfo?.createdAt).format('LT')}
          </div>
        }
        setShowModal={setIsModalDisplay}
        footer={
          <div className="text-blue-500 font-semibold text-xs">
            Uploaded by{' '}
            <span className="underline">{currentUser?.personal_details?.displayName}</span>
          </div>
        }
        width={null}
      >
        <div style={{ width: '50vw', height: '50vh' }}>
          <iframe
            width="100%"
            height="100vh"
            title="Documents Preview"
            src={viewDocInfo?.viewInfo?.url}
            className="h-full"
            frameBorder="0"
          />
        </div>
      </DisplayAppDocuments>
    </div>
  );
};

const mapStateToProps = ({ customer, user }) => ({
  customerRecord: customer?.customerRecord,
  currentUser: user?.currentUser,
});

export default connect(mapStateToProps)(AddHospitalProfileForm);
