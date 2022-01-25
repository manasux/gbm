import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { Col, Row, Form, Input, Upload, Button, Divider, Popconfirm, Dropdown, Menu } from 'antd';
import PNG from '@/assets/file-types/png_doc.svg';
import PDF from '@/assets/file-types/pdf_doc.svg';
import moment from 'moment';
import styles from '../index.module.less';

const DocForm = ({ form, currentUser, setFilelist, filelist }) => {
  const [otherDocsVisible, setOtherDocsVisible] = useState(false);

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
  const fileSizeConvertor = (size) => {
    if (size && size / 1024 / 1024 > 0) {
      const newSize = (size / 1024 / 1024).toFixed(2);
      return `${newSize} MB`;
    }
    return null;
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const getPanUploadControl = () => (
    <Upload
      size="large"
      className="mt-2"
      multiple
      beforeUpload={async (content) => {
        let file;
        await toBase64(content)
          .then((res) => {
            file = {
              encodedFile: res,
              name: content?.name,
              typeId: 'PAN_CARD',
            };
            setFilelist((prev) => [...prev, file]);
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

  const getAadharUploadControl = () => (
    <Upload
      size="large"
      className="mt-2"
      multiple
      beforeUpload={async (content) => {
        let file;
        await toBase64(content)
          .then((res) => {
            file = {
              encodedFile: res,
              name: content?.name,
              typeId: 'AADHAAR_CARD',
            };
            setFilelist((prev) => [...prev, file]);
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
  const getOtherUploadControl = () => (
    <Upload
      size="large"
      className="mt-2"
      multiple
      beforeUpload={async (content) => {
        let file;
        await toBase64(content)
          .then((res) => {
            file = {
              encodedFile: res,
              name: content?.name,
              typeId: 'OTHER_DOCUMENT',
            };
            setFilelist((prev) => [...prev, file]);
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

  const menuForSourcePage = (
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

  const getDocumentName = (typeId) => {
    switch (typeId) {
      case 'OTHER_DOCUMENT':
        return (
          <p className="capitalize m-0">{form?.getFieldValue('documentName')?.toLowerCase()}</p>
        );

      default:
        return <p className="capitalize m-0">{typeId?.replace('_', ' ')?.toLowerCase()}</p>;
    }
  };
  return (
    <Row gutter={24}>
      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
        <div className={`${styles?.uploadStyles}`}>
          <Form.Item
            name="panCard"
            label={<span className="formLabel">Pan number</span>}
            rules={[
              {
                message: 'Please enter a valid pan number!',
                pattern: /^[a-zA-Z0-9]+$/, // accepts alphanumeric input only without space
              },
            ]}
          >
            <div>
              <Input placeholder="Enter pan number" size="large" />
            </div>
          </Form.Item>
          {getPanUploadControl()}
        </div>
      </Col>
      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
        <div className={`${styles?.uploadStyles}`}>
          <Form.Item
            name="aadharCard"
            label={<span className="formLabel">Aadhar number</span>}
            rules={[
              {
                message: 'Please enter a valid aadhar number!',
                pattern: /^\d+$/, // accepts only numbers without space
              },
            ]}
          >
            <Input placeholder="Enter aadhar number" size="large" />
          </Form.Item>
          {getAadharUploadControl()}
        </div>
      </Col>
      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
        <div className={`${styles?.uploadStyles}`}>
          <Dropdown
            visible={otherDocsVisible}
            onVisibleChange={() => {
              setOtherDocsVisible(!otherDocsVisible);
            }}
            overlay={menuForSourcePage}
            placement="bottomCenter"
          >
            <Form.Item
              name="documentName"
              label={<span className="formLabel">Other document</span>}
              rules={[
                {
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
                size="large"
              />
            </Form.Item>
          </Dropdown>

          {getOtherUploadControl()}
        </div>
      </Col>
      {filelist?.length > 0 && (
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <div className="my-4 font-bold text-sm text-blue-900">Uploaded Documents</div>
          <div className="mt-4" style={{ maxHeight: '20vh', overflow: 'auto' }}>
            {filelist?.map((info, index) => (
              <div key={info?.uid}>
                {index !== 0 && <Divider />}

                <div className="w-full flex justify-between mt-4 ">
                  <div className="flex">
                    <div className="">
                      <img src={info?.type?.includes('pdf') ? PDF : PNG} alt="PNG" />
                    </div>
                    <div className=" mx-6 ">
                      <div className="text-blue-900 text-md font-semibold">{info?.name}</div>
                      <div className="capitalize text-blue-800">
                        {getDocumentName(info?.typeId)}
                      </div>
                      <div className="text-gray-400 font-normal text-xs">
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

                  <div className="flex mx-2 " style={{ float: 'right' }}>
                    <div className="mx-2">
                      {' '}
                      <Popconfirm
                        title="Are you sure you want to delete this attachment?"
                        onConfirm={() => {
                          setFilelist(() => filelist?.filter((item, i) => i !== index));
                        }}
                        okText="Delete"
                        cancelText="Cancel"
                        okType="danger"
                      >
                        <Button type="primary" shape="circle" size="small">
                          <DeleteOutlined />
                        </Button>
                      </Popconfirm>
                    </div>

                    <Button
                      type="primary"
                      shape="circle"
                      size="small"
                      onClick={() => {
                        setViewUploadedDocuments(true);
                        setUploadUrl(URL.createObjectURL(info));
                        setDisplayFrame(true);
                      }}
                    >
                      <EyeOutlined />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Col>
      )}
    </Row>
  );
};

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(DocForm);
