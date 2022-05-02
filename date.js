function getdate(){ 
let date = new Date();  
let options = {  
    weekday: "long", month: "short",  
    day: "numeric"  
};  

timeFormat = date.toLocaleDateString("en-us", options);
return timeFormat;

}
module.exports= getdate();
