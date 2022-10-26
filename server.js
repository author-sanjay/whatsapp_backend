import express from "express";
import mongoose from "mongoose";
import Messages from "./dbmessages.js";
import Pusher from "pusher";

const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: "1497708",
    key: "9e3a199104fea69bb83a",
    secret: "31390be9aecf8ef18862",
    cluster: "ap2",
    useTLS: true
});

const connection_url="mongodb+srv://admin:huvkam5RhzeoU1eH@cluster1.4ruxgjo.mongodb.net/?retryWrites=true&w=majority"


app.use(express.json())


mongoose.connect(connection_url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const db=mongoose.connection

db.once("open",()=>{
    console.log("DB Connected");
    const msgCOllection= db.collection("messagecontents");
    const changeStream = msgCOllection.watch();

    changeStream.on("change",(change)=>{
        console.log(change)
        if(change.operationType==="insert"){
            const messageDetails=change.fullDocument;
            pusher.trigger("messages","inserted",{
                name:messageDetails.user,
                message:messageDetails.message
            });
        }else{
            console.log("error Triggering pusher");
        }
    })
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

