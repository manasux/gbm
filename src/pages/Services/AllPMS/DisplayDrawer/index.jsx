/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'umi';
import {
  Drawer,
  Row,
  Col,
  Input,
  Form,
  Upload,
  Button,
  Divider,
  Popconfirm,
  message,
  Badge,
  Card,
  Select,
  Rate,
} from 'antd';
import Rating from '@/components/Rating';
import { getInitials } from '@/utils/common';
import DocumentModel from '@/components/UploadGlobalDocs';
import classNames from 'classnames';
import styles from './index.less';
import RatingModal from '../RatingModal';
import PNG from '@/assets/file-types/png_doc.svg';
import PDF from '@/assets/file-types/pdf_doc.svg';
import moment from 'moment';
import { ContainerTwoTone, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import DisplayAppDocuments from '@/components/DisplayAppDocuments';
import CheckValidation from '@/components/CheckValidation';

const { Option } = Select;
const DisplayDrawer = ({
  dispatch,
  setDisplayDrawer,
  displayDrawer,
  selectedPMSRecord,
  isTabCompleted,
  particularPMS,
  currentUser,
  showFeedbackPMS,
  loadingAddComments,
  allComments,
  docType,
}) => {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [commentAttachments, setCommentAttachments] = useState([]);
  const [comments, setComments] = useState('');
  const [rating, setRating] = useState(0);
  const [documentModel, setDocumentModel] = useState(false);
  const inputRef = useRef();
  const [isModalDisplay, setIsModalDisplay] = useState(false);
  const [viewDocInfo, setViewDocInfo] = useState('');
  const [documentSubType, setDocumentSubType] = useState(undefined);
  const [pmsAttachments, setPmsAttachments] = useState([]);

  const showModal = () => {
    setShowRatingModal(true);
  };

  const onClose = () => {
    setDisplayDrawer(false);
  };

  useEffect(() => {
    if (displayDrawer) {
      dispatch({
        type: 'product/getDocType',
        payload: {
          query: {
            doc_type_id: 'SHARED_DOC',
            view_size: 50,
          },
        },
      });
      dispatch({
        type: 'product/getPmsAttachments',
        payload: {
          query: {
            workEffortId: selectedPMSRecord?.workEffortId,
            partyId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
          },
        },
      }).then((res) => {
        if (res) {
          setPmsAttachments(res?.records);
        }
      });
      dispatch({
        type: 'product/getFeedbackPMS',
        payload: {
          query: {
            partyId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
            workEffortId: selectedPMSRecord?.workEffortId,
          },
        },
      });
    }
  }, [displayDrawer]);
  useEffect(() => {
    if (selectedPMSRecord) {
      dispatch({
        type: 'product/getParticularPMS',
        payload: {
          pathParams: {
            asset_id: selectedPMSRecord?.fixedAssetId,
            service_id: selectedPMSRecord?.maintHistSeqId,
          },
        },
      });
    }
  }, [selectedPMSRecord, documentModel]);

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
  const Item = ({ data, value }) => (
    <div className={'mt-1'}>
      <div className="font-medium">{data}</div>
      <div className="text-blue-800 font-semibold " style={{ fontSize: '1rem', width: '15rem' }}>
        {value}
      </div>
    </div>
  );
  const fetchComments = () => {
    dispatch({
      type: 'product/fetchComments',
      payload: {
        pathParams: {
          party_id: currentUser?.personal_details?.organizationDetails?.orgPartyId,
        },
        query: {
          workEffortId: selectedPMSRecord?.workEffortId,
        },
      },
    });
  };
  useEffect(() => {
    if (selectedPMSRecord?.workEffortId) fetchComments();
  }, [selectedPMSRecord]);

  const addComment = () => {
    dispatch({
      type: 'product/addComments',
      payload: {
        pathParams: {
          party_id: currentUser?.id,
        },
        body: {
          note: comments,
          workEffortId: selectedPMSRecord?.workEffortId,
          productId: selectedPMSRecord?.productId,
          productTypeId: selectedPMSRecord?.modelId,
          subTypeId: 'PMS',
          productContentTypeId: 'PRODUCT',
          attachments: commentAttachments?.length > 0 ? commentAttachments : [],
        },
      },
    })
      .then((res) => {
        if (res?.responseMessage === 'success') {
          message.success('Comment added successfully');
          setCommentAttachments([]);
          setComments('');
          fetchComments();
        } else {
          throw new Error();
        }
      })
      .catch((err) => {
        if (err) message.error('Failed to add comments');
      });
  };
  const onDeleteDocumentHandler = (contentId, communicationEventId) => {
    dispatch({
      type: 'product/deletePmsAttachments',
      payload: {
        body: {
          communicationEventId,
          workEffortId: selectedPMSRecord?.workEffortId,
          customerId: selectedPMSRecord?.customerId,
        },
        pathParams: {
          contentId,
        },
      },
    }).then((res) => {
      if (res?.responseMessage === 'success') {
        message?.success('You have deleted attachment successfully');
        setPmsAttachments((prev) => {
          return prev?.filter((item) => item?.id !== communicationEventId);
        });
      } else {
        message?.error('Something went wrong!');
      }
    });
  };
  return (
    <div className={classNames(styles?.styleDrawer, styles?.colStyle)}>
      <Drawer
        title={
          <div className="flex items-center">
            <ContainerTwoTone style={{ fontSize: '2rem' }} twoToneColor="white" />
            <span className="mx-2  text-gray-100" style={{ fontSize: '1.5rem' }}>
              PMS
            </span>
            <Badge className="mx-4" size="default" count={selectedPMSRecord?.status} />
            <div className="mx-2">
              {selectedPMSRecord?.status && selectedPMSRecord?.status === 'completed' && (
                <Rating
                  onClick={() => {
                    if (!showFeedbackPMS[0]?.experienceRating) showModal();
                  }}
                  rating={rating}
                  setRating={setRating}
                  displayFlex={true}
                  experienceRating={showFeedbackPMS[0]?.experienceRating}
                />
              )}
            </div>
          </div>
        }
        width={selectedPMSRecord ? 600 : 830}
        onClose={onClose}
        visible={displayDrawer}
        afterVisibleChange={isTabCompleted && isTabCompleted === 'COMPLETED'}
      >
        <div className={classNames('mt-6 mx-6', styles?.formStyles)}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={[24, 12]}>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Item data="PMS no" value={selectedPMSRecord?.pmsNo || 'n/a'} />
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Item
                  data="Product"
                  value={<span className="capitalize">{selectedPMSRecord?.typeName || 'n/a'}</span>}
                />
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Item
                  data="Type"
                  value={
                    <span className="capitalize">{selectedPMSRecord?.headTypeName || 'n/a'}</span>
                  }
                />
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Item
                  data="Model"
                  value={
                    <span className="capitalize">{selectedPMSRecord?.modelName || 'n/a'}</span>
                  }
                />
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Item
                  data="Company"
                  value={
                    <span className="capitalize">{selectedPMSRecord?.brandName || 'n/a'}</span>
                  }
                />
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Item
                  data="PMS Date"
                  value={moment(selectedPMSRecord?.pmsDate).format('LL') || 'n/a'}
                />
              </Col>
              <CheckValidation show={selectedPMSRecord?.statusId === 'OVERDUE'}>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <Item data="Days crossed" value={selectedPMSRecord?.daysDiff || 'n/a'} />
                </Col>
              </CheckValidation>

              <CheckValidation show={selectedPMSRecord?.statusId === 'UPCOMING'}>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <Item data="Days left" value={selectedPMSRecord?.daysDiff || 'n/a'} />
                </Col>
              </CheckValidation>

              <CheckValidation show={selectedPMSRecord?.statusId === 'COMPLETED'}>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <Item data="Completed in Days" value={selectedPMSRecord?.daysDiff || 'n/a'} />
                </Col>
              </CheckValidation>

              <CheckValidation show={selectedPMSRecord?.statusId === 'COMPLETED'}>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <Item
                    data="PMS Done By"
                    value={
                      <span className="capitalize">
                        {selectedPMSRecord?.pmsDoneBy?.displayName || 'n/a'}
                      </span>
                    }
                  />
                </Col>
              </CheckValidation>

              <CheckValidation show={selectedPMSRecord?.statusId === 'COMPLETED'}>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <Item data="Total PMS" value={selectedPMSRecord?.totalPms || 'n/a'} />
                </Col>
              </CheckValidation>

              <CheckValidation show={selectedPMSRecord?.statusId === 'COMPLETED'}>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <Item data="PMS left" value={selectedPMSRecord?.pmsLeft || 'n/a'} />
                </Col>
              </CheckValidation>
            </Row>
            <Divider />
            <Row gutter={[24, 12]}>
              <Col lg={12} xl={12} md={12} sm={12} xs={12}>
                <Item
                  data="Customer"
                  value={
                    <span className="capitalize">{selectedPMSRecord?.customerName || 'n/a'}</span>
                  }
                />
              </Col>
              <Col lg={12} xl={12} md={12} sm={12} xs={12}>
                <Item data="Contact No." value={selectedPMSRecord?.formattedPhone || 'n/a'} />
              </Col>
              <Col lg={12} xl={12} md={12} sm={12} xs={12}>
                <Item
                  data="Email"
                  value={<span className="lowercase">{selectedPMSRecord?.customerEmail}</span>}
                />
              </Col>
              <Col lg={12} xl={12} md={12} sm={12} xs={12}>
                <Item
                  data="Location"
                  value={<span className="capitalize">{selectedPMSRecord?.city || 'n/a'}</span>}
                />
              </Col>
            </Row>
            <Divider />
            <Row gutter={[24, 12]}>
              <Col lg={12} xl={12} md={12} sm={12} xs={12}>
                <Item
                  data="Assigned Person"
                  value={
                    <span className="capitalize">
                      {selectedPMSRecord?.assignee?.fullName || 'n/a'}
                    </span>
                  }
                />
              </Col>
              <Col lg={12} xl={12} md={12} sm={12} xs={12}>
                <Item
                  data="Contact No."
                  value={
                    selectedPMSRecord?.assignee?.contact?.countryCode +
                      selectedPMSRecord?.assignee?.contact?.areaCode +
                      selectedPMSRecord?.assignee?.contact?.contactNumber || 'n/a'
                  }
                />
              </Col>
              <Col lg={12} xl={12} md={12} sm={12} xs={12}>
                <Item data="Email" value={selectedPMSRecord?.email || 'n/a'} />
              </Col>
              <Col lg={12} xl={12} md={12} sm={12} xs={12}>
                <Item
                  data="Location"
                  value={
                    <span className="capitalize">{selectedPMSRecord?.address?.city || 'n/a'}</span>
                  }
                />
              </Col>
            </Row>
            <Divider />
            <Row gutter={[24, 12]}>
              <Col lg={12} xl={12} md={12} sm={12} xs={12}>
                <p className="font-medium">Documents</p>
                <Select
                  className="mt-2"
                  size="middle"
                  getPopupContainer={(node) => node.parentNode}
                  placeholder="Select document type"
                  onSelect={(value) => {
                    setDocumentSubType(value);
                    setDocumentModel(true);
                  }}
                  value={documentSubType}
                >
                  {docType?.productContentTypes?.map((item) => (
                    <Option key={item?.id} value={item?.id}>
                      <span className="capitalize">{item?.description}</span>
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col lg={12} xl={12} md={12} sm={12} xs={12}>
                <Item
                  data="Document No."
                  value={
                    pmsAttachments?.[pmsAttachments?.length - 1]?.attachments?.[0]
                      ?.documentNumber || 'n/a'
                  }
                />
              </Col>
            </Row>
            <Divider />
            <div>
              <div className="my-4 font-bold text-sm text-blue-900">Uploaded Documents</div>
              <div className="mt-4" style={{ maxHeight: '20vh', overflow: 'auto' }}>
                {pmsAttachments?.map((document) =>
                  document?.attachments?.map((info, index) => (
                    <div key={info?.id}>
                      {index !== 0 && <Divider />}

                      <div className="w-full flex justify-between mt-4 ">
                        <div className="flex">
                          <div className="">
                            <img src={info?.extension?.includes('pdf') ? PDF : PNG} alt="PNG" />
                          </div>
                          <div className=" mx-6 ">
                            <div className="text-blue-900 text-md font-semibold">{info?.name}</div>
                            <div className="text-gray-600 font-normal text-xs">
                              {moment(info?.createdAt).format('LL')} at{' '}
                              {moment(info?.createdAt).format('LT')}
                              {fileSizeConvertor(info?.sizeFormatted)}
                            </div>
                            <div className="text-blue-800 font-semibold text-xs">
                              Uploaded by{' '}
                              <span className="underline">
                                {document?.fromParty?.organization?.organizationName}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex mx-2 " style={{ float: 'right' }}>
                          <div className="mx-2">
                            {' '}
                            <Popconfirm
                              title="Are you sure you want to delete this attachment?"
                              onConfirm={() => onDeleteDocumentHandler(info?.id, document?.id)}
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
                  )),
                )}
              </div>
            </div>
            <Divider />
          </Form>

          {selectedPMSRecord?.status === 'completed' && showFeedbackPMS?.length > 0 && (
            <div className="font-medium mt-4 text-md mb-2">
              Feedback
              <div className="flex mt-2 ml-2 mr-2 items-center">
                <Avatar style={{ backgroundColor: '#87d068' }}>
                  {getInitials(particularPMS?.customerName)}
                </Avatar>
                <div className="ml-2 bg-gray-200 w-full rounded  ">
                  <div className="ml-4 mt-2 mr-4 pb-2">{showFeedbackPMS[0]?.comments || []}</div>
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              height: '200px',
              overflow: 'scroll',
              margin: ' 20px 0',
            }}
          >
            {allComments?.communications?.map((communication, index) => (
              <div
                key={communication?.id}
                className={classNames(index !== 0 ? 'mt-6' : 'mt-2', 'w-full ')}
              >
                <div
                  className={classNames(
                    'flex space-x-2 items-center',
                    communication?.fromParty?.id ===
                      currentUser?.personal_details?.organizationDetails?.orgPartyId
                      ? ' justify-start'
                      : '  justify-end',
                  )}
                >
                  <div
                    className={classNames(
                      'w-8',
                      communication?.fromParty?.id !==
                        currentUser?.personal_details?.organizationDetails?.orgPartyId && 'mx-4',
                    )}
                  >
                    <Avatar
                      style={{
                        backgroundColor: '#1c9cff',
                      }}
                    >
                      {getInitials(particularPMS?.customerName)}
                    </Avatar>
                  </div>

                  <div
                    className={`p-3 ml-2 rounded shadow 
                ${
                  communication?.fromParty?.id ===
                  currentUser?.personal_details?.organizationDetails?.orgPartyId
                    ? 'bg-white flex flex-col ml-2 mr-10'
                    : 'bg-blue-600 items-end text-white flex flex-col mr-2 ml-10'
                } `}
                  >
                    {communication?.communicationEventTypeId === 'FEEDBACK_NOTE' && (
                      <div>
                        <Rate disabled value={communication?.experienceRating} />
                      </div>
                    )}
                    <div
                      className={`font-semibold text-sm pl-2 pr-2
                    ${
                      communication?.fromParty?.id ===
                      currentUser?.personal_details?.organizationDetails?.orgPartyId
                        ? 'float-left'
                        : 'float-right'
                    } `}
                    >
                      {communication?.note}
                    </div>

                    <div className="">
                      {communication?.attachments?.map((info) => (
                        <div key={info?.id}>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              setViewDocInfo(info);
                              setIsModalDisplay(true);
                            }}
                          >
                            {info?.downloadUrl?.includes('png') ? (
                              <img
                                width={200}
                                height={200}
                                src={info?.downloadUrl}
                                alt="Compliant Document"
                              />
                            ) : (
                              <>
                                <div className="text-white  bg-blue-700 rounded box-shadow text-center">
                                  <EyeOutlined />
                                  View
                                </div>
                                <div className="cursor-pointer border ">
                                  <iframe
                                    src={info?.downloadUrl}
                                    width="100%"
                                    height={200}
                                    type="application/pdf"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="font-semibold text-xs pl-2 pr-2 mt-2">
                      {moment(communication?.entryDate).format('DD MMMM YYYY')}-
                      {moment(communication?.entryDate).format('HH:MM:SS')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center font-medium text-md mt-4 mb-2">
            Comments
          </div>
          <div className="mx-2 flex mb-2">
            <Input
              className="w-full"
              onChange={(e) => setComments(e.target.value)}
              ref={inputRef}
              value={comments}
              placeholder="Enter Your Comment here..."
            />
            <Upload
              beforeUpload={async (content) => {
                await toBase64(content)
                  .then((res) => {
                    const obj = {
                      encodedFile: res,
                      name: content?.name,
                    };
                    setCommentAttachments([].concat(obj, commentAttachments));
                  })
                  .catch(() => {});

                return false;
              }}
              fileList={[]}
            >
              <Button type="primary" size="medium" className={classNames(styles?.uploadBtnStyling)}>
                <UploadOutlined className="text-xl font-extrabold" />
              </Button>
            </Upload>
            <div className="ml-2">
              <Button
                type="primary"
                onClick={addComment}
                loading={loadingAddComments}
                disabled={!comments}
              >
                Send
              </Button>
            </div>
          </div>
          {commentAttachments?.length > 0 && (
            <>
              <div className="my-4 font-bold text-sm text-blue-900">Uploaded Documents</div>
              <div className="mt-4" style={{ maxHeight: '20vh', overflow: 'auto' }}>
                {commentAttachments?.map((info, index) => (
                  <div key={info?.name}>
                    {index !== 0 && <Divider />}

                    <div className="w-full flex justify-between mt-4 ">
                      <div className="flex">
                        <div className="">
                          <img src={info?.name?.includes('pdf') ? PDF : PNG} alt="PNG" />
                        </div>
                        <div className=" mx-6 ">
                          <div className="text-blue-900 text-md font-semibold">{info?.name}</div>
                          <div className="text-gray-600 font-normal text-xs">
                            {moment(new Date().toISOString()).format('LL')} at{' '}
                            {moment(new Date().toISOString()).format('LT')}
                          </div>
                          <div className="text-blue-500 font-semibold text-xs">
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
                              setCommentAttachments(() =>
                                commentAttachments?.filter((item, i) => i !== index),
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Drawer>
      <DocumentModel
        showDocumentModel={documentModel}
        fetchPMSComments={fetchComments}
        setPmsAttachments={setPmsAttachments}
        particularPMS={particularPMS}
        selectedPMSRecord={selectedPMSRecord}
        subTypeId={documentSubType}
        setShowDocumentModel={setDocumentModel}
        status="pms"
        docTypeName="Upload Pms Document"
        setDocumentSubType={setDocumentSubType}
      />
      <RatingModal
        rating={rating}
        showRatingModal={showRatingModal}
        setShowRatingModal={setShowRatingModal}
        selectedPMSRecord={selectedPMSRecord}
      />
      <DisplayAppDocuments
        showModal={isModalDisplay}
        setViewDocInfo={setViewDocInfo}
        titleName={<div className="capitalize">{viewDocInfo?.name}</div>}
        subtitle={
          <div>
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
        <div style={{ width: '50vw', height: '50vh' }}>
          <iframe
            width="100%"
            height="100vh"
            title="Documents Preview"
            src={viewDocInfo?.downloadUrl}
            className="h-full"
            frameBorder="0"
          />
        </div>
      </DisplayAppDocuments>
    </div>
  );
};

export default connect(({ product, user, loading }) => ({
  currentUser: user?.currentUser,
  docType: product?.docType,
  treeHierarchy: product?.treeHierarchy,
  productDetail: product?.productDetail,
  complaintPreview: product?.ComplaintPreview,
  particularPMS: product?.particularPMS,
  showFeedbackPMS: product?.showFeedbackPMS,
  loadingAddComments: loading?.effects['product/addComments'],
  allComments: product?.allComments,
}))(DisplayDrawer);
