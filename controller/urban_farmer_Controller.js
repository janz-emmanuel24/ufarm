exports.get_urban_farmer_dashboard = (prodModel, ordersModel) => async (req, res) => {
    //sets the user session to req.user which is the current user
    req.session.user = req.user
    
    //Get all produces upload by this particular user
    const userProduces = await prodModel.find({produce_owner: req.user})//produpload

    const loggedInUrbanFarmer = req.session.user

    //number of approved produce by this user
    const approved_produce_count = await prodModel.aggregate([
        {$match: {$and: [{product_status: 'approved'}, {fullname: loggedInUrbanFarmer.fullname}]}}
    ])

    //for the template header
    const logged_in_user = req.user;

    const produce_images = await prodModel.find();//produpload

    const urban_farmer_Orders = await ordersModel.aggregate([//ordersModel
        {$match: {order_status: 'booked & pending'}},
        {$group: {
            _id: {
                _id: '$_id', 
                order_status: '$order_status', 
                produce_ordered: '$produce_ordered',
                order_quantity: '$order_quantity',
                unit_price: '$unit_price',
                produce_owner_name: '$produce_owner_name',
                produce_owner_email: '$produce_owner_email',
                produce_owner_contact: '$produce_owner_contact',
                public_user_name: '$public_user_name',
                public_user_contact: '$public_user_contact',
                public_user_email: '$public_user_email'
            }, 
            productTotal: {
                $sum: {
                    $multiply: ["$order_quantity", "$unit_price"]
                }
            }
        }}
    ])

    //Get Produce totals according to category and based on the logged in user
    const horticulture_totals = await prodModel.aggregate([//prodMod
        {$match: {produce_type: 'horticulture'}},
        {$group: {
            _id: {
                _id: '$fullname',
                fullname: '$fullname'
            }, 
            totalQuantity: {
                $sum: '$quantity'
            }, 
            total_of_all_horticulture_products: {
                $sum: {
                    $multiply: ['$unit_price', '$quantity']
                }
            }
        }}
    ])

    const poultry_totals = await prodModel.aggregate([//prodMod
        {$match: {produce_type: 'poultry'}},
        {$group: {
            _id: {
                _id: '$fullname',
                fullname: '$fullname'
            }, 
            totalQuantity: {
                $sum: '$quantity'
            }, 
            total_of_all_poultry_products: {
                $sum: {
                    $multiply: ['$unit_price', '$quantity']
                }
            }
        }}
    ])

    const diary_totals = await prodModel.aggregate([//prodMod
        {$match: {produce_type: 'dairy'}},
        {$group: {
            _id: {
                _id: '$fullname',
                fullname: '$fullname'
            }, 
            totalQuantity: {
                $sum: '$quantity'
            }, 
            total_of_all_diary_products: {
                $sum: {
                    $multiply: ['$unit_price', '$quantity']
                }
            }
        }}
    ])

    //rendering to the template
    res.render('urban_farmer_dashboard', {
        userProduces, 
        loggedInUrbanFarmer, 
        urban_farmer_Orders, 
        horticulture_totals, 
        poultry_totals, 
        diary_totals,
        logged_in_user,
        produce_images,
        approved_produce_count
    })
}

exports.upload_produce = (prodModel, regModel) => async (req, res) => {

    req.session.user = req.user

    try {
        const produce = new prodModel(req.body)//prodModel

        produce.produce_image = req.file.path;
        produce.produce_owner = req.user._id;

        const ownerDetails = await regModel.findById(produce.produce_owner)//regModel

        produce.fullname = ownerDetails.fullname;
        produce.contact = ownerDetails.phone;

        await produce.save();

        res.redirect('/urban_farmer_dashboard')

    } catch(err) {
        console.log(err)
    } 
}

exports.approve_order = (ordersModel, prodModel) => async (req, res) => {
    const order_id = req.params.order_id
    
    const requestedOrder = await ordersModel.findOne({_id: order_id})//ordersModel

    requestedOrder.order_status = req.body.approve_decline_order

    //find the product in the uploaded prodcts schema using the product id
    const produce_quantity_to_change = await prodModel.findOne({_id: requestedOrder.produce_id})//prodMod

    // if req.body.approve_decline_order == Approved for Delivery
    if(req.body.approve_decline_order === 'Approved for Delivery') {
        //find the approvedProduct's quantity
        const approved_product_quantity = requestedOrder.order_quantity

        const newProductQuantity = produce_quantity_to_change.quantity - approved_product_quantity

        //Change the quantity property in the produce_upload_model
        produce_quantity_to_change.quantity = newProductQuantity
    }

    //save that new value
    await requestedOrder.save()
    await produce_quantity_to_change.save()

    res.redirect('back')
}

exports.update_product_availability = prodModel => async (req, res) => {

    const product_id = req.params.product_id;

    const product_to_update = await prodModel.findOne({_id: product_id})//prodModel

    product_to_update.produce_availability = req.body.product_availability

    product_to_update.save()

    res.redirect('back')
}