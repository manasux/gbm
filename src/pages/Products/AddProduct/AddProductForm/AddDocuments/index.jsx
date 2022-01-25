/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Select, Button, Modal, message, Input } from 'antd';
import { connect, useParams } from 'umi';
import classNames from 'classnames';
import moment from 'moment';
import { debounce } from 'lodash';
import TextInput from '@/components/FormComponents/TextInput';
import SelectInput from '@/components/FormComponents/SelectInput';
import SelectDate from '@/components/FormComponents/SelectDate';
import styles from '../AddProductMerchandise/index.less';

const AddDocuments = ({
  dispatch,
  docType,
  docSubType,
  documentStatus,
  loadingShared,
  loadingInternal,
  visible,
  setVisible,
  updateSharedDocument,
  updateInternalDocument,
  setUpdateInternalDocument,
  setUpdateSharedDocument,
}) => {
  const { serialNumberId } = useParams();
  const [form] = Form.useForm();
  const [showOtherOptionError, setShowOtherOptionError] = useState(false);
  const [selectedOption, setSelectedOption] = useState({});
  const [otherOptions, setOtherOptions] = useState([]);
  const [othervalue, setothervalue] = useState({});
  const [docTypeId, setDocTypeId] = useState('');
  const [documentAttachment, setDocumentAttachment] = useState();

  function disabledDate(current) {
    return current > moment().endOf('day');
  }

  const docTypeList = (value) => {
    dispatch({
      type: 'product/getDocType',
      payload: {
        query: {
          keyword: value || '',
          doc_type_id: documentStatus,
        },
      },
    });
  };

  const getTypeId = () => {
    if (updateSharedDocument?.type?.id && !docTypeId && documentStatus === 'SHARED_DOC') {
      return updateSharedDocument?.type?.id;
    }

    if (updateInternalDocument?.type?.id && !docTypeId && documentStatus === 'INTERNAL_DOC')
      return updateInternalDocument?.type?.id;
    if (docTypeId) return docTypeId;
  };
  const onSubtypeChange = (value) => {
    dispatch({
      type: 'product/getDocSubTypesList',
      payload: {
        query: {
          doc_type_id: documentStatus,
          type_id: getTypeId(),
          keyword: value,
        },
      },
    });
  };

  useEffect(() => {
    if (documentStatus) docTypeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentStatus]);

  useEffect(() => {
    if (updateSharedDocument || updateInternalDocument) {
      setDocTypeId('');
    }
    if (docTypeId || updateSharedDocument || updateInternalDocument) onSubtypeChange();
  }, [docTypeId, updateSharedDocument, updateInternalDocument]);

  const docTypeSearch = debounce(docTypeList, 400);

  const reqTitle = () => {
    if (updateSharedDocument && documentStatus === 'SHARED_DOC') {
      return 'Edit Shared Documents';
    }
    if (updateInternalDocument && documentStatus === 'INTERNAL_DOC') {
      return 'Edit Internal Document';
    }
    if (documentStatus === 'SHARED_DOC') {
      return 'Add Shared Documents';
    }
    if (documentStatus === 'INTERNAL_DOC') {
      return 'Add Internal Documents';
    }
  };

  const reqButtonTitle = () => {
    if (updateSharedDocument || updateInternalDocument) {
      return 'Update';
    }
    return 'Add ';
  };

  const searchDocType = debounce(onSubtypeChange, 400);

  useEffect(() => {
    if (updateSharedDocument && documentStatus === 'SHARED_DOC') {
      form.setFieldsValue({
        ...updateSharedDocument,
        doc_type_info_shared: {
          ...updateSharedDocument?.type,
          id: updateSharedDocument?.type ? updateSharedDocument?.type?.id : '',
        },
        doc_sub_type_details_shared: {
          ...updateSharedDocument?.sub_type,
          sub_type_id: updateSharedDocument?.sub_type ? updateSharedDocument?.sub_type?.id : '',
        },
        attach_doc_details_shared: {
          ...updateSharedDocument?.description,
          attach_doc: updateSharedDocument?.description ? updateSharedDocument?.description : '',
        },
        attach_doc_date_shared: {
          ...updateSharedDocument?.document_date,
          doc_date: updateSharedDocument?.document_date
            ? moment(updateSharedDocument?.document_date)
            : '',
        },
        attach_doc_number_shared: {
          doc_number: updateSharedDocument?.document_number,
        },
      });
    }
    if (updateInternalDocument && documentStatus === 'INTERNAL_DOC') {
      form.setFieldsValue({
        ...updateInternalDocument,
        doc_type_info_internal: {
          ...updateInternalDocument?.type,
          id: updateInternalDocument?.type ? updateInternalDocument?.type?.id : '',
        },
        doc_sub_type_details_internal: {
          ...updateInternalDocument?.sub_type,
          sub_type_id: updateInternalDocument?.sub_type ? updateInternalDocument?.sub_type?.id : '',
        },
        attach_doc_details_internal: {
          ...updateInternalDocument.description,
          attach_doc: updateInternalDocument?.description
            ? updateInternalDocument?.description
            : '',
        },
        attach_doc_date_internal: {
          ...updateInternalDocument?.document_date,
          doc_date: updateInternalDocument?.document_date
            ? moment(updateInternalDocument?.document_date)
            : '',
        },
        attach_doc_number_internal: {
          doc_number: updateInternalDocument?.document_number,
        },
      });
    }
  }, [updateSharedDocument, visible, updateInternalDocument]);

  return (
    <Modal
      title={reqTitle()}
      width={1000}
      centered
      maskClosable={false}
      visible={visible}
      onCancel={() => {
        setVisible(false);
        form?.resetFields();
        setUpdateSharedDocument('');
        setUpdateInternalDocument('');
      }}
      footer={[
        <div className={classNames('flex justify-end pb-3', styles.btnStyles)} key="footer">
          <div
            className="mx-12 mt-2 cursor-pointer"
            onClick={() => {
              form.resetFields();
              setVisible(false);
              setUpdateSharedDocument('');
              setUpdateInternalDocument('');
            }}
          >
            <span className="text-gray-500">Cancel</span>
          </div>
          <div className="mr-4">
            {' '}
            <Button
              loading={documentStatus === 'SHARED_DOC' ? loadingShared : loadingInternal}
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
      <div className="p-2 px-4  bg-white rounded">
        <Form
          form={form}
          onFinish={(values) => {
            const formdata = new FormData();
            if (updateSharedDocument && documentStatus === 'SHARED_DOC') {
              const data = {};
              if (
                values?.attach_doc_details_shared?.attach_doc !== updateSharedDocument?.description
              ) {
                data.description = values?.attach_doc_details_shared?.attach_doc;
              } else {
                delete data?.description;
              }
              if (
                values?.doc_sub_type_details_shared?.sub_type_id !==
                  updateSharedDocument?.sub_type?.id ||
                values?.doc_type_info_shared?.id !== updateSharedDocument?.type?.id
              ) {
                data.type_id = values?.doc_sub_type_details_shared
                  ? values?.doc_sub_type_details_shared?.sub_type_id
                  : values?.doc_type_info_shared?.id;
              } else {
                delete data?.type_id;
              }
              if (
                moment(values?.attach_doc_date_shared?.doc_date).format() !==
                moment(updateSharedDocument?.document_date).format()
              )
                data.document_date = moment(values?.attach_doc_date_shared?.doc_date).format();
              else {
                delete data?.document_date;
              }
              if (
                values?.attach_doc_number_shared?.doc_number !==
                updateSharedDocument?.document_number
              ) {
                data.document_number = values?.attach_doc_number_shared?.doc_number;
              } else {
                delete data?.document_number;
              }
              dispatch({
                type: 'product/editUploadSharedDocuments',
                payload: {
                  pathParams: {
                    productId: serialNumberId,
                    contentId: updateSharedDocument?.id,
                  },
                  body: data,
                },
              }).then((res) => {
                if (res?.responseMessage) {
                  message.success('Shared document details updated successfully');
                  setVisible(false);
                  form?.resetFields();
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
              });
            } else if (updateInternalDocument && documentStatus === 'INTERNAL_DOC') {
              const data = {};
              if (
                values?.attach_doc_details_internal?.attach_doc !==
                updateInternalDocument?.description
              ) {
                data.description = values?.attach_doc_details_internal?.attach_doc;
              } else {
                delete data?.description;
              }
              if (
                values?.doc_sub_type_details_internal?.sub_type_id !==
                  updateInternalDocument?.sub_type?.id ||
                values?.doc_type_info_internal?.id !== updateInternalDocument?.type?.id
              ) {
                data.type_id = values?.doc_sub_type_details_internal
                  ? values?.doc_sub_type_details_internal?.sub_type_id
                  : values?.doc_type_info_internal?.id;
              } else {
                delete data?.type_id;
              }
              if (
                moment(values?.attach_doc_date_internal?.doc_date).format() !==
                moment(updateInternalDocument?.document_date).format()
              )
                data.document_date = moment(values?.attach_doc_date_internal?.doc_date).format();
              else {
                delete data?.document_date;
              }
              if (
                values?.attach_doc_number_internal?.doc_number !==
                updateInternalDocument?.document_number
              ) {
                data.document_number = values?.attach_doc_number_internal?.doc_number;
              } else {
                delete data?.document_number;
              }
              dispatch({
                type: 'product/editUploadSharedDocuments',
                payload: {
                  pathParams: {
                    productId: serialNumberId,
                    contentId: updateInternalDocument?.id,
                  },
                  body: data,
                },
              }).then((res) => {
                if (res?.responseMessage) {
                  message.success('Internal document details updated successfully');
                  setVisible(false);
                  form?.resetFields();
                  dispatch({
                    type: 'product/getInternalDocuments',
                    payload: {
                      pathParams: {
                        productId: serialNumberId,
                      },
                      query: {
                        document_type: 'INTERNAL_DOC',
                      },
                    },
                  });
                }
              });
            } else {
              if (!documentAttachment) {
                message.error('Please add a document in order to proceed further');
                return '';
              }
              formdata.append('file', documentAttachment);
              if (documentStatus === 'SHARED_DOC') {
                formdata.append('description', values?.attach_doc_details_shared?.attach_doc);
                formdata.append(
                  'documentDate',
                  moment(values.attach_doc_date_shared.doc_date).format(),
                );
                formdata.append('documentNumber', values?.attach_doc_number_shared?.doc_number);
                dispatch({
                  type: 'product/uploadSharedDocuments',
                  payload: {
                    pathParams: {
                      prodId: serialNumberId,
                    },
                    query: {
                      product_content_type_id: values?.doc_sub_type_details_shared
                        ? values?.doc_sub_type_details_shared?.sub_type_id
                        : values?.doc_type_info_shared?.id,
                      document_type: documentStatus,
                    },
                    body: formdata,
                  },
                }).then(() => {
                  setVisible(false);
                  form?.resetFields();
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
                });
              } else {
                formdata.append('description', values?.attach_doc_details_internal?.attach_doc);
                formdata.append(
                  'documentDate',
                  moment(values.attach_doc_date_internal.doc_date).format(),
                );
                formdata.append('documentNumber', values?.attach_doc_number_internal?.doc_number);
                dispatch({
                  type: 'product/uploadInternalDocuments',
                  payload: {
                    pathParams: {
                      prodId: serialNumberId,
                    },
                    query: {
                      product_content_type_id: values?.doc_sub_type_details_internal
                        ? values?.doc_sub_type_details_internal?.sub_type_id
                        : values?.doc_type_info_internal?.id,
                      document_type: documentStatus,
                    },
                    body: formdata,
                  },
                }).then(() => {
                  setVisible(false);
                  form?.resetFields();
                  dispatch({
                    type: 'product/getInternalDocuments',
                    payload: {
                      pathParams: {
                        productId: serialNumberId,
                      },
                      query: {
                        document_type: 'INTERNAL_DOC',
                      },
                    },
                  });
                });
              }
            }
            setUpdateInternalDocument('');
            setUpdateSharedDocument('');
          }}
          colon={false}
        >
          <Row gutter={[24, 0]} className="">
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <div className={classNames('formLabel', styles.textStyles)}>Document Type</div>
              <SelectInput
                disabled={documentStatus === 'SHARED_DOC'}
                rules={[{ required: true, message: 'Please select the type' }]}
                name={
                  documentStatus === 'SHARED_DOC'
                    ? ['doc_type_info_shared', 'id']
                    : ['doc_type_info_internal', 'id']
                }
                placeholder="Sales/Services"
                showSearch="true"
                onClear={() => {
                  if (documentStatus === 'SHARED_DOC') {
                    form.setFieldsValue({
                      doc_sub_type_details_shared: '',
                    });
                  } else {
                    form.setFieldsValue({
                      doc_sub_type_details_internal: '',
                    });
                  }
                }}
                onChange={() => {
                  if (documentStatus === 'SHARED_DOC') {
                    form.setFieldsValue({
                      doc_sub_type_details_shared: '',
                    });
                  } else {
                    form.setFieldsValue({
                      doc_sub_type_details_internal: '',
                    });
                  }
                }}
                onSearch={(value) => docTypeSearch(value)}
                setFields={(data) =>
                  setOtherOptions([
                    ...otherOptions,
                    {
                      id: 'doc_type_info',
                      doc_type_info: { label: data, id: 'DT_OTHER' },
                    },
                  ])
                }
                type="documentType"
                showOtherOptionError={showOtherOptionError}
                setShowOtherOptionError={setShowOtherOptionError}
                othervalue={othervalue}
                // setothervalue={setothervalue}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                onSelect={(value) => {
                  setDocTypeId(value);
                  if (value === 'DT_OTHER') {
                    setSelectedOption((prev) => ({
                      ...prev,
                      documentType: true,
                    }));
                    form?.setFieldsValue({
                      doc_type_info: { id: value, label: othervalue.documentType },
                    });
                  } else {
                    setSelectedOption((prev) => ({
                      ...prev,
                      documentType: false,
                    }));
                    setShowOtherOptionError({ documentType: false });
                    setothervalue((prev) => ({
                      ...prev,
                      documentType: '',
                    }));
                    form?.setFieldsValue({
                      doc_type_info: { id: value },
                    });
                  }
                }}
              >
                {Array.isArray(docType?.productContentTypes) &&
                  docType?.productContentTypes?.map((product) => (
                    <Select.Option key={product?.id} value={product?.id}>
                      {product?.description}
                    </Select.Option>
                  ))}
              </SelectInput>
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <div className={classNames('formLabel', styles.textStyles)}>Document Sub Type</div>
              <SelectInput
                disabled={documentStatus === 'SHARED_DOC'}
                rules={[{ required: true, message: 'Please select the sub-type' }]}
                placeholder="Others"
                name={
                  documentStatus === 'SHARED_DOC'
                    ? ['doc_sub_type_details_shared', 'sub_type_id']
                    : ['doc_sub_type_details_internal', 'sub_type_id']
                }
                setFields={(data) =>
                  setOtherOptions([
                    ...otherOptions,
                    {
                      id: 'Document',
                      doc_type_info: { label: data, id: 'DSBT_OTHER' },
                    },
                  ])
                }
                type="documentSubType"
                showOtherOptionError={showOtherOptionError}
                setShowOtherOptionError={setShowOtherOptionError}
                othervalue={othervalue}
                showSearch="true"
                onSearch={(value) => searchDocType(value)}
                // setothervalue={setothervalue}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                onSelect={(value) => {
                  if (value === 'DSBT_OTHER') {
                    setSelectedOption((prev) => ({
                      ...prev,
                      documentSubType: true,
                    }));
                    form?.setFieldsValue({
                      doc_sub_type_details: {
                        sub_type_id: value,
                        label: othervalue.documentSubType,
                      },
                    });
                  } else {
                    setSelectedOption((prev) => ({
                      ...prev,
                      documentSubType: false,
                    }));
                    setShowOtherOptionError({ documentSubType: false });
                    setothervalue((prev) => ({
                      ...prev,
                      documentSubType: '',
                    }));
                    form?.setFieldsValue({
                      doc_sub_type_details: { sub_type_id: value },
                    });
                  }
                }}
              >
                {Array.isArray(docSubType?.productContentTypes) &&
                  docSubType?.productContentTypes?.map((product) => (
                    <Select.Option key={product?.id} value={product?.id}>
                      {product?.description}
                    </Select.Option>
                  ))}
              </SelectInput>
            </Col>

            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <div className={classNames('formLabel', styles.textStyles)}>Document Title</div>
              <div className="flex ">
                <div className="w-full ml-2">
                  <TextInput
                    style={{ width: '100%' }}
                    rules={[{ required: true, message: 'Please enter document name' }]}
                    name={
                      documentStatus === 'SHARED_DOC'
                        ? ['attach_doc_details_shared', 'attach_doc']
                        : ['attach_doc_details_internal', 'attach_doc']
                    }
                    placeholder="Document"
                  />
                </div>
              </div>
            </Col>
            <Col lg={12} xl={12} md={24} sm={24} xs={24}>
              <div className={classNames('formLabel', styles.textStyles)}>Document Date </div>
              <div className="flex ">
                <div className="w-full">
                  <SelectDate
                    rules={[{ required: true, message: 'Please select document date' }]}
                    name={
                      documentStatus === 'SHARED_DOC'
                        ? ['attach_doc_date_shared', 'doc_date']
                        : ['attach_doc_date_internal', 'doc_date']
                    }
                    placeholder="Select Document date"
                    disabledDate={disabledDate}
                  />
                </div>
              </div>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <div className={classNames('formLabel', styles.textStyles)}>Document Number </div>
              <Form.Item
                name={
                  documentStatus === 'SHARED_DOC'
                    ? ['attach_doc_number_shared', 'doc_number']
                    : ['attach_doc_number_internal', 'doc_number']
                }
              >
                <Input placeholder="Enter Document No." size="middle" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default connect(({ product, user, loading }) => ({
  docType: product.docType,
  docSubType: product.docSubType,
  currentUser: user.currentUser,
  loadingShared: loading.effects['product/uploadSharedDocuments'],
  loadingInternal: loading.effects['product/uploadInternalDocuments'],
}))(AddDocuments);
