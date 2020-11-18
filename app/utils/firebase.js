import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/storage';

firebase.initializeApp(); // ここは各自のプロジェクトで

export const db = firebase.firestore();
export const storage = firebase.storage();
export default firebase;
