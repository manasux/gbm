/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import classNames from 'classnames';
import UploadGlobalDocs from '@/components/UploadGlobalDocs';
import styles from './index.less';

const UploadDocument = ({ docTypeName, status }) => {
  const [showDocumentModel, setShowDocumentModel] = useState(false);
  const [titleName, setTitleName] = useState('');
  return (
    <>
      <div
        className={classNames(styles?.uploadbox, 'cursor-pointer border')}
        onClick={() => {
          setTitleName(docTypeName);
          setShowDocumentModel(true);
        }}
      >
        <Button
          type="primary"
          shape="circle"
          size="large"
          onClick={() => {
            setTitleName(docTypeName);
            setShowDocumentModel(true);
          }}
        >
          <UploadOutlined className="text-xl" />
        </Button>
        <div className="text-blue-500 mt-2" style={{ fontWeight: '500' }}>
          {docTypeName}
        </div>
      </div>
      <UploadGlobalDocs
        status={status}
        docTypeName={titleName}
        setShowDocumentModel={setShowDocumentModel}
        showDocumentModel={showDocumentModel}
      />
    </>
  );
};
export default UploadDocument;
