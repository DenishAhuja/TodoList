// its a module

module.exports.getDate = getDate;

function getDate(){
    let today = new Date();
    // var currentDay = today.getDay();
    
    let options = { 
        weekday: 'long',
          month: 'long',
          year: 'numeric',
           day: 'numeric' 
    };

    let day = today.toLocaleDateString("hi-IN" , options);
    
    return day;
}
module.exports.getDay = getDay;

function getDay(){
    let today = new Date();
    // var currentDay = today.getDay();
    
    let options = { 
        weekday: 'long'
    };

    let day = today.toLocaleDateString("hi-IN" , options);
    
    return day;
}

console.log(module.exports);