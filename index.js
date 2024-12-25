const express=require('express');
const users=require("./MOCK_DATA.json")
const app=express();
const validator = require('validator');       // to check email if valid or not
const fs=require('fs');
const { type } = require('os');
const PORT=8005;
const mongoose=require("mongoose");

//schema
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        require:true,

    },
    lastname:{
        type:String,
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    jobTitle:{
        type:String,
    },
    gender:{
        type:String,
        require:true,
    }
})

const User=mongoose.model("user",userSchema);



// app.get("/api/users",(req,res)=>{
//     return res.json(users)
// })                               //Rest API
// app.get("/users",(req,res)=>{                                  // All this get data from mockdata
//   const html=`
//   <ul> 
//   ${users.map((user)=>`<li>${user.first_name}</li>`)} 
//   </ul>`;
//   res.send(html);
// })
// app.get("/api/users/:id",(req,res)=>{
//     const id=Number(req.params.id);
//     const user=users.find((user)=>user.id===id);
//     return res.json(user)
// }) 
//Connection
mongoose.connect('mongodb://127.0.0.1:27017/youtube-app-1').then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log("Mongo Error",err));
app.use(express.urlencoded({extended:false}));//middleware pulgin
app.use(express.json());


app.get("/user",async(req,res)=>{
    const allDbUsers=await User.find({});
    const html=`
    <ul>
    ${allDbUsers.map((user)=> `<li>${user.firstName}-${user.email}</li>`)}
        </ul>`
     res.send(html);
})
//REST API
   app.get("/api/users",(req,res)=>{
   return res.json(users)
     })      
app
.route("/api/users/:id")
.get((req,res)=>{
    const id=Number(req.params.id);
    const user=users.find((user)=>user.id===id);
    return res.json(user);
})
.patch(async(req,res)=>{
    await User.findByIdAndUpdate(req.params.id,{lastname:"Changed"});
     return res.json({status:"success"})
})
.delete((req,res)=>{
    return res.json({status:"Pending"});
});
app.post("/api/user",async(req,res)=>{
    const body=req.body;
    if(
        !body ||
        ! body.first_name ||
        ! body.last_name ||
        ! body.email ||
        ! body.gender ||
        ! body.job_title 

        ){
            return res.status(400).json({msg:"all field are reqire.."});
        };
        // this check if email id valid or not
        if (!validator.isEmail(body.email)) {
            return res.status(400).json({ error: 'Invalid email address' });    
        }
        // Validate gender 
        const allowedGenders = ['male', 'female', 'other'];
        if (!allowedGenders.includes(body.gender)) {
        return res.status(400).json({ error: 'Gender must be male, female, or other' });
    }
        
     const result=  await User.create({
            firstName:body.first_name,
            last_name:body.last_name,
            email:body.email,
            gender:body.gender,
            jobTitle:body.job_title ,

        });
//   user.push({...body,id: user.length+1});
//   fs.writeFile('./MOCK_DATA.json',JSON.stringify(user),(err,data)=>{
//     return res.json({status:"sucess",id:user.length+1});
 // })
 console.log('result',result);
 return res.status(201).json({msg:'success'});
});


app.listen(PORT,()=>console.log(`Server Started at PORT ${8005}`));


