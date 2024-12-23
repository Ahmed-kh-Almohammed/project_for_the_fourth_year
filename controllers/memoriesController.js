
//const memoryModel = require('../models/memoryModel');
const db = require('../models/database');


let city = []; let event = [];
let types = []; let allusers = [];
let userr = [];
let EVCit = [];
let users = []; let today = new Date(); let year, month, day;
let allmemories = [], allmemory = []; let allmemoriesID = [];
async function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}
async function again(req, res) {
  allmemories = [], allmemory = []; allmemoriesID = [];
  memoryId = req.params.id;
  year = today.getFullYear();
  month = today.getDate();
  day = today.getMonth() + 1;
types=[];
users=[];
city=[];
event=[];
  types.push("A", "achivement", "marriage", "graduation", "ceremony", "birth");

  allmemoriesID = await db.GetAllMemfromuser(req.session.userId);
  for (let i = 0; i < allmemoriesID.length; i++) {
    let mem = await db.GetAllMemory(allmemoriesID[i].memoryId);
    allmemories.push(mem);
  }

  for (let i = 0; i < allmemories.length; i++) {
    userr = [];
    let idd = allmemories[i][0].memoryId;

    //console.log(idd)
    let use = await db.GetAllmemoryID(idd);

    for (let j = 0; j < use.length; j++) {
      let op = await db.getUser(use[j].userfk);
      userr.push(op)
    }
    let memorynamee = allmemories[i][0].memoryName;
    let cityy = await db.getCityName(allmemories[i][0].cityFk);
    let datee = allmemories[i][0].memoryDate;
    let storyy = allmemories[i][0].story;
    let typee = types[allmemories[i][0].memoryType];
    let linkss = await db.getPhotoMemory(allmemories[i][0].memoryId);
    allmemory.push({ memoryName: memorynamee, id: idd, user: userr, city: cityy, date: datee, story: storyy, type: typee, links: linkss });
  }

  allusers = await db.getAllUsers();
  for (let i = 0; i < allusers.length; i++) {
    if (allusers[i].userId != req.session.userId)
      users.push(allusers[i]);
  }
  //console.log(users)
  let cities = await db.memoriesGetAllCities();
  for (let i = 0; i < cities.length; i++)
    city.push(cities[i]);

  let allevent = await db.memoriesGetAllevent();

  for (let i = 0; i < allevent.length; i++)
    event.push(allevent[i]);
}
const memoryGet = async (req, res) => {
console.log("sssssssssss",req.session)
  /* EVCit=[];
   let eve=await db.memoriesGetAlleventcities(event_select,city_select); 
   for(let i=0;i<eve,length;i++)
   {
     let o=await db.getCityName(eve[i].cityFk);
     EVCit.push(o[0]);
   }
   console.log(EVCit);
 */
  allmemories = [], allmemory = []; allmemoriesID = [];
  memoryId = req.params.id;
  year = today.getFullYear();
  month = today.getDate();
  day = today.getMonth() + 1;
types=[];
users=[];
city=[];
event=[];
  types.push("A", "achivement", "marriage", "graduation", "ceremony", "birth");

  allmemoriesID = await db.GetAllMemfromuser(req.session.userId);

  for (let i = 0; i < allmemoriesID.length; i++) {
    let mem = await db.GetAllMemory(allmemoriesID[i].memoryId);
    allmemories.push(mem);
  }

  for (let i = 0; i < allmemories.length; i++) {
    userr = [];
    let idd = allmemories[i][0].memoryId;

    //console.log(idd)
    let use = await db.GetAllmemoryID(idd);

    for (let j = 0; j < use.length; j++) {
      let op = await db.getUser(use[j].userfk);
      userr.push(op)
    }
    let memorynamee = allmemories[i][0].memoryName;
    let cityy = await db.getCityName(allmemories[i][0].cityFk);
    let datee = allmemories[i][0].memoryDate;
    let storyy = allmemories[i][0].story;
    let typee = types[allmemories[i][0].memoryType];
    let linkss = await db.getPhotoMemory(allmemories[i][0].memoryId);
    allmemory.push({ memoryName: memorynamee, id: idd, user: userr, city: cityy, date: datee, story: storyy, type: typee, links: linkss });
  }

  allusers = await db.getAllUsers();
  for (let i = 0; i < allusers.length; i++) {
    if (allusers[i].userId != req.session.userId)
      users.push(allusers[i]);
  }
  //console.log(users)
  let cities = await db.memoriesGetAllCities();
  for (let i = 0; i < cities.length; i++)
    city.push(cities[i]);

  let allevent = await db.memoriesGetAllevent();

  for (let i = 0; i < allevent.length; i++)
    event.push(allevent[i]);

  res.render('memories', { EVCit, fileParam: null, textParam: null, session: req.session, day, year, month, city, event, types, users, allmemory });
}
const memoryPost = async (req, res) => {

  if (req.body.updatememory) {
    let id = req.params.id;
    let memoryname = req.body.updateheaders;
    let dd = req.body.updateDate;
    memorydate = await convert(dd);
    let story = req.body.updatestory;

    let w = await db.updatememoryByID(memoryname, memorydate, story, id);
    let url = "/memories";
    res.redirect(url);
    //let url = "/memories/" + memoryId;
    // res.redirect(url);
  }

  if (req.body.addImageS) {
    console.log("ffffffffffff", req.files)
    let id = req.params.id;
    let sampleFile = req.files.addImage;
    let name = sampleFile.name;
    let path=__dirname;
    let fully = "D:\\ioio\\My Archive\\public\\memoryImgs\\" + name
    sampleFile.mv(fully, async (err) => {
      if (err) { console.log(err) }
      let k = await db.insertVictimPhoto(id, name);
      let url = "/memories";
      res.redirect(url);
    });
    // req.session.msg="added succesfully"

  }
  if (req.body.updatememory0) {
    //users
    let TAGS = req.body.users;
    let friends = [];
    let s='';
    for (let i = 0; i < TAGS.length; i++) {
      if (TAGS[i] != ',') {
        s = s + TAGS[i];
      }
      else if (TAGS[i] == ',') {
        friends.push(parseInt(s));
        s = '';
      }
    }
    friends.push(parseInt(s));
    if(req.body.typeSelect===''){
      req.session.suc="select a Type :("
      }
      else if(req.body.citySelect==='')
      {
        req.session.suc="select a city :("
      }
      else 
      {
        if(!isNaN(friends[0]))
        {
    let o0=await db.delete1(req.params.id);
    console.log(friends.length)
    for (let kkkk = 0; kkkk < friends.length; kkkk++) {
      console.log(kkkk);
    let o=await db.update1(req.params.id,friends[kkkk]);
    console.log(o);
    }
    }
    else{
      let o0=await db.delete1(iiid);
    }
  }
    let o2=await db.update2(req.body.typeSelect,req.params.id);
    console.log(o2,req.body.typeSelect)
    if(req.body.eventNameSelect==="0")
    {
      console.log(1)
      let o4=await db.update3(req.body.citySelect,req.params.id)
    }
    else 
    {
      let y = await db.getEveCityFk(req.body.eventNameSelect, req.body.citySelect);
      console.log(y)
      if(y.length>0)
      {
      let o5=await db.update4( y[0].eventCityId,req.params.id);
      let o4=await db.update3(req.body.citySelect,req.params.id)

      }
    }   
     let u=await again(req,res);
    res.redirect('/memories')
  }
  if (req.body.form == "NOW") {
    year = today.getFullYear();
    month = today.getDate();
    day = today.getMonth() + 1;
  }

  if (req.body.addMemory) {
    let story = req.body.addStory;
    let Datee = req.body.addDate;
    let namee = req.body.addmemname;
    let event_select = req.body.eventNameSelect;
    if (event_select === "0") {
      event_select = null;
    }
    let type_select = req.body.typeSelect;
    let city_select = req.body.citySelect;
    let TAGS = req.body.TAGS;
    let friends = [];
    let s = '';
    for (let i = 0; i < TAGS.length; i++) {

      if (TAGS[i] != ',') {
        s = s + TAGS[i];
      }
      else if (TAGS[i] == ',') {
        friends.push(parseInt(s));
        s = '';
      }
    }
    friends.push(parseInt(s));

    if(namee==='')
    {
      req.session.suc="select a name to the memory :("
    }
    else if(type_select===''){
    req.session.suc="select a Type :("
    }
    else if(city_select==='')
    {
      req.session.suc="select a city :("
    }
    else if(isNaN(friends[0]))
    {
      
      req.session.suc="select a user :("
    }
    else 
    {
    if (event_select !== null) {
      let y = await db.getEveCityFk(event_select, city_select);
      event_select = y[0].eventCityId;
    }
    let w = await db.insertMemory(req.session.userId, story, Datee, type_select, event_select, city_select, namee);
    let id = w.insertId;
    console.log(friends)
    if(friends[0]>=1&&friends[0]<=15)
    {
      for (let i = 0; i < friends.length; i++) {
      let ww = await db.insertParticipant(id, friends[i]);


    }
    }
    
    }

   
    
    console.log(req.session.suc)
let u=await again(req,res);
    res.redirect('/memories');

  }

  //res.render('memories',{fileParam:req.body.addImage,textParam:req.body.addStory,session:req.session,day,year,month,city,event,types,users,allmemory});
}
const memoriesDelete = async (req, res) => {
  memoryId = req.params.id;
  if (req.body.deletememory) {
    let er = await db.deletememory1(req.params.id);
    let e = await db.deletememory2(req.params.id);


  }
  else if (req.body.deletePhoto) {
    let e = await db.deletePhoto(req.params.id);
  }
  let url = "/memories";
  res.redirect(url);


}
module.exports = {
  memoryGet,
  memoryPost, memoriesDelete
}

 // getPhotoMemory