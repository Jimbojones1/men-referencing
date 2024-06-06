
const express = require('express');
const router = express.Router();

const Listing = require('../models/listing');

router.delete('/:listingId', async function(req, res){
	
	try {
		const listingDoc = await Listing.findById(req.params.listingId)
		// server side validation, 
	// make sure the logged in user id is equal to the listings owners id
		if(listingDoc.owner.equals(req.session.user._id)){
			await listingDoc.deleteOne(); // this is calling deleteOne
			// on a mongoose document, not a model!
			res.redirect('/listings')
		} else {
			res.send('You dont have permission to delete that')
		}

	} catch(err){
		console.log(err)
		res.redirect('/')
	}
})


router.get('/', async (req, res) => {
	try {
		// .populate('owner') takes the id store on the owner key, 
		// and replaces it with the user object!
	  const populatedListings = await Listing.find({}).populate('owner')
	//   console.log(populatedListings)
  
	  // Add the following:
	  res.render('listings/index.ejs', {
		listings: populatedListings,
	  });
	} catch (error) {
	  console.log(error);
	  res.redirect('/');
	}
  });

  router.post('/', async (req, res) => {

	try {
		// add the owner property and assign, 
		// the logged in user _id 
		req.body.owner = req.session.user._id;
		const listingDoc = await Listing.create(req.body);
		// console.log(listingDoc)
		res.redirect('/listings');
	} catch(err){
		console.log(err)
		res.redirect('/')
	}

  });
  
router.get('/new', async function(req, res){
	res.render('listings/new.ejs')
})

router.get('/:listingId', async (req, res) => {
	try {
	  const populatedListings = await Listing.findById(
		req.params.listingId
	  ).populate('owner');
  
	  res.render('listings/show.ejs', {
		listing: populatedListings,
	  });
	} catch (error) {
	  console.log(error);
	  res.redirect('/');
	}
  });
  
  

module.exports = router;