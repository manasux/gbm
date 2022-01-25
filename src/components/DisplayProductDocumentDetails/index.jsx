/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Modal, Form, Row, Col, Input, DatePicker, Table, Button, Popconfirm, message } from 'antd';
import { DeleteOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import DisplayDrawer from '@/components/DisplayDrawer';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import { connect } from 'umi';
import classNames from 'classnames';
import moment from 'moment';
import FilterDocument from '@/components/FilterDocument';
import styles from './index.less';
// import DisplayAppDocuments from '@/components/DisplayAppDocuments';

const DisplayProductDocumentDetails = ({
  visible,
  setVisible,
  setSelectedHierarchy,
  selectedHierarchy,
  productDetail,
  dispatch,
  setDocTree,
  sharedDoc,
  docTree,
  actionStatement,
  accessoryDrafts,
  isFilter,
  loadSharedDoc,
  setSharedDocuments,
  internalDoc,
  loadInternal,
  accessId,
  treeHierarchy,
}) => {
  const [form] = Form.useForm();
  const [uploadUrl, setUploadUrl] = useState(null);
  const [displayFrame, setDisplayFrame] = useState(false);
  const [displayDrawer, setDisplayDrawer] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [viewUploadedDocuments, setViewUploadedDocuments] = useState(false);
  const [accessoryParentDetail, setAccessoryParentDetail] = useState();

  const [searchTextForShared, setSearchTextForShared] = useState('');
  const [searchTextForInternal, setSearchTextForInternal] = useState('');
  const getPageTitle = () => {
    switch (selectedHierarchy?.sub_type?.id) {
      case 'INST_REPORT':
        return 'Installation Report';
      case 'MCH_PHOTO':
        return 'Machinery Photo';
      case 'PRD_INVOICE':
        return 'Product Invoice';
      default:
        return 'Document Preview';
    }
  };
  // eslint-disable-next-line consistent-return
  const getTypeofDoc = () => {
    switch (selectedHierarchy?.sub_type?.id) {
      case 'INST_REPORT':
        return 'Installation Report';
      case 'MCH_PHOTO':
        return 'Machinery Photo';
      case 'PRD_INVOICE':
        return 'Product Invoice';
      default:
        return 'Document Preview';
    }
  };

  const getSelectedAccessoryParent = () => {
    setAccessoryParentDetail(
      accessoryDrafts?.records?.filter(
        (list) => list.serial_number === selectedHierarchy?.serial_number,
      ),
    );
  };
  useEffect(() => {
    getSelectedAccessoryParent();
  }, [selectedHierarchy?.serial_number]);
  const getDataSource = () => {
    if (isFilter === 'INTERNAL_DOC') {
      return internalDoc[selectedHierarchy?.uniqueKeyFactor];
    }
    if (
      actionStatement === 'SHARED_DOC' &&
      selectedHierarchy?.uniqueKeyFactor &&
      sharedDoc?.length > 0
    ) {
      return sharedDoc;
    }
    if (
      actionStatement === 'SHARED_DOC' &&
      (isFilter === 'SHARED_DOC' || isFilter === 'MAIN_FILTER') &&
      selectedHierarchy?.uniqueKeyFactor &&
      sharedDoc[selectedHierarchy?.uniqueKeyFactor]?.length > 0 &&
      sharedDoc !== {}
    ) {
      return sharedDoc?.[selectedHierarchy?.uniqueKeyFactor];
    }
    if (docTree === 'ACC_DOC' && isFilter !== 'SHARED_DOC') {
      const accessArray = [];
      Object.keys(sharedDoc)?.map((item) =>
        sharedDoc[item]?.map((list) => {
          accessArray.push(list);
        }),
      );
      return accessArray;
    }

    return [];
  };

  const getSharedDocuments = () => {
    dispatch({
      type: 'product/getSharedDocuments',
      payload: {
        pathParams: {
          productId:
            actionStatement === 'SHARED_DOC'
              ? productDetail?.product_id
              : accessId || selectedHierarchy?.product_id,
        },
        query: {
          document_type: 'SHARED_DOC',
          keyword: searchTextForShared,
          subTypeId: selectedHierarchy?.uniqueKeyFactor,
        },
      },
    });
  };

  const getInternalDocuments = () => {
    dispatch({
      type: 'product/getInternalDocuments',
      payload: {
        pathParams: {
          productId: productDetail?.product_id,
        },
        query: {
          document_type: 'INTERNAL_DOC',
          keyword: searchTextForInternal,
          subTypeId: selectedHierarchy?.uniqueKeyFactor,
        },
      },
    });
  };
  useEffect(() => {
    if (selectedHierarchy && isFilter !== 'INTERNAL_DOC') getSharedDocuments();
    if (selectedHierarchy && isFilter === 'INTERNAL_DOC') getInternalDocuments();
  }, [
    docTree,
    searchTextForShared,
    selectedHierarchy,
    visible,
    searchTextForInternal,
    viewUploadedDocuments,
  ]);

  const deleteDocument = (id) => {
    if (id) {
      dispatch({
        type: 'product/deleteUploadedDocuments',
        payload: {
          pathParams: {
            productId: productDetail?.product_id,
            contentId: id,
          },
        },
      })
        .then(() => {
          if (isFilter === 'MAIN_PROD') {
            setSharedDocuments(false);
          }
          if (isFilter === 'INTERNAL_DOC') {
            getInternalDocuments();
          }
          getSharedDocuments();
        })
        .then(() => {
          dispatch({
            type: 'product/getProductDocuments',
            payload: {
              pathParams: {
                productId: productDetail?.product_id,
              },
              query: {
                showBasicInfo: true,
              },
            },
          });
          message.success('Content deleted successfully!');
        });
    }
  };

  const downloadAttachment = (content) => {
    fetch(`${content.download_url}`).then((response) => {
      response.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${content.name}`;

        a.click();
      });
    });
  };

  useEffect(() => {
    if (docTree !== 'ACC_DOC') {
      form.setFieldsValue({
        ...productDetail,
        family: productDetail?.family_info?.name,
        brand: productDetail?.brand_info?.name,
        name: productDetail?.product?.name,
        type: productDetail?.type?.name,
        sub_type: productDetail?.sub_type?.name,
        model: productDetail?.model?.name,
        serial_number: productDetail?.serial_number,
        department: productDetail?.department_info?.name,
        installation: moment(productDetail?.installation_date),
      });
    }
    if (docTree === 'ACC_DOC') {
      if (accessoryParentDetail?.length > 0) {
        form.setFieldsValue({
          ...accessoryParentDetail,
          name: accessoryParentDetail[0]?.accessory?.name,
          type: accessoryParentDetail[0]?.type?.name || accessoryParentDetail[0]?.sub_type?.name,
          model: accessoryParentDetail[0]?.model?.name,
          serial_number: accessoryParentDetail[0]?.serial_number,
          installation: moment(accessoryParentDetail[0]?.installation_date),
        });
      }
    }
  }, [productDetail, accessoryParentDetail]);
  const documentColumns = [
    {
      title: <span className="text-xs">Serial No.</span>,
      align: 'left',
      dataIndex: 'serial_number',
      render: (_, __, index) => (
        <>
          <div key={index} className="mx-2 capitalize text-xs">
            {index < 9 ? `0${index + 1}` : index + 1}{' '}
          </div>
        </>
      ),
    },
    {
      title: <span className="text-xs">Type</span>,
      dataIndex: 'type',
      align: 'left',
      render: (data, __, index) => (
        <div key={index} className="mx-2 capitalize text-xs">
          {data?.name || '-'}
        </div>
      ),
    },
    {
      title: <span className="text-xs">Sub Type</span>,
      dataIndex: 'sub_type',
      align: 'left',
      render: (data, __, index) => (
        <div key={index} className="mx-2 capitalize text-xs">
          {data?.name || '-'}
        </div>
      ),
    },
    {
      title: <span className="text-xs">Doc Date</span>,
      dataIndex: 'document_date',
      align: 'left',
      render: (data, __, index) => (
        <div key={index} className="mx-2 capitalize text-xs">
          {moment(data).format('DD MMMM YYYY') || '-'}
        </div>
      ),
    },
    {
      title: <span className="text-xs">Document No.</span>,
      dataIndex: 'document_number',
      align: 'left',
      render: (data, __, index) => (
        <div key={index} className="mx-2 capitalize text-xs">
          {data || '-'}
        </div>
      ),
    },
    {
      title: <span className="text-xs">Title</span>,
      align: 'left',
      dataIndex: 'description',
      render: (data, __, index) => (
        <div key={index} className="mx-2 capitalize text-xs">
          {data || '-'}
        </div>
      ),
    },
    {
      title: <span className="text-xs">Created Date/Time</span>,
      dataIndex: 'created_by_details',
      align: 'center',
      render: (data, record, index) => (
        <div key={index} className="mx-2 capitalize text-xs">
          <div className="font-semibold">{data?.name}</div>
          <div className="lowercase">
            {moment(record?.created_at).format('LL')} at {moment(record?.created_at).format('LT')}
          </div>
        </div>
      ),
    },
    {
      title: <span className="text-xs">Modified Date/Time</span>,
      dataIndex: 'last_modified_by_details',
      align: 'center',
      render: (data, record, index) => (
        <div key={index} className="mx-2 capitalize text-xs">
          <div className="font-semibold">{data?.name}</div>
          <div className="lowercase">
            {moment(record?.updated_at).format('LL')} at {moment(record?.updated_at).format('LT')}
          </div>
        </div>
      ),
    },
    {
      align: 'right',
      render: (_, record, index) => (
        <div key={index} className="flex" style={{ float: 'right' }}>
          <div className={classNames('ml-2', styles.btnStyle)}>
            <Button
              type="primary"
              shape="circle"
              size="small"
              onClick={() => {
                setUploadUrl(record?.downloadUrl);
                setDisplayFrame(true);
              }}
            >
              <EyeOutlined />
            </Button>
          </div>

          <Modal
            onCancel={() => setDisplayFrame(false)}
            visible={displayFrame}
            width="80%"
            title="Document Preview"
            footer={null}
            bodyStyle={{ margin: 0, padding: 0, height: '80vh' }}
          >
            <iframe
              width="100%"
              height="100%"
              title="Documents Preview"
              src={uploadUrl}
              className="h-full text-center w-full"
              frameBorder="0"
            />
          </Modal>

          <div className="ml-2">
            <Button
              type="primary"
              shape="circle"
              size="small"
              onClick={() => downloadAttachment(record)}
            >
              <DownloadOutlined />
            </Button>
          </div>
          <div className="ml-2">
            <Button
              type="danger"
              shape="circle"
              size="small"
              disabled={record?.is_modified_by_admin}
            >
              <Popconfirm
                okText="Delete"
                okType="danger"
                placement="right"
                onConfirm={() => {
                  deleteDocument(record?.id);
                }}
                title="Are you sure you want to delete this attachment?"
              >
                <span className="cursor-pointer">
                  <DeleteOutlined />
                </span>
              </Popconfirm>
            </Button>
          </div>
        </div>
      ),
    },
  ];
  return (
    <Modal
      title={
        <div className="mx-1 mt-2 flex justify-between font-bold">
          <div className="text-md">{getPageTitle()}</div>
        </div>
      }
      bodyStyle={{ maxHeight: '75vh', overflow: 'auto' }}
      maskClosable={false}
      width={1300}
      className={classNames(styles.modalStyles2, viewUploadedDocuments && styles.modalStyles)}
      centered={!viewUploadedDocuments}
      visible={visible}
      onCancel={() => {
        dispatch({
          type: 'product/getSharedDocuments',
          payload: {
            pathParams: {
              productId: productDetail?.product_id,
            },
            query: {
              document_type: 'SHARED_DOC',
            },
          },
        });
        setSelectedHierarchy('');
        setVisible(false);
        if (!selectedHierarchy?.sub_type?.id || selectedHierarchy?.sub_type?.id === 'PRD_INVOICE')
          dispatch({
            type: 'product/getSharedDocuments',
            payload: {
              pathParams: {
                productId: productDetail?.product_id,
              },
              query: {
                document_type: 'SHARED_DOC',
              },
            },
          });
        if (docTree) setDocTree('');
      }}
      footer={null}
    >
      <div className={classNames('m-4 mx-6')}>
        <Form layout="vertical" size="large" hideRequiredMark form={form}>
          <Row gutter={[24, 12]}>
            {docTree !== 'ACC_DOC' && (
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <div className="formLabel" style={{ fontSize: '0.8rem' }}>
                  Product Family
                </div>
                <Form.Item name="family" noStyle>
                  <Input disabled size="middle" />
                </Form.Item>
              </Col>
            )}

            {docTree !== 'ACC_DOC' && (
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <div className="formLabel">Product Company</div>
                <Form.Item name="brand" noStyle>
                  <Input disabled size="middle" />
                </Form.Item>
              </Col>
            )}

            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <div className="formLabel">
                {docTree === 'ACC_DOC' ? 'Accessory' : 'Product'} Name
              </div>
              <Form.Item name="name" noStyle>
                <Input disabled size="middle" />
              </Form.Item>
            </Col>

            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <div className="formLabel">
                {' '}
                {docTree === 'ACC_DOC' ? 'Accessory' : 'Product'} Type
              </div>
              <Form.Item name="type" noStyle>
                <Input disabled size="middle" />
              </Form.Item>
            </Col>
            {docTree !== 'ACC_DOC' && (
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <div className="formLabel">Product Sub Type</div>
                <Form.Item name="sub_type" noStyle>
                  <Input disabled size="middle" />
                </Form.Item>
              </Col>
            )}

            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <div className="formLabel">
                {' '}
                {docTree === 'ACC_DOC' ? 'Accessory' : 'Product'} Model
              </div>
              <Form.Item name="model" noStyle>
                <Input disabled size="middle" />
              </Form.Item>
            </Col>

            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <div className="formLabel">Serial No.</div>
              <Form.Item name="serial_number" noStyle>
                <Input disabled size="middle" />
              </Form.Item>
            </Col>
            {docTree !== 'ACC_DOC' && (
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <div className="formLabel">Department</div>
                <Form.Item name="department" noStyle>
                  <Input disabled size="middle" />
                </Form.Item>
              </Col>
            )}
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <div className="formLabel">Installation Date.</div>
              <Form.Item name="installation" noStyle>
                <DatePicker size="middle" style={{ width: '100%' }} disabled />
              </Form.Item>
            </Col>
            {docTree !== 'ACC_DOC' && (
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <div className="formLabel">Product Price</div>
                <Form.Item name="price" noStyle>
                  <Input disabled size="middle" />
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>

        <div className="my-4">
          <div className="mx-1 mt-2 flex justify-between font-bold text-sm text-blue-900">
            Uploaded Documents
          </div>
          {(isFilter === 'ACC_FILTER' ||
            isFilter === 'MAIN_FILTER' ||
            isFilter === 'MAIN_PROD' ||
            isFilter === 'SHARED_DOC' ||
            isFilter === 'INTERNAL_DOC') && (
            <FilterDocument
              docTree={docTree}
              isFilter={isFilter}
              visible={visible}
              setVisible={setVisible}
              selectedHierarchy={selectedHierarchy}
              typeofDoc={getTypeofDoc()}
              setSearchTextForShared={setSearchTextForShared}
              setSearchTextForInternal={setSearchTextForInternal}
              getInternalDocuments={getInternalDocuments}
            />
          )}
          <Table
            loading={isFilter === 'INTERNAL_DOC' ? loadInternal : loadSharedDoc}
            size="small"
            className={classNames(styles.tableStyle, 'shadow rounded')}
            scroll={{ x: 1000, y: 200 }}
            columns={documentColumns}
            dataSource={getDataSource()}
            pagination={false}
            rowClassName="cursor-pointer"
            locale={{
              emptyText: <EmptyStateContainer />,
            }}
          />
        </div>
      </div>
      {/* TODO: remove it*/}
      {/* <DisplayDrawer
        previewUrl={previewUrl}
        setDisplayDrawer={setDisplayDrawer}
        displayDrawer={displayDrawer}
        setSelectedHierarchy={setSelectedHierarchy}
        selectedHierarchy={selectedHierarchy}
        setViewUploadedDocuments={setViewUploadedDocuments}
        viewUploadedDocuments={viewUploadedDocuments}
      /> */}

      {/* <DisplayAppDocuments
        showModal={isModalDisplay}
        setViewDocInfo={setViewDocInfo}
        titleName={<div className="capitalize">{viewDocInfo?.name}</div>}
        subtitle={
          <div className="">
            {moment(viewDocInfo?.createdDate).format('LL')} at{' '}
            {moment(viewDocInfo?.createdDate).format('LT')}
          </div>
        }
        setShowModal={setIsModalDisplay}
        footer={
          <div className="text-blue-500 font-semibold text-xs">
            Uploaded by <span className="underline">{viewDocInfo?.createdBy}</span>
          </div>
        }
        width={null}
      >
        <div style={{ width: '60vw', height: '60vh' }}>
          <iframe
            width="100%"
            height="100vh"
            title="Documents Preview"
            src={viewDocInfo?.downloadUrl}
            className="h-full"
            frameBorder="0"
          />
        </div>
      </DisplayAppDocuments> */}
    </Modal>
  );
};

export default connect(({ user, product, loading }) => ({
  internalDoc: product.internalDoc,
  sharedDoc: product.sharedDoc,
  productDetail: product.productDetail,
  accessoryDrafts: product.accessoryDrafts,
  currentUser: user.currentUser,
  loadSharedDoc: loading.effects['product/getSharedDocuments'],
  loadInternal: loading.effects['product/getInternalDocuments'],
  treeHierarchy: product.treeHierarchy,
}))(DisplayProductDocumentDetails);
