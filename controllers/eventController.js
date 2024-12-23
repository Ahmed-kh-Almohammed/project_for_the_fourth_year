
const db = require('../models/database.js');
let event;
let city;
let AllEvents;
let CityEvent;
async function again(req,res)
{
  
  city = await db.getCities();
  AllEvents=await db.getAllEvent();
  CityEvent = [];
 for (let i = 0; i < AllEvents.length; i++) {
   let cityTest = [];
   let EventCites = await db.getEventCites(AllEvents[i].eventId);
   for (let j = 0; j < EventCites.length; j++) {
     let test = await db.getCityName(EventCites[j].cityFk);
     cityTest.push(test[0].cityName);
   }
   CityEvent.push(cityTest);
 }
}
const eventGet = async (req, res) => {
  let today = new Date()
  let r=await again(req,res);
  let day = today.getDate()
  if (day < 10) day = "0" + day;
  let month = today.getMonth() + 1
  if (month < 10) month = "0" + month;
  let date = month + "-" + day;
  event = await db.getEventByDate(date);
  res.render('event', { session: req.session, event, city, eventFlterDate: "Null", CityEvent ,AllEvents});
}
eventDelete =async (req,res)=>{
  let eventId=req.params.id;
  let y=await db.deleteEventById(eventId);
let r=await again(req,res);
res.redirect('/event')
}
eventPost = async (req, res) => {
  if (req.body.eventDateFilter) {
    let date = req.body.eventDate;
    let eventFlterDate = await db.getEventByDate(date);
    let r=await again(req,res);
    res.render('event', { session: req.session, event, city, eventFlterDate, CityEvent,AllEvents });
  }
  if (req.body.CitySelect) { 
   let e=await db.getEventCityFilter(req.body.CitySelect);
   eventFlterDate=[];
   CityEvent=[];
   let tt=[];
   tt.push(req.body.CitySelect)
   for(let i=0;i<e.length;i++)
   {
    let name=await db.getEventById(e[i].eventFk);
   eventFlterDate.push(name[0]);

   CityEvent.push(tt);
   }
    res.render('event', { session: req.session, event, city, eventFlterDate, CityEvent ,AllEvents});
  }
 
  if(req.body.addevent){
    let eventName=req.body.eventName;
    let eventDate=req.body.eventDate;
    let eventDetails=req.body.eventDetails;
    let city=[];
    let e=req.body.native;
    let s='';
    for(let i=0;i<e.length;i++){
      if(e[i]!==',')
      {
        s=s+e[i];
      }
      else if(e[i]===',')
      {
      city.push(s);
        s='';

      }
    }
    city.push(s);
    let w=await db.insertEvent(eventName,eventDate,eventDetails,city);
    req.session.msg="added succesfully"
    let r=await again(req,res);
    res.render('event', { session: req.session, event, city, eventFlterDate: "Null", CityEvent ,AllEvents});
  
  }

}

module.exports = {
  eventGet,
  eventPost,
  eventDelete
}