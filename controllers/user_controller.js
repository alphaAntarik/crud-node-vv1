const bcrypt=require("bcrypt")
 const userModel=require('../models/user_model')


exports.signup = async (req, res) => {

    const existingUser = await userModel.findOne({ email: req.body.email })
    if (existingUser) {
       return res.status(400).json({'error' : 'user already exists'})
    }
    const salt=await bcrypt.genSalt(10)
    const hashedPassword= await bcrypt.hash(req.body.password,salt)
    const user = new userModel(
        {
         name:req.body.name,
         email:req.body.email,
         password:hashedPassword,
     }
      
    );
    user.save().then((user) => {

      const { password, ...response_details } = user.toObject()
       req.session.userId = user._id;
      return  res.json({"user":response_details})
    }).catch((err)=>res.json({"err":err}))
}
 exports.login= async (req, res) => {
   try {
       const user = await userModel.findOne({ email: req.body.email })
       if (!user) {
           return res.status(400).json({error:"user not found"})
       }

       const compare_password = await bcrypt.compare( req.body.password,user.password,)
       if (!compare_password) {
           return res.status(400).json({error:"wrong password"})
     }
 req.session.userId = user._id;
       user.password=undefined
             return res.status(200).json({ message: "Login successful",user:user });
   } catch (error) {
     return res.status(400).json({error:"error occurred"})
       
   }
}

exports.updateUser = async (req, res) => {
  const update = req.body;
  

  try {
    const user_to_update = await userModel.findById(req.body.id);
    if (!user_to_update) {
      return res.status(404).json({ error: "no user found" });
    }

    user_to_update.name = req.body.name;
    

  
    user_to_update.save()
      .then(user => res.status(200).json(user.toObject()))
      .catch(err => res.status(500).json({ err: 'failed to save' }));

  } catch (error) {
    res.status(500).json({ error: "error" });
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.body.id)
    if (!user) {
      return res.status(400).json({error:"error to delete"})
    }

    return res.json({messahe:"successfully deleted"})
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}
exports.dashboard = (req, res) => {
  if (!req.session.userId) {
        return res.json({authenticated:false});
    }
     return res.json({authenticated:true});
}
exports.logout =async (req, res) => {

  try {
    const user = await userModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(400).json({ error: "user not found" })
    }

    const compare_password = await bcrypt.compare(req.body.password, user.password,)
    if (!compare_password) {
      return res.status(400).json({ error: "wrong password" })
    }
    req.session.destroy(err => {
      if (err) {
        return res.json({ cookie: 'not destroyed' });
      }
      res.clearCookie('connect.sid');
      //  The connect.sid is the default name for the session ID cookie used by the express-session middleware in Express.js applications. 
      return res.json({ cookie: 'destroyed' });
    });
  
   } catch (error) {
     return res.status(400).json({error:"error occurred"})
       
  }
  

  
}
