const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const NGO = require('../models/ngo.model.js');
const Animal = require('../models/animal.model.js');
const Report = require('../models/report.model.js');

const signup = async (req, res) => {
    const { name, email, password, phone, description, address, city, website } = req.body;
    if (!name || !email || !password || !phone || !description || !address || !city || !website) {
        return res.status(400).json({
          message: "1 or more parameter(s) missing from req.body",
        });
    }

    let ngo = await NGO.findOne({email}).catch((err) => {
        console.log(err.toString());
        res.status(500).json({
          message: "Something went wrong",
          error: err.toString(),
        });
    });

    if(ngo){
        return res.status(409).json({
            message: "Email already registered",
        });
    }

    let hashedPassword =  await bcrypt.hash(password, 10);
    const ngo = new User({
        _id: new mongoose.Types.ObjectId(),
        name,
        email,
        password: hashedPassword,
        phone,
        description,
        address,
        city,
        website
    });

      await ngo
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

    let ngo = await NGO.findOne({email}).catch((err) => {
        console.log(err.toString());
        res.status(500).json({
          message: "Something went wrong",
          error: err.toString(),
        });
    });

    if(!ngo){
        return res.status(401).json({
            message: "Auth failed: Email not found",
        });
    }

    let result = await bcrypt.compare(password, ngo.password);
    if(result){
        const token = jwt.sign(
            {
              userId: ngo._id,
              userType: "NGO",
              email: ngo.email,
              name: ngo.name,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "30d",
            }
        );
        return res.status(200).json({
            user: {
              _id: ngo._id,
              name: ngo.name,
              email: ngo.email,
            },
            token
        });
    } else{
        return res.status(401).json({
            message: "Auth failed: Invalid password",
        });
    }
}

const finalizeReport = async (req, res) => {
    const ngoId = req.user.userId;
    const {wasRescued, reportId} = req.body;

    if (!wasRescued || !reportId) {
        return res.status(400).json({
          message: "1 or more parameter(s) missing from req.body",
        });
    }

    let report = await Report.findById(reportId).catch((err) => {
        console.log(err.toString());
        res.status(500).json({
          message: "Something went wrong",
          error: err.toString(),
        });
    });

    const notes = "";
    if(req.body.notes){
        notes = req.body.notes;
    }

    Report.updateOne(
        {'_id': report._id},
        {
            $set: {
                wasRescued,
                checkedBy: ngoId,
                notes
            }
        },

    )
    .then(async () => {
        if(wasRescued){
            const {name, type, afflictions, address, city, } = req.body;
            const animal = new Animal({
                _id: new mongoose.Types.ObjectId(),
                name,
                type,
                afflictions,
                city,
                address,
                reportId,
                ngoId
            });
            animal.save().then(()=>{
                return res.status(201).send({
                    "message":"Report Checked, Animal Rescued",
                    report
                })
            })
        }
        
        return res.status(201).send({
            "message":"Report Checked",
            report
        })
    })
    .catch((err) => {
        console.log(err.toString());
        res.status(500).json({
          message: "Something went wrong",
          error: err.toString(),
        });
    })
}

const updateAnimalStatus = async (req, res) => {
    const {animalId} = req.body;
    const animal = await Animal.findById(animalId).catch((err) => {
        console.log(err.toString());
        res.status(500).json({
          message: "Something went wrong",
          error: err.toString(),
        });
    })
    if(!animal){
        return res.status(404).json({
            message: "Animal not found",
        });
    }
    if(req.body.ready){
        animal.ready = req.body.ready;
    }
    if(req.body.isAdopted){
        animal.isAdopted = req.body.isAdopted;
    }
    animal.save().then(()=>{
        return res.status(201).send({
            "message":"Status Updated"
        });
    })
}

const getAllNGOs = async (req, res) => {
    const ngos = await NGO.find({}).catch((err) => {
        console.log(err.toString());
        res.status(500).json({
          message: "Something went wrong",
          error: err.toString(),
        })
    });
    return res.status(201).send(ngos);
}

module.exports = {
    login,
    signup,
    finalizeReport,
    updateAnimalStatus,
    getAllNGOs
}