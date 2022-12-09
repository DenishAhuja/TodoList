const express  = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

// const date = require(__dirname + "/date.js");

// console.log(date());

const app = express();

// let items =["Buy food" , "cook food" , "eat food"];
// let workItems = [];

// now using mongoose.
// creating new database 
mongoose.connect("mongodb+srv://adminn-mongodb-details/myFirstDatabase");

const itemsSchema = {
    name : String
};

const Item = mongoose.model("Item" , itemsSchema);

const item1 = new Item({
    name : "Welcome!!"
});

const item2 = new Item({
    name : "hello!!"
});

const item3 = new Item({
    name : "badiya!!"
});

const defaultItems = [item1 , item2 , item3];

const listSchema = {
    name : String,
    items: [itemsSchema]
};

const List = mongoose.model("List" , listSchema);

app.set("view engine" , "ejs");   //needed to use ejs see doc ejs.co

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));  //to use the static files 
// stored in our computer only not in server

app.get("/" , function(req , res){

    // let day = date.getDate();

    Item.find({} , function(err,  foundItems){
        
        if(foundItems.length === 0){

            Item.insertMany(defaultItems , function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Successfully inserted..")
                }
            });
        res.redirect("/");
        }else{
            res.render("list" , {listTitle: "Today" , newListItems : foundItems}); //for ejs
            console.log("already items present in the db");
        }

    });

    

});



//dynamic route (pages)

app.get("/:customListName" , function(req , res){
   const customListName = _.capitalize(req.params.customListName);


// soo that same name se jayada list na bn jaye agr list present h already then 
// will provide it the access of that list otherwise will create the new list.

List.findOne({name : customListName} , function(err , foundList){
    if(!err){
        if(!foundList){
            //create a new list

            const list  = new List({
                name : customListName,
                items : defaultItems
            });
         
            list.save();

            res.redirect("/" + customListName);

        }else{
            // show the existing list

            res.render("list" , {listTitle: foundList.name , newListItems : foundList.items});
        }
    }
});

   

});



app.post("/" , function(req ,res,next){

    const itemName = req.body.newItem;
    const listName = req.body.list;
    if(itemName.length === 0){
        res.redirect("/" + listName);
    }

    if(itemName.length > 0){
    const item = new Item({
        name : itemName
    });

    // if(listName ==="Today"){
        
    //     item.save();
    //     res.redirect("/");
    
    // }else{
        List.findOne({name : listName} , function(err , foundList){
            // console.log(foundList.items);
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });

    // }

}


    

    // if(req.body.list === "Work"){
    //     workItems.push(item);
    //     res.redirect("/work");

    // }else{
    //     defaultItems.push(item);
    //     res.redirect("/");

    // }


});

app.post("/delete" , function(req,res){ 

   const checkedItemId = req.body.checkbox;
   const listName = req.body.listName;

   if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId , function(err){
        if(!err){
            console.log("Successfully deleted checked item");
            res.redirect("/");
        }
    });
    // deleting items fromt the custom dynamic list
   }else{
       List.findOneAndUpdate({name : listName} , {$pull : {items : {_id : checkedItemId}}} , function(err , foundList){
           if(!err){
               res.redirect("/" + listName);
           }
       });
   }

    
});



// app.get("/work" , function(req,res){
//     res.render("list" , {listTitle: "Work List" , newListItems: workItems});
// });

// app.post("/work" , function(req , res){
//     let item = req.body.newItem;
//     workItems.push(item);
//     res.redirect("/work");
// })

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port , function(){
    console.log("server has started successfully!!");
})

