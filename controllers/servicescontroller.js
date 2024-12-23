const { name } = require('ejs');
const db = require('../models/database');
let=[];
let defaulthistory=[];
let defaultLinks=[];
let cityname=[];
let percnt=[];
let Ccity=[];
class Queue {
    constructor() {
        this.items = {}
        this.frontIndex = 0
        this.backIndex = 0
    }
    enqueue(item) {
        this.items[this.backIndex] = item
        this.backIndex++
        return item + ' inserted'
    }
    dequeue() {
        const item = this.items[this.frontIndex]
        delete this.items[this.frontIndex]
        this.frontIndex++
        return item
    }
    peek() {
        return this.items[this.frontIndex]
    }
    get printQueue() {
        return this.items;
    }
}
const servicesGet = async (req, res) =>{
    Ccity=await db.getCities();
    let rr=[];
    defaulthistory=[];
    defaultLinks=[];
    for(let j=0;j<Ccity.length;j++)
    {
     rr=await db.getCityHistory(Ccity[j].cityId);
     if(rr.length>0)
     {
            defaulthistory.push(Ccity[j].cityName);
        let links=[];
        for (let i = 0; i < rr.length; i++) {
            let historyId=rr[i].historyId;
    
             let yy=await db.getCityHistoryLinks(historyId);
             links.push(yy)
        }
            defaultLinks.push([rr,links]);
     }

    }
    
    
    res.render('services',{session:req.session,history:'NULL',defaulthistory, defaultLinks, names:'NULL',works:'NULL',hobbies:'NULL',mymap:'NULL',percnt:'NULL',term:'NULL'});
}
let names=[],works=[],hobbies=[];
const servicesPostOne = async (req, res) => {
    if(req.body.cityName)
        {

let cityId= await db.getCityId(req.body.cityName);

    let history=await db.getCityHistory(cityId[0].cityId);
  defaulthistory=[];let links=[];
  defaultLinks=[];
  defaulthistory.push(req.body.cityName);
    for (let i = 0; i < history.length; i++) {
        let historyId=history[i].historyId;
        
        let yy=await db.getCityHistoryLinks(historyId);
        links.push(yy);
    }
    defaultLinks.push([history,links]);
    res.render('services',{session:req.session,history,defaulthistory, defaultLinks, names:'NULL',works:"NULL",hobbies:'NULL',mymap:'NULL',percnt:'NULL',ok:'NULL',term:'NULL'});
}

 if(req.body.FamilyName && req.body.startdate && req.body.endingdate)
{   
    console.log(req.body.FamilyName , req.body.startdate ,req.body.endingdate)
    hobbies=[];works=[];names=[];
    let excity=[],exhobbies=[];
    for(let i=0;i<10000;i++)
    {excity[i]=0;
        exhobbies[i]=0;}
    let UsersId=await db.getusersbyFamilyName(req.body.FamilyName);
    for(let i=0;i<UsersId.length;i++) 
    {
        let userid=UsersId[i].userid;
        let allworksforAFamily=await db.getworksbyusersId(userid,req.body.startdate,req.body.endingdate);
        
        let allcitiesfromuseridanddatephase=await db.getcitybyuserbyfamilyName(userid,req.body.startdate,req.body.endingdate);
        let hobbiesfromuseridfamily=await db.gethobbiesbyusersId(userid);
       
       for(let j=0;j<hobbiesfromuseridfamily.length;j++)
    {
          let hobbyid=hobbiesfromuseridfamily[j].hobbyfk;
         
           if(exhobbies[hobbyid]==0)
        {
             let hobbynames=await db.gethobbiesnamesfromhobbiesid(hobbyid);
             exhobbies[hobbyid]=1;hobbies.push(hobbynames[0].hobbyName);
            
        }
         }       
    
    let mpp=new Map();
        for(let j=0;j<allworksforAFamily.length;j++)
        {
            if(mpp.hasOwnProperty(allworksforAFamily[j].jobEduName)){ }
    else  
    {
        mpp[allworksforAFamily[j].jobEduName]=1; works.push(allworksforAFamily[j].jobEduName);
    }    
        }
        for(let j=0;j<allcitiesfromuseridanddatephase.length;j++)
        {
           let cityID=allcitiesfromuseridanddatephase[j].cityfk;
           if(excity[cityID]==0){
           let Namescities=await db.getCityName(cityID); 
           excity[cityID] =1;
           names.push(Namescities[0].cityName);
        }
        }
    }
  
     res.render('services',{session:req.session,history:'NULL',defaulthistory, defaultLinks, names,works,hobbies,mymap:'NULL',percnt:'NULL',ok:'NULL',term:'NULL'});
}

if(req.body.popularName)
{
   
    let cities=await db.getallcitieshasapopularname(req.body.popularName);
    let mymap=new Map();
 
    for(let i=0;i<cities.length;i++)
    { 
        let Namescities=await db.getCityName(cities[i].birthPlace); 
         cityname.push(Namescities);
    } 
       
for(let i=0;i<cityname.length;i++)
{
    let temp=cityname[i][0].cityName;
    if(mymap.hasOwnProperty(temp))
    {
        mymap[temp]+=1;
    }
    else  
    {
        mymap[temp]=1;
    }
    
}

 var keys = Object.keys(mymap);
 let keyss=[],percnt=[]; 
    keys.forEach(async keyy=>{ 
       
               keyss.push(keyy);
                 });
                
    for(let i=0;i<keyss.length;i++) 
    { 
        let cityid=await db.getCityByName(keyss[i])
        
        let all =await db.getallnumcity(cityid[0].cityId);
    
        percnt.push(all[0].birth)
    }
res.render('services',{session:req.session,history:'NULL',defaulthistory, defaultLinks, names:'NULL',works:'NULL',hobbies:'NULL',mymap,percnt,term:'NULL'});
}
if(req.body.secondName && req.body.firstName)
{
const queue=new Queue();
let term=[];
var sett= new Set();
    let first=req.body.secondName;
    let second=req.body.firstName;
    let userid=await db.getusersIdforansc(second,first); 
    let o=(typeof  id=='number');
    if(userid.length==1 && o){
    userid=userid[0].userid;
    let id=req.session.userId;
    console.log('ss',id,userid)
    const queue = new Queue()
    queue.enqueue(id);
    let siz=1;
    while(siz>0)
    {
        let id=queue.peek();
        let ft=await db.getmotheruser(id);
      
        let sd= await db.getfatheruser(id);
       sd=sd[0].fatherfk;ft=ft[0].motherfk;
        let opp=(typeof  ft=='number');
        let op=(typeof  sd=='number');
        if(opp){ sett.add(ft);queue.enqueue(ft);siz++;}
        if(op){sett.add(sd);queue.enqueue(sd);siz++;}
       // console.log(sett)
        queue.dequeue();siz--;
    }
    /////////////
    queue.enqueue(userid);
    console.log(userid)
    siz=1;
    let ok=0,num=-1;
    
while(siz>0)
{
    let id=queue.peek();
       
        let ft=await db.getmotheruser(id);
        let sd= await db.getfatheruser(id);
        sd=sd[0].fatherfk;
        ft=ft[0].motherfk;
        let opp=(typeof  ft=='number');
        let op=(typeof  sd=='number');
        if(opp){ 
            console.log(ft)
            if(sett.has(ft)) {ok=1;num=ft;break;}
            queue.enqueue(ft);siz++;}
        if(op){
            console.log(sd)
            if(sett.has(sd)){ok=1; num=sd; break; }
            queue.enqueue(sd);siz++;}

        queue.dequeue();siz--;
}

term.push(ok);
term.push(num);
if(!ok && sett.has(userid)){ok=1;num=userid;}
if(ok)
{
    let user=await db.getusername(num);
      term.push(user[0].firstname);
      term.push(user[0].lastname);
}
    }
    else {
        term.push(-1);
    }
res.render('services',{session:req.session,history:'NULL',defaulthistory, defaultLinks, names:'NULL',works:'NULL',hobbies:'NULL',mymap:'NULL',percnt:'NULL',term});
}
}
module.exports = {
    servicesGet,
    servicesPostOne
  }
  
  