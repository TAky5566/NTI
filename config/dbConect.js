import mongoose from 'mongoose';

const dbConect = async function (url) {
  await mongoose.connect(url);
  console.log('db connect');
};

export default dbConect;
