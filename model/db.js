const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');
mongoose.connect('mongodb://localhost:27017/todoList', {
    useNewUrlParser: true,
    useUnifiedTopology:true,
}).then(function () {
    console.log("Connection connected Successfully");
}).catch(function () {
    console.log("Connection Fail");
})
const listSchema = new mongoose.Schema({
    text:{
        type: String,
        required:true
    }
});
const customSchema = new mongoose.Schema({
    name:String,
    textlist: [listSchema]
});
let  custom  =  mongoose.model("custom", customSchema);
let  listdb  =  mongoose.model("listdb", listSchema);
module.exports = { custom: custom, listdb: listdb }