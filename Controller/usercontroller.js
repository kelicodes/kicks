import user from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";


export const userReg=async(req,res)=>{

    try {
        const {name,email,password}=req.body
        if(!name || !email || !password){
            return res.status(400).json({success:false,message:"all fileds are required."} )
        }

        const salt=await bcrypt.genSalt(10)
        const passwordbcrpt= await bcrypt.hash(password, salt)

    const checkmail= await user.findOne({email})
        if(checkmail){
            return res.json({success:false, message:"user with mail exists"})
        }


        const newuser= new user({
            name,
            email,
            password:passwordbcrpt
        })

        await newuser.save()
        const token = JWT.sign({ id: newuser._id }, process.env.SECRETWORD, { expiresIn: "1d" });


        return res.status(200).json({success:true,user:newuser,token,message:"user saved successfully"})


    } catch (error) {
        console.error(error.message)
        return res.status(500).json({
            success:false, message:"eroor in userreg controller"
        })
    }
}



export const userLogin=async(req,res)=>{
    try {
        const {email,password}=req.body
        if(!email || !password){
            return res.status(401).json({message:"email and password are required,",success:false})
        }

        const guest= await user.findOne({email})

        if(!guest){
             return res.status(500).json({message:"email not found ,",success:false})
        }

        const passwordcompare= await bcrypt.compare(password,guest.password)

        if(!passwordcompare){
            return res.status(500).json({message:"password mismatch,",success:false})

        }

        const token = JWT.sign({ id: guest._id }, process.env.SECRETWORD, { expiresIn: "1d" });


        return res.json({success:true,token,message:"password worked"})


    } catch (error) {
        console.error(error.message)
        return res.status(500).json({
            success:false, message:"eroor in uselogin controller"
        })
    }
}



export const logout=()=>{
    try {
          return res.json({ success: true, message: "User logged out. Remove token on client side." });
    } catch (error) {
         console.error(error.message)
        return res.status(500).json({
            success:false, message:"eroor in logout controller"
        })
    }
}
