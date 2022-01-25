import { Upload, Message, Tooltip, message, Col, Row, Spin, Icon } from 'antd';
import React, { useState } from 'react';
import Axios from 'axios';
import { hostname } from '@/utils/apiUtils';
import { connect } from 'umi';
import svg from '@/assets/icons/m-2.svg';
import styles from './index.less';

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

const ImageUpload = (props) => {
  const { partyId, partyImage } = props;
  const [loading, setLoading] = useState(false);

  const removeProfilePicture = () => {
    // dispatch action to delete
  };

  function onFileChangeHandler(info) {
    if (info.file.status === 'uploading') {
      setLoading(true);
    }
    if (info.file.status === 'done') {
      const data = new FormData();
      data.append('file', info.file.originFileObj);
      Axios.post(
        `${hostname()}/xapi/v1/party/${partyId}/profileImage?contentTypeId=LGOIMGURL`,
        data,
        {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
            'content-type': 'application/x-www-form-ulencoded',
          },
        },
      )
        .then(() => {
          setLoading(false);
          message.success(`${info.file.name} file uploaded successfully`);
        })
        .catch(() => {});
    } else if (info.file.status === 'error') {
      setLoading(false);
      message.error(`${info.file.name} file upload failed.`);
    }
  }
  const uploadButton = () => (
    <div className="cursor-pointer">
      <div className="relative">
        <Tooltip title="Upload Pic">
          <img
            src={partyImage?.publicThumbNailUrl || svg}
            className="h-24 w-24 rounded-full"
            alt=""
          />
        </Tooltip>
        {partyImage?.publicThumbNailUrl &&
          // eslint-disable-next-line no-constant-condition
          (false ? (
            <div className={`${styles.deleteImage}`}>
              <Icon type="loading" />
            </div>
          ) : (
            <Tooltip title="Delete Logo">
              <div
                className={`${styles.deleteImage} pointer-cursor`}
                onClick={(event) => {
                  event.stopPropagation();
                  removeProfilePicture();
                }}
              >
                <Icon type="close-circle" className="text-red-600" />
              </div>
            </Tooltip>
          ))}
      </div>
    </div>
  );

  return (
    <div>
      <Row type="flex" justify="center">
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
              {uploadButton()}
            </Upload>
          </Spin>
        </Col>
      </Row>
    </div>
  );
};

export default connect(null)(ImageUpload);
