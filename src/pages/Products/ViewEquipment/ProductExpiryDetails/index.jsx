/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import NumberInput from '@/components/FormComponents/NumberInput';
import SelectDate from '@/components/FormComponents/SelectDate';
import classNames from 'classnames';
import styles from './index.less';
import UploadFormContent from '../UploadFormContent';

const ProductExpiryDetails = ({
  form,
  warrantyFilelist,
  setWarrantyFilelist,
  pmsFilelist,
  setPmsFilelist,
  warrantyContentInfo,
  setWarrantyContentInfo,
  pmsContentInfo,
  setPmsContentInfo,
  isVerified,
}) => {
  const [uploadContentModel, setUploadContentModel] = useState(false);
  const [docUploadName, setDocUploadName] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const warrantyPeriod = form?.getFieldValue(['warranty_details', 'warranty']);
  const pmsPeriod = form?.getFieldValue(['pms_details', 'pms']);
  const warrantyStartDate = form?.getFieldValue('warranty_start_date');
  const warrantyEndDate = form?.getFieldValue('warranty_end_date');

  const [warrantyValue, setWarrantyValue] = useState(1);

  useEffect(() => {
    form?.setFieldsValue({
      warranty_details: { warranty: 1 },
      pms_details: { pms: 1 },
    });
  }, []);

  const onWarrantyPeriodChange = (e) => {
    form?.setFieldsValue({
      warranty_start_date: '',
      warranty_end_date: '',
    });
    setWarrantyValue(e?.target?.value);
  };

  useEffect(() => {
    const date = form?.getFieldValue('warranty_start_date');
    date &&
      form?.setFieldsValue({
        warranty_end_date: moment(date).add(warrantyValue, 'years').subtract(1, 'days'),
      });
  }, [warrantyValue]);

  return (
    <div className={classNames('bg-white shadow rounded mb-4 border-b', styles.mainDiv)}>
      <Row gutter={[24, 0]} className="px-6 pt-3">
        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
              <div className={classNames('formLabel', styles.textStyles)}>
                Warranty Period{' '}
                <span
                  className={classNames(' bg-gray-200 rounded px-2 text-blue-700', styles.info)}
                >
                  <i>i</i>
                </span>
              </div>
              <div className="flex ">
                <div className=" w-full">
                  <NumberInput
                    isDisabled={isVerified}
                    rules={[
                      {
                        required: (pmsPeriod || warrantyStartDate || warrantyEndDate) && true,
                        message: 'Please enter number of years',
                      },
                    ]}
                    name={['warranty_details', 'warranty']}
                    setWarrantyValue={setWarrantyValue}
                    onChange={onWarrantyPeriodChange}
                    placeholder="Period"
                    form={form}
                    initialValue={1}
                    min={1}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Col>

        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <Row>
            <div className={classNames('formLabel', styles.textStyles)}>
              PMS{' '}
              <span className={classNames(' bg-gray-200 rounded px-2 text-blue-700', styles.info)}>
                <i>i</i>
              </span>
            </div>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
              <div className="flex ">
                <div className=" w-full">
                  <NumberInput
                    isDisabled={isVerified}
                    rules={[
                      {
                        required: (warrantyPeriod || warrantyStartDate || warrantyEndDate) && true,
                        message: 'Please enter PMS number',
                      },
                    ]}
                    name={['pms_details', 'pms']}
                    placeholder="PMS Visits in a year"
                    setFields={(id) => {
                      form?.setFieldsValue({
                        pms_details: { pms: id },
                      });
                    }}
                    min={1}
                    initialValue={1}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Col>

        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <div className={classNames('formLabel', styles.textStyles)}>Start Date</div>
          <SelectDate
            disabledDate={(current) =>
              current &&
              current.valueOf() < form.getFieldValue('installation_details')?.installation_date
            }
            disabled={isVerified}
            rules={[
              {
                required: true,
                message: 'Please select start date',
              },
            ]}
            name="warranty_start_date"
            placeholder="Start Date"
            onChange={(date) => {
              form?.setFieldsValue({
                warranty_end_date: moment(date).add(warrantyValue, 'years').subtract(1, 'days'),
              });
            }}
          />
        </Col>
        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <div className={classNames('formLabel', styles.textStyles)}>End Date</div>
          <SelectDate
            disabledDate={(current) =>
              current && current.valueOf() < form?.getFieldValue('warranty_start_date')
            }
            disabled={true}
            onChange={(date) => {}}
            name="warranty_end_date"
            placeholder="End Date"
          />
        </Col>
      </Row>
      <UploadFormContent
        form={form}
        name={docUploadName}
        setUploadContentModel={setUploadContentModel}
        setUploadStatus={setUploadStatus}
        uploadStatus={uploadStatus}
        uploadContentModel={uploadContentModel}
        filelist={docUploadName === 'warrantyPeriod' ? warrantyFilelist : pmsFilelist}
        setFilelist={docUploadName === 'warrantyPeriod' ? setWarrantyFilelist : setPmsFilelist}
        contentInfo={docUploadName === 'warrantyPeriod' ? warrantyContentInfo : pmsContentInfo}
        setContentInfo={
          docUploadName === 'warrantyPeriod' ? setWarrantyContentInfo : setPmsContentInfo
        }
      />
    </div>
  );
};

export default connect()(ProductExpiryDetails);
