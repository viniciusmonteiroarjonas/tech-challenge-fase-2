const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/blogging_platform';

  await mongoose.connect(uri);
  console.log('[Database] MongoDB conectado com sucesso');
};

module.exports = connectDB;
