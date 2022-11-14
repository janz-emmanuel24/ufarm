const router = require('express').Router()
const multer = require('multer')
const connectEnsureLogin = require('connect-ensure-login')

const Produce_upload_model = require('../model/Produce_upload_model')
const RegisterModel = require('../model/Register_usersModel')
const User_orders = require('../model/OrdersSchema')
const { request } = require('express')

//image upload
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads")
    }, 
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

//instantiating a variable to store multer's functionality
var upload = multer({storage: storage})

//display urban farmer information
router.get('/', connectEnsureLogin.ensureLoggedIn('/login'), async (req, res) => {
    //sets the user session to req.user which is the current user
    req.session.user = req.user
    
    //Get all produces upload by this particular user
    const userProduces = await Produce_upload_model.find({produce_owner: req.user})

    // console.log(req.user)

    const loggedInUrbanFarmer = req.session.user

    //See all orders directed to him
    // const urbanFarmerOrders = await User_orders.find()

    const urban_farmer_Orders = await User_orders.aggregate([
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

    console.log('These are the logged in urban Farmer_orders ', urban_farmer_Orders )

    console.log('This is the logged in urbanFarmer', loggedInUrbanFarmer)

    //Get Produce totals according to category and based on the logged in user
    const horticulture_totals = await Produce_upload_model.aggregate([
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

    const poultry_totals = await Produce_upload_model.aggregate([
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

    const diary_totals = await Produce_upload_model.aggregate([
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

    console.log('This is total for Horticulture ', horticulture_totals)
    console.log('This is total for poultry ', poultry_totals)
    console.log('This is total for diary ', diary_totals)

    //we are passing the user session data to the user object key
    res.render('urban_farmer_dashboard', {userProduces, loggedInUrbanFarmer, urban_farmer_Orders, horticulture_totals, poultry_totals, diary_totals})
})

//Upload a produce
router.post('/', connectEnsureLogin.ensureLoggedIn(), upload.single("produce_image"), async (req, res) => {

    req.session.user = req.user

    try {
        const produce = new Produce_upload_model(req.body)

        produce.produce_image = req.file.path;
        produce.produce_owner = req.user._id;

        // console.log("This is from the produce", produce.produce_owner)
        // console.log("This is from the req.user", req.user._id)

        const ownerDetails = await RegisterModel.findById(produce.produce_owner)

        produce.fullname = ownerDetails.fullname;
        produce.contact = ownerDetails.phone;


        // console.log(produce)

        await produce.save();

        res.redirect('/urban_farmer_dashboard')

    } catch(err) {
        console.log(err)
    } 
})

//approving the order 
router.post('/approve_user_order/:order_id', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const order_id = req.params.order_id
    
    const requestedOrder = await User_orders.findOne({_id: order_id})

    requestedOrder.order_status = req.body.approve_decline_order

    //find the product in the uploaded prodcts schema using the product id
    const produce_quantity_to_change = await Produce_upload_model.findOne({_id: requestedOrder.produce_id})


    // if req.body.approve_decline_order == Approved for Delivery
    if(req.body.approve_decline_order === 'Approved for Delivery') {
        //find the approvedProduct's quantity
        const approved_product_quantity = requestedOrder.order_quantity

        const newProductQuantity = produce_quantity_to_change.quantity - approved_product_quantity

        //Change the quantity property in the produce_upload_model
        produce_quantity_to_change.quantity = newProductQuantity

        // console.log('This is the new product Quantity', newProductQuantity)
    }

    //set the new value of the quantity in the upload products to be minus that of the approve product quantity from orders

    //save that new value

    console.log('This is the approved order', requestedOrder)
    console.log('This is the product found', produce_quantity_to_change)

    await requestedOrder.save()
    await produce_quantity_to_change.save()

    res.redirect('back')
})

//Update product availability
router.post('/update_product_availability/:product_id', async (req, res) => {

    const product_id = req.params.product_id;

    const product_to_update = await Produce_upload_model.findOne({_id: product_id})

    product_to_update.produce_availability = req.body.product_availability

    // console.log(product_to_update);

    product_to_update.save()

    res.redirect('back')
})

module.exports = router;