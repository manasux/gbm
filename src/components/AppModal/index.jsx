import React from 'react';
import { Modal } from 'antd';
import styles from './index.less';

const AppModal = (props) => {
  const { showModal, titleName, subtitle, setShowModal, children, footer } = props;
  return (
    <Modal
      {...props}
      centered
      maskClosable={false}
      visible={showModal}
      onCancel={() => {
        setShowModal(false);
      }}
      footer={footer}
      className={`${styles.AppModal} AppModal`}
    >
      <div className={`${styles.ModalTitle} text-gray-900`}>
        {titleName}
        <div className={`${styles.ModalSubTitle}`}>{subtitle}</div>
      </div>
      {children}
    </Modal>
  );
};
export default AppModal;
