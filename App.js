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
import ImageSelect from './app/components/ImageSelect';
import DatePicker from './app/components/DatePicker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import firebase from 'firebase';
import 'firebase/firestore';
const db = firebase.firestore();

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
  image: Yup.string()
    .nullable()
    .required('画像が必要です'),
  date: Yup.date()
    .nullable()
    .required('日付を選択してください'),
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
    try {
      const localImageUrl = values.image; // 画像URL（キャッシュ）を保持
      delete values.image; // Firestoreに最初に保存する際は画像URL(キャッシュ)を削除
      const docRef = await db.collection('/members').add(values);
      const { imageUrl } = await this.submitImage(localImageUrl, docRef.id);
      await docRef.update({ imageUrl }); // 画像URLを登録
      actions.resetForm();
      Alert.alert('送信できました');
    } catch (error) {
      Alert.alert('送信に失敗しました', error.message);
    }
  };

  // 画像を保存する
  submitImage = async (localImageUrl, memberId) => {
    const imagePath = `members/${memberId}.jpg`; // 画像の位置を決める（とりあえずmemberのidを使う）
    const imageRef = storage.ref().child(imagePath); // refを作成
    const imageResponse = await fetch(localImageUrl); // キャッシュから画像ファイルをダウンロード
    const blob = await imageResponse.blob(); // Blob化
    const snapshot = await imageRef.put(blob); // Storageに保存
    const imageUrl = await imageRef.getDownloadURL(); // URLを取得
    return { imageUrl, snapshot };
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
                    <ImageSelect label='アカウント画像' name='image' />
                    <DatePicker
                      label='日付'
                      title='日付を選択'
                      placeholder='日付を選択'
                      name='date'
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
