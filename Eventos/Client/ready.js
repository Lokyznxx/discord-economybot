const client = require("../../index");
const config = require("../../config.json");

client.on("ready", () =>{
 

     
  console.log(`Bot on`)
  
  if(config.mongo || process.env.MONGO){
  const mongoose = require("mongoose")
  mongoose.set('strictQuery', false);
  mongoose.connect(config.mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  }).then(async () => {
    console.log(`Connected MongoDB`)
  }).catch((err) => {
    console.log("\nMongoDB Error: " + err + "\n\n" + sexo)
    })
  } else {
  console.log("sexo")
    }

})