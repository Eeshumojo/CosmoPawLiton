const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require('../models/user.model.js');
const Animal = require('../models/animal.model.js');
const Report = require('../models/report.model.js');

const signup = async (req, res) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
        return res.status(400).json({
          message: "1 or more parameter(s) missing from req.body",
        });
    }

    let user = await User.findOne({email}).catch((err) => {
        console.log(err.toString());
        res.status(500).json({
          message: "Something went wrong",
          error: err.toString(),
        });
    });

    if(user){
        return res.status(409).json({
            message: "Email already registered",
          });
    }

    let hashedPassword =  await bcrypt.hash(password, 10);
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name,
        email,
        password: hashedPassword,
        phone,
    });

      await user
      .save()
      .then(()=>{
        res.status(201).json({
            message: "Signup successful",
        });
      })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
          message: "1 or more parameter(s) missing from req.body",
        });
    }

    let user = await User.findOne({email}).catch((err) => {
        console.log(err.toString());
        res.status(500).json({
          message: "Something went wrong",
          error: err.toString(),
        });
    });

    if(!user){
        return res.status(401).json({
            message: "Auth failed: Email not found",
        });
    }

    let result = await bcrypt.compare(password, user.password);
    if(result){
        const token = jwt.sign(
            {
              userId: user._id,
              userType: "User",
              email: user.email,
              name: user.name,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "30d",
            }
        );
        return res.status(200).json({
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
            },
            token
        });
    } else{
        return res.status(401).json({
            message: "Auth failed: Invalid password",
        });
    }
}

const getProfile = async (req, res, next) => {
    const userId = req.user.userId;
  
    await User.findById(userId)
      .select("name email phone address city")
      .then(async (user) => {
        res.status(200).json({
            user,
        });
      })
      .catch((err) => {
        console.log(err.toString());
        res.status(500).json({
          message: "Something went wrong",
          error: err.toString(),
        });
      });
};

const applyForAdoption = async (req, res, next) => {
    const userId = req.user.userId;
    const {animalId} = req.body;
    if(!animalId){
        return res.status(400).json({
            message: "1 missing from req.body",
        });
    }
    let animal = await Animal.findById(animalId).catch((err) => {
        console.log(err.toString());
        res.status(500).json({
          message: "Something went wrong",
          error: err.toString(),
        });
    });

    let user = await User.findById(userId).catch((err) => {
        console.log(err.toString());
        res.status(500).json({
          message: "Something went wrong",
          error: err.toString(),
        });
    });

    if(!animal){
        res.status(404).json({
            message: "The Animal was not found",
        });
    } else if(animal.isAdopted){
        res.status(410).json({
            message: "Animal already adopted",
        });
    }

    animal.appliers.push(userId);
    user.wantToAdopt.push(animalId);
    user.save()
    animal.save().then(()=>{
        return res.status(200).json({
            "message":"Applied for adoption"
        })
    });
}

const createReport = async (req, res, next) => {
    const userId = req.user.userId;
    const {lat, lng, address, city};

    if (!lat || !lng || !address || !city) {
        return res.status(400).json({
          message: "1 or more parameter(s) missing from req.body",
        });
    }

    let coordinates = {
        lat = lat,
        lng = lng
    }


    const report = new Report({
        _id: new mongoose.Types.ObjectId(),
        city,
        address,
        coordinates,
        userId,
    });

    await report
    .save()
    .then(()=>{
      res.status(201).json({
          message: "Report Created",
          report,
      });
    })
}

module.exports = {
    signup,
    login,
    getProfile,
    applyForAdoption,
    createReport
}