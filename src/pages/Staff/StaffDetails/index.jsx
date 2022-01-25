import React, { useState, useEffect } from 'react';
import { connect, useParams } from 'umi';
import { Typography, Col, Row, Tooltip, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ImageUpload from '@/components/ImageUpload';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import styles from './index.less';
import UpdateStaffDetails from '../component/UpdateStaffDetails';
import StaffDocuments from './StaffDocuments';
import { useGetStaff, useGetContents } from '@/query/useStaff';
import { useGetCountries } from '@/query/useCommon';
import OrganizationDocuments from './OrganizationDocuments';
import CheckValidation from '@/components/CheckValidation';
import UpdateDesignationDetails from '../component/UpdateDesignationDetails';
import moment from 'moment';
import UpdateOrganizationDetails from '../component/UpdateOrganizationDetails';

const { Paragraph } = Typography;

/**
 *
 * @StaffDetails - The purpose of this component is to get details of particular staff member
 */

/**
* @property {Object} staffDetails is the details of single staff 

*/

const StaffDetails = ({ staffDetails }) => {
  const { profileId } = useParams();
  const [isEditBasicDetails, setIsEditBasicDetails] = useState(false);
  const [isEditDesignation, setIsEditDesignation] = useState(false);
  const [isEditOrganization, setIsEditOrganization] = useState(false);
  const [isView, setIsView] = useState(true);

  // Calling Query API to get Countries

  const countriesRecord = useGetCountries();
  const { data: countriesData, isSuccess: isCountriesSuccess } = countriesRecord || {};
  const { data: countries } = countriesData || {};

  // Calling Query API to get Staff Record
  const staff = useGetStaff(profileId);
  const { data: staffData, refetch } = staff || {};
  const { staff: info } = staffData || {};
  const { manager, partyAttributes } = (info && info) || { manager: '', partyAttributes: [] };

  const getStaffType = () => {
    switch (info?.typeId) {
      case 'EMPLOYEE':
        return 'Staff';
      case 'PARTNER':
        return 'Partner';
      default:
        return '';
    }
  };

  // Initializing Staff type and role type
  const type = getStaffType();
  const roleType = (info?.roles && info?.roles?.map((role) => role)?.join()) || '';

  // Calling Query API to get Staff Contents
  const contentsRec = useGetContents(profileId);
  const { refetch: refetchStaffContents } = contentsRec;

  const getCountryName = (CountryId, StateId) => {
    const country = countries?.filter((item) => item?.id === CountryId);
    const { name, provinces } = country?.[0] || { name: '', provinces: [] };
    const provinceRec = provinces?.filter((item) => item?.id === StateId);
    const { name: province } = provinceRec?.[0] || { name: '' };

    return {
      country: name,
      province,
    };
  };

  const { country, province } =
    isCountriesSuccess &&
    getCountryName(
      info?.postalAddresses?.[0]?.countryGeoId,
      info?.postalAddresses?.[0]?.stateProvinceGeoId,
    );

  const getRoleName = () => {
    switch (roleType) {
      case 'STORE_ADMIN':
        return 'Administrator';
      case 'STORE_MANAGER':
        return 'Manager';
      case 'STORE_EMPLOYEE':
        return 'Employee';

      default:
        return 'Partner';
    }
  };

  return (
    <div className="container mx-auto">
      <Page
        title={type}
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: `${type}`,
                path: `/staff/${profileId}/profile`,
              },
            ]}
          />
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={10} lg={10} xl={8} xxl={8}>
            <div className="rounded shadow bg-white">
              <div className={`${styles.NameWrapper} flex items-center px-6 py-4 border-b`}>
                <div>
                  <ImageUpload partyId={profileId} partyImage={null} />
                </div>
                <div className="pl-4 w-full">
                  <span className="flex justify-between">
                    <div className={styles.LeadName}>
                      <Paragraph
                        className="w-full text-lg font-semibold"
                        ellipsis
                        title={`${type} name`}
                      >
                        {info?.name}
                      </Paragraph>
                    </div>
                    <Tooltip title="Edit Basic Details">
                      <EditOutlined
                        onClick={() => {
                          setIsEditBasicDetails(!isEditBasicDetails);
                        }}
                        className={` text-blue-700 font-semibold hover:font-bold border-blue-600`}
                        style={{ color: '#3182ce' }}
                      />
                    </Tooltip>
                  </span>
                  <div title="Designation" className={`${styles.LeadDesignation} mb-2`}>
                    <Paragraph className="w-full" ellipsis title={`${type} since 3 months ago`}>
                      <span className="capitalize">{type?.toLowerCase()}</span> since{' '}
                      {moment(info?.createdDate).format('DD MMMM YYYY')}
                    </Paragraph>
                  </div>
                  <div>
                    <Tag color="green">{getRoleName()}</Tag>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex justify-between border-b  px-6 py-4">
                <div className="text-sm text-gray-600 uppercase">Email</div>
                <div className={`flex ${styles.LeadCompanyPhone}`}>
                  <div className="font-semibold text-black">
                    <span className="text-blue-500 underline text-sm ml-2">{`${info?.emailAddresses?.[0]?.email}`}</span>
                  </div>
                </div>
              </div>
              {/* Contact Number*/}
              <div className="flex justify-between border-b  px-6 py-4">
                <div className="text-sm text-gray-600 uppercase">Contact no</div>
                <div
                  className={`${styles.LeadCompanyEmail} flex truncate font-semibold text-black`}
                >
                  <div className="pl-2">
                    <Paragraph
                      style={{ maxWidth: 275 }}
                      title={staffDetails?.joining_date}
                      ellipsis
                    >
                      {`${info?.phoneNumbers?.[0]?.formattedPhoneNumberInUSFormat}`}
                    </Paragraph>
                  </div>
                </div>
              </div>
              {/* Address */}
              <div className="flex justify-between border-b  px-6 py-4">
                <div className="text-sm text-gray-600 uppercase">Address</div>
                <div
                  className={`${styles.LeadCompanyEmail} flex truncate font-semibold text-black`}
                >
                  <div className="pl-2">
                    <Paragraph style={{ maxWidth: 275 }} title="Address">
                      <address className="text-right ">
                        <p className="m-0">{info?.postalAddresses?.[0]?.address1}</p>
                        <p className="m-0">{info?.postalAddresses?.[0]?.address2}</p>
                        <p className="m-0">{info?.postalAddresses?.[0]?.city},</p>
                        <p className="m-0">{province},</p>
                        <p className="m-0">{country}</p>
                        <p className="m-0">{info?.postalAddresses?.[0]?.postalCode}</p>
                      </address>
                    </Paragraph>
                  </div>
                </div>
              </div>
            </div>
            {/* Designation and Role */}
            <CheckValidation show={type === 'Staff'}>
              <div className="rounded shadow bg-white mt-2">
                <div className="flex justify-between px-6 py-4 border-b">
                  <p className="bg-white rounded  font-bold text-blue-900 text-md m-0 ">
                    Designation and Role
                  </p>
                  <Tooltip title="Edit Designation and Role Details">
                    <EditOutlined
                      onClick={() => setIsEditDesignation(true)}
                      className={` text-blue-700 font-semibold hover:font-bold border-blue-600`}
                      style={{ color: '#3182ce' }}
                    />
                  </Tooltip>
                </div>

                <div className="flex justify-between border-b  px-6 py-4">
                  <div className="text-sm text-gray-600 uppercase">Designation</div>
                  <div
                    className={`${styles.LeadCompanyEmail} flex truncate font-semibold text-black`}
                  >
                    <div className="pl-2">
                      <Paragraph
                        style={{ maxWidth: 275, textTransform: 'capitalize' }}
                        title="Staff Designation"
                        ellipsis
                      >
                        {partyAttributes
                          ?.find((item) => item?.attrName === 'DESIGNATION')
                          ?.attrValue?.toLowerCase()}
                      </Paragraph>
                    </div>
                  </div>
                </div>
                {/* Division */}
                <div className="flex justify-between border-b  px-6 py-4">
                  <div className="text-sm text-gray-600 uppercase">Division</div>
                  <div
                    className={`${styles.LeadCompanyEmail} flex truncate font-semibold text-black`}
                  >
                    <div className="pl-2">
                      <Paragraph
                        style={{ maxWidth: 275, textTransform: 'capitalize' }}
                        title="Staff Division"
                        ellipsis
                      >
                        {partyAttributes
                          ?.find((item) => item?.attrName === 'DIVISION')
                          ?.attrValue?.toLowerCase()}
                      </Paragraph>
                    </div>
                  </div>
                </div>
                {/* Supervisor */}
                <div className="flex justify-between border-b  px-6 py-4">
                  <div className="text-sm text-gray-600 uppercase">Supervisor</div>
                  <div
                    className={`${styles.LeadCompanyEmail} flex truncate font-semibold text-black`}
                  >
                    <div className="pl-2">
                      <Paragraph
                        style={{ maxWidth: 275, textTransform: 'capitalize' }}
                        title="Staff Supervisor"
                        ellipsis
                      >
                        {info?.manager?.displayName?.toLowerCase()}
                      </Paragraph>
                    </div>
                  </div>
                </div>
              </div>
            </CheckValidation>
            {/*  Organization Details */}
            <CheckValidation show={type === 'Partner'}>
              <div className="rounded shadow bg-white mt-2">
                <div className="flex justify-between px-6 py-4 border-b">
                  <p className="bg-white rounded  font-bold text-blue-900 text-md m-0 ">
                    Organization Details
                  </p>
                  <Tooltip title="Edit Organization Details">
                    <EditOutlined
                      onClick={() => setIsEditOrganization(true)}
                      className={` text-blue-700 font-semibold hover:font-bold border-blue-600`}
                      style={{ color: '#3182ce' }}
                    />
                  </Tooltip>
                </div>

                {/* Name */}
                <div className="flex justify-between border-b  px-6 py-4">
                  <div className="text-sm text-gray-600 uppercase">Name</div>
                  <div
                    className={`${styles.LeadCompanyEmail} flex truncate font-semibold text-black`}
                  >
                    <div className="pl-2">
                      <Paragraph style={{ maxWidth: 275 }} title="Address" ellipsis>
                        Clark
                      </Paragraph>
                    </div>
                  </div>
                </div>
                {/* Security amount */}
                <div className="flex justify-between border-b  px-6 py-4">
                  <div className="text-sm text-gray-600 uppercase">Security amount</div>
                  <div
                    className={`${styles.LeadCompanyEmail} flex truncate font-semibold text-black`}
                  >
                    <div className="pl-2">
                      <Paragraph style={{ maxWidth: 275 }} title="Address" ellipsis>
                        100000
                      </Paragraph>
                    </div>
                  </div>
                </div>
                {/* Address */}
                <div className="flex justify-between border-b  px-6 py-4">
                  <div className="text-sm text-gray-600 uppercase">Address</div>
                  <div
                    className={`${styles.LeadCompanyEmail} flex truncate font-semibold text-black`}
                  >
                    <div className="pl-2">
                      <Paragraph style={{ maxWidth: 275 }} title="Address" ellipsis>
                        <address className="text-right">
                          <p className="m-0">P.O. Box 651, 8916 Dui. Ave</p>
                          <p className="m-0">Tasmania, Indonesia</p>
                          <p className="m-0">28283</p>
                        </address>
                      </Paragraph>
                    </div>
                  </div>
                </div>
              </div>
            </CheckValidation>
          </Col>
          <Col xs={24} sm={24} md={14} lg={14} xl={16} xxl={16}>
            {/* Staff Documents Section */}
            <StaffDocuments
              partyType={type}
              info={info}
              refetchStaff={refetch}
              refetchStaffContents={refetchStaffContents}
            />
            {/* Organization Documents Section in Case of Role Type Partner */}
            <CheckValidation show={type === 'Partner'}>
              <OrganizationDocuments partyType={type} info={info} refetchStaff={refetch} />
            </CheckValidation>
          </Col>
        </Row>
        <UpdateStaffDetails
          visible={isEditBasicDetails}
          setVisible={setIsEditBasicDetails}
          staffDetails={info}
          refetchStaff={refetch}
        />
        <UpdateDesignationDetails
          visible={isEditDesignation}
          setVisible={setIsEditDesignation}
          info={info}
          refetchStaff={refetch}
        />
        <UpdateOrganizationDetails
          visible={isEditOrganization}
          setVisible={setIsEditOrganization}
          info={info}
          refetchStaff={refetch}
        />
      </Page>
    </div>
  );
};

export default StaffDetails;
