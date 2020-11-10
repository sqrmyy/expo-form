import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  name: Yup.string()
    .min(3, '3文字以上で入力してください')
    .max(20, '20文字以内で入力してください')
    .required('氏名を入力してください'),
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
      </ScrollView>
    );
  }
}
