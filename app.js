const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bcrypt=require('bcrypt')
var admin = require("firebase-admin");
const bodyParser = require("body-parser");
const serviceAccount = require('./serviceAccountKey.json');
app.use(bodyParser.json());
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    });
const db = admin.firestore();

app.post('/user',async(req,res) => {
    // console.log(req.body);
    let email=req.body.email;
    let password=req.body.password;
    let exist=false;
    let hashPassword;
    if(email && password){
		let user=await db.collection('users').get();
        user.forEach((docs)=>{
            if(docs.data().email==email){
                exist=true;
                hashPassword=docs.data().password;
                return;
            }
        })
        if(exist){
            const match = await bcrypt.compare(password, hashPassword);
            if(match){
                res.status(200).send('user authenticated');
            }
            else{
                res.status(401).send('user not authenticated');
            }
        }
        else{
            password=await bcrypt.hash(password, 10);
            await db.collection("users").add({
                        email:email,
                        password:password
            });
            res.status(201).send('user-created')
        }
    }
	else{
    if(!email){
        res.status(406).send({"status":"error","error":"Email missing"});
    }
    else{
        if(!password)
        res.status(406).send({"status":"error","error":"Password missing"});
        }
    }

})

app.listen(PORT, (req,res)=>{
    console.info(`Running on ${PORT}`)
})