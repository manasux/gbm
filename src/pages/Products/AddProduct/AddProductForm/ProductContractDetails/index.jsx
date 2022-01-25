/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Row, Col, Select } from 'antd';
import SelectInput from '@/components/FormComponents/SelectInput';
import classNames from 'classnames';
import { connect } from 'umi';
import moment from 'moment';
import { debounce } from 'lodash';
import NumberInput from '@/components/FormComponents/NumberInput';
import SelectDate from '@/components/FormComponents/SelectDate';
import styles from '../../index.less';
import UploadFormContent from '../UploadFormContent';

const ProductContractDetails = ({
  isVerified,
  form,
  dispatch,
  contractTypeList,
  contractSubList,
  contractPeriodFilelist,
  setContractPeriodFilelist,
  contractPeriodContentInfo,
  setContractPeriodContentInfo,
}) => {
  const [contractType, setContractType] = useState('');
  const [uploadContentModel, setUploadContentModel] = useState(false);
  const [docUploadName, setDocUploadName] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [warrantyValue, setWarrantyValue] = useState(1);
  const [contractSubType, setContractSubType] = useState();
  const [pmsValue, setPMSValue] = useState();
  // const [contractPrice, setContractPrice] = useState();

  const contract_start_date = form?.getFieldValue(['contract_details', 'start_date']);
  const contract_end_date = form?.getFieldValue(['contract_details', 'end_date']);

  const getDateOnSelection = () => {
    if (form?.getFieldValue('warranty_end_date') === undefined) {
      return form.getFieldValue(['installation_details', 'installation_date']);
    } else {
      return form?.getFieldValue('warranty_end_date');
    }
  };

  useEffect(() => {
    getDateOnSelection();
  }, [form?.getFieldValue('warranty_end_date')]);

  const getContractTypeList = (value) => {
    dispatch({
      type: 'product/getContractTypeList',
      payload: {
        keyword: value,
      },
    });
  };

  const getContractSubList = (value) => {
    dispatch({
      type: 'product/getContractSubList',
      payload: {
        type_id: contractType,
        keyword: value,
      },
    });
  };

  useEffect(() => {
    getContractSubList();
  }, [contractType]);

  useEffect(() => {
    getContractTypeList();
  }, []);

  const contractTypeSearch = debounce(getContractTypeList, 400);
  const contractSubTypeSearch = debounce(getContractSubList, 400);

  useEffect(() => {
    const date = form?.getFieldValue(['contract_details', 'start_date']);
    date &&
      form?.setFieldsValue({
        contract_details: {
          end_date: moment(date).add(warrantyValue, 'years').subtract(1, 'days'),
        },
      });
  }, [warrantyValue]);
  return (
    <div className="bg-white shadow rounded mb-4 border-b">
      <Row gutter={[24, 0]} className="px-6 pt-3">
        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <div className={classNames('formLabel', styles.textStyles)}>Contract Type</div>
          <SelectInput
            disabled={isVerified}
            onClear={() => {
              form.setFieldsValue({
                contract_details: { sub_type_id: '' },
              });
              setContractType('');
              setContractSubType('');
            }}
            onChange={() => {
              form.setFieldsValue({
                contract_details: { sub_type_id: '' },
              });
            }}
            placeholder="Choose contract type "
            name={['contract_details', 'type_id']}
            showSearch="true"
            onSearch={(value) => contractTypeSearch(value)}
            onSelect={(value) => setContractType(value)}
            rules={[
              {
                required:
                  (contractSubType ||
                    warrantyValue ||
                    pmsValue ||
                    contractPrice ||
                    contract_start_date ||
                    contract_end_date) &&
                  true,
                message: 'Please enter contract type',
              },
            ]}
          >
            {Array.isArray(contractTypeList?.searchResults) &&
              contractTypeList?.searchResults?.map((contract) => (
                <Select.Option key={contract?.id} value={contract?.id}>
                  {contract?.description}
                </Select.Option>
              ))}
          </SelectInput>
        </Col>

        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <div className={classNames('formLabel', styles.textStyles)}>Sub Type</div>
          <SelectInput
            disabled={isVerified}
            onClear={() => setContractSubType('')}
            placeholder="Choose sub type "
            name={['contract_details', 'sub_type_id']}
            showSearch="true"
            onSearch={(value) => contractSubTypeSearch(value)}
            onSelect={(value) => setContractSubType(value)}
            rules={[
              {
                required:
                  (contractType ||
                    warrantyValue ||
                    pmsValue ||
                    contractPrice ||
                    contract_start_date ||
                    contract_end_date) &&
                  true,
                message: 'Please enter sub type',
              },
            ]}
          >
            {Array.isArray(contractSubList?.searchResults) &&
              contractSubList?.searchResults?.map((type) => (
                <Select.Option key={type?.id} value={type?.id}>
                  {type?.description}
                </Select.Option>
              ))}
          </SelectInput>
        </Col>

        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <div className={classNames('formLabel', styles.textStyles)}> Contract Period</div>
          <NumberInput
            isDisabled={isVerified}
            name={['contract_details', 'period']}
            placeholder="Period"
            form={form}
            setWarrantyValue={setWarrantyValue}
            rules={[]}
            initialValue={1}
            min={1}
          />
        </Col>
        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <div className={classNames('formLabel', styles.textStyles)}>PMS</div>
          <NumberInput
            isDisabled={isVerified}
            name={['contract_details', 'pms']}
            placeholder="PMS Visits in a year"
            form={form}
            setPMSValue={setPMSValue}
            rules={[
              {
                required:
                  (contractSubType ||
                    contractType ||
                    warrantyValue ||
                    contractPrice ||
                    contract_start_date ||
                    contract_end_date) &&
                  true,
                message: 'Please enter pms',
              },
            ]}
            initialValue={1}
            min={1}
          />
        </Col>
        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <div className={classNames('formLabel', styles.textStyles)}>Start date</div>
          <SelectDate
            disabledDate={(current) => current && current.valueOf() < getDateOnSelection()}
            disabled={isVerified}
            defaultPickerValue={getDateOnSelection()}
            name={['contract_details', 'start_date']}
            placeholder="Contract start date"
            onChange={(date) => {
              form?.setFieldsValue({
                contract_details: {
                  end_date: date
                    ? moment(date).add(warrantyValue, 'years').subtract(1, 'days')
                    : '',
                },
              });
            }}
            rules={[
              {
                required:
                  (contractSubType ||
                    contractType ||
                    warrantyValue ||
                    contractPrice ||
                    pmsValue ||
                    contract_end_date) &&
                  true,
                message: 'Please enter start date',
              },
            ]}
          />
        </Col>
        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <div className={classNames('formLabel', styles.textStyles)}>End date</div>
          <SelectDate
            disabledDate={(current) =>
              current && current.valueOf() < form?.getFieldValue(['contract_details', 'start_date'])
            }
            disabled={true}
            name={['contract_details', 'end_date']}
            placeholder="Contract end date"
            rules={[
              {
                required:
                  (contractSubType ||
                    contractType ||
                    warrantyValue ||
                    contractPrice ||
                    pmsValue ||
                    contract_start_date) &&
                  true,
                message: 'Please enter end date',
              },
            ]}
          />
        </Col>
        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <div className={classNames('formLabel', styles.textStyles)}>Contract Price</div>
          <div className="flex ">
            <div className="w-full">
              <NumberInput
                rules={[
                  {
                    required:
                      (contractSubType ||
                        contractType ||
                        warrantyValue ||
                        pmsValue ||
                        contract_start_date ||
                        contract_end_date) &&
                      true,
                    message: 'Please select contract price',
                  },
                ]}
                // setContractPrice={setContractPrice}
                isDisabled={isVerified}
                name={['contract_details', 'price']}
                placeholder="Contract Price"
                form={form}
              />
            </div>
          </div>
        </Col>
      </Row>

      <UploadFormContent
        form={form}
        name={docUploadName}
        setUploadContentModel={setUploadContentModel}
        setUploadStatus={setUploadStatus}
        uploadStatus={uploadStatus}
        uploadContentModel={uploadContentModel}
        filelist={contractPeriodFilelist}
        setFilelist={setContractPeriodFilelist}
        contentInfo={contractPeriodContentInfo}
        setContentInfo={setContractPeriodContentInfo}
      />
    </div>
  );
};

export default connect(({ product }) => ({
  contractTypeList: product.contractTypeList,
  contractSubList: product.contractSubList,
}))(ProductContractDetails);
