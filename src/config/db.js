import mongoose from 'mongoose';
const { connect } = mongoose;
const connectDB = async () => {
  const connection = await connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Cennected`);
};

export default connectDB;
