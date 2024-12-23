
let city, array, hobby;
let partner_array = [];
let relation_array;
let tusers;
let relative = [];
let isChildUser = 0;
const db = require('../models/database.js');
const profileGet = async (req, res) => {
    city = await db.getCities();
    array = await db.MoveCity(req.session.userId);
    tusers = await db.getTrustedUsers(req.session.userId);
    //console.log(tusers);
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
    res.render('profile', {
        session: req.session, city, array, Move, partner_array, hobby,
        tusers
    });

}
const profilePost = async (req, res) => {


    ///^^^^^^^^


    if (req.body.T_Child) {
        isChildUser = 1;
    }
    if (req.body.userhobby) {
        const { native_select } = req.body;
        let any = await db.insertUserHobby(req.session.userId, native_select);
        res.render('profile', {
            session: req.session, city,
            array, Move: 'NULL', partner_array: 'NULL', hobby, tusers: 'NULL'
        });
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
        res.render('profile', {
            session: req.session, city,
            array, Move: 'NULL', partner_array: 'NULL', hobby: 'NULL', tusers: zusers
        });
    }
    else if (req.body.tusers) {
        //  console.log('object ');
        // console.log(req.body);
        const { native_select } = req.body;
        //  console.log(typeof(native_select));
        let any = await db.insertTuser(req.session.userId, native_select);
        res.render('profile', {
            session: req.session, city,
            array, Move: 'NULL', partner_array: 'NULL', hobby: 'NULL', tusers
        });
    }
    else if (req.body.moves) {
        // const { cityId, dateMove, detailsMove } = req.body;
        //   console.log(req.body)
        // let any = await db.updateCity(cityId, req.session.userId, detailsMove, dateMove);
        // res.render('profile', { session: req.session, city, array, Move: 'NULL' });
        const { cityId, dateMove, detailsMove } = req.body;
        //console.log(req.body)
        let any = await db.insertCityMove(req.session.userId, cityId, dateMove, detailsMove);
        res.render('profile', {
            session: req.session, city,
            array, Move: 'NULL', partner_array: 'NULL', hobby: 'NULL', tusers: 'NULL'
        });
    }
    else if (req.body.hobby) {
        // console.log(req.body);
        const { featureHobby } = req.body;
        //console.log(req.body)

        let any = await db.insertHobby(featureHobby);
        res.render('profile', {

            session: req.session, city,
            array, Move: 'NULL', partner_array: 'NULL', hobby, tusers: 'NULL'
        });
    }
    else if (req.body.lib) {
        const { libId, libName, dateLib, detailsLib, linkLib } = req.body;
        //console.log(req.body)
        let any = await db.insertLib(
            req.session.userId, libId, libName, dateLib, detailsLib, linkLib);
        res.render('profile', {
            session: req.session, city, array, Move: 'NULL'
            , partner_array: 'NULL', hobby: 'NULL', tusers: 'NULL'
        });
    }
    else if (req.body.Edu) {
        const { cityId, eduJobName, dateJobEduStart, dateJobEduEnd, detailsJobEdu } = req.body;
        let any = await db.insertEdu(
            req.session.userId, cityId, eduJobName, dateJobEduStart, dateJobEduEnd, detailsJobEdu);
        res.render('profile', {
            session: req.session, city, array, Move: 'NULL'
            , partner_array: 'NULL', hobby: 'NULL', tusers: 'NULL'
        });
    }
    else if (req.body.partner) {

        const { TypeMarriageSelect, firstname, lastname, partnerDate, partnerDetails } = req.body;
        //console.log(req.body)
        let any = await db.insertRelation(
            req.session.userId, TypeMarriageSelect, firstname, lastname, partnerDate, partnerDetails);
        res.render('profile', {
            session: req.session, city, array,
            Move: 'NULL', partner_array: 'NULL', hobby: 'NULL', tusers: 'NULL'
        });

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
    else {
        // if (!req.files || Object.keys(req.files).length === 0) {
        //     return res.status(400).send('No files were uploaded.');
        // }

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        // let sampleFile = req.files.link;
        // let pla = sampleFile.name;
        // ///console.log(sampleFile);
        // let fully = `C:/Users/ahmed/Desktop/NmyArc/` + 'public/' + pla

        // Use the mv() method to place the file somewhere on your server
        // sampleFile.mv(fully, async (err) => {
        //     if (err) return res.status(500).send(err);
        //     const { date, name, details, updateBook } = req.body;
        //     let id = updateBook;
        //     let any = await db.updateLib(date, name, details, pla, id);
        //     res.redirect('/lifeTime');


        // });
        // console.log(req.body);
        // if (!req.files || Object.keys(req.files).length === 0) {
        //     return res.status(400).send('No files were uploaded.');
        // }
        // let sampleFile = req.files.photo;
        // let pla = sampleFile.name;
        // ///console.log(sampleFile);
        // let fully = `C:/Users/ahmed/Desktop/NmyArc/` + 'public/' + pla

        const { userFirstName, userSecondName, birthSelect, deathSelect, deathDate, birthDate,
            deathReason, gender } = req.body;
        let userId = req.session.userId;
        let array = await db.UpdateProfile(userFirstName,
            userSecondName, birthSelect, deathSelect, deathDate, birthDate,
            deathReason, gender, userId);

        req.session.firstName = userFirstName
        console.log(array);
        ///^^^^^

        res.redirect('/profile');

    }

}
module.exports = {
    profileGet,
    profilePost
}
