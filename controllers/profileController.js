
let city, array, hobby,userHobby;
let partner_array = [];
let relation_array;
let tusers;
var given=[];
var cityH=[];
let relative = [];
let isChildUser = 0;
const db = require('../models/database.js');
const { link } = require('../routes/famillyRoutes.js');
const profileGet = async (req, res) => {
    userHobby=await db.getUserHobby(req.session.userId);
    var G =await db.givenauth(req.session.userId);
    var given=[];
    for(let i=0;i<G.length;i++)
    {
        let r=await db.getUser(G[i].user1);
        let au=0;
        if(G[i].authFk===1)au="Update";
        else if(G[i].authFk===2)au="Read";
        else if(G[i].authFk===3)au="Delete"
        else if(G[i].authFk===4)au="Admin";
        given.push({name:r.firstName+r.lastName,id:G[i].user1,PI:au});
    }
    var users=await db.getAllUsers();
    var auth=await db.getAllAuth();
    city = await db.getCities();
    cityH = await db.getCitiesHis();
    array = await db.MoveCity(req.session.userId);

    relation_array = await db.getRelationsFromTwoTables(req.session.userId);
    hobby = await db.getHobby();
    let Move = [];
    //console.log(city);
    for (let i = 0; i < array.length; i++) {

        let test = await db.getCityName7(array[i].cityFk)
        //   console.log(test);
        Move.push(test[0]);
    }
    
    relative = relation_array;
    for (let i = 0; i < relation_array.length; i++) {
        if (relation_array[i].relationType == 1 || relation_array[i].relationType == 2) {

            // let test=await db.getPartnerName(relation_array[i]);
            //   partner_array.push(test[0])
            //  console.log(relation_array[i]);
            let test;
            let userOneFk = relation_array[i].userOneFk;
            let userTwoFk = relation_array[i].userTwoFk;
            if (userOneFk != req.session.userId) {
                test = await db.getUser(userOneFk);
            }
            else {
                test = await db.getUser(userTwoFk);
            }
            partner_array.push(test);
        }

    }
    // console.log('here',partner_array);
    ///
    let kuser=await db.getUser(req.session.userId);
    res.render('profile', {
        session: req.session,city, array, Move, partner_array, hobby,
        tusers,users,auth,given,kuser ,userHobby,cityH
    });

}
const profilePost = async (req, res) => {
    if (req.body.T_Child) {
        isChildUser = 1;
    }
    var G =await db.givenauth(req.session.userId);
    given=[];
    for(let i=0;i<G.length;i++)
    {
        let r=await db.getUser(G[i].user1);
        let au=0;
        if(G[i].authFk===1)au="Update";
        else if(G[i].authFk===2)au="Read";
        else if(G[i].authFk===3)au="Delete"
        else if(G[i].authFk===4)au="Admin";
        given.push({name:r.firstName+r.lastName,id:G[i].user1,PI:au});
    }
    city = await db.getCities();
    array = await db.MoveCity(req.session.userId);
   if(req.body.giveauth)
    {
        let userFk=parseInt( req.body.userSelect)
        let authFk=parseInt( req.body.authSelect)
        console.log(isNaN(authFk))
        if(isNaN(authFk)||isNaN(userFk))
        {
            console.log("d");
            req.session.suc="You have to enter both user and privilliges !!"
        }
        else 
        {
            if(authFk===1||authFk===3||authFk===4)
        {
            let f=await db.checkauth(req.session.userId,userFk,2)
            if(f===0)
            {
            let any = await db.insertauth(req.session.userId,userFk,2);
            }
        }
        let f=await db.checkauth(req.session.userId,userFk,authFk)
        if(f===0)
        {
            let any = await db.insertauth(req.session.userId,userFk,authFk);
        }
        }
        
        res.redirect('profile');
    }
    else if (req.body.childr) {
        ///^^^^^^^^
        //console.log(req.body)
        let { childrName, childrDate, childrDetails, isUser, partnerId } = req.body;
        partnerId = +partnerId;
        isUser = +isUser;
        isUser = +isChildUser;
        isChildUser=0;
        let any = await db.insertChild(
            req.session.userId, partnerId, childrName, childrDate, childrDetails, isUser);
        res.render('profile', {

            session: req.session, city, array, Move: 'NULL',
            partner_array, hobby: 'NULL', tusers: 'NULL',

        });
    }
    else if (req.body.userhobby) {
        const { native_select } = req.body;
        let any = await db.insertUserHobby(req.session.userId, native_select);
        res.redirect('profile');
    }
    else if (req.body.moves) {
        // const { cityId, dateMove, detailsMove } = req.body;
        //   console.log(req.body)
        // let any = await db.updateCity(cityId, req.session.userId, detailsMove, dateMove);
        // res.render('profile', { session: req.session, city, array, Move: 'NULL' });
        const { cityId, dateMove, detailsMove } = req.body;
        console.log(req.body)
        let any = await db.insertCityMove(req.session.userId, cityId, dateMove, detailsMove);
        res.redirect('profile');
    }
    else if (req.body.hobby) {
        // console.log(req.body);
        const { featureHobby } = req.body;
        console.log(req.body)

        let any = await db.insertHobby(featureHobby);
        res.redirect('profile');
    }
    else if (req.body.Tpartner) {
        ///^^^^^^^^
        const { partnerId } = req.body;
        let zusers = [];
        for (let i = 0; i < tusers.length; i++) {

            let so = [+tusers[i].userOneFk, +tusers[i].userTwoFk];
            let mn = +req.session.userId, mx = +partnerId;
            if (mn > mx) {
                let tep = mn;
                mn = mx;
                mx = tep;
            }
            if (so[0] > so[1]) {
                let tep = so[0];
                so[0] = so[1];
                so[1] = tep;
            }
            if (s[0] == mn && s[1] == mx) {
                zusers.push(tusers[i]);
            }

        }
        console.log(zusers);
        res.render('profile', {
            session: req.session, city,
            array, Move: 'NULL', partner_array: 'NULL', hobby: 'NULL', tusers: zusers
        });
    }
    else if (req.body.lib) {
       
        var { libId, libName, dateLib, detailsLib, linkLib } = req.body;
        if(libName==='')libName=null;
        if(dateLib==='')dateLib=null;
        if(detailsLib==='')detailsLib=null;
        if(linkLib==='')linkLib=null;
        //console.log(req.body)
        let any = await db.insertLib(
            req.session.userId, libId, libName, dateLib, detailsLib, linkLib);
            res.redirect('profile');
    }
    else if (req.body.Edu) {
        let type=req.body.EduId;
        const { cityId, eduJobName, dateJobEduStart, dateJobEduEnd, detailsJobEdu } = req.body;
        let any = await db.insertEdu(
            req.session.userId, cityId, eduJobName, dateJobEduStart, dateJobEduEnd, detailsJobEdu,type);
            res.redirect('profile');
    }
    else if (req.body.partner) {
        const { TypeMarriageSelect, firstname, lastname, partnerDate, partnerDetails } = req.body;
    
        let any = await db.insertRelation1(req.session.userId, TypeMarriageSelect, firstname, lastname, partnerDate, partnerDetails);
            console.log(any)
        res.redirect('profile');
    }
    else if (req.body.childr) {

        //console.log(req.body)
        let { childrName, childrDate, childrDetails, isUser, partnerId } = req.body;
        partnerId = +partnerId;
        isUser = +isUser;
        let any = await db.insertChild(
            req.session.userId, partnerId, childrName, childrDate, childrDetails, isUser);
        ///    console.log(isUser,' ',typeof(isUser));
        //   console.log(partnerId,' ',typeof(partnerId));
        res.redirect('profile');
    }
    else if(req.body.addD){
        let name=req.body.cityName;
        if(name==='')
        {
            req.session.suc3="choose a city :("
        }
        else 
        {
        let rr=await db.insertCity(name);

        }

        res.redirect('profile');
    }
    else if(req.body.addDH){
        let cityId=req.body.cityId;
        let firstname=req.body.firstname;
        let date=req.body.Date;
        let details=req.body.Details;
        if(firstname==='')
        {
            req.session.suc2="fill the first name :("
        }
        else if(cityId==='')
        {
            req.session.suc2="choose a city :("
        }
        else if(date===''){
            req.session.suc2="fill the date feild :("
        }
        else if(details===''){
            req.session.suc2="fill the details feild :("
        }
        else 
        {
        let rr=await db.insertCH(firstname,details,cityId,date)

        }
        res.redirect('profile')
    }
    else if(req.body.addDHL)
    {
        let x=req.body.cityHId;
        let Link=req.body.Link;
        if(Link==='')
        {
            req.session.suc1="fill the link feild"
        }
        else {
        let rr=await db.insertCHL(x,Link);

        }
        res.redirect('profile')
    }
    else {
        var gender;
        if(req.body.gender==='Female')gender=1;
        else gender=0;
        var birthSelect;
        if(req.body.birthSelect==='null')birthSelect=null;
        else birthSelect=req.body.birthSelect;
        var deathSelect;
        if(req.body.deathSelect==='null')deathSelect=null;
        else deathSelect=req.body.deathSelect;
        const { userFirstName, userSecondName, deathDate, birthDate,
            deathReason ,password} = req.body;
        let userId = req.session.userId;
        let array = await db.UpdateProfile(userFirstName,
            userSecondName, birthSelect, deathSelect, deathDate, birthDate,
            deathReason, gender, userId,password);

        req.session.firstName = userFirstName
        res.redirect('/profile');
    }
}
module.exports = {
    profileGet,
    profilePost
}
