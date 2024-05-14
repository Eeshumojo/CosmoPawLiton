const User = require('../routes/models/user.model.js');
const NGO = require('../routes/models/ngo.model.js');
const Animal = require('../routes/models/animal.model.js');

const getAnimalsOfNGO = async (req, res) =>{
    const ngoId = req.user.userId;
    const animals = await Animal.find({ngoId});
    if(!animals){
        return res.status(404).send({
            "message":"No Animals Found"
        })
    }
    res.status(201).send({
        animals
    })
}

const getReadyAnimals = async (req, res) =>{
    const animals = await Animal.find({ready: true, isAdopted: false});
    if(!animals){
        return res.status(404).send({
            "message":"No Animals Found"
        })
    }
    res.status(201).send({
        animals
    })
}

const getWantingToAdopt = async (req, res) =>{
    const userId = req.user.userId;
    let user = await User.findById(userId).catch((err) => {
        console.log(err.toString());
        res.status(500).json({
          message: "Something went wrong",
          error: err.toString(),
        });
    });
    let animals = [];
    user.wantToAdopt.forEach((animalId) => {
        const animal = await Animal.findById(animalId).catch((err) => {
            console.log(err.toString());
            res.status(500).json({
              message: "Something went wrong",
              error: err.toString(),
            });
        })
        animals.push(animal);
    });

    return res.status(201).send(
        animals
    )
}


module.exports={
    getAnimalsOfNGO,
    getReadyAnimals,
    getWantingToAdopt
}