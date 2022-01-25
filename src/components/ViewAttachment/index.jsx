import React, { useState } from 'react';
import { Popconfirm, Spin } from 'antd';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import PDF from '@/assets/file-types/pdf-icon.svg';
import PNG from '@/assets/file-types/png.svg';
import JPG from '@/assets/file-types/jpg.svg';
import DOC from '@/assets/file-types/doc.svg';
import GIF from '@/assets/file-types/gif.svg';
import TXT from '@/assets/file-types/txt.svg';
import styles from './index.less';

const getAtachmentType = (contentName) => {
  const contentNameFormatted = contentName.toUpperCase();
  const contentType = contentNameFormatted.substring(
    contentNameFormatted.lastIndexOf('.') + 1,
    contentNameFormatted.length,
  );
  switch (contentType) {
    case 'PDF':
      return <img className={styles.image} src={PDF} alt="PDF" />;
    case 'PNG':
      return <img className={styles.image} src={PNG} alt="PNG" />;
    case 'JPG':
      return <img className={styles.image} src={JPG} alt="JPG" />;
    case 'DOC':
      return <img className={styles.image} src={DOC} alt="DOC" />;
    case 'GIF':
      return <img className={styles.image} src={GIF} alt="GIF" />;
    case 'TXT':
      return <img className={styles.image} src={TXT} alt="TXT" />;
    default:
      return <img className={styles.image} src={PNG} alt="PNG" />;
  }
};

const ViewAttachment = ({ onRemove, attachment, readOnly, onView }) => {
  const [state, setState] = useState({ unloading: [] });

  const downloadAttchmentFile = () => {
    const load = state.unloading.slice();
    load[attachment.id] = true;
    setState({
      unloading: load,
    });
    const urll = attachment.thumbNailUrl;
    fetch(`${urll}`).then((response) => {
      response.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${attachment.name}`;
        load[attachment.id] = false;
        setState({
          unloading: load,
        });
        a.click();
      });
    });
  };

  const attachmentParts = attachment.thumbNailUrl.split('/');
  const attachmentName = attachmentParts[attachmentParts.length - 1];

  return (
    <li>
      <Spin spinning={state.unloading[attachment.contentId] || false} delay={0}>
        <a
          className={[
            styles.docPreviewWrapper,
            `${attachment.is_attachable ? styles.active : ''}`,
          ].join(' ')}
        >
          <div className={styles.aSH}>
            <span>
              <a
                className="ant-upload-list-item-thumbnail"
                href={attachment.thumbNailUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={attachment.thumbNailUrl}
                  alt="attachment"
                  className={styles.listItemImage}
                />
              </a>
            </span>
            <div className={styles.aYy}>
              <div className={styles.aYA}>{getAtachmentType(attachmentName)}</div>
              <div className={styles.aYz}>
                <div className={styles.aQA}>
                  <div className={styles.aV3} id=":lj">
                    {attachment.name}
                  </div>

                  <div className={styles.font_mi}>{attachment.size_formatted}</div>
                </div>
                <div className={styles.ayp}>
                  <div className={[styles.font_mi, styles.font_shade_light].join(' ')}>
                    {attachment.contentId ? 'Task Attachment' : ''}
                  </div>
                  <div className={[styles.m_t_5, 'flex justify-around items-center'].join(' ')}>
                    <span className={styles.btn_attachment_action}>
                      <a title="View file" onClick={onView}>
                        <EyeOutlined />
                      </a>
                    </span>
                    <span className={styles.btn_attachment_action}>
                      <a title="Download file" onClick={downloadAttchmentFile}>
                        <DownloadOutlined style={{ color: 'green' }} />
                      </a>
                    </span>
                    {!readOnly && (
                      <Popconfirm
                        title="Are you sure to delete this attachment?"
                        onConfirm={onRemove}
                        okText="Delete"
                        cancelText="Cancel"
                        okType="danger"
                      >
                        <span className={[styles.btn_attachment_action].join(' ')}>
                          <i
                            aria-label="icon: delete"
                            title="Remove file"
                            tabIndex="-1"
                            style={{ color: '#e81123' }}
                            className="anticon anticon-delete"
                          >
                            <svg
                              viewBox="64 64 896 896"
                              focusable="false"
                              className=""
                              data-icon="delete"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" />
                            </svg>
                          </i>
                        </span>
                      </Popconfirm>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
      </Spin>
    </li>
  );
};

export default ViewAttachment;
