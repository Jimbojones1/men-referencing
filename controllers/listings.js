
const express = require('express');
const router = express.Router();

const Listing = require('../models/listing');


router.post('/:listingId/favorited-by', async function(req, res){
	try {
		// We want add the logged in users id, to the listing.favoritedByUsers array
		// option 1
		await Listing.findByIdAndUpdate(req.params.listingId, {
			// mongodb operator! that lets you modify an array
			$push: {favoritedByUsers: req.session.user._id}
		})

		// option 2 
		// const listingDoc = Listing.findById(req.params.listingId)
		// listingDoc.favoritedByUsers.push(req.session.user._id)
		// listingDoc.save();
		res.redirect(`/listings/${req.params.listingId}`)

	} catch(err){
		console.log(err)
		res.redirect('/')
	}
})


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
	  console.log(populatedListings, ' <- listing on show page!')

	  // we want to figure if the logged in user has favorited the listing!
	  
	  // since this reference ids and not embedded, we can't use id method, 
	  // but can use array methods
	  const isFavoritedByUser = populatedListings.favoritedByUsers.some((userId) => {
		// userId is each id in the array, does it equal the logged in users array
		// .some just looks for a match, and if it finds it returns true and soon as thre is match
		return userId.equals(req.session.user._id)
	  })

	  res.render('listings/show.ejs', {
		listing: populatedListings,
		isFavoritedByUser: isFavoritedByUser
	  });
	} catch (error) {
	  console.log(error);
	  res.redirect('/');
	}
  });
  
  

module.exports = router;