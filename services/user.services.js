const User = require("../models/user.model");
const UserProfile = require("../models/user.profile.model");
const tokenService = require('../jwt/token.service');
const bcrypt = require('bcrypt');
const { default: mongoose } = require("mongoose");


class UserServices {
    async signup(name, email, password) {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error("This Email already owned by a user");
        }
        const hashedPassword = await bcrypt.hash(password,10); //for hashing the password

        const user = await User.create({
            name,
            email,
            password:hashedPassword
        });

        return user;
    }
   async loginUser(email,password){
        const user=await User.findOne({email}).select("+password")
        if(!user){
            throw new Error("User not Found")
        }
        if(!user.isActive){
            throw new Error("Account is inactive!")
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            throw new Error("Invalid credentials")
        }
        const payload={
            id:user._id,
            email:user.email,
            isActive:user.isActive,
        }
        const token=tokenService.generateToken(payload)
        const userWithoutPassword=user.toObject()
        delete userWithoutPassword.password
        return{user:userWithoutPassword,token}
    }
    async getAllUsers(){
        const user=await User.find({isActive:true}).populate('profile')
        return user
    }
    async getAllUsersWithoutpop(){
         const user=await User.find({isActive:true});
        const userIds=user.map((user)=>user._id);
        const userProfiles=await UserProfile.find({
            user:{$in:userIds},
        });

        const userWithprofiles=user.map((user)=>{
            const profile=userProfiles.find(
                (profile)=>profile.user.toString()===user._id.toString(),
            )
            return{
                ...user.toObject(),
                profile:profile||null,
            };
        });
        return userWithprofiles;
    }

    async addUserProfile(userId,profileData){
        if(!mongoose.isValidObjectId(userId)){
            throw new Error("Invalid user Id");
        }
        const user=await User.findOne({_id:userId,isActive:true})

        if(!user){
            throw new Error("User not found") 
        }
        const userProfile = await UserProfile.create({
            user:userId,
            age: profileData.age,
            dob:profileData.dob,
            bio:profileData.bio,
        });

        user.profile = userProfile._id;
        await user.save();
        return userProfile;
    }

    async updateUser(id, name, email) {
        const user = await User.findOne({ _id: id, isActive: true });

        if (!user) {
            throw new Error("User not Found");
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error("This Email already owned by a user");
            }
            user.email = email;
        }

        if (name) {
            user.name = name;
        }

        await user.save();
        return user;
    }

    async softDeleteUser(id) {
        const user = await User.findOne({ _id: id, isActive: true });

        if (!user) {
            throw new Error("User not Found");
        }

        user.isActive = false;
        await user.save();
        return user;
    }
}


module.exports = new UserServices();
