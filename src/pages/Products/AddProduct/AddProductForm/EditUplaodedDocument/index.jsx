/* eslint-disable consistent-return */
import React, { useEffect } from 'react';
import { connect, useParams } from 'umi';
import moment from 'moment';
import { Button, Input, Modal, Form, message, Select, DatePicker, Row, Col } from 'antd';

const AddContractDetails = ({
  dispatch,
  visible,
  setVisible,
  documentStatus,
  docUploadType,
  setDocumentStatus,
  updateSharedDocument,
  setUpdateSharedDocument,
  selectedMerchandise,
}) => {
  const { serialNumberId } = useParams();
  const [form] = Form.useForm();
  const { Option } = Select;
  const reqTitle = () => {
    switch (documentStatus) {
      case 'SHARED_DOC':
        return 'Edit uploaded document';
      default:
        return 'Edit Item/Accessory uploaded document';
    }
  };

  const getContractTypeList = () => {
    dispatch({
      type: 'product/getUploadTypeList',
      payload: {
        query: {
          doc_type_id: 'SHARED_DOC',
        },
      },
    });
  };

  const onFinish = (values) => {
    const data = values;
    data.document_date = moment(values?.document_date).format();

    if (values?.description === updateSharedDocument?.description) delete data?.description;
    if (values?.type_id === updateSharedDocument?.sub_type?.id) delete data?.type_id;
    if (
      moment(values?.document_date).format('LL') ===
      moment(updateSharedDocument.document_date).format('LL')
    )
      delete data?.document_date;
    if (values?.document_number === updateSharedDocument?.document_number)
      delete data?.document_number;
    if (documentStatus === 'SHARED_DOC') {
      dispatch({
        type: 'product/updateContent',
        payload: {
          pathParams: {
            productId: serialNumberId,
            contentId: updateSharedDocument?.id,
          },
          body: data,
        },
      })
        .then((resp) => {
          setVisible(false);
          dispatch({
            type: 'product/getProductDocuments',
            payload: {
              pathParams: {
                productId: serialNumberId,
              },
            },
          });
          setDocumentStatus('');
          getContractTypeList();
          if (resp?.responseMessage) message.success('Content updated successfully!');
        })
        .then(() => {
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
      dispatch({
        type: 'product/updateContent',
        payload: {
          pathParams: {
            productId: selectedMerchandise,
            contentId: updateSharedDocument?.id,
          },
          body: data,
        },
      }).then((resp) => {
        setVisible(false);
        dispatch({
          type: 'product/getMerchandiseDocuments',
          payload: {
            pathParams: {
              productId: selectedMerchandise,
            },
          },
        });
        setDocumentStatus('');
        getContractTypeList();
        if (resp?.responseMessage) message.success('Content updated successfully!');
      });
    }
  };

  useEffect(() => {
    getContractTypeList();
    if (updateSharedDocument) {
      form?.setFieldsValue({
        ...updateSharedDocument,
        description: updateSharedDocument?.description,
        type_id: updateSharedDocument?.sub_type?.id,
        document_date: updateSharedDocument.document_date
          ? moment(updateSharedDocument.document_date)
          : '',
        document_number: updateSharedDocument?.document_number,
      });
    }
  }, [visible]);

  return (
    <Modal
      title={reqTitle()}
      visible={visible}
      width={1000}
      footer={
        <div className="flex justify-end m-6 mb-12">
          <div className="pb-8">
            <Button
              onClick={() => {
                form.submit();
              }}
              type="primary"
              size="large"
            >
              Update
            </Button>
          </div>
          <div
            className="text-blue-400 underline mt-2 mx-4 cursor-pointer"
            onClick={() => {
              form.resetFields();
              setVisible(false);
              setDocumentStatus('');
              setUpdateSharedDocument('');
            }}
          >
            Cancel
          </div>
        </div>
      }
      bodyStyle={{ margin: 0, padding: 0, height: '20vh' }}
      centered
      onCancel={() => {
        setVisible(false);
        setDocumentStatus('');
        setUpdateSharedDocument('');
      }}
      afterClose={() => {
        form.resetFields();
      }}
    >
      <div className="mx-6">
        <Form layout="vertical" hideRequiredMark form={form} onFinish={onFinish}>
          <Row gutter={[24, 12]}>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                name="description"
                label={<span className="formLabel">Document Title</span>}
              >
                <Input placeholder="Enter document title" size="large" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                name="type_id"
                label={<span className="formLabel">Document Sub Type</span>}
              >
                <Select placeholder="Select Doc Sub Type" style={{ width: '100%' }} size="large">
                  {docUploadType?.productContentTypes?.map((type) => (
                    <Option value={type?.id}>{type?.description}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                name="document_date"
                label={<span className="formLabel">Document Date</span>}
              >
                <DatePicker size="large" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                name="document_number"
                label={<span className="formLabel">Document Number</span>}
              >
                <Input placeholder="Enter No." size="large" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default connect(({ product }) => ({
  docUploadType: product.docUploadType,
  productDetail: product.productDetail,
}))(AddContractDetails);
