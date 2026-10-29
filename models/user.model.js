const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[true, 'Name is required'],
        trim: true
    },
    email: { 
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false // Exclude password from query results by default
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // we have commented it beacause to run getAllUsersWithoutpop() in user.services.js 
    //  profile:{
    //      type:mongoose.Schema.Types.ObjectId,
    //      ref:"UserProfile",
    //  } 
},{
    timestamps:true
}
);

const User = mongoose.model("User",userSchema);
module.exports=User;
