import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Upload,
  Button,
  Popconfirm,
  Divider,
  Dropdown,
  Menu,
  message,
} from 'antd';
import { DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import PNG from '@/assets/file-types/png_doc.svg';
import PDF from '@/assets/file-types/pdf_doc.svg';
import moment from 'moment';
import AppModal from '@/components/AppModal';
import { connect } from 'umi';
import CheckValidation from '@/components/CheckValidation';
import { useUpdateStaff, useUpdateStaffContents } from '@/query/useMutateStaff';
import { useParams } from 'umi';

const UpdateOrgDocuments = ({
  isDocumentsVisible,
  setIsDocumentsVisible,
  documentInfo,
  setDocumentInfo,
  updatedFileList,
  setUpdatedFileList,
  currentUser,
  refetchStaff,
  refetchStaffOrgContents,
}) => {
  const { partyType, partyId, typeId, formName, label, value } = documentInfo;
  const [otherDocsVisible, setOtherDocsVisible] = useState(false);
  const [isModalDisplay, setIsModalDisplay] = useState(false);
  const [viewDocInfo, setViewDocInfo] = useState('');
  const [form] = Form.useForm();
  const { profileId } = useParams();

  //Initializing update mutate
  const updateStaffMutate = useUpdateStaff();
  const updateStaffDocMutate = useUpdateStaffContents();

  useEffect(() => {
    form?.setFieldsValue({
      organization: {
        [formName]: value,
      },
    });
  }, [value, formName, form]);

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

  const handleCancel = () => {
    setIsDocumentsVisible(false);
    setDocumentInfo('');
    setUpdatedFileList([]);
  };

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

      default:
        return <p className="capitalize m-0">{typeId?.replace('_', ' ')?.toLowerCase()}</p>;
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const getUploadControl = () => (
    <Upload
      size="large"
      multiple
      beforeUpload={async (content) => {
        let file;
        await toBase64(content)
          .then((res) => {
            file = {
              encodedFile: res,
              name: content?.name,
              typeId,
              viewInfo: {
                url: URL.createObjectURL(content),
                createdAt: new Date().toISOString(),
                updatedBy: currentUser?.personal_details?.displayName,
              },
            };

            setUpdatedFileList((prev) => [...prev, file]);
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

  const updateContents = (contents) => {
    updateStaffDocMutate
      ?.mutateAsync({ body: contents, pathParams: { partyId: partyId } })
      .then((res) => {
        if (res?.responseMessage == 'success') {
          message.success(`You have updated your ${partyType} Documents successfully`);
          refetchStaffOrgContents();
        } else {
          message.error('Something went wrong!');
        }
      });
  };

  const updateDocsInfo = (value) => {
    updateStaffMutate
      ?.mutateAsync({ body: value, pathParams: { staffId: profileId } })
      .then((res) => {
        if (res?.responseMessage == 'success') {
          message.success(`You have updated your ${partyType} successfully`);
          refetchStaff();
        } else {
          message.error('Something went wrong!');
        }
      });
  };

  const onDocumentSubmit = (val) => {
    const key = Object.keys(val['organization']);
    const updatedValue = val?.organization[key];

    let data = { organization: { ...val?.organization, orgPartyId: partyId } };

    if (value !== updatedValue) {
      updateDocsInfo(data);
    }
    if (updatedFileList.length !== 0) {
      const contents = updatedFileList?.map((item) => {
        delete item.viewInfo;
        return item;
      });
      updateContents(contents);
    }
  };

  return (
    <>
      <Modal
        title={
          <div className="bg-white rounded px-4 py-1 font-bold text-blue-900 text-md">
            Update {partyType} Document
          </div>
        }
        visible={isDocumentsVisible}
        onCancel={handleCancel}
        footer={
          <div className="flex justify-end">
            <div>
              <Button
                type="link"
                onClick={() => {
                  setIsDocumentsVisible(false);
                  setDocumentInfo('');
                  setUpdatedFileList([]);
                }}
              >
                Cancel
              </Button>
            </div>
            <div>
              <Button
                onClick={() => {
                  form.submit();
                }}
                type="primary"
                loading={updateStaffMutate?.isLoading}
              >
                Update
              </Button>
            </div>
          </div>
        }
      >
        <Form form={form} autoComplete="off" onFinish={onDocumentSubmit}>
          <CheckValidation
            show={documentInfo?.typeId === 'OTHER_DOCUMENT'}
            fallback={
              <div className={`${styles?.uploadStyles}`}>
                <Form.Item
                  name={['organization', `${formName}`]}
                  label={<span className="formLabel">{label}</span>}
                  rules={[
                    {
                      message: `Please enter a valid ${label?.toLowerCase()}!`,
                      pattern: typeId === 'AADHAAR_CARD' ? /^\d+$/ : /^[a-zA-Z0-9]+$/,
                    },
                  ]}
                >
                  <Input placeholder={`Enter ${label?.toLowerCase()}`} size="large" />
                </Form.Item>
                <div className="">{getUploadControl()}</div>
              </div>
            }
          >
            <div className={`${styles?.uploadStyles}`}>
              <p className="m-0 font-medium inline self-center mr-2">Other document</p>
              <Dropdown
                visible={otherDocsVisible}
                onVisibleChange={() => {
                  setOtherDocsVisible(!otherDocsVisible);
                }}
                overlay={menuForSourcePage}
                placement="bottomCenter"
              >
                <Form.Item
                  name={formName}
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
              <div className="">{getUploadControl()}</div>
            </div>
          </CheckValidation>
        </Form>
        {updatedFileList?.length > 0 && (
          <>
            <div className="my-4 font-bold text-sm text-blue-900">Uploaded Documents</div>
            <div className="mt-4" style={{ maxHeight: '20vh', overflow: 'auto' }}>
              {updatedFileList?.map((info, index) => (
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
                            setUpdatedFileList(() =>
                              updatedFileList?.filter((item, i) => i !== index),
                            );
                          }}
                          okText="Delete"
                          cancelText="Cancel"
                          okType="danger"
                        >
                          <Button type="danger" shape="circle" size="small">
                            <DeleteOutlined />
                          </Button>
                        </Popconfirm>
                      </div>

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
                </div>
              ))}
            </div>
          </>
        )}
      </Modal>
      <AppModal
        showModal={isModalDisplay}
        setViewDocInfo={setViewDocInfo}
        setUpdatedFileList={setUpdatedFileList}
        titleName={<div className="capitalize">{viewDocInfo?.name}</div>}
        subtitle={
          <div className="">
            {moment(viewDocInfo?.viewInfo?.createdAt).format('LL')} at{' '}
            {moment(viewDocInfo?.viewInfo?.createdAt).format('LT')}
          </div>
        }
        setShowModal={setIsModalDisplay}
        footer={
          <div className="text-blue-500 font-semibold text-xs">
            Uploaded by <span className="underline">{viewDocInfo?.viewInfo?.updatedBy}</span>
          </div>
        }
        width={null}
      >
        <div style={{ width: '60vw', height: '60vh' }}>
          <iframe
            width="100%"
            height="100vh"
            title="Documents Preview"
            src={viewDocInfo?.viewInfo?.url}
            className="h-full"
            frameBorder="0"
          />
        </div>
      </AppModal>
    </>
  );
};

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser,
});
export default connect(mapStateToProps)(UpdateOrgDocuments);
