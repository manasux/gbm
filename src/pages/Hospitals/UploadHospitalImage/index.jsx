/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Upload } from 'antd';
import styles from './index.less';
import { useLocation } from 'umi';
import classNames from 'classnames';
import { AimOutlined, EnvironmentOutlined, FormOutlined, TeamOutlined } from '@ant-design/icons';
// import BED from '@/assets/file-types/bed-solid.svg';

const UploadHospitalImage = ({
  setContentInfo,
  contentInfo,
  filelist,
  setFilelist,
  currentUser,
}) => {
  const [previewImg, setPreviewImg] = useState();
  const { pathname } = useLocation();
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = (contentInfo) => {
    setPreviewImg(URL.createObjectURL(contentInfo));
  };
  // useEffect(() => {
  //   if (contentInfo) handlePreview();
  // }, [contentInfo]);
  return (
    <>
      <div className={classNames(styles?.globalBox)}>
        {contentInfo && (
          <img
            src={URL.createObjectURL(contentInfo)}
            alt="avatar"
            style={{ width: '100%', objectFit: 'cover', height: '148px', borderRadius: '8px' }}
          />
        )}
        <Upload
          accept=".png,.jpg,.jpeg"
          beforeUpload={async (content) => {
            setContentInfo(content);
            let file;
            await toBase64(content).then((res) => {
              file = res;
            });
            setFilelist(file);
            return false;
          }}
          // onchange={(content) => handlePreview(content)}
          maxCount={1}
          // multiple={false}
          // listType="picture-card"
          // openFileDialogOnClick={false}
        >
          <div className="absolute right-2 top-2">
            <Button shape="circle" size="small">
              <FormOutlined />
            </Button>
          </div>
        </Upload>
        <img
          src="https://image.shutterstock.com/image-vector/hospital-building-flat-icon-600w-1035427231.jpg"
          alt="avatar"
          style={{
            position: 'absolute',
            top: '60px',
            left: '20px',
            width: '120px',
            height: '120px',
            textAlign: 'right',
            zIndex: '9',
            objectFit: 'cover',
            borderRadius: '50%',
            mozBorderRadius: '50%',
            webkitBorderRadius: '50%',
            border: '4px solid white',
          }}
        />
        <div className="absolute z-20  bottom-1">
          <Upload
            accept=".png,.jpg,.jpeg"
            beforeUpload={async (content) => {
              setContentInfo([].concat(content, contentInfo));
              let file;
              await toBase64(content).then((res) => {
                file = res;
              });

              setFilelist([].concat(file, filelist));

              return false;
            }}
            fileList={[]}
          >
            {/* <div className="absolute z-20 left-40 bottom-1"> */}
            <div>
              <Button shape="circle" type="primary" size="small">
                <FormOutlined />
              </Button>
            </div>
          </Upload>
        </div>
      </div>
      {pathname === '/hospital/profile' && (
        <div className="mt-10 mb-10">
          <Row gutter={[24, 24]}>
            <Col lg={12} xl={6} md={12} sm={24} xs={24}>
              <div className="flex justify-start items-center border-2 border-gray-200 shadow-xl  h-10  p-8 rounded-l hover:border-transparent">
                <span className="text-blue-700">
                  {' '}
                  <TeamOutlined style={{ fontSize: '20px' }} />
                </span>
                <div className="ml-5">
                  <div className="text-black">Organization Name</div>
                  <div className="font-bold">
                    {currentUser?.personal_details?.organization_details?.organization_name}
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={12} xl={6} md={12} sm={24} xs={24}>
              <div className="flex justify-start items-center border-2 border-gray-200 shadow-xl  h-10  p-8 rounded-l">
                <span className="text-blue-700">
                  {' '}
                  <span className="text-blue-700">
                    <img
                      src="https://image.shutterstock.com/image-vector/single-bed-linear-icon-line-260nw-1266300556.jpg"
                      style={{ height: '40px', backgroundColor: 'blue' }}
                    />
                    {/* <a className="fas fa-bed" href="#" />
                     */}
                    {/* <BedIcon /> */}
                    {/* {BED} */}
                  </span>
                </span>
                <div className="ml-5">
                  <div className="text-black">No. of Beds</div>
                  <div className="font-bold">100</div>
                </div>
              </div>
            </Col>
            <Col lg={12} xl={6} md={12} sm={24} xs={24}>
              <div className="flex justify-start items-center border-2 border-gray-200 shadow-xl  h-10  p-8 rounded-l">
                <span className="text-blue-700">
                  <EnvironmentOutlined style={{ fontSize: '20px' }} />
                </span>
                <div className="ml-5">
                  <div className="text-black">Area</div>
                  <div className="font-bold">
                    {' '}
                    {
                      currentUser?.personal_details?.organization_details?.address[0]
                        ?.address_line_1
                    }
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={12} xl={6} md={12} sm={24} xs={24}>
              <div className="flex justify-start items-center border-2 border-gray-200 shadow-xl  h-10  p-8 rounded-l">
                <span className="text-blue-700">
                  <AimOutlined style={{ fontSize: '20px' }} />
                </span>
                <div className="ml-5">
                  <div className="text-black">PinCode</div>
                  <div className="font-bold">
                    {currentUser?.personal_details?.organization_details?.address[0]?.postal_code}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default UploadHospitalImage;
