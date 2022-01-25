/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import { MoreOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Popover } from 'antd';
import DisplayDrawer from '@/components/DisplayDrawer';
import classNames from 'classnames';
import PNG from '@/assets/file-types/png_doc.svg';
import PDF from '@/assets/file-types/pdf_doc.svg';
import styles from '../../index.less';

const UploadDocuments = ({ setContentInfo, contentInfo, filelist, setFilelist }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState();

  const [popoverVisibility, setPopoverVisibility] = useState({});

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = (file) => {
    setPreviewVisible(true);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleDelete = (info) => {
    setFilelist(() =>
      filelist?.filter((__, i) => i !== contentInfo.findIndex((item) => item?.uid === info?.uid)),
    );
    setContentInfo(() =>
      contentInfo?.filter(
        (list) =>
          list?.uid !==
          contentInfo[contentInfo.findIndex((listInfo) => listInfo?.uid === info?.uid)]?.uid,
      ),
    );
  };

  const fileSizeConvertor = (size) => {
    if (size && size / 1024 / 1024 > 0) {
      const newSize = (size / 1024 / 1024).toFixed(2);
      return `${newSize} MB`;
    }
    return null;
  };

  return (
    <div>
      <>
        <div className={classNames(filelist?.length > 0 ? '' : styles?.globalBox, 'mt-6')}>
          <div className={classNames(filelist?.length > 0 && 'flex')}>
            {filelist?.length > 0 &&
              contentInfo?.map((info, index) => (
                <>
                  <div className={classNames(styles?.imageCards)}>
                    <div className="flex">
                      <img
                        src={info?.type?.includes('pdf') ? PDF : PNG}
                        alt="PNG"
                        style={{ margin: 'auto', marginLeft: '1.8rem' }}
                      />
                      <Popover
                        visible={popoverVisibility[index] && !previewVisible}
                        content={() => (
                          <div className="cursor-pointer">
                            <div
                              className="border-b hover:bg-gray-200 px-6 py-1"
                              onClick={() => {
                                setPopoverVisibility({ [index]: false });
                                handlePreview(info);
                              }}
                            >
                              View
                            </div>
                            <div
                              className=" hover:bg-gray-200 px-6 py-1"
                              onClick={() => {
                                handleDelete(info);
                              }}
                            >
                              Delete
                            </div>
                          </div>
                        )}
                        trigger="click"
                      >
                        <MoreOutlined
                          onClick={() => {
                            setPopoverVisibility({
                              [index]: !popoverVisibility[index],
                            });
                          }}
                          style={{ float: 'right' }}
                          className="text-lg cursor-pointer"
                        />
                      </Popover>
                    </div>
                    <div className="text-xs">{`error_message${index + 1}.${
                      info?.type?.split('/')[1]
                    }`}</div>
                    <div className="text-xs text-gray-600">{fileSizeConvertor(info?.size)}</div>
                  </div>
                </>
              ))}

            <Upload
              accept=".png,.jpg,.jpeg,.pdf"
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
              <div className={classNames(filelist?.length > 0 && styles?.subBtn)}>
                <Button type="primary" shape="circle" size="large">
                  {filelist?.length > 0 ? (
                    <PlusOutlined className="text-xl font-extrabold" />
                  ) : (
                    <UploadOutlined className="text-xl font-extrabold" />
                  )}
                </Button>
              </div>
            </Upload>
          </div>
          {!filelist?.length > 0 && (
            <div className="text-blue-500 mt-1.5" style={{ fontWeight: '500' }}>
              Upload Error messages
            </div>
          )}
        </div>
      </>

      <DisplayDrawer
        previewUrl={previewImage}
        setDisplayDrawer={setPreviewVisible}
        displayDrawer={previewVisible}
        setPopoverVisibility={setPopoverVisibility}
      />
    </div>
  );
};

export default UploadDocuments;
