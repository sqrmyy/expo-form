import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Select from './app/components/Select';
import Input from './app/components/Input';
import RadioButton from './app/components/RadioButton';
import CheckBox from './app/components/CheckBox';
import prefectures from './app/constants/prefectures';
import { Formik } from 'formik';
import * as Yup from 'yup';

const genderOptions = [
  { label: '男性', value: 0 },
  { label: '女性', value: 1 },
];

const schema = Yup.object().shape({
  name: Yup.string()
    .min(3, '3文字以上で入力してください')
    .max(20, '20文字以内で入力してください')
    .required('氏名を入力してください'),
  gender: Yup.number()
    .oneOf(
      genderOptions.map((option) => option.value),
      '性別を選択して下さい'
    )
    .required('性別を選択して下さい'),
  terms: Yup.bool().oneOf([true], '同意が必要です'),
  prefecture: Yup.number()
    .oneOf(
      prefectures.map((option) => option.value),
      '地域を選択してください'
    )
    .nullable()
    .required('地域を選択してください'),
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: '100%',
  },
});

export default class App extends Component {
  onSubmit = async (values, actions) => {
    // データ送信
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.form}>
            <Formik
              initialValues={{
                name: '',
              }}
              validateOnMount
              validationSchema={schema}
              onSubmit={this.onSubmit}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                isValid,
                isSubmitting,
                values,
                errors,
                touched,
              }) => (
                <>
                  <View>
                    {errors.name && touched.name ? (
                      <Text>{errors.name}</Text>
                    ) : null}
                    <TextInput
                      value={values.name}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      placeholder='氏名を入力してください'
                    />
                    <Input
                      label='氏名'
                      name='name'
                      placeholder='氏名を入力してください'
                    />
                    <RadioButton
                      label='性別'
                      name='gender'
                      options={genderOptions}
                    />
                    <Select
                      label='お住いの地域'
                      name='prefecture'
                      options={prefectures}
                    />
                    <CheckBox label='同意事項' title='同意する' name='terms' />
                  </View>
                  <Button
                    title='Submit'
                    onPress={handleSubmit}
                    disabled={!isValid || isSubmitting}
                  />
                </>
              )}
            </Formik>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    );
  }
}
