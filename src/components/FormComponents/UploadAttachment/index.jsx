import React, { useState, useRef } from 'react';
import { Form, Button, message, Modal, Row, Col, Input, Carousel } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'umi';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import { UploadOutlined, LoadingOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import styles from './index.less';

// 5 mb
const maxAllowedFileSize = 1024 * 1024 * 5;

const UploadAttachment = ({
  name,
  rules,
  label,
  multiple,
  dispatch,
  setFields,
  value,
  heading,
}) => {
  const contentStyle = {
    backgroundColor: '#364d79',
  };
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  // const [lightbox, setLightbox] = useState({
  //   index: 0,
  //   visible: false,
  // });

  const fileRef = useRef();

  const uploadedImg =
    'https://cdn-test.dazzleroad.com/cflare-assets/assets/images/CaratFlare_files/5eeda7310aad897d6ddd8593_icons8-check-file-64%20(1).png';

  const [files, setFiles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onFileChange = async (event) => {
    setLoading(true);
    const allFiles = Array.from(event.target.files);
    // show the error message of some of the files are greater than 5 mb limit
    if (allFiles.some((singleFile) => singleFile.size > maxAllowedFileSize)) {
      message.error('Cannot upload some files due to 5 mb max size allowed');
    }
    // filter out the files that are greater than 5 mb
    allFiles
      .filter((f) => f.size < maxAllowedFileSize)
      .forEach((singleFile) => {
        return new Promise((resolve, reject) => {
          // custom logic of upload files and generate content ids
          const formData = new FormData();
          formData.append('file', singleFile);
          dispatch({
            type: 'common/uploadContent',
            payload: formData,
          })
            .then((res) => {
              if (res) {
                setFields(res?.contentId);
                setFiles((prev) =>
                  prev.concat({
                    uid: (prev.length + 1).toString(),
                    contentId: res?.contentId,
                    name: singleFile.name,
                    status: 'done',
                    url: res.downloadUrl,
                  }),
                );
                setLoading(false);
                setIsModalVisible(true);
                resolve();
              }
            })
            .catch(() => {
              return reject();
            });
        });
      });
  };

  const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: 'block', background: '#005be7', borderRadius: '50%' }}
        onClick={onClick}
      />
    );
  };

  const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: 'block', background: '#005be7', borderRadius: '50%' }}
        onClick={onClick}
      />
    );
  };
  const settings = {
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <>
      {/* replaced button with icon and added no style */}
      <Form.Item name={name} colon={false} rules={rules} label={label}>
        <div className="hidden">
          {/* Using the native input file type to achieve more control over file upload */}

          <input
            type="file"
            ref={fileRef}
            onChange={onFileChange}
            multiple={!multiple}
            accept=".png,.jpg,.jpeg"
          />
        </div>

        <Button
          className={classNames(styles.svgStyles)}
          style={{ borderRadius: '4px' }}
          type="primary"
          size="large"
          icon={
            !loading ? (
              <UploadOutlined style={{ fontSize: '1rem' }} />
            ) : (
              <LoadingOutlined style={{ fontSize: '1rem' }} />
            )
          }
          onClick={() => fileRef.current.click()}
        />
      </Form.Item>
      {/* will be used later */}
      <Modal
        width={1400}
        footer={null}
        bodyStyle={{ margin: 0, padding: 0, height: '75vh' }}
        centered
        title="Preview"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        <div className="m-4">
          <div className={classNames('formLabel', styles.textStyles)}>{heading}</div>
          <Input size="large" defaultValue={value} />
        </div>

        <Row gutter={[24, 12]}>
          <Col span={6}>
            <div className=" rounded" style={{ maxHeight: '65vh', overflow: 'auto' }}>
              <div className="m-4">
                {files?.length > 0 &&
                  files.map((file) => (
                    <div
                      className="items-center mt-4 my-1 border rounded-lg bg-gray-100 border-dashed w-full "
                      key={file?.contentId}
                    >
                      <div className="px-2">
                        <img src={uploadedImg} width={20} alt="upload-image1" />
                      </div>
                      <div className="p-2 flex-auto flex">
                        <div className="text-xs text-blue-800 font-semibold leading-none">
                          {file?.name}
                          <div className="font-normal">{file?.shortText}</div>
                        </div>
                      </div>
                      <div className="flex items-center px-2">
                        <div
                          id="previewButton"
                          className="cursor-pointer ml-3 text-black-600"
                          onClick={(e) => {
                            e.preventDefault();
                            setPreviewImage(file?.url);
                            e.stopPropagation();
                            // setLightbox({
                            //   index: 0,
                            //   visible: true,
                            // });
                          }}
                        >
                          <EyeOutlined />
                        </div>

                        <div
                          id="DeleteButton"
                          className="cursor-pointer ml-3 text-red-600"
                          onClick={(e) => {
                            e.preventDefault();
                            setFiles((prev) => prev.filter((f) => f.contentId !== file.contentId));
                          }}
                        >
                          <DeleteOutlined />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Col>
          <Col span={18}>
            {!previewImage ? (
              <div className="mx-2" style={{ marginTop: '20%' }}>
                <EmptyStateContainer />
              </div>
            ) : (
              <Carousel
                arrows
                {...settings}
                afterChange={(a) => setPreviewImage(files[a]?.url)}
                className="mx-8"
              >
                {files.map((file) => (
                  <div style={contentStyle} key={file?.url}>
                    <iframe
                      title="Documents Preview"
                      src={previewImage}
                      style={{
                        height: '64vh',
                        width: '52vw',
                      }}
                      frameBorder="0"
                    />
                  </div>
                ))}
              </Carousel>
            )}
          </Col>
        </Row>
      </Modal>
    </>
  );
};

UploadAttachment.propTypes = {
  rules: PropTypes.array,
  label: PropTypes.string,
  multiple: PropTypes.bool,
  setFields: PropTypes.func,
};

export default connect()(UploadAttachment);
