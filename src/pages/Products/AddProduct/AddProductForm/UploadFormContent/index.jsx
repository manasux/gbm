/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Upload, Table, Select, DatePicker, Input, Progress, Button } from 'antd';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import { connect } from 'umi';
import { DeleteTwoTone, DownloadOutlined, FileImageOutlined } from '@ant-design/icons';
import moment from 'moment';

const UploadAttachment = ({
  setUploadContentModel,
  currentUser,
  name,
  docUploadType,
  dispatch,
  setFilelist,
  filelist,
  contentInfo,
  setContentInfo,
  uploadStatus,
  uploadContentModel,
  form,
}) => {
  useEffect(() => {
    if (filelist?.length > 0)
      dispatch({
        type: 'product/getUploadTypeList',
        payload: {
          query: {
            doc_type_id: 'SHARED_DOC',
            type_id: 'SALES',
          },
        },
      });
  }, [filelist]);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(false);
  const reqTitle = () => {
    switch (uploadStatus) {
      case 'uploadSerialNumber':
        return 'Upload serial number document';
      case 'uploadInstallationDate':
        return 'Upload installation date document';
      case 'uploadPmsPeriod':
        return 'Upload pms document';
      case 'uploadWarrantyPeriod':
        return 'Upload warranty period document';
      case 'uploadContractPrice':
        return 'Upload contract price document';
      case 'uploadItemInstallationDetails':
        return 'Upload installation date document';
      case 'uploadAccessoryInstallationDetails':
        return 'Upload installation date document';
      case 'uploadItemSerialNumber':
        return 'Upload serial number document';
      default:
        return 'Preview';
    }
  };
  const showProgress = () => {
    setTimeout(() => {
      setProgress(Math.floor(Math.random() * (80 - 40 + 1) + 40));
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setUploadedFile(true);
        }, 500);
      }, 1000);
    }, 1000);
    return setUploadedFile(false);
  };
  const { Option } = Select;
  const documentColumns = [
    {
      title: 'Uploading',
      dataIndex: 'name',
      align: 'left',
      render: (n, record) => (
        <div className="flex items-center">
          <div>
            <FileImageOutlined className="text-5xl" />
          </div>
          <div>
            <div>{n}</div>
            <div className="text-gray-400">{moment(record?.lastModifiedDate).format('LLL')}</div>
            <div className="text-blue-500 ">
              Uploaded by{' '}
              <span className="underline">{currentUser?.personal_details?.display_name}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Document Title.',
      align: 'center',
      render: (_, __, index) => (
        <>
          <div className="flex items-center">
            <Form.Item name={[`${name}`, `${index}`, 'description']}>
              <Input placeholder="Enter document title" bordered={false} />
            </Form.Item>
          </div>
        </>
      ),
    },
    {
      title: 'Document Sub Type',
      align: 'right',
      render: (_, __, index) => (
        <>
          <div className="flex justify-end">
            <Form.Item name={[name, index, 'sub_type_id']}>
              <Select placeholder="Select Doc Sub Type" style={{ width: 120 }} bordered={false}>
                {docUploadType?.productContentTypes?.map((type) => (
                  <Option value={type?.id}>{type?.description}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </>
      ),
    },
    {
      title: 'Document Date',
      align: 'center',
      render: (_, __, index) => (
        <>
          <div className="flex justify-end">
            <Form.Item name={[`${name}`, `${index}`, 'document_date']}>
              <DatePicker bordered={false} />
            </Form.Item>
          </div>
        </>
      ),
    },
    {
      title: 'Document No.',
      render: (_, __, index) => (
        <>
          <div className="flex items-center">
            <Form.Item name={[`${name}`, `${index}`, 'document_number']}>
              <Input placeholder="Enter No." bordered={false} />
            </Form.Item>
          </div>
        </>
      ),
    },
    {
      render: (record, _, index) => (
        <div className="flex">
          {(index !== 0 || uploadedFile) && (
            <div
              className="flex items-center"
              onClick={() => {
                form.setFieldsValue({
                  [name]: {
                    [index]: '',
                  },
                });
                setContentInfo(() => contentInfo?.filter((item) => item?.uid !== record?.uid));
              }}
            >
              <DeleteTwoTone className=" text-2xl" twoToneColor="red" />
            </div>
          )}
          <div className="ml-6">
            {index === 0 ? (
              <>
                {uploadedFile ? (
                  <a href={filelist[index]} target="_blank" rel="noopener noreferrer" download>
                    <DownloadOutlined style={{ fontSize: '2rem' }} />
                  </a>
                ) : (
                  <Progress type="circle" percent={progress} width={60} />
                )}
              </>
            ) : (
              <a href={filelist[index]} target="_blank" rel="noopener noreferrer" download>
                <DownloadOutlined style={{ fontSize: '2rem' }} />
              </a>
            )}
          </div>
        </div>
      ),
    },
  ];

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <>
      <Modal
        width={1000}
        footer={
          <div className="flex justify-end m-6 mb-12">
            <div className="pb-8">
              <Button
                onClick={() => {
                  setUploadContentModel(false);
                }}
                type="primary"
                size="large"
              >
                Save
              </Button>
            </div>
          </div>
        }
        bodyStyle={{ margin: 0, padding: 0, height: '30vh' }}
        centered
        title={
          <div className="w-7/8  flex justify-between mx-3">
            <div> {reqTitle()}</div>
            <div>
              <Upload
                beforeUpload={async (content) => {
                  setProgress(0);
                  setContentInfo([].concat(content, contentInfo));
                  let file;
                  await toBase64(content).then((res) => {
                    file = res;
                  });
                  setFilelist([].concat(file, filelist));

                  showProgress();
                  return false;
                }}
                fileList={[]}
              >
                <div className="w-full text-white hover:bg-gray-300 bg-blue-600 font-medium px-3 pt-2 pb-1 cursor-pointer rounded-lg border-gray-400 border border-dashed text-center">
                  Upload Document
                </div>
              </Upload>
            </div>
          </div>
        }
        visible={uploadContentModel}
        onCancel={() => {
          setUploadContentModel(false);
        }}
      >
        <div className="w-7/8 mx-8 ">
          {filelist?.length > 0 ? (
            <>
              <Table
                scroll={{ x: 1000, y: 500 }}
                columns={documentColumns}
                dataSource={contentInfo}
                rowKey={(record) => record.serial_number}
                rowClassName="cursor-pointer"
                pagination={false}
              />
            </>
          ) : (
            <div className="mx-2" style={{ marginTop: '16%' }}>
              <EmptyStateContainer />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default connect(({ user, product }) => ({
  currentUser: user.currentUser,
  docUploadType: product.docUploadType,
}))(UploadAttachment);
