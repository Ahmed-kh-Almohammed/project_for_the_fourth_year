
//const db = require('../models/lifeTime.js');
const db = require('../models/database.js');
let ReqBody;
let cityInfo = [];
let Moves = [];
let book = [];
let Edu = [];
let relation_array = [];
let partner_array = [];

let Nchildren = [];
let NNchildren = [];
const lifeTimeGet = async (req, res) => {

  Edu.length = cityInfo.length = Moves.length = book.length = relation_array.length = partner_array.length = 0;
  let userId = req.session.userId;
  // Moves
  Moves = await db.MoveCity(userId);
  //  console.log(Moves[0]);
  for (let i = 0; i < Moves.length; i++) {
    let nam = await db.getCityName7(Moves[i].cityFk);
    console.log(Moves[i])
    let ob = { dateStart: Moves[i].dateStart, name: nam[0].cityName, details: Moves[i].details, id: Moves[i].userCityId };
    cityInfo.push(ob);
  }
  //searchs
  book = await db.getLSearches(userId);
  for (let i = 0; i < book.length; i++) {
    let row = await db.getLink(book[i].libraryId);
    // console.log('hh',row);
    if(row[0])
    book[i].link = row[0].file_src;
    else book[i].link="#"
    //console.log(book[i]);
  }
  ///Edu
  Edu = await db.getEdu(userId);
  for (let i = 0; i < Edu.length; i++) {
    let temp = await db.getCityName7(Edu[i].cityFk);
    Edu[i].cityName = temp[0].cityName;
  }
  ///
  relation_array = await db.getRelationsFromTwoTables(req.session.userId);

  ///
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
      test.relationDate = relation_array[i].relationDate;
      test.partnerDetails = relation_array[i].partnerDetails;
      test.relativeId = relation_array[i].relativeId;
      if (relation_array[i].relationType == 1) {
        test.relationType = 1;
      }
      else test.relationType = 2;
      //console.log(test);
      partner_array.push(test);
    }

  }


  //console.log(partner_array);
  book.sort((a, b) => {
    const dateA = new Date(a.libDate);
    const dateB = new Date(b.libDate);
    return dateA - dateB;
  });
  //console.log(book);
  Edu.sort((a, b) => {
    const dateA = new Date(a.jobEduEndDate);
    const dateB = new Date(b.jobEduEndDate);
    return dateA - dateB;
  });
  // console.log(Edu);
  partner_array.sort((a, b) => {
    const dateA = new Date(a.relationDate);
    const dateB = new Date(b.relationDate);
    return dateA - dateB;
  });

  cityInfo.sort((a, b) => {
    const dateA = new Date(a.dateStart);
    const dateB = new Date(b.dateStart);
    return dateA - dateB;
  })
  //console.log(cityInfo);
  // console.log(relation_array);

  res.render('lifeTime', {
    NNchildren,Nchildren,
    session: req.session,
    cityInfo, ReqBody: 'NULL', book, Edu, partner_array
  });
}


