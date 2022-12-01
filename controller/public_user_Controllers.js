exports.get_Homepage = (req, res) => {

    logged_in_public_user = req.user;

    console.log(logged_in_public_user)

    res.render('landingpage', {logged_in_public_user}) 
}

exports.our_farmers = (req,res) => {

    logged_in_public_user = req.user;

    res.render('ourfarmers', {logged_in_public_user})
}

exports.categories_in_shop = Model => async (req, res) => {

    logged_in_public_user = req.user;

    const all_approved_produces = await Model.aggregate([{$match: {product_status: "approved"}}])

    res.render('categories', {all_approved_produces, logged_in_public_user})
}

exports.horticulture = Model => async (req, res) => {

    logged_in_public_user = req.user;

    const all_horticulture_produces = await Model.aggregate([{$match: {produce_type: "horticulture"}}])
    
    res.render('horticulture', {all_horticulture_produces, logged_in_public_user})
}

exports.dairy = Model => async (req, res) => {

    logged_in_public_user = req.user;

    const all_dairy_produces = await Model.aggregate([{$match: {produce_type: "dairy"}}])

    res.render('dairy', {all_dairy_produces, logged_in_public_user})
}

exports.poultry = Model => async (req, res) => {
    logged_in_public_user = req.user;

    const all_poultry_produces = await Model.aggregate([{$match: {produce_type: "poultry"}}])
    
    res.render('poultry', {all_poultry_produces, logged_in_public_user})
}

exports.categories_check = Model => async (req,res) => {

    let all_produces;

    let searchQuery;

    if(req.query.search_produce) {
        //store the query string and convert it to lowercase
        searchQuery = req.query.search_produce.toLocaleLowerCase();
        //query the DB with the search Query
        all_produces = await Model.aggregate([
            {$match: {$or: [{produce_type: searchQuery},{pname: searchQuery}]}}
        ])
    } else {
        all_produces = await Model.find();
    }

    res.render('market', {all_produces}) 
}

exports.my_orders = Model => async (req, res) => {

    const logged_in_public_user = req.user;

    //get the user's orders
    const myOrders = await Model.aggregate([
        {$match: {$or: [{order_status: 'booked & pending'},{order_status: 'Approved for Delivery'}]}},
        {$group: {
            _id: {
                _id: '$_id', 
                order_status: '$order_status', 
                produce_owner_name: '$produce_owner_name',
                produce_ordered: '$produce_ordered',
                order_quantity: '$order_quantity',
                unit_price: '$unit_price',
                produce_owner_email: '$produce_owner_email',
                produce_owner_contact: '$produce_owner_contact',
                public_user_name: '$public_user_name',
                sales_description: '$sales_description'
            }, 
            productTotal: {
                $sum: {
                    $multiply: ["$order_quantity", "$unit_price"]
                }
            }
        }}
    ])

    res.render('my_bookings', {myOrders, logged_in_public_user})
}

exports.create_booking = (Model1, Model2, Model3) => async (req, res) => {
    req.session.user = req.user

    //get the order schema
    const order = new Model1(req.body)//model1--OrderSchemaModel

    //get the ordered produce by its ID from the uploaded produce schema
    const bookedProduct = await Model2.findOne({_id: req.body.produce_id})//model2--Produce_uploadMod
    
    //update fields
    order.produce_ordered = bookedProduct.pname
    order.unit_price = bookedProduct.unit_price
    order.produce_owner_ward = bookedProduct.pward
    order.produce_owner_email = bookedProduct.farmer_email
    order.sales_description = bookedProduct.sales_description

    //get the user making the order's id
    const public_user_info = await Model3.findOne({_id: req.session.user._id})//model3--public_userModel

    //change a few fields in the order schema based on the results of the previous queries
    order.public_user_email = public_user_info.google.email
    order.public_user_name = public_user_info.google.name
    order.booked_by = public_user_info._id
    
    //save the order to DB
    await order.save()

    //redirect the user to the mybookings page so that he can see his orders and general information

    res.redirect('/my_orders')
}