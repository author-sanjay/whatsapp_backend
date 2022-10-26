import express from "express";
import mongoose from "mongoose";
import Messages from "./dbmessages.js";
const app = express();
const port = process.env.PORT || 9000;

const connection_url="mongodb+srv://admin:huvkam5RhzeoU1eH@cluster1.4ruxgjo.mongodb.net/?retryWrites=true&w=majority"


app.use(express.json())


mongoose.connect(connection_url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})


app.get("/", (req, res) => {
    res.status(200).send("Hello")
});

app.post('/api/messages/new',(req,res)=>{
    const dbMessage=req.body

    Messages.create(dbMessage,(err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(201).send(data)
        }
    })
})

app.get('/api/messages/sync',(req,res)=>{
    Messages.find((err,data)=>{
        if(err){
            res.status(500).send(err)

        }else{
            res.status(200).send(data)
        }
    })
})
app.listen(port,()=>{
    console.log("server Running")
})

