import {Cloudinary} from 'cloudinary-react-native';

const cloudinary = new Cloudinary({
  cloud_name: 'KIDSPOTKEY',
  api_key: '465798237744771',
  api_secret: '*********************************' // À sécuriser côté backend si possible
});

export default cloudinary;