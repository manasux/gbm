import React, { useState } from 'react';
import { connect } from 'umi';
import { Col, Input, Row, Form, Upload, Button, Divider, Popconfirm, Dropdown, Menu } from 'antd';
import { DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import styles from '../index.module.less';
import PNG from '@/assets/file-types/png_doc.svg';
import PDF from '@/assets/file-types/pdf_doc.svg';
import moment from 'moment';

const OrgForm = ({ form, currentUser, setOrgFileList, orgFileList }) => {
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
      multiple
      className="mt-2"
      beforeUpload={async (content) => {
        let file;
        await toBase64(content)
          .then((res) => {
            file = {
              encodedFile: res,
              name: content?.name,
              typeId: 'PAN_CARD',
            };

            setOrgFileList((prev) => [...prev, file]);
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
  const getGSTUploadControl = () => (
    <Upload
      size="large"
      multiple
      className="mt-2"
      beforeUpload={async (content) => {
        let file;
        await toBase64(content)
          .then((res) => {
            file = {
              encodedFile: res,
              name: content?.name,
              typeId: 'GST_NUM',
            };
            setOrgFileList((prev) => [...prev, file]);
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
      multiple
      className="mt-2"
      beforeUpload={async (content) => {
        let file;
        await toBase64(content)
          .then((res) => {
            file = {
              encodedFile: res,
              name: content?.name,
              typeId: 'OTHER_DOCUMENT',
            };
            setOrgFileList((prev) => [...prev, file]);
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

  const getDocumentName = (typeId) => {
    switch (typeId) {
      case 'OTHER_DOCUMENT':
        return (
          <p className="capitalize m-0">
            {form?.getFieldValue(['organization', 'documentName'])?.toLowerCase()}
          </p>
        );
      case 'GST_NUM':
        return <p className="capitalize m-0">GST</p>;

      default:
        return <p className="capitalize m-0">{typeId?.replace('_', ' ')?.toLowerCase()}</p>;
    }
  };

  const menuForSourcePage = (
    <Menu style={{ maxHeight: 250, overflow: 'auto' }}>
      {otherDocs?.map((item) => (
        <Menu.Item key={item?.id}>
          <a
            href
            onClick={() => {
              setOtherDocsVisible(false);

              form?.setFieldsValue({
                organization: { documentName: item?.name },
              });
            }}
          >
            {item?.name}
          </a>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <>
      <Row gutter={24}>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Form.Item
            name={['organization', 'organizationName']}
            label={<span className="formLabel">Name</span>}
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Organization name can't be blank!",
              },
            ]}
          >
            <Input placeholder="Enter organization name" size="large" />
          </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Form.Item
            name={['organization', 'securityAmount']}
            label={<span className="formLabel">Security amount</span>}
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Security amount can't be blank!",
              },
              {
                message: 'Please enter a valid amount!',
                pattern: /^\d+$/,
              },
            ]}
          >
            <Input placeholder="Enter security amount" size="large" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <div className={`${styles?.uploadStyles}`}>
            <Form.Item
              name={['organization', 'panCard']}
              label={<span className="formLabel">Pan number</span>}
              rules={[
                {
                  message: 'Please enter a valid pan number!',
                  pattern: /^[a-zA-Z0-9]+$/,
                },
              ]}
            >
              <Input placeholder="Enter pan number" size="large" />
            </Form.Item>
            {getPanUploadControl()}
          </div>
        </Col>
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <div className={`${styles?.uploadStyles}`}>
            <Form.Item
              name={['organization', 'gstNum']}
              label={<span className="formLabel">GST number</span>}
              rules={[
                {
                  message: 'Please enter a valid GST number!',
                  pattern: /^[a-zA-Z0-9]+$/,
                },
              ]}
            >
              <Input placeholder="Enter GST number" size="large" />
            </Form.Item>
            {getGSTUploadControl()}
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
                name={['organization', 'documentName']}
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
        {orgFileList?.length > 0 && (
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <div className="my-4 font-bold text-sm text-blue-900">Uploaded Documents</div>
            <div className="mt-4" style={{ maxHeight: '20vh', overflow: 'auto' }}>
              {orgFileList?.map((info, index) => (
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
                            setOrgFileList(() => orgFileList?.filter((item, i) => i !== index));
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
    </>
  );
};

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(OrgForm);
