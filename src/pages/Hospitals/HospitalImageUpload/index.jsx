/* eslint-disable no-unused-vars */
import {
  Upload,
  Message,
  Tooltip,
  message,
  Col,
  Row,
  Spin,
  notification,
  Icon,
  Button,
} from 'antd';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { connect, useLocation } from 'dva';
import { hostname } from '@/utils/apiUtils';
import { getPageQuery } from '@/utils/utils';
import dummyLogo from '@/assets/file-types/yourlogo.jpg';
import emptySeatEmptyStateSvg from '@/assets/icons/space-empty.svg';

import {
  AimOutlined,
  EnvironmentOutlined,
  FormOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    Message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    Message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const HospitalImageUpload = ({ currentUser, dispatch, deleteImageLoading, customerRecord }) => {
  const [loading, setLoading] = useState(false);
  const [coverImgLoading, setCoverImgLoading] = useState(false);
  const { pathname } = useLocation();
  const { task } = getPageQuery();
  const [partyImage, setPartyImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [logoContentId, setLogoContentId] = useState('');
  const [partyImgContentId, setPartyImgContentId] = useState('');
  const partyId = currentUser?.personal_details?.organizationDetails?.orgPartyId;

  useEffect(() => {
    getPartyImage('LGOIMGURL')?.then((res) => {
      if (res?.data?.responseMessage === 'success') {
        setPartyImage(res?.data?.publicResourceUrl);
        setLogoContentId(res?.data?.contentId);
      }
    });
    getPartyImage('CVR_PHOTO')?.then((res) => {
      if (res?.data?.responseMessage === 'success') {
        setCoverImage(res?.data?.publicResourceUrl);
        setPartyImgContentId(res?.data?.contentId);
      }
    });
  }, []);

  const getPartyImage = (contentTypeId) => {
    return Axios.get(
      `${hostname()}/xapi/v1/party/${partyId}/profileImage?contentTypeId=${contentTypeId}`,
      {
        headers: {
          accessToken: localStorage.getItem('accessToken'),
          'content-type': 'application/x-www-form-ulencoded',
        },
      },
    );
  };

  // const removeProfilePicture = () => {
  //   dispatch({
  //     type: 'lead/deleteLeadImage',
  //     payload: {
  //       leadPartyId: partyId,
  //       content_id: partyImage.contentId,
  //     },
  //     cb: () => {
  //       notification.success({
  //         message: 'Logo is removed successfully!',
  //         duration: 3,
  //       });
  //     },
  //   });
  // };

  function onFileChangeHandler(info) {
    if (info?.file?.status === 'uploading') {
      setLoading(true);
    }
    if (info?.file?.status === 'done') {
      const data = new FormData();
      data.append('file', info?.file?.originFileObj);
      Axios.post(
        `${hostname()}/xapi/v1/party/${partyId}/profileImage?contentTypeId=LGOIMGURL&contentId=${
          logoContentId || ''
        }`,
        data,
        {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
            'content-type': 'application/x-www-form-ulencoded',
          },
        },
      )
        .then((res) => {
          getPartyImage('LGOIMGURL')?.then((res) => {
            if (res?.data?.responseMessage === 'success') {
              setPartyImage(res?.data?.publicResourceUrl);
              setLogoContentId(res?.data?.contentId);
            }
          });
          setLoading(false);
          message.success(`${info.file.name} file uploaded successfully`);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (info.file.status === 'error') {
      setLoading(false);
      message.error(`${info.file.name} file upload failed.`);
    }
  }
  const UploadCoverImage = (info) => {
    if (info?.file?.status === 'uploading') {
      setCoverImgLoading(true);
    }
    if (info?.file?.status === 'done') {
      const data = new FormData();
      data.append('file', info?.file?.originFileObj);
      Axios.post(
        `${hostname()}/xapi/v1/party/${partyId}/profileImage?contentTypeId=CVR_PHOTO&contentId=${
          partyImgContentId || ''
        }`,
        data,
        {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
            'content-type': 'application/x-www-form-ulencoded',
          },
        },
      )
        .then(() => {
          getPartyImage('CVR_PHOTO')?.then((res) => {
            if (res?.data?.responseMessage === 'success') {
              setCoverImage(res?.data?.publicResourceUrl);
              setPartyImgContentId(res?.data?.contentId);
            }
          });
          setCoverImgLoading(false);
          message.success(`${info.file.name} file uploaded successfully`);
        })
        .catch((err) => {
          message.error(err);
        });
    } else if (info?.file?.status === 'error') {
      setCoverImgLoading(false);
      message.error(`${info?.file?.name} file upload failed.`);
    }
  };
  const uploadCoverImgButton = () => (
    <div>
      <div className="relative">
        <Tooltip title={coverImage ? 'Change Hopital Image' : 'Upload Hopital Image'}>
          {/* Comment it for now */}
          {/* <img
            src={
              // <Button shape="circle" size="small">
              <FormOutlined />
              // </Button>
            }
            className="h-16 w-16 rounded-full"
            alt=""
          /> */}
          <Button shape="circle" size="small">
            <FormOutlined />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
  const uploadLogoButton = () => (
    <div>
      <div className="relative">
        <Tooltip title={partyImage ? 'Change Logo' : 'Upload Logo'}>
          <Button type="primary" shape="circle" size="small">
            <FormOutlined />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
  return (
    <div className="bg-white pb-4 rounded-lg">
      <div style={{ position: 'relative' }}>
        <img
          src={coverImage || emptySeatEmptyStateSvg}
          alt="Image Not Available"
          style={{
            width: '100%',
            objectFit: 'cover',
            height: '200px',
            borderRadius: '8px',
          }}
          className="shadow"
        />
        {/* Upload Back Cover Image */}
        <div style={{ position: 'absolute', top: '9px', right: '9px' }}>
          <Row type="flex" justify="end">
            <Col>
              <Spin spinning={coverImgLoading}>
                <Upload
                  accept=".png,.jpg,.jpeg"
                  name="avatar"
                  multiple={false}
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={UploadCoverImage}
                >
                  {task === 'hospitalbranch' ? '' : uploadCoverImgButton()}
                </Upload>
              </Spin>
            </Col>
          </Row>
        </div>
        {/* ******End of Back Cover Upload Image****** */}

        <img
          src={partyImage || dummyLogo}
          alt="Logo"
          style={{
            position: 'absolute',
            top: '116px',
            left: '20px',
            width: '120px',
            height: '120px',
            textAlign: 'right',
            zIndex: '12',
            objectFit: 'cover',
            borderRadius: '50%',
            mozBorderRadius: '50%',
            webkitBorderRadius: '50%',
            border: '4px solid white',
          }}
          className="shadow"
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-16px',
            left: '116px',
            zIndex: '14',
          }}
        >
          <Row type="flex" justify="end">
            <Col>
              <Spin spinning={loading}>
                <Upload
                  accept=".png,.jpg,.jpeg"
                  name="avatar"
                  multiple={false}
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={onFileChangeHandler}
                >
                  {task === 'hospitalbranch' ? '' : uploadLogoButton()}
                </Upload>
              </Spin>
            </Col>
          </Row>
        </div>
      </div>
      {(pathname === '/branches/profile' ||
        pathname === '/branch-profile' ||
        task === 'hospitalbranch') && (
        <div className="p-6 mt-6">
          <Row gutter={[24, 24]}>
            <Col lg={12} xl={6} md={12} sm={24} xs={24}>
              <div className="flex justify-start items-center border-2 border-gray-200 shadow-lg h-10  p-8 rounded-lg">
                <span className="text-blue-600">
                  {' '}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </span>
                <div className="ml-5">
                  <p className="m-0 text-gray-600 font-semibold text-sm">Organization Name</p>
                  <p className="m-0 font-bold capitalize">
                    {currentUser?.personal_details?.organizationDetails?.organizationName || 'N/A'}
                  </p>
                </div>
              </div>
            </Col>
            <Col lg={12} xl={6} md={12} sm={24} xs={24}>
              <div className="flex justify-start items-center border-2 border-gray-200 shadow-lg h-10  p-8 rounded-lg">
                <span className="text-blue-700">
                  <span className="text-blue-700">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="bed"
                      className="h-6 w-6"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 512"
                    >
                      <path
                        fill="currentColor"
                        d="M176 256c44.11 0 80-35.89 80-80s-35.89-80-80-80-80 35.89-80 80 35.89 80 80 80zm352-128H304c-8.84 0-16 7.16-16 16v144H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v352c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16v-48h512v48c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V240c0-61.86-50.14-112-112-112z"
                      ></path>
                    </svg>
                  </span>
                </span>
                <div className="ml-5">
                  <p className="m-0 text-gray-600 font-semibold text-sm whitespace-nowrap">
                    No. of Beds
                  </p>
                  <p className="m-0 font-bold">{customerRecord?.noOfBeds}</p>
                </div>
              </div>
            </Col>
            <Col lg={12} xl={6} md={12} sm={24} xs={24}>
              <div className="flex justify-start items-center border-2 border-gray-200 shadow-lg h-10  p-8 rounded-lg">
                <span className="text-blue-700">
                  <EnvironmentOutlined style={{ fontSize: '20px' }} />
                </span>
                <div className="ml-5">
                  <p className="m-0 text-gray-600 font-semibold text-sm whitespace-nowrap">Area</p>
                  <p className="m-0 font-bold capitalize">
                    {' '}
                    {currentUser?.personal_details?.organizationDetails?.address[0]?.addressLine1 ||
                      'N/A'}
                  </p>
                </div>
              </div>
            </Col>
            <Col lg={12} xl={6} md={12} sm={24} xs={24}>
              <div className="flex justify-start items-center border-2 border-gray-200 shadow-lg h-10  p-8 rounded-lg">
                <span className="text-blue-700">
                  <AimOutlined style={{ fontSize: '20px' }} />
                </span>
                <div className="ml-5">
                  <p className="m-0 text-gray-600 font-semibold text-sm whitespace-nowrap">
                    Pin Code
                  </p>
                  <p className="m-0 font-bold">
                    {currentUser?.personal_details?.organizationDetails?.address[0]?.postalCode ||
                      'N/A'}
                  </p>
                </div>
              </div>
            </Col>
            {task === 'hospitalbranch' && (
              <>
                <Col lg={12} xl={6} md={12} sm={24} xs={24}>
                  <div className="flex justify-start items-center border-2 border-gray-200 shadow-lg h-10  p-8 rounded-lg">
                    <span className="text-blue-700">
                      <MailOutlined style={{ fontSize: '20px' }} />
                    </span>
                    <div className="ml-5">
                      <div className="text-black">Hospital Email</div>
                      <div className="font-bold">amitmathur@gmail.com</div>
                    </div>
                  </div>
                </Col>
                <Col lg={12} xl={6} md={12} sm={24} xs={24}>
                  <div className="flex justify-start items-center border-2 border-gray-200 shadow-lg h-10  p-8 rounded-lg">
                    <span className="text-blue-700">
                      <PhoneOutlined style={{ fontSize: '20px' }} />
                    </span>
                    <div className="ml-5">
                      <div className="text-black">Hospital Phno.</div>
                      <div className="font-bold">8284083970</div>
                    </div>
                  </div>
                </Col>
              </>
            )}
          </Row>
        </div>
      )}
    </div>
  );
};

export default connect(({ loading, user }) => ({
  currentUser: user?.currentUser,
  deleteImageLoading: loading.effects['lead/deleteLeadImage'],
}))(HospitalImageUpload);
