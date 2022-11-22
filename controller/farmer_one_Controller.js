exports.get_farmer_one_dashboard = (regModel, prodModel, ordersModel) => async (req, res) => {
    //get the farmer One Session Details 
    req.session.user = req.user;

    const logged_in_user = req.user;
    const loggedInFarmerOne = req.session.user;


    const urbanfarmers = await regModel.find({role: "urban farmer"});//regModel
    const urban_farmers_uploads = await prodModel.find();//produceModel
    const produce_images = await prodModel.find();//produceModel

    //find produces with a status of pending and belongs to this user's ward
    const produce_pending_approval = await prodModel.aggregate([
        {$match: {$and: [{product_status: 'pending'},{pward: loggedInFarmerOne.ward}]}}
    ])

    console.log('these are the produces pending approval', produce_pending_approval.length);


    //get the orders made for farmers in this farmer's ward
    const user_orders_for_farmerOne_ward = await ordersModel.find()//OrdersModel

    //Total of horticulture produces based on ward
    const horticulture_totals_based_on_ward = await prodModel.aggregate([//produceModel
        {$match: {produce_type: 'horticulture'}},
        {$group: {
            _id: {
                _id: '$pward'
            }, 
            totalQuantity: {
                $sum: '$quantity'
            }, 
            total_horticulture: {
                $sum: {
                    $multiply: ['$unit_price', '$quantity']
                }
            }
        }}
    ])

    const poultry_totals_based_on_ward = await prodModel.aggregate([//produceModel
        {$match: {produce_type: 'poultry'}},
        {$group: {
            _id: {
                _id: '$pward'
            }, 
            totalQuantity: {
                $sum: '$quantity'
            }, 
            total_poultry: {
                $sum: {
                    $multiply: ['$unit_price', '$quantity']
                }
            }
        }}
    ])

    const diary_totals_based_on_ward = await prodModel.aggregate([//produceModel
        {$match: {produce_type: 'dairy'}},
        {$group: {
            _id: {
                _id: '$pward'
            }, 
            totalQuantity: {
                $sum: '$quantity'
            }, 
            total_diary: {
                $sum: {
                    $multiply: ['$unit_price', '$quantity']
                }
            }
        }}
    ])

    res.render('farmer_one_dashboard', {
        urbanfarmers, 
        urban_farmers_uploads, 
        loggedInFarmerOne, 
        user_orders_for_farmerOne_ward, 
        horticulture_totals_based_on_ward, 
        poultry_totals_based_on_ward, 
        diary_totals_based_on_ward,
        logged_in_user,
        produce_images,
        produce_pending_approval
    })
}

exports.approve_decline_produce = prodModel => async (req, res) => {
    const productId = req.params.productId;
    const produce_to_approve = await prodModel.findById(productId);//prodModel
    produce_to_approve.product_status = req.body.approve_decline;

    // console.log(produce_to_approve.product_status)
    try {
        await produce_to_approve.save()
        res.redirect('/farmer_one_dashboard')
    } catch (error) {
        console.log(error)
    }
}