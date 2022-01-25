import Breadcrumbs from '@/components/BreadCrumbs';
import Page from '@/components/Page';
import { EyeOutlined, DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import { Col, Collapse, Row, Tooltip, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import PreviewImage from '@/components/PreviewImage';
import CheckValidation from '@/components/CheckValidation';
import styles from './index.less';
import AddProductAccessory from '../AllProducts/AddProductAccessory';

const { Panel } = Collapse;

const ViewProduct = ({ match, dispatch, productDetail }) => {
  const [previewAttachment, setPreviewAttachment] = useState({
    visible: false,
    index: 0,
    imageList: [],
  });
  const [downloadAttachmentLoading, setDownloadAttachmentLoading] = useState({});
  const [addAccessoryModal, setAddAccessoryModal] = useState({
    visible: false,
    product: null,
  });

  const uploadedImg =
    'https://cdn-test.dazzleroad.com/cflare-assets/assets/images/CaratFlare_files/5eeda7310aad897d6ddd8593_icons8-check-file-64%20(1).png';

  const unUploadedImg =
    'https://cdn-test.dazzleroad.com/cflare-assets/assets/images/CaratFlare_files/5ef05928d97fc35dfe8b8a1b_File%20not%20uploaded%20icon.png';

  const getProductDetails = () => {
    dispatch({
      type: 'product/getProductDetails',
      payload: {
        productId: match?.params?.id,
      },
    });
  };

  useEffect(() => {
    getProductDetails();
  }, []);

  const viewAttachment = (contents) => {
    const imageList = contents.map((content) => content?.download_url);
    setPreviewAttachment({
      visible: true,
      index: 0,
      imageList,
    });
  };

  const downloadAttachment = (content) => {
    setDownloadAttachmentLoading({ [content.id]: true });
    fetch(`${content.download_url}`).then((response) => {
      response.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${content.name}`;
        setDownloadAttachmentLoading({});
        a.click();
      });
    });
  };

  const DocumentView = ({ name, value, documentNameProperty, contents }) => {
    return (
      <>
        <div className="p-2 pl-0 border-b text-sm text-gray-700 font-medium">
          {name}: <span className="text-blue-600">{value}</span>
        </div>
        <Row gutter={12}>
          {contents?.length > 0 ? (
            contents?.map((content) => (
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <div
                  className="flex items-center justify-between mt-2 mb-2 border rounded-lg bg-gray-100 border-dashed"
                  key={content?.id}
                >
                  <div className="p-2">
                    <img
                      src={content?.is_verified === 'Y' ? uploadedImg : unUploadedImg}
                      width={40}
                      alt="upload-image1"
                    />
                  </div>
                  <div className="p-2 flex-auto flex">
                    <div className="text-xs text-blue-800 font-semibold leading-none">
                      {content[documentNameProperty]}
                      <div className="font-normal">{document.shortText}</div>
                      {content?.verification_date && (
                        <div className="mt-1">
                          <span className="text-grey-600 text-xs">
                            {content?.is_verified === 'Y' ? 'Verified' : 'Rejected'} on{' '}
                          </span>
                          <span className="text-blue-900 text-xs">
                            {moment(content?.verification_date).format('LL')}
                          </span>
                        </div>
                      )}
                      <div
                        className={`${
                          content?.is_verified === 'Y' ? 'text-green-600' : 'text-red-600'
                        } text-xs mt-1`}
                      >
                        {content?.is_verified === 'Y' ? 'Approved' : 'Rejected'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center px-2">
                    <Tooltip title="View Attachment">
                      <div
                        className="cursor-pointer mr-2"
                        style={{ fontSize: 18 }}
                        onClick={() => viewAttachment(contents)}
                      >
                        <EyeOutlined />
                      </div>
                    </Tooltip>
                  </div>
                  <Tooltip title="Download Attachment">
                    <div
                      className="cursor-pointer mr-2 text-blue-600"
                      style={{ fontSize: 18 }}
                      onClick={() => downloadAttachment(content)}
                    >
                      {downloadAttachmentLoading[content?.id] ? (
                        <LoadingOutlined />
                      ) : (
                        <DownloadOutlined />
                      )}
                    </div>
                  </Tooltip>
                </div>
              </Col>
            ))
          ) : (
            <div className="flex items-center p-4 justify-between border rounded-lg bg-orange-100 border-dashed mt-2">
              <p className="text-xs m-0 p-0 text-orange-800 font-semibold leading-none">
                No attachment uploaded!
              </p>
            </div>
          )}
        </Row>
      </>
    );
  };

  return (
    <div className="container mx-auto">
      <Page
        title="View product"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'All Products',
                path: '/products/all',
              },
              {
                name: match?.params?.id,
                path: `/products/${match?.params?.id}`,
              },
            ]}
          />
        }
        primaryAction={
          <Button
            type="primary"
            onClick={() =>
              setAddAccessoryModal({
                visible: true,
                product: null,
              })
            }
          >
            Add product accessory
          </Button>
        }
      >
        <div className="mb-4 mt-4">
          <Collapse defaultActiveKey="basic_details">
            <Panel
              className="bg-white"
              header={<div className="text-base font-medium bg-white">Product basic details</div>}
              key="basic_details"
            >
              <Row gutter={16}>
                <Col xl={8} lg={8} md={24} sm={24} xs={24}>
                  <div className="bg-white shadow rounded">
                    <div className="p-3 flex justify-between border-b text-sm text-gray-700 font-medium">
                      <div>Brand</div>
                      <div>
                        <span className="text-blue-600">{productDetail?.brand_info?.name}</span>
                        {productDetail?.brand_info?.label && (
                          <span className="text-blue-600">
                            {' '}
                            - {productDetail?.brand_info?.label}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-3 flex justify-between  border-b text-sm text-gray-700 font-medium">
                      <div>Family</div>
                      <div>
                        <span className="text-blue-600">{productDetail?.family_info?.name}</span>
                        {productDetail?.family_info?.label && (
                          <span className="text-blue-600">
                            {' '}
                            - {productDetail?.family_info?.label}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-3 flex justify-between border-b text-sm text-gray-700 font-medium">
                      <div>Type</div>
                      <div>
                        <span className="text-blue-600">{productDetail?.type_info?.name}</span>
                        {productDetail?.type_info?.label && (
                          <span className="text-blue-600">
                            {' '}
                            - {productDetail?.type_info?.label}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-3 flex justify-between border-b text-sm text-gray-700 font-medium">
                      <div>Sub-type</div>
                      <div>
                        <span className="text-blue-600">{productDetail?.sub_type_info?.name}</span>
                        {productDetail?.sub_type_info?.label && (
                          <span className="text-blue-600">
                            {' '}
                            - {productDetail?.sub_type_info?.label}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-3 flex justify-between text-sm text-gray-700 font-medium">
                      <div>Department</div>
                      <div>
                        <span className="text-blue-600">
                          {productDetail?.department_info?.name}
                        </span>
                        {productDetail?.department_info?.label && (
                          <span className="text-blue-600">
                            {' '}
                            - {productDetail?.department_info?.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>

                <Col xl={16} lg={16} md={24} sm={24} xs={24}>
                  <div className={`${styles.AttachmentContainer} bg-white shadow rounded`}>
                    <div className="bg-white p-4 border-b">
                      <div className="text-lg font-semibold text-blue-600">Model</div>
                      <DocumentView
                        name="Modal number"
                        value={productDetail?.model_number}
                        documentNameProperty="name"
                        contents={productDetail?.model_content}
                      />
                    </div>
                    <div className="bg-white p-4 border-b">
                      <div className="text-lg font-semibold text-blue-600">Installation date</div>
                      <DocumentView
                        name="Installation date"
                        value={moment(productDetail?.installation_date).format('LL')}
                        documentNameProperty="name"
                        contents={productDetail?.installation_date_content}
                      />
                    </div>
                    <div className="bg-white p-4 border-b">
                      <div className="text-lg font-semibold text-blue-600">Serial Number</div>
                      <DocumentView
                        name="Serial number"
                        value={productDetail?.serial_number}
                        documentNameProperty="name"
                        contents={productDetail?.serial_number_content}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </div>

        <div className=" mb-4 mt-4">
          <Collapse>
            <Panel
              disabled={productDetail?.has_warranty !== 'Y'}
              className="bg-white"
              header={<div className="text-base font-medium bg-white">Warranty details</div>}
              key="warranty_details"
            >
              <Row gutter={16}>
                <Col xl={8} lg={8} md={24} sm={24} xs={24}>
                  <div className={`${styles.BackgroundColor} shadow rounded`}>
                    <div className="p-3 flex justify-between border-b text-sm text-gray-700 font-medium">
                      <div>Start date</div>
                      <div>
                        <span className="text-blue-600">
                          {moment(productDetail?.warranty_start_date).format('LL')}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 flex justify-between text-sm text-gray-700 font-medium">
                      <div>End date</div>
                      <div>
                        <span className="text-blue-600">
                          {moment(productDetail?.warranty_end_date).format('LL')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col xl={16} lg={16} md={24} sm={24} xs={24}>
                  <div className={`${styles.AttachmentContainer} bg-white shadow rounded`}>
                    <div className="bg-white p-4 border-b">
                      <div className="text-lg font-semibold text-blue-600">Warranty</div>
                      <DocumentView
                        name="Warranty"
                        value={`${productDetail?.warranty} year(s)`}
                        documentNameProperty="name"
                        contents={productDetail?.warranty_content}
                      />
                    </div>
                    <div className="bg-white p-4 border-b">
                      <div className="text-lg font-semibold text-blue-600">PMS Number</div>
                      <DocumentView
                        name="PMS Number"
                        value={productDetail?.pms}
                        documentNameProperty="name"
                        contents={productDetail?.pms_content}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </div>

        <div className=" mb-4 mt-4">
          <Collapse>
            <Panel
              disabled={productDetail?.after_warranty !== 'Y'}
              className="bg-white"
              header={<div className="text-base font-medium bg-white">Contract details</div>}
              key="contract_details"
            >
              <Row gutter={16}>
                <Col xl={8} lg={8} md={24} sm={24} xs={24}>
                  <div className="bg-white shadow rounded">
                    <div className="p-3 flex justify-between border-b text-sm text-gray-700 font-medium">
                      <div>Start date</div>
                      <div>
                        <span className="text-blue-600">
                          {moment(productDetail?.contract_details?.start_date).format('LL')}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 flex justify-between border-b text-sm text-gray-700 font-medium">
                      <div>End date</div>
                      <div>
                        <span className="text-blue-600">
                          {moment(productDetail?.contract_details?.end_date).format('LL')}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 flex justify-between text-sm text-gray-700 font-medium">
                      <div>Contract period</div>
                      <div>
                        <span className="text-blue-600">
                          {productDetail?.contract_details?.period} year(s)
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col xl={16} lg={16} md={24} sm={24} xs={24}>
                  <div className={`${styles.AttachmentContainer} bg-white shadow rounded`}>
                    <div className="bg-white p-4 border-b">
                      <div className="text-lg font-semibold text-blue-600">Contract type</div>
                      <DocumentView
                        name="Contract type"
                        value={productDetail?.contract_details?.type_desc}
                        documentNameProperty="name"
                        contents={productDetail?.contract_details?.type_content}
                      />
                    </div>
                    <div className="bg-white p-4 border-b">
                      <div className="text-lg font-semibold text-blue-600">PMS Number</div>
                      <DocumentView
                        name="PMS Number"
                        value={productDetail?.contract_details?.pms}
                        documentNameProperty="name"
                        contents={productDetail?.contract_details?.pms_content}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </div>
        <CheckValidation show={addAccessoryModal.visible}>
          <AddProductAccessory
            visible={addAccessoryModal.visible}
            product={addAccessoryModal.product}
            setVisible={(isVisible) =>
              setAddAccessoryModal({
                visible: isVisible || false,
                product: null,
              })
            }
          />
        </CheckValidation>
        <CheckValidation show={previewAttachment.visible}>
          <PreviewImage
            lightbox={previewAttachment}
            setLightbox={setPreviewAttachment}
            imageList={previewAttachment?.imageList}
          />
        </CheckValidation>
      </Page>
    </div>
  );
};

export default connect(({ loading, product }) => ({
  loading: loading.effects['product/getProductData'],
  productDetail: product.productDetail,
}))(ViewProduct);
