const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
app.set('view engine', 'ejs')
const {
  listdb
} = require("./model/db.js")
const {
  custom
} = require('./model/db');
const _ = require('lodash');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
  extended: true
}))
const path = require('path');
const db = require("./model/db.js");
//creating empty array
// const arrlist = [];
// const worklist = [];

let date = new Date();
let options = {
  weekday: "long",
  month: "short",
  day: "numeric"
};

let timeFormat = date.toLocaleDateString("en-us", options);
let timetrim = timeFormat.split(',')[0];
let item1 = new listdb({
  text: "Click on Input to add todo list"
});
let item2 = new listdb({
  text: "Vinay"
});
let item3 = new listdb({
  text: "Rohan"
})
const arrlist = [item1, item2, item3];
app.get('/', (req, res) => {
  listdb.find({}, function (err, founditems) {
    if (founditems.length === 0) {
      listdb.insertMany(arrlist, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result)
        }
      })
      res.redirect('/')
    } else {
      res.render('index', {
        msg: timeFormat,
        newListIndex: founditems
      })
    }

  })
});
// post route
app.post('/', (req, res) => {
  const list = req.body.list;
  const btn = req.body.btn.split(',')[0];
  const lists = new listdb({
    text: list
}) 
  if (btn === timetrim) {   // for Home route
    lists.save();
    res.redirect('/')
}
else{                         // for custom route
  console.log("btn "+btn);
  custom.findOne({name:btn},function(err, docs){
   docs.textlist.push(lists);
   docs.save();
   res.redirect('/' + btn)
  })
}
});

//Delete route
app.post('/delete', function (req, res) {
  const id = req.body.checkbox;
  const hidden = req.body.hidden.split(',')[0];
  if(hidden === timetrim){          //home route
    listdb.findByIdAndRemove(id, function (err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log(result)
        res.redirect('/')
      }
    })
  }
  else{                     //custom route
    custom.findOneAndUpdate({name:hidden},{$pull:{textlist:{_id: id}}}, function(err, result){
        if(!err){
          res.redirect('/'+ hidden);
        }
    })
  }

});

//Work Route
app.get('/:customroute', (req, res) => {
  const customroutes = _.capitalize(req.params.customroute);
  console.log(customroutes);
  custom.findOne({
    name: customroutes
  }, function (err, docs) {
    if (!err) {
      if (!docs) {
        let list = new custom({
          name: customroutes,
          textlist: arrlist
        })
        list.save();
        res.redirect('/' + customroutes);
      } else {
        res.render('index', {
          msg: docs.name,
          newListIndex: docs.textlist
        })
        //  res.redirect('/' + customroutes);
      }
    } else {
      console.log(docs);
    }

  });
});

app.listen(port, () => {
  console.log(`Port is listining at ${port}`)
})