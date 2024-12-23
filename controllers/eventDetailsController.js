const db = require('../models/database.js');

let eventId;
let event;
let cityEvent;
let city;
let pppp=[];
let po=[];
let vi=[];
let users=[];
async function again(req, res)
{
  city = await db.getCities();
 po=[];
 vi=[];
  event = await db.getEventById(eventId);
  cityEvent = await db.getEventCites(eventId);
users=await db.getAllUsers();
  for (let j = 0; j < cityEvent.length; j++) {
    let people= await db.getMemoryEvent(cityEvent[j].eventCityId);
    let victims =await db.getMemoryVictim(cityEvent[j].eventCityId);
    
    if(people.length>0)
      {
        for(let k=0;k<people.length;k++)
        {
        let q22=await db.getUser(people[k].userFk);
      q22=q22.firstName+q22.lastName;
      let q11=await db.getCityName(people[k].cityFk);
      q11=q11[0].cityName;
      let q33=people[k].memoryDate;
      let q44=people[k].story;
      let q55=await db.getPhotoMemory(people[k].memoryId);
      po.push({user:q22,city:q11,date:q33,story:q44,links:q55});
        }
      }
      if(victims.length>0)
      {
        for(let k=0;k<victims.length;k++)
        {
            let q2=await db.getUser(victims[k].userFk);
      q2=q2.firstName+q2.lastName;
      let q1=await db.getCityName(victims[k].cityFk);
      q1=q1[0].cityName;
      let q3=victims[k].memoryDate;
      let q4=victims[k].story;
      let q5=await db.getPhotoMemory(victims[k].memoryId);
      let q6=victims[k].memoryId;
      vi.push({user:q2,city:q1,date:q3,story:q4,links:q5,id:q6});
        }
    
      }
}
  let cityTest = [];
  for (let j = 0; j < cityEvent.length; j++) {
    let test = await db.getCityName(cityEvent[j].cityFk);
    cityTest.push({ id: cityEvent[j].cityFk, name: test[0].cityName, details: cityEvent[j].eventCityDetails });
  }
 
  cityEvent = cityTest;
  pppp=[];
  for(let i=0;i<cityEvent.length;i++)
  {

    let r= await db.getPhoto(eventId,cityEvent[i].id);
    pppp.push(r);
  }
}
const eventDetailsGet = async (req, res) => {

  eventId = req.params.id;
let u=await again(req, res);
  res.render('eventDetails', { session: req.session, cityEvent, event: event[0], city,photo:pppp ,po,vi,users});
}

const eventDetailsPost = async (req, res) => {
  if(req.body.addvictim)
  { 
    console.log(eventId,req.body);
    let cityEventFk= await db.getEventCity(eventId,req.body.city);
   let nnnn=await db.getCityName(req.body.city);
   let y=await db.UpdateDeathProfile(nnnn[0].cityName,req.body.date,event[0].eventName,req.body.user);
    let r=await db.insertVictimMem(req.body.user,cityEventFk[0].eventCityId,req.body.city,req.body.story,req.body.date);
    
    let sampleFile = req.files.sampleFile;
    let name = sampleFile.name;
    memoryId=r.insertId;

    let fully = "D:\\My Archive\\public\\" + name;
    sampleFile.mv(fully, async (err) => {
    if (err) { console.log(err) }  
      let oo = await db.insertVictimPhoto(name,memoryId);
      let url = "/eventDetails/" + eventId;
      res.redirect(url);
    });
}
  else if (req.body.addcity) {

    let e = req.body.native;
    let s = '';
    let c = [];
    for (let i = 0; i < e.length; i++) {
      if (e[i] !== ',') {
        s = s + e[i];
      }
      else if (e[i] === ',') {
        c.push(s);
        s = '';

      }
    }
    c.push(s);
    let u=await again(req, res);
    let url = "/eventDetails/" + eventId;
    res.redirect(url);
  }
  else if (req.body.updateCityDetails) {
    let details = req.body.updateCityDetails;
    let t = await db.updateCityEventDetails(req.params.id, eventId, details);
   let u=await again(req, res);
    let url = "/eventDetails/" + eventId;
    res.redirect(url);
  }
  else if (req.body.updateevent) {
    let eventName = req.body.eventName;
    let eventDate = req.body.eventDate;
    let eventDetails = req.body.eventDetails;
    let w = await db.updateEventdetails(eventName, eventDate, eventDetails, eventId);
    req.session.msg = "updated succesfully"
   let u=await again(req, res);
   console.log(event,eventId)
   let url = "/eventDetails/" + eventId;
   res.redirect(url);
  }
  else if (req.files) {
    let sampleFile = req.files.sampleFile;
    let name = sampleFile.name;
    let fully = "D:\\My Archive\\public\\" + name;
    sampleFile.mv(fully, async (err) => {
      if (err) { console.log(err) }
      
  let cityId=req.body.submit;
      let oo = await db.insertPhoto(name,eventId,cityId);
      let url = "/eventDetails/" + eventId;
      res.redirect(url);
    });
  }
  else if(req.body.showMore){
  let url = "/eventDetails/" + req.params.id;
  res.redirect(url);
  }
}
const eventDetailsDelete = async (req, res) => {
  if(req.body.deletePhoto)
  {
    let e = await db.deletePhoto(req.params.id);
  }
  else if(req.body.deletecity)
  {
    let e = await db.deleteEventDetailsById(req.params.id, eventId);
  }
  else if(req.body.deletevictim)
  {
    let e = await db.deletevictim(req.params.id);
  }
  let url = "/eventDetails/" + eventId;
  res.redirect(url);
}
module.exports = {
  eventDetailsGet, eventDetailsPost, eventDetailsDelete
}