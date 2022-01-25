/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'umi';
import { getInitials } from '@/utils/common';
import {
  Drawer,
  Row,
  Col,
  Divider,
  Button,
  Popconfirm,
  Modal,
  Avatar,
  Input,
  Upload,
  message,
  Badge,
  Select,
  Rate,
} from 'antd';
import { ContainerTwoTone, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import PNG from '@/assets/file-types/png_doc.svg';
import PDF from '@/assets/file-types/pdf_doc.svg';
import DocumentModel from '@/components/UploadGlobalDocs';
import classNames from 'classnames';
import moment from 'moment';
import Rating from '@/components/Rating';
import RatingModal from '@/pages/Services/AllComplaints/RatingModal';
import DisplayAppDocuments from '@/components/DisplayAppDocuments';
import styles from './index.less';

const { Option } = Select;
const DisplayDrawer = ({
  dispatch,
  setDisplayDrawer,
  displayDrawer,
  selectedHierarchy,
  treeHierarchy,
  productDetail,
  currentUser,
  previewUrl,
  viewUploadedDocuments,
  setViewUploadedDocuments,
  selectedComplaintRecord,
  complaintPreview,
  status,
  showFeedbackComplaints,
  loadingAddComments,
  allComments,
  docType,
}) => {
  const [uploadUrl, setUploadUrl] = useState(null);
  const [displayFrame, setDisplayFrame] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [commentAttachments, setCommentAttachments] = useState([]);
  const [comments, setComments] = useState('');
  const [rating, setRating] = useState(0);
  const [documentModel, setDocumentModel] = useState(false);
  const inputRef = useRef();
  const [documentSubType, setDocumentSubType] = useState('');
  const [complaintAttachments, setComplaintAttachments] = useState([]);
  const [viewDocInfo, setViewDocInfo] = useState('');
  const [isModalDisplay, setIsModalDisplay] = useState(false);

  const showModal = () => {
    if (!complaintPreview?.experienceRating) setShowRatingModal(true);
  };

  useEffect(() => {
    if (displayDrawer) {
      dispatch({
        type: 'product/getFeedbackComplaints',
        payload: {
          query: {
            partyId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
            custRequestId: complaintPreview?.response?.id,
          },
        },
      });
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
        type: 'product/getComplaintAttachments',
        payload: {
          query: {
            partyId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
            custRequestId: selectedComplaintRecord?.id,
          },
        },
      }).then((res) => {
        if (res) {
          setComplaintAttachments(res?.records);
        }
      });
    }
  }, [displayDrawer]);
  const getTreeComments = () => {
    dispatch({
      type: 'product/getPreviewDocs',
      payload: {
        pathParams: {
          productId: productDetail?.product_id,
        },
        query: {
          document_type: 'SHARED_DOC',
        },
      },
    });
  };
  const getComplaintPreView = () => {
    dispatch({
      type: 'product/getComplaintPreview',
      payload: {
        pathParams: {
          productId: selectedComplaintRecord?.id,
        },
      },
    });
  };

  const fetchComments = () => {
    dispatch({
      type: 'product/fetchComments',
      payload: {
        pathParams: {
          party_id: currentUser?.personal_details?.organizationDetails?.orgPartyId,
        },
        query: {
          custRequestId: complaintPreview?.response?.id,
        },
        body: {
          obj: {
            id: complaintPreview?.id,
            entryDate: complaintPreview?.response?.createdAt,
            fromParty: {
              id: currentUser?.personal_details?.organizationDetails?.orgPartyId,
            },
            note: complaintPreview?.response?.story,
            attachments: complaintPreview?.response?.attachments,
          },
        },
      },
    });
  };
  useEffect(() => {
    if (selectedHierarchy) getTreeComments();
  }, [selectedHierarchy]);
  useEffect(() => {
    if (selectedComplaintRecord) {
      getComplaintPreView();
    }
  }, [selectedComplaintRecord, documentModel]);
  useEffect(() => {
    if (complaintPreview?.response?.id) fetchComments();
  }, [complaintPreview, displayDrawer]);

  const onClose = () => {
    setDisplayDrawer(false);
    if (viewUploadedDocuments) setViewUploadedDocuments(false);
    setComplaintAttachments([]);
  };
  const Item = ({ data, value }) => (
    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
      <div className="mt-1">
        <div className="font-medium">{data}</div>
        <div className="text-blue-800 font-semibold capitalize" style={{ fontSize: '1rem' }}>
          {value}
        </div>
      </div>
    </Col>
  );
  const setFocus = (isOpen) => {
    if (isOpen) inputRef.current.focus();
  };
  const addComment = () => {
    dispatch({
      type: 'product/addComments',
      payload: {
        pathParams: {
          party_id: currentUser?.id,
        },
        body: {
          note: comments,
          custRequestId: complaintPreview?.response?.id,
          productId: complaintPreview?.response?.productId,
          productTypeId: complaintPreview?.response?.productModel?.id,
          subTypeId: 'COMPLAINT',
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

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const fileSizeConvertor = (size) => {
    if (size && size / 1024 / 1024 > 0) {
      const newSize = (size / 1024 / 1024).toFixed(2);
      return `${newSize} MB`;
    }
    return null;
  };

  const onDeleteDocumentHandler = (contentId, communicationEventId) => {
    dispatch({
      type: 'product/deleteComplaintAttachment',
      payload: {
        body: {
          communicationEventId,
          customerId: selectedComplaintRecord?.customer?.id,
          custRequestId: selectedComplaintRecord?.id,
        },
        pathParams: {
          contentId,
        },
      },
    }).then((res) => {
      if (res?.responseMessage === 'success') {
        message?.success('You have deleted attachment successfully');
        setComplaintAttachments((prev) => {
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
              {previewUrl ? 'Preview Document' : 'Complaint'}
            </span>
            <Badge className="mx-4" size="default" count={complaintPreview?.response?.status?.id} />
            <div className="mx-2">
              {complaintPreview?.response?.status?.id === 'CRQ_CLOSED' && (
                <Rating
                  onClick={() => {
                    if (!showFeedbackComplaints[0]?.experienceRating) showModal();
                  }}
                  rating={rating}
                  setRating={setRating}
                  displayFlex={true}
                  experienceRating={
                    showFeedbackComplaints?.length > 0 &&
                    showFeedbackComplaints[0]?.experienceRating
                  }
                />
              )}
            </div>
          </div>
        }
        width={selectedComplaintRecord ? 600 : 830}
        onClose={onClose}
        visible={displayDrawer}
        footer={null}
        afterVisibleChange={status && status === 'viewComplaint' && setFocus}
      >
        {' '}
        {!selectedComplaintRecord &&
          (!previewUrl ? (
            <>
              <div className="">
                <Row gutter={[24, 12]}>
                  <Item
                    data="Document Category"
                    value={selectedHierarchy?.document_category?.name}
                  />

                  <Item data="Document Type" value={selectedHierarchy?.type?.name} />

                  <Item data="Document Sub Type" value={selectedHierarchy?.sub_type?.name} />

                  <Item data="Document Title" value={selectedHierarchy?.description} />

                  <Item data="Document Number" value={selectedHierarchy?.document_number} />

                  <Item
                    data="Document Date"
                    value={moment(selectedHierarchy?.document_date).format('LL')}
                  />
                </Row>
                <Divider />

                <div className="my-4 font-bold text-lg text-blue-900">Upload Documents</div>

                <div className="w-full flex justify-between mt-4 ">
                  <div className="flex">
                    <div className="">
                      <img
                        src={treeHierarchy?.mime_type_id?.includes('pdf') ? PDF : PNG}
                        alt="PNG"
                      />
                    </div>
                    <div className=" mx-6 ">
                      <div className="text-blue-900 text-md font-semibold">
                        {treeHierarchy?.name}
                      </div>
                      <div className="text-gray-600 font-normal text-xs">
                        {moment(treeHierarchy?.updated_at).format('LL')} at{' '}
                        {moment(treeHierarchy?.updated_at).format('LT')}
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
                    <Button
                      type="primary"
                      shape="circle"
                      size="small"
                      onClick={() => {
                        setUploadUrl(treeHierarchy?.download_url);
                        setDisplayFrame(true);
                      }}
                    >
                      <EyeOutlined />
                    </Button>
                    <div className="ml-2">
                      <Popconfirm
                        title="Are you sure you want to delete this attachment?"
                        okText="Delete"
                        cancelText="Cancel"
                        okType="danger"
                      >
                        <Button type="primary" shape="circle" size="small">
                          <span className="cursor-pointer">
                            <DeleteOutlined />
                          </span>
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <iframe
              width="100%"
              height="100vh"
              title="Documents Preview"
              src={previewUrl}
              className="h-full"
              frameBorder="0"
            />
          ))}
        {selectedComplaintRecord && (
          <div className="p-6">
            <Row gutter={[24, 12]}>
              <Item data="Family" value={complaintPreview?.response?.productFamily?.name} />

              <Item data="Brand" value={complaintPreview?.response?.productCompany?.name} />

              <Item data="Product" value={complaintPreview?.response?.product?.name} />

              <Item data="Product Type" value={complaintPreview?.response?.product?.name} />

              <Item
                data="Product SubType"
                value={complaintPreview?.response?.productSubType?.name}
              />

              <Item data="Model" value={complaintPreview?.response?.productModel?.name} />

              <Item data="Department" value={complaintPreview?.response?.department?.name} />

              <Item data="Serial No." value={complaintPreview?.response?.productSerialNumber} />

              <Item
                data="Contract Status"
                value={complaintPreview?.response?.warrantyStatus ? 'Yes' : 'No'}
              />

              <Item data="Call Status" value={complaintPreview?.response?.status?.name} />

              <Item
                data="Year of Purchase"
                value={moment(complaintPreview?.response?.installationDate).format('DD MMMM YYYY')}
              />
            </Row>
            <Divider style={{ color: '#d8d8d8' }} />
            {complaintPreview?.response?.category !== 'Product' && (
              <>
                <Row gutter={[24, 12]}>
                  <Item
                    data="Accessory Brand"
                    value={complaintPreview?.response?.productCompany?.name}
                  />

                  <Item
                    data=" Accessory Model"
                    value={complaintPreview?.response?.productModel?.name}
                  />

                  <Item data="Category" value={complaintPreview?.response?.category} />

                  <Item data="Accessory" value={complaintPreview?.response?.product?.name} />

                  <Item data="Accessory Type" value={complaintPreview?.response?.product?.name} />

                  <Item
                    data="Accessory SubType"
                    value={complaintPreview?.response?.productSubType?.name}
                  />

                  <Item
                    data="Accessory Serial No."
                    value={complaintPreview?.response?.accSerialNumber}
                  />
                </Row>
                <Divider />
              </>
            )}
            <Row gutter={[24, 12]}>
              <Item data="Customer" value={complaintPreview?.response?.customer?.name || 'n/a'} />

              <Item
                data="Contact No."
                value={complaintPreview?.response?.customer?.phone?.phoneFormatted}
              />

              <Item data="Email" value={complaintPreview?.response?.customer?.email} />

              <Item data="Location" value={complaintPreview?.response?.customer?.address?.city} />
            </Row>
            <Divider />

            <Row gutter={[24, 12]}>
              <Item
                data="Assigned Person"
                value={selectedComplaintRecord?.assignee?.fullName || 'n/a'}
              />

              <Item
                data="Contact No."
                value={
                  selectedComplaintRecord?.assignee?.contact?.countryCode +
                  selectedComplaintRecord?.assignee?.contact?.areaCode +
                  selectedComplaintRecord?.assignee?.contact?.contactNumber
                }
              />

              <Item data="Email" value={selectedComplaintRecord?.assignee?.email || 'n/a'} />

              <Item
                data="Location"
                value={selectedComplaintRecord?.assignee?.address?.city || 'n/a'}
              />
            </Row>
            <Divider />

            <Row gutter={[24, 12]}>
              <Col lg={12} xl={12} md={12} sm={12} xs={12}>
                <p className="font-medium">Documents</p>
                <Select
                  className="mt-2"
                  size="middle"
                  placeholder="Select document type"
                  onSelect={(value) => {
                    setDocumentSubType(value);
                    setDocumentModel(true);
                  }}
                  value={documentSubType || undefined}
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
                    complaintAttachments?.[complaintAttachments?.length - 1]?.attachments?.[0]
                      ?.documentNumber
                  }
                />
              </Col>
            </Row>
            <Divider />
            <div>
              <div className="my-4 font-bold text-sm text-blue-900">Uploaded Documents</div>
              <div className="mt-4" style={{ maxHeight: '20vh', overflow: 'auto' }}>
                {complaintAttachments?.map((document) =>
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
            {complaintPreview?.response?.status?.id === 'CRQ_CLOSED' &&
              showFeedbackComplaints?.length > 0 && (
                <div className="font-medium mt-4 text-md mb-2">
                  Feedback
                  <div className="flex mt-2 ml-2 mr-2 ">
                    <Avatar style={{ backgroundColor: '#87d068' }}>
                      {getInitials(complaintPreview?.response?.createdBy?.displayName)}
                    </Avatar>
                    <div className="ml-2 bg-gray-200 w-full rounded ">
                      <div className="mx-4 my-2">{showFeedbackComplaints[0]?.comments}</div>
                    </div>
                  </div>
                </div>
              )}

            <div
              style={{
                height: '220px',
                overflow: 'scroll',
              }}
            >
              <div className="font-medium">Comments</div>

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
                        {getInitials(complaintPreview?.response?.createdBy?.displayName)}
                      </Avatar>
                    </div>
                    <div
                      className={`p-3 rounded shadow
                    ${
                      communication?.fromParty?.id ===
                      currentUser?.personal_details?.organizationDetails?.orgPartyId
                        ? 'bg-white flex flex-col ml-2 mr-10'
                        : 'bg-blue-600 items-end text-white flex flex-col mr-2'
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
                        }
                        `}
                      >
                        {communication?.note}
                      </div>
                      <div className="">
                        {communication?.attachments?.map((info) => (
                          <div key={info?.id}>
                            <div
                              className="cursor-pointer"
                              onClick={() => {
                                setUploadUrl(info?.downloadUrl);
                                setDisplayFrame(true);
                              }}
                            >
                              {info?.downloadUrl?.includes('png') ||
                              info?.fileType?.includes('jpg') ? (
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

            <div className=" items-center flex">
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
                <Button
                  type="primary"
                  size="medium"
                  className={classNames(styles?.uploadBtnStyling)}
                >
                  <UploadOutlined className="text-xl font-extrabold" />
                </Button>
              </Upload>
              <div className=" ml-2">
                <Button
                  style={{ float: 'right' }}
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
        )}
      </Drawer>

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

      <DocumentModel
        showDocumentModel={documentModel}
        selectedComplaintRecord={selectedComplaintRecord}
        setComplaintAttachments={setComplaintAttachments}
        setDocumentSubType={setDocumentSubType}
        fetchComplaintComments={fetchComments}
        subTypeId={documentSubType}
        setShowDocumentModel={setDocumentModel}
        status="complaint"
        docTypeName="Upload Complaint Document"
      />

      <RatingModal
        rating={rating}
        showRatingModal={showRatingModal}
        setShowRatingModal={setShowRatingModal}
        complaintPreview={complaintPreview}
      />

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
    </div>
  );
};

export default connect(({ product, user, loading }) => ({
  currentUser: user.currentUser,
  docType: product?.docType,
  treeHierarchy: product.treeHierarchy,
  productDetail: product.productDetail,
  complaintPreview: product?.ComplaintPreview,
  showFeedbackComplaints: product?.showFeedbackComplaints,
  loadingAddComments: loading.effects['product/addComments'],
  allComments: product?.allComments,
}))(DisplayDrawer);
