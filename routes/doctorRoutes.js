import express from 'express'
const router = express.Router();
import {Doctor} from '../models/doctors.js'


router.post('/', async(request , response) => {
  try{
  if(!request.body.name ||
    !request.body.specialty ||
    !request.body.experience ||
    !request.body.gender ||
    !request.body.consultationFee ||
    !request.body.location
  ){
    return response.status(400).send({message: 'name , specialty , experience, gender, consultationFee, location'});
  }
  const newDoctor = {
    name : request.body.name,
    specialty:request.body.specialty,
    experience:request.body.experience,
    gender:request.body.gender,
    consultationFee:request.body.consultationFee,
    location:request.body.location,
  };
  const doctor = await Doctor.create(newDoctor)
  return response.status(201).send(doctor)
  }catch(error){
console.log(error);
response.status(500).send({message: error.message})
  }
})

// for getting all the list 
router.get('/', async( request , response) => {
  try{
  const doctor = await Doctor.find({});
  return response.status(200).json({
    count : doctor.length,
    data : doctor
  })
  }
  catch(error){
  console.log(error);
  response.status(500).send({message: error.message})
  }
})

// for getting using specific detail
router.get('/:id', async( request , response) => {
  try{
    const {id} = request.params;
  const doctor = await Doctor.findById(id);
  return response.status(200).json(doctor)
  }
  catch(error){
  console.log(error);
  response.status(500).send({message: error.message})
  }
})

// GET doctor by name
router.get('/name/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const doctor = await Doctor.findOne({ name: { $regex: new RegExp(name, "i") } });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error fetching doctor by name:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get list of doctors
// router.get('/name/:name', async (req, res) => {
//   try {
//     const { name } = req.params;

//     const doctors = await Doctor.find({
//       name: { $regex: new RegExp(name, "i") }, // case-insensitive search
//     });

//     if (doctors.length === 0) {
//       return res.status(404).json({ message: "No doctors found" });
//     }

//     res.status(200).json(doctors);
//   } catch (error) {
//     console.error("Error fetching doctors by name:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
 

export default router;