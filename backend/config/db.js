const mongoose = require('mongoose');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

let isConnected = false;

const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false);
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learning_tracker';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.log(`MongoDB Notice: ${error.message}`);
    console.log('⚡ StudyOS API running with high-performance in-memory store fallback mode.');
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
