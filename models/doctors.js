import mongoose from "mongoose";

const DoctorSchema = mongoose.Schema({
    name : {
        type:String,
        required:true,
    },
    specialty : {
        type:String,
        required:true,
    },
    experience : {
        type:Number,
        required:true,
    },
    gender : {
        type:String,
        required:true,
    },
    consultationFee : {
        type : Number,
        required: true,
    },
    location : {
        type : String,
        required : true,
    },
});
export const Doctor = mongoose.model('Doctor', DoctorSchema);