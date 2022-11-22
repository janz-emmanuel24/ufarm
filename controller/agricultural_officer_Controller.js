exports.get_dashboard = (Model1, Model2) => async (req, res) => {

    const logged_in_user = req.user

    const registeredFarmerOnes = await Model1.find({role: "farmer one"})//registration Model

    const produce_images = await Model2.find(); //UploadProduceModel

    const appointed_farmers_count = await Model1.find({status_appointed: 'appointed'})

    res.render('agric_officer_dashboard', {registeredFarmerOnes, logged_in_user, produce_images, appointed_farmers_count})
}

exports.get_farmer_one_to_update = (Model1, Model2) => async (req, res) => {

    const farmerOne_id = req.params.farmerOne_id;

    const logged_in_user = req.user

    const produce_images = await Model1.find();//uploadModel

    const farmerOne = await Model2.findById({_id: farmerOne_id})//regModel

    res.render('agUpdate_farmer_one', {farmerOne, logged_in_user, produce_images})
}

exports.update_farmer_one = (Model) => async (req, res) => {

    const farmerOne_id = req.params.farmerOne_id;

    await Model.findByIdAndUpdate(farmerOne_id, req.body)//regModel

    res.redirect('/agric_dashboard')
}