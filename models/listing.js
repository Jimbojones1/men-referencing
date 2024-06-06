const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
	streetAddress: {
	  type: String,
	  required: true,
	},
	city: {
	  type: String,
	  required: true,
	},
	price: {
	  type: Number,
	  required: true,
	  min: 0,
	},
	size: {
	  type: Number,
	  required: true,
	  min: 0,
	},
	// 1 user has many listings,
	// a listing belongs to a user!
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User', // belongs to !
	},
	// Many users to many listing favorites
	// MANY TO MANY RELATIONSHIP
	favoritedByUsers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User', // belongs to !
	}]
  });

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;