const UserServices=require('../services/user.services')

class UserController{
    async signup(req,res){
        try{
        const {name,email,password}=req.body
        if(!name || !email||!password){
                return res.status(400).json({message:"All fields are required!"})
            }
            const result=await UserServices.signup(name,email,password)
            return res.status(201).json({message:"User created successfully",data:result});
        }catch(error){
            console.log(error.message);
            return res.status(500).json({message:error.message})
        }

    }
    async login(req,res){
        try {
            const{email,password}=req.body
            if(!email||!password){
                return res.status(400).json({message:'Both "email" and "password" are required'})
            }
            const loginData = await UserServices.loginUser(email, password)
           return res.status(200).json(loginData)
        } catch (error) {
            res.status(401).json({error:error.message})
        }
    }
    async getAllUsers(req,res){
        try {
            const result=await UserServices.getAllUsers()
            return res.status(201).json({message:"User fetched successfully",data:result});

        } catch (err) {
            return res.status(500).json({message:err.message})
            
        }
    }

    async getAllUsersWithoutpop(req,res){
        try {
            const result=await UserServices.getAllUsersWithoutpop()
            return res.status(200).json({message:"User fetched successfully",data:result});
        } catch (err) {
            return res.status(500).json({message:err.message})
        }
    }

    async updateUser(req, res) {
        try {
            if (req.user.id !== req.params.id) {
                return res.status(403).json({ message: "You can only update your own account" });
            }

            const { name, email } = req.body;
            if (!name && !email) {
                return res.status(400).json({ message: "Name or email is required" });
            }

            const result = await UserServices.updateUser(req.params.id, name, email);
            return res.status(200).json({ message: "User updated successfully", data: result });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async deleteUser(req, res) {
        try {
            if (req.user.id !== req.params.id) {
                return res.status(403).json({ message: "You can only delete your own account" });
            }

            const result = await UserServices.softDeleteUser(req.params.id);
            return res.status(200).json({ message: "User deleted successfully", data: result });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async addUserProfile(req,res){
        try{
            const userId = req.user.id
            const {age,dob,bio} = req.body;
            if (!userId){
                return res.status(400).json({message:"User ID is required"});
            }
            const newUserProfile = await UserServices.addUserProfile(userId,{age,dob,bio});
            return res.status(201).json({message:"User profile added successfully",data:newUserProfile});
        }
        catch(err){
            if (err.code=== 11000){
                return res
                  .status(409)
                  .json({message:"A profile for this user already exists"});
            }
            console.log(err);
            res.status(400).json({error:err.message});
        }
    }
}

module.exports= new UserController();
