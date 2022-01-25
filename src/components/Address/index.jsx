/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
import { AutoComplete, Col, Form, Input, Row, Select } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;

// eslint-disable-next-line no-undef
const map = new google.maps.Map(document.getElementById('map'));
// eslint-disable-next-line no-undef
const googleInstance = new google.maps.places.AutocompleteService();
// eslint-disable-next-line no-undef
const placesService = new google.maps.places.PlacesService(map);

const Address = (props) => {
  const { form, dispatch, countries = [], type = 'address', pincode } = props;

  const [suggestedAddress, setSuggestedAddress] = useState([]);

  const action = (text) => {
    googleInstance.getPredictions({ input: text }, (predictions) => {
      setSuggestedAddress(predictions);
    });
  };
  const debounceSearch = debounce(action, 400);

  const [provinces, setProvinces] = useState([]);
  const [pinCodeProvince, setPinCodeProvince] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('IND India');

  const componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'short_name',
    postal_code: 'short_name',
  };

  useEffect(() => {
    dispatch({
      type: 'common/getCountriesList',
    }).then((countriesData) => {
      const foundCountry = countriesData.filter((c) => c.id === selectedCountry.split(' ')[0]);
      setProvinces(foundCountry.length > 0 ? foundCountry[0].provinces : []);
    });
  }, []);

  useEffect(() => {}, []);

  const getAddressFieldsFromGoogle = async (placeId, cb) => {
    let finalData = {};
    placesService.getDetails({ placeId }, ({ address_components }) => {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < address_components.length; i++) {
        const addressType = address_components[i].types[0];
        if (componentForm[addressType]) {
          const val = address_components[i][componentForm[addressType]];
          finalData = { ...finalData, [addressType]: val };
        }
        if (address_components.length - 1 === i) {
          cb(finalData);
        }
      }
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      [type]: {
        country_code: selectedCountry,
      },
    });
  }, []);

  return (
    <div>
      <Row gutter={24} className={`px-6 pt-6 `}>
        {/* *** Comment it for Now may Need this */}
        {/* <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          {' '}
          <Form.Item
            name={[type, 'address_line_1']}
            label={<span className="formLabel">Address line 1</span>}
            rules={[
              {
                required: false,
                message: "Address line 1 can't be blank!",
              },
            ]}
          >
            <AutoComplete
              onSearch={debounceSearch}
              {...props}
              dataSource={
                suggestedAddress &&
                suggestedAddress.map(({ place_id, description }) => ({
                  value: JSON.stringify({ id: place_id, description }),
                  text: description,
                }))
              }
              onSelect={async (e) => {
                const obj = JSON.parse(e);
                getAddressFieldsFromGoogle(obj.id, (addressFieldsByGoogle) => {
                  const foundCountry = countries?.filter(
                    (c) => c.code === addressFieldsByGoogle.country,
                  );
                  const countryCode =
                    foundCountry && foundCountry.length > 0
                      ? `${foundCountry[0].id} ${foundCountry[0].name}`
                      : '';
                  const foundProvince =
                    Array.isArray(foundCountry) &&
                    foundCountry.length > 0 &&
                    foundCountry[0]?.provinces.find(
                      (province) =>
                        province.code === addressFieldsByGoogle.administrative_area_level_1,
                    );
                  const sCode = foundProvince ? `${foundProvince.id} ${foundProvince.name}` : '';
                  form.setFieldsValue({
                    [type]: {
                      city: addressFieldsByGoogle.locality,
                      postal_code: addressFieldsByGoogle.postal_code,
                      address_line_1: `${addressFieldsByGoogle.street_number || ''}, ${
                        addressFieldsByGoogle.route || ''
                      }`,
                      address_line_2: '',
                      country_code: countryCode,
                      state_code: sCode,
                    },
                  });

                  setProvinces((foundCountry && foundCountry[0]?.provinces) || []);
                  setSelectedCountry(countryCode);
                });
              }}
            >
              <Input placeholder="Street, House No." size="middle" />
            </AutoComplete>
          </Form.Item>
        </Col> */}
        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <Form.Item
            name={[type, 'addressLine1']}
            label={<span className="formLabel">Address Line 1</span>}
            rules={[
              {
                required: true,
                message: "Address line 1 can't be blank!",
              },
            ]}
          >
            <Input type="text" placeholder="Street, house no." size="middle" />
          </Form.Item>
        </Col>
        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <Form.Item
            name={[type, 'addressLine2']}
            label={<span className="formLabel">Address Line 2</span>}
          >
            <Input type="text" placeholder="Suite, building, apt." size="middle" />
          </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Form.Item
            name={[type, 'postalCode']}
            label={<span className="formLabel">Pin Code</span>}
            rules={[
              {
                required: true,
                message: "Zip code/Postal code can't be blank!",
              },
            ]}
          >
            <Input
              size="middle"
              placeholder="ZIP / Postal code"
              onBlur={(e) => {
                let pincodeValue = e.target.value;
                dispatch({
                  type: 'common/pinCodeContent',
                  payload: {
                    pathParams: { pinCode: pincodeValue },
                  },
                }).then((pinCodeData) => {
                  const foundPinCode = pinCodeData;
                });
              }}
            />
          </Form.Item>
        </Col>
        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <Form.Item
            name={[type, 'region']}
            label={<span className="formLabel">Region</span>}
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Please Enter Your Region!',
              },
            ]}
          >
            <Select
              getPopupContainer={(node) => node.parentNode}
              placeholder="Select your region"
              size="middle"
              className={styles.selectStyle}
            >
              <Select.Option value="North">North</Select.Option>
              <Select.Option value="South">South</Select.Option>
              <Select.Option value="East">East</Select.Option>
              <Select.Option value="West">West</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <Form.Item
            name={[type, 'countryCode']}
            label={<span className="formLabel">Country</span>}
            rules={[
              {
                required: true,
                message: 'Please select your Country',
              },
            ]}
            initialValue="IND"
          >
            <Select
              getPopupContainer={(node) => node.parentNode}
              showSearch
              placeholder="Select your country"
              size="middle"
              onSelect={(countryValue) => {
                form.setFieldsValue({ address: { stateCode: '' } });
                setSelectedCountry(countryValue);
                const foundCountry = countries.filter((c) => c.id === countryValue.split(' ')[0]);
                setProvinces(foundCountry.length > 0 ? foundCountry[0].provinces : []);
              }}
            >
              {countries.length > 0
                ? countries.reverse().map((c) => {
                    return (
                      <Option key={c.id} value={`${c.id}`}>
                        {c.name} ({c.code})
                      </Option>
                    );
                  })
                : ''}
            </Select>
          </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Form.Item
            name={[type, 'stateCode']}
            rules={[
              {
                required: true,
                message: 'Please select your State',
              },
            ]}
            label={<span className="formLabel">State</span>}
          >
            <Select
              getPopupContainer={(node) => node.parentNode}
              showSearch
              size="middle"
              placeholder="Select your state"
              notFoundContent="No states found"
            >
              {provinces.map((province) => (
                <Option key={province.id} value={`${province.id} ${province.name}`}>
                  {province.name} ({province.code})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Form.Item
            name={[type, 'city']}
            label={<span className="formLabel">City</span>}
            rules={[
              {
                required: true,
                message: "City can't be blank!",
              },
            ]}
          >
            <Input size="middle" type="text" placeholder="City" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ common }) => ({
  countries: common.countriesList,
  pincode: common.pinCodeContent,
}))(Address);
