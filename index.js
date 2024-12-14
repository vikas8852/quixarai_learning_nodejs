const express=require('express');
//const user=require("./MOCK_DATA.json")
const app=express();
const mongoose=require("mongoose");
const fs=require('fs');
const { type } = require('os');
const PORT=8000;
//Connection
mongoose.connect('mongodb://127.0.0.1:27017/youtube-app-1').then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log("Mongo Error",err));
app.use(express.urlencoded({extended:false}));//middleware pulgin
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
    }
})
const User=mongoose.model("user",userSchema);
app.get("/user",async(req,res)=>{
    const allDbUsers=await User.find({});
    const html=`
    <ul>
    ${allDbUsers.map((user)=> `<li>${user.firstName}-${user.email}</li>`)}
        </ul>`
     res.send(html);
})
//REST API
app.get("/api/user",(req,res)=>{
    res.setHeader('myName','Piysuh Garg')
    return res.json(user);
})
app
.route("/api/user/:id")
.get((req,res)=>{
    const id=Number(req.params.id);
    const users=user.find((user)=>user.id===id);
    return res.json(users);
})
.patch((req,res)=>{
    res.json({status:"Pending"})
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


app.listen(PORT,()=>console.log(`Server Started at PORT ${8000}`));


