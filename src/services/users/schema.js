import { Schema, model } from 'mongoose';
import { categories } from '../categories';

const UserSchema = new Schema({
  firstName: { type: String, required: [true, 'Please add your First Name'] },
  lastName: { type: String, required: [true, 'Please add your Last Name'] },
  email: {
    type: String,
    trim,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  profilePicUrl: {
    type: String,
    default:
      'https://res.cloudinary.com/a-pyro/image/upload/v1624895886/defaults/117-ironman_hshiey.png',
  },
  profileBgUrl: {
    type: String,
    default:
      'https://res.cloudinary.com/a-pyro/image/upload/v1624896050/defaults/Colored_Shapes_ghhjkv.svg',
  },
  linkedinUrl: String,
  facebookUrl: String,
  twitterUrl: String,
  password: { type: String, required: [true, 'Please provide a password'] },
  role: { type: String, default: 'User' },
  googleId: { type: String },
  bio: { type: String, trim },
  skills: [{ type: String, enum: categories }],
  address: {
    type: String,
    required: [true, 'Please add an address'],
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  requests: [{ type: Schema.Types.ObjectId, ref: 'Request' }],
  communities: [{ type: Schema.Types.ObjectId, ref: 'Community' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  transactions: [
    {
      sender: { type: Schema.Types.ObjectId, ref: 'User' },
      receiver: { type: Schema.Types.ObjectId, ref: 'User' },
    },
  ],
  reviews: [
    {
      rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must can not be more than 5'],
      },
      content: { type: String },
      reviewer: { type: Schema.Types.ObjectId, ref: 'User' },
    },
  ],
  avgRating: Number,
  balance: { type: Number, default: 100 },
});

// Geocode & create location field
UserSchema.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude], //long, lat
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };
  if (this.isModified('reviews')) {
    this.avgRating =
      this.reviews.reduce((acc, cv) => acc + cv.rating) / this.reviews.length;
  }
  // do not save address in db => ho salvato la location quindi non mi serve
  // mi serviva inizialmente per creare questa location ma siccome sono in un middleware ora setto undefined e non lo salva (son nell'hook pre)
  this.address = undefined; // non me lo salva in db :)

  next();
});

export default model('User', UserSchema);