const lifeTimePost = async (req, res) => {
  ReqBody = req.body;
  // console.log(ReqBody);
  res.render('lifeTime', {
    session: req.session, cityInfo
    , ReqBody, book, Edu, partner_array, Nchildren,NNchildren
  });
}
const lifeTimeDelete = async (req, res) => {


  //update
  if (req.body.updateMoves) {
    // console.log('updateMoves');
    const { name, details, dateStart, updateMoves } = req.body;
    let id = updateMoves;
    //cityName, dateStart, details, userCityId
    let any = await db.updateUserCity(name, dateStart, details, id);
    res.redirect('/lifeTime');
  }
  else if (req.body.updateBook) {


    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.link;
    let pla = sampleFile.name;
    ///console.log(sampleFile);
    console.log("dirname is : ");
    let path=__dirname;
    path=path.slice(0,-12);
    let fully = path+"\\public\\" + pla;
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(fully, async (err) => {
      if (err) return res.status(500).send(err);
      const { date, name, details, updateBook } = req.body;
      let id = updateBook;
      let any = await db.updateLib(date, name, details, pla, id);
      res.redirect('/lifeTime');
    });

  }
    
    // Use the mv() method to place the file somewhere on your server
    
    
  else if (req.body.updatesearches) {

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.link;
    let pla = sampleFile.name;
    let path=__dirname;
    path=path.slice(0,-12);
    let fully = path+"\\public\\" + pla;
    sampleFile.mv(fully, async (err) => {
      if (err) return res.status(500).send(err);
      const { date, name, details, updatesearches } = req.body
      let id = updatesearches;
      let any = await db.updateLib(date, name, details, pla, id);
      res.redirect('/lifeTime');
    });
  }
  else if (req.body.updateEdu) {
    const { Sdate, Edate, name, city, details, updateEdu } = req.body;
    console.log(req.body)
    let id = updateEdu;
    //console.log(cityId);
    let any = await db.updateEdu(Sdate, Edate, name, city, details, id);
    res.redirect('/lifeTime');

  }
  else if (req.body.updateRelation) {

    const { date, name, details, updateRelation } = req.body;
    let status=1;
    if(req.body.status==='Married')status=1;
    else status=2;
    let relativeId = updateRelation;
    let temp = name.split('_');
    let firstName = temp[0], secondName = temp[1];
    console.log('any');
    let any = await db.updateRelation(date, firstName, secondName, details, status, relativeId);
    res.redirect('/lifeTime');
  }
  else if (req.body.show_child) {
    //^^^^^
    const { show_child } = req.body;
    const id1 = req.session.userId;
    const id2 = show_child;
    let any = await db.getChildren(id1, id2);
    for (let i = 0; i < any.length; i++) {
      Nchildren.push(any[i]);
    }
    any = await db.getChildren(id2, id1);
    for (let i = 0; i < any.length; i++) {
      Nchildren.push(any[i]);
    }
    res.render('lifeTime', {
      session: req.session, cityInfo
      , ReqBody, book, Edu, partner_array,
      achivments, Nchildren,NNchildren
    });
  }
  else if (req.body.show_child_N) {
    //^^^^^
    const { show_child_N } = req.body;
    const id1 = req.session.userId;
    const id2 = show_child_N;

    let any = await db.getNNchildren(id1, id2);
    for (let i = 0; i < any.length; i++) {
      NNchildren.push(any[i]);
    }
    any = await db.getNNchildren(id2, id1);
    for (let i = 0; i < any.length; i++) {
      NNchildren.push(any[i]);
    }

    res.render('lifeTime', {
      session: req.session, cityInfo
      , ReqBody, book, Edu, partner_array,
      achivments, Nchildren,NNchildren
    });

  }
  else if (req.body.deleteMoves) {
    const { deleteMoves } = req.body;
    let id = deleteMoves;
    let any = await db.deleteUserCityById(id);
    res.redirect('/lifeTime');
  }
  else if (req.body.deleteSearches) {
    //  console.log(req.body);
    const { deleteSearches } = req.body;
    let id = deleteSearches;
    let any = await db.deleteLibById(id);
    res.redirect('/lifeTime');
  }
  else if (req.body.deleteBook) {
    //  console.log(req.body);
    const { deleteBook } = req.body;
    let id = deleteBook;
    let any = await db.deleteLibById(id);
    res.redirect('/lifeTime');
  }
  else if (req.body.deleteEdu) {
    //  console.log(req.body);
    const { deleteEdu } = req.body;
    let id = deleteEdu;
    let any = await db.deleteEduById(id);
    res.redirect('/lifeTime');
  }
  else if (req.body.deleteRelation) {
    const { deleteRelation } = req.body;
    let id = deleteRelation;
    let any = await db.deleteRelation(id);
    res.redirect('/lifeTime');
  }
  else {
    res.render('lifeTime', {
      session: req.session, cityInfo, ReqBody, book, Edu, partner_array
    });
  }
};



module.exports = {
  lifeTimeGet,
  lifeTimePost,
  lifeTimeDelete,
}