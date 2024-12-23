const mysql = require('mysql');
const express = require('express');
const { name } = require('ejs');
require("dotenv").config({ path: './.env' });
const pool = mysql.createPool({
    connectionLimit: 10,
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.MYSQL_DB,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
 
});

 
let db = {};
db.getUser = (id) =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM Users WHERE userId= ?', [id], (error, user)=>{
            if(error){
                return reject(error);
            }
            return resolve(user[0]);
        });
    });
};
db.getUserByEmail = (email) =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM Users WHERE userEmail = ?', [email], (error, users)=>{
            if(error){
                return reject(error);
            }
            console.log(users[0]);
            return resolve(users[0])
        });
    });
};
db.insertUser = (firstName, lastName, email, password) =>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO Users (firstName, lastName, userEmail, userPassword) VALUES (?, ?, ?, ?)', [firstName, lastName, email, password], (error, result)=>{
            if(error){
                
              return resolve("duplicated email");
            }
              return resolve(db.getUser(result.insertId));
        });
    });
};
//event Controllers

db.getEventByDate = (date) =>{
    return new Promise((resolve, reject)=>{
        pool.query("SELECT * FROM events WHERE DATE_FORMAT(eventDate, '%m-%d') = ?", [date], (error, events)=>{
            if(error){
                return reject(error);
            }
            return resolve(events)
        });
    });
};

db.getEventCites = (eventId) =>{
    return new Promise((resolve, reject)=>{
        pool.query("SELECT * FROM eventcities WHERE eventFk = ?", [eventId], (error, eventCities)=>{
            if(error){
                return reject(error);
            }
            return resolve(eventCities)
        });
    });
};
db.getCityName = (cityId) =>{
    return new Promise((resolve, reject)=>{
        pool.query("SELECT cityName FROM cities WHERE cityId = ?", [cityId], (error, city)=>{
            if(error){
                return reject(error);
            }
            return resolve(city)
        });
    });
};

db.getCities = () =>{
    return new Promise((resolve, reject)=>{
        pool.query("SELECT * FROM cities ", (error, city)=>{
            if(error){
                return reject(error);
            }
            return resolve(city)
        });
    });
};
db.getCityByName = (cityName) =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT cityId FROM cities  WHERE cityName = ?', [cityName], (error, name)=>{
            if(error){
                return reject(error);
            }
            return resolve(name)
        });
    });
};
db.getEventCityFilter=async (cityName)=>{
    let cityId=await db.getCityByName(cityName);
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM eventcities WHERE cityFk = ?', [cityId[0].cityId], (error, ev)=>{
            if(error){
                return reject(error);
            }
            return resolve(ev)
        });
    });
}
db.deleteEventById=(eventId)=>{
    return new Promise((resolve, reject)=>{
        pool.query('delete FROM events WHERE eventId = ?', [eventId], (error, ev)=>{
            if(error){
                return reject(error);
            }
            return resolve(ev)
        });
    });
}
db.getEventById=(eventFk)=>{

    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM events WHERE eventId = ?', [eventFk], (error, ev)=>{
            if(error){
                return reject(error);
            }
            return resolve(ev)
        });
    });
}
db.getAllEvent=()=>{

    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM events ', (error, AllEvents)=>{
            if(error){
                return reject(error);
            }
            return resolve(AllEvents)
        });
    });
}
db.updateEventdetails=(eventName,eventDate,eventDetails,eventId)=>{
    console.log(eventId)
    return new Promise((resolve, reject)=>{

        pool.query('UPDATE EVENTs set eventName=?,eventDate=?,eventDetails=?  WHERE eventId =?', [eventName,eventDate,eventDetails,eventId],(error, AllEvents)=>{
            if(error){
                return reject(error);
            }
            return resolve("ok")
        });
    });
}

db.getPhoto=async (eventId,cityId)=>{
    let id= await db.getEventCity(eventId,cityId);
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM links WHERE EventCityFk=?', [id[0].eventCityId], (error, ev)=>{
            if(error){
                return reject(error);
            }
            return resolve(ev)
        });
    });
   
}
db.insertPhoto= async (imgsrc,eventId,cityId)=>{
    let id= await db.getEventCity(eventId,cityId);

    var insertData = "INSERT INTO Links (eventCityFk,file_src)VALUES(?,?)"
          
    return new Promise((resolve, reject)=>{
    pool.query(insertData, [id[0].eventCityId,imgsrc], (err, result) => {
            if(err){
                console.log(err);
            }
              return resolve(result);
        })
    });
}
db.getEventCity=(eventId,cityId)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM eventcities WHERE eventFk = ? and cityFk=?', [eventId,cityId], (error, ev)=>{
            if(error){
                return reject(error);
            }
            return resolve(ev)
        });
    });
   
}
db.insertEvent = (eventName,eventDate,eventDetails,city) =>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO events (eventName,eventDate,eventDetails) VALUES (?, ?, ?)', [eventName,eventDate,eventDetails], async (error, result)=>{
            if(error){
                
              return reject(error)
            }
            for(let i=0;i<city.length;i++)
            {
                let r=await db.getCityByName(city[i])
                db.insertcityEvent(r[0].cityId,result.insertId,"no details");
            }
              return resolve(result);
        });
    });
};

db.UpdateDeathProfile= (deathPlace,deathDate,deathReason,userId)=>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE Users set deathPlace=?,deathDate=?, deathReason=? where userId=?', [deathPlace,deathDate,deathReason,userId], (error, result)=>{
            if(error){
                console.log(error);
              return resolve("error");
            }
              return resolve(result);
        });
    });
}


db.deleteEventDetailsById=(cityId,eventId)=>{
    return new Promise((resolve, reject)=>{
        pool.query('delete FROM eventcities WHERE eventFk = ? AND CITYFK=?', [eventId,cityId], (error, ev)=>{
            if(error){
                return reject(error);
            }
            return resolve(ev)
        });
    });
}

db.deletePhoto=async (linkid)=>{
    
    return new Promise((resolve, reject)=>{
        pool.query('delete FROM links WHERE linkId=?', [linkid], (error, ev)=>{
            if(error){
                return reject(error);
            }
            return resolve(ev)
        });
    });
}

db.deletevictim=async (id)=>{
    return new Promise((resolve, reject)=>{
        pool.query('delete FROM memories WHERE memoryId=?', [id], (error, ev)=>{
            if(error){
                return reject(error);
            }
            return resolve(ev)
        });
    });
}
db.getAllUsers=()=>{
    return new Promise((resolve, reject)=>{
        pool.query('select * from users', (error, ev)=>{
            if(error){
                return reject(error);
            }
            return resolve(ev)
        });
    });
}
db.getLastMemoryId=()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT LAST_INSERT_ID()  as id FROM memories', (error, ev)=>{
            if(error){
                return reject(error);
            }
            return resolve(ev)
        });
    });
}
db.insertVictimPhoto=(id,name)=>{

    return new Promise((resolve, reject)=>{
    pool.query('INSERT INTO Links (memoryFk,file_src)VALUES(?,?)', [id,name], (err, result) => {
            if(err){
                console.log(err);
            }
              return resolve(result);
        })
    });
}
db.insertVictimMem=(userFk,evCi,cityFk,story,date)=>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO memories (userFk,cityEventFk,cityFk,story,memoryDate,memoryType)VALUES(?,?,?,?,?,100)', [userFk,evCi,cityFk,story,date], (err, result) => {
                if(err){
                    console.log(err);
                }
                  return resolve(result);
            })
        });
}
db.getMemoryEvent=(id)=>{
    return new Promise((resolve, reject)=>{
        pool.query('select * from memories where cityeventfk=? and memoryType!=100', [id], (error, ev)=>{
            if(error){
                return reject(error);
            }
            return resolve(ev)
        });
    });
}


db.getFamilyTree = (userId) => {
    return new Promise(async (resolve, reject) => {
        let q = new Queue();
        let x = { level: 0, userId: userId };
        q._push(x);
        let tree = [];
        while (!q.isEmpty()) {
            let { level, userId } = q._pop();
            let query = 'SELECT * FROM Users WHERE userId= ?';
            let user = await pool.query(query, [userId]);
            let { motherFk, fatherFk, gender, firstName, lastName } = user[0];
            let x = { level: level + 1, userId: motherFk };
            let y = { level: level + 1, userId: fatherFk };
            let node = { firstName: firstName, lastName: lastName, gender: gender, level: level };
            tree.push(node);
            if (motherFk) {
                q._push(x);
            }
            if (fatherFk) {
                q._push(y);
            }
        }
        return tree;

    });
};


db.getMemoryVictim=(id)=>{
    return new Promise((resolve, reject)=>{
        pool.query('select * from memories where cityeventfk=? and memoryType=100', [id], (error, ev)=>{
            if(error){
                return reject(error);
            }
            return resolve(ev)
        });
    });
}
db.getPhotoMemory=async (id)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM links WHERE memoryfk=?', [id], (error, ev)=>{
            if(error){
                return reject(error);
            }
            return resolve(ev)
        });
    });
   
}

db.insertcityEvent=(cityId,eventId,details)=>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO eventcities (cityFk,eventFk,eventCityDetails) VALUES (?, ?, ?)', [cityId,eventId,details], (error, result)=>{
            if(error){
                
              return reject(error)
            }
              return resolve("ok");
        });
    });
}
db.updateCityEventDetails=(cityId,eventId,details)=>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE eventcities set eventCityDetails=? where cityFk=? AND eventFk=?', [details,cityId,eventId], (error, result)=>{
            if(error){
                console.log(error);
              return resolve("error");
            }
              return resolve(result);
        });
    });
}
/////////////////



db.getallhistoryhasadate=(historyDate)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM cityhistory WHERE historyDate= ?', [historyDate], (error, history)=>{
            if(error){
                console.log(error,historyDate,history);
                return reject(error);
            }
            return resolve(history);                         
        });
    });
}
db.getCityName=(cityid)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT cityName FROM Cities WHERE cityid= ?', [cityid], (error, city)=>{
            if(error){
                console.log(error,cityName,city);
                return reject(error);
            }
            return resolve(city);                         
        });
    });
}
db.getCityId=(cityName)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT cityId FROM Cities WHERE cityName= ?', [cityName], (error, city)=>{
            if(error){
                console.log(error,cityName,city);
                return reject(error);
            }
            return resolve(city);                         
        });
    });
}
db.getCityHistory=(cityId)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM cityHistory WHERE cityFk= ?', [cityId], (error, cityhistory)=>{
            if(error){
                return reject(error);
            }
            return resolve(cityhistory);
        });
    });
}
db.getCityHistoryLinks=(historyId)=>{
    
    return new Promise((resolve, reject)=>{
        pool.query('SELECT file_src FROM links WHERE historyFk=?', [historyId], (error, historyLinks)=>{
            if(error){
                return reject(error);
            }
            return resolve(historyLinks);
        });
    });
}
db.getusersbyFamilyName=(FamilyName)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT userid FROM users WHERE lastName= ?', [FamilyName], (error, user)=>{
            if(error){
                return reject(error);
            }
            return resolve(user);
        });
    }); 
}
db.getcitybyuserbyfamilyName=(userid,startdate,enddate)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT cityfk FROM usercities WHERE userfk= ? AND datestart>=? AND datestart<=? ', [userid,startdate,enddate], (error, city)=>{
            if(error){
                return reject(error);
            }
            return resolve(city);
        });
    }); 
}
db.getworksbyusersId=(userid,startdate,enddate)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT jobEduName FROM jobedues WHERE type=2 AND userfk=? AND jobEduENdDate>=? AND jobEduDatestart<=?  ', [userid,startdate,enddate], (error, user)=>{
            if(error){
                return reject(error);
            } 
            return resolve(user);
        });
    });
}
db.gethobbiesbyusersId=(userid)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT hobbyfk FROM userhobbies WHERE   userfk=?', [userid], (error, user)=>{
            if(error){
                return reject(error);
            } 
            return resolve(user);
        });
    });
}
db.gethobbiesnamesfromhobbiesid=(hobid)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT hobbyName FROM hobbies WHERE   hobbyid=?', [hobid], (error, user)=>{
            if(error){
                return reject(error);
            } 
            return resolve(user);
        });
    });
}
db.getallcitieshasapopularname=(username)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT birthPlace FROM users WHERE   firstName=?', [username], (error, user)=>{
            if(error){
                return reject(error);
            } 
            return resolve(user);
        });
    });
}
db.getallnumcity=(cityname)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT count(birthPlace) as birth FROM users WHERE   birthPlace=?', [cityname], (error, user)=>{
            if(error){
                return reject(error);
            } 
            return resolve(user);
        });
    });   
}
db.getusersIdforansc=(usern1,usern2)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT userid FROM users WHERE   firstname=? AND lastname=?', [usern1,usern2], (error, user)=>{
            if(error){
                return reject(error);
            } 
            return resolve(user);
        });
    });
}
db.getfatheruser=(userid)=>{
return new Promise((resolve, reject)=>{
    pool.query('SELECT fatherfk FROM users WHERE   userid=?', [userid], (error, user)=>{
        if(error){
            return reject(error);
        } 
        return resolve(user);
    });
});
}
db.getmotheruser=(userid)=>{
return new Promise((resolve, reject)=>{
    pool.query('SELECT motherfk FROM users WHERE   userid=?', [userid], (error, user)=>{
        if(error){
            return reject(error);
        } 
        return resolve(user);
    });
});
}
db.getusername=(userid)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT firstname,lastname FROM users WHERE   userid=?', [userid], (error, user)=>{
            if(error){
                return reject(error);
            } 
            return resolve(user);
        });
    });
    }
    ////memories
    db.Seldelete1=(id)=>{

        return new Promise((resolve, reject)=>{
                pool.query('select * FROM participants WHERE memoryFk=?', [id],(error, city)=>{
                if(error){
                    return reject(error);
                }
                return resolve(city);                         
            });
            
        });
    }
    db.delete1=(id)=>{

        return new Promise((resolve, reject)=>{
                pool.query('delete FROM participants WHERE memoryFk=?', [id],(error, city)=>{
                if(error){
                    return reject(error);
                }
                return resolve(city);                         
            });
            
        });
    }
    db.update1=(id,friends)=>{
        return new Promise((resolve, reject)=>{
                pool.query('INSERT INTO participants (memoryFk,userFk) VALUES (?, ?)', [id,friends],(error, city)=>{
                if(error){
                    return reject(error);
                }
                console.log(city);
                return resolve(city);                         
            });
            
            
        });
    }
    db.update2=(m,i)=>{
        return new Promise((resolve, reject)=>{
            pool.query('UPDATE memories set memoryType=? where memoryId=?', [m,i], (error, result)=>{
                if(error){
                    console.log(error);
                  return resolve("error");
                }
                  return resolve(result);
            });
        });
    }
    db.update3=(m,i)=>{
        return new Promise((resolve, reject)=>{
            pool.query('UPDATE memories set cityFk=? where memoryId=?', [m,i], (error, result)=>{
                if(error){
                    console.log(error);
                  return resolve("error");
                }
                  return resolve(result);
            });
        });
    }
    db.update4=(m,i)=>{
        return new Promise((resolve, reject)=>{
            pool.query('UPDATE memories set cityEventFk=? where memoryId=?', [m,i], (error, result)=>{
                if(error){
                    console.log(error);
                  return resolve("error");
                }
                  return resolve(result);
            });
        });
    }
 db.getEveCityFk=(ev,c)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM eventcities where eventFk=? and cityFk=?', [ev,c],(error, city)=>{
            if(error){
                return reject(error);
            }
            return resolve(city);                         
        });
    });
 }
db.memoriesGetAllCities=()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT cityid,cityName FROM Cities', (error, city)=>{
            if(error){
                return reject(error);
            }
            return resolve(city);                         
        });
    });
}
db.memoriesGetAllevent=()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM events', (error, event)=>{
            if(error){
                return reject(error);
            }
            return resolve(event);                         
        });
    }); 
}
db.memoriesGetAlleventcities=(eventId,cityid)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT eventcityid FROM eventcities WHERE  eventFk=? AND cityFk=?', [eventId,cityid], (error, eveent)=>{
            if(error){
                return reject(error);
            }
            return resolve(eveent);                         
        });
    }); 
}
db.memoriesGetAllfriends=(user)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT userTwoFK FROM relatives where userOneFK=? ', [user],(error, friend)=>{
            if(error){
                return reject(error);
            }
            return resolve(friend);                         
        });
    }); 
}
    db.insertParticipant=(mem,fr) =>{
        return new Promise((resolve, reject)=>{
            pool.query('INSERT INTO participants (memoryFk,userFk) VALUES(?,?)', [mem,fr], (error, result)=>{
                if(error){
                    
                  return reject(error)
                }
                  return resolve(result);
            });
        });
    }
    db.insertMemory= (userf,storyf,memorydatef,memorytypef,cityeventf,cityf,memorynamee) =>{
        return new Promise((resolve, reject)=>{
            pool.query('INSERT INTO memories (userFk,story,memoryDate,memoryType,cityEventFk,cityFk,memoryName)VALUES(?,?,?,?,?,?,?)', [userf,storyf,memorydatef,memorytypef,cityeventf,cityf,memorynamee], (error, result)=>{
                if(error){
                    
                  return reject(error)
                }
                  return resolve(result);
            });
        });
    }
    db.insertMemuser=(user,memory)=>{
            return new Promise((resolve, reject)=>{
                pool.query('INSERT INTO participants (userFk,memoryFk)VALUES(?,?)', [user,memory], (error, result)=>{
                    if(error){
                        
                      return reject(error)
                    }
                      return resolve(result);
                });
            });
    }
    db.getmemoryidnow=(userf,memorydatef,memorytypef,cityeventf,cityf,memorynamee) =>{
        return new Promise((resolve, reject)=>{
            pool.query('select memoryid from memories where userFk=? AND memoryDate=? AND memoryType=? ANd cityEventFk=? AND cityFk=?', [userf,memorydatef,memorytypef,cityeventf,cityf], (error, result)=>{
                if(error){
                    
                  return reject(error)
                }
                  return resolve(result);
            });
        }
        )}
    db.deletememory2=async (id)=>{
        return new Promise((resolve, reject)=>{
            pool.query('delete FROM memories WHERE memoryId=?', [id], (error, mem)=>{
                if(error){
                    return reject(error);
                }
                return resolve(mem)
            });
        });
    }
    db.deletememory1=async (id)=>{
        return new Promise((resolve, reject)=>{
            pool.query('delete FROM participants WHERE memoryfk=?', [id], (error, mem)=>{
                if(error){
                    return reject(error);
                }
                return resolve(mem)
            });
        });
    }
    db.GetAllMemory=(id)=>{
        return new Promise((resolve, reject)=>{
            pool.query('Select * FROM memories where memoryID=?',[id], (error, mem)=>{
                if(error){
                    return reject(error);
                }
                return resolve(mem)
            });
        });
    }
    db.GetAllmemoryID=(userid)=>{
        return new Promise((resolve, reject)=>{
            pool.query('Select userfk FROM participants where memoryFk=?',[userid], (error, mem)=>{
                if(error){
                    return reject(error);
                }
                return resolve(mem)
            });
        });
    }
    db.GetAllMemfromuser=(userid)=>{
        return new Promise((resolve, reject)=>{
            pool.query('Select memoryId FROM memories where userfk=?',[userid], (error, mem)=>{
                if(error){
                    return reject(error);
                }
                return resolve(mem)
            });
        });
    }
    db.getUserMemory=(id)=>{
        return new Promise((resolve, reject)=>{
            pool.query('Select userfk FROM memories where memoryid=?',[id], (error, mem)=>{
                if(error){
                    return reject(error);
                }
                return resolve(mem)
            });
        }); 
    }
    db.updatememoryByID=(memoryname,memorydate,storyy,id)=>{
       
        return new Promise((resolve, reject)=>{
    
            pool.query('UPDATE memories set memoryName=?,memoryDate=?,story=?  WHERE memoryid =?', [memoryname,memorydate,storyy,id],(error, eme)=>{
                if(error){
                    return reject(error);
                }
                return resolve(eme)
            });
        });
    }
        ////////////





        
db.MoveCity = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM usercities WHERE  userFk=?', [userId], (error, movecity) => {
            if (error) {
                return reject(error);
            }
            return resolve(movecity)
        });
    });

}

db.updateCity = (cityId, userId, details, dateStart) => {

    return new Promise((resolve, reject) => {

        pool.query('UPDATE usercities set details=?,dateStart=?  WHERE cityFk =? and userFk =?', [details, dateStart, cityId, userId], (error, up) => {
            if (error) {
                return reject(error);
            }
            return resolve("ok")
        });
    });
}
db.getCityName7 = (cityId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM cities WHERE cityId = ?", [cityId], (error, city) => {
            if (error) {
                return reject(error);
            }
            return resolve(city)
        });
    });
};

db.getHobby = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM hobbies ", (error, hobby) => {
            if (error) {
                return reject(error);
            }
            return resolve(hobby)
        });
    });
};
db.getHobbyName = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT hobbyName FROM hobbies where hobbyId=?",[id], (error, hobby) => {
            if (error) {
                return reject(error);
            }
            return resolve(hobby)
        });
    });
};
db.getUserHobby = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM userhobbies where userFk=?",[userId], async (error, hobby) => {
            if (error) {
                return reject(error);
            }
            var r=[];
            for(let i=0;i<hobby.length;i++)
            {
                
            let test=await db.getHobbyName(hobby[i].hobbyFk);
            r.push(test[0].hobbyName)
            }
            return resolve(r)
        });
    });
};
db.insertHobby = (featureHobby) => {
    return new Promise((resolve, reject) => {

        pool.query(`INSERT INTO hobbies (hobbyName)
         VALUES (?)`, [featureHobby], (error, result) => {
            if (error) {

                return reject(error)
            }
            return resolve("ok");
        });

    });
};
db.insertCityMove = (userId, cityId, dateMove, detailsMove) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO usercities (userFk,cityFk,dateStart,details)
         VALUES (?, ?, ?,?)`, [userId, cityId, dateMove, detailsMove], (error, result) => {
            if (error) {

                return reject(error)
            }
            return resolve("ok");
        });
    });
};

db.insertLib = (userId, libId, libName, dateLib, detailsLib, linkLib) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO libraries (userFk, libType, libName, libDate, libDetails)
            VALUES (?, ?, ?, ?, ?)`,
            [userId, libId, libName, dateLib, detailsLib],
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                const libraryFk = result.insertId;
                if(linkLib)
                {
                    pool.query(
                    `INSERT INTO links (file_src, libraryFk) VALUES (?, ?)`,
                    [linkLib, libraryFk],
                    (error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        return resolve("ok");
                    }
                );
                }
                return resolve("ok");
                
            }
        );
    });
};
db.insertRelation1 = (userId, TypeMarriageSelect, firstname, lastName, partnerDate, partnerDetails) => {
  console.log("hhh")
    return new Promise((resolve, reject) => {
        pool.query(
            'SELECT * FROM Users WHERE firstName = ? and lastName= ?', [firstname, lastName], (error, sresult) => {
                if (error) {
                    return reject(error);
                }
                console.log("pppppppp",sresult[0]);
                let userTwoFk = sresult[0].userId;
                console.log(userTwoFk);


                pool.query(
                    `INSERT INTO relatives (userOneFk ,userTwoFk, relationType,relationDate,partnerDetails)
                    VALUES (?, ?,?,?,?)`,
                    [userId, userTwoFk, TypeMarriageSelect, partnerDate, partnerDetails],
                    (error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        return resolve("ok");
                    }
                );
            }
        );
    });
};
db.getRelationsFromTwoTables = (id) => {
    return new Promise((resolve, reject) => {

        pool.query(`SELECT * FROM relatives r JOIN users u ON (u.userId =
         r.userOneFk OR u.userId = r.userTwoFk) WHERE u.userId = ?`, [id]
            , (error, result) => {

                if (error) {
                    return reject(error);
                }
                return resolve(result);
            });
    });
};


db.insertEdu = (userId, cityId, eduJobName, dateJobEduStart, dateJobEduEnd, detailsJobEdu,type) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO jobedues
            (userFk , cityFk , jobEduName, jobEduDateStart, jobEduEndDate, jobEduDetails,type)
            VALUES (?,?,?, ?,?,?,?)`,
            [userId, cityId, eduJobName, dateJobEduStart, dateJobEduEnd, detailsJobEdu,type],
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                return resolve("ok");
            }
        );

    });
};

db.getTrustedUsers = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM users ", (error, res) => {
            if (error) {
                return reject(error);
            }
            return resolve(res)
        });
    });
};

db.insertTuser = (userId, native_select) => {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < native_select.length; i++) {
            pool.query(`INSERT INTO trustedusers
         (userFk) VALUES (?)`,
                [userId], (error, result) => {
                    if (error) {

                        return reject(error);
                    }
                    return resolve('ok');
                });
        }
    });
};
db.insertUserHobby = (userId, native_select) => {
    
    return new Promise((resolve, reject) => {  
        var hh=[]; var hobbyFk="";
    for (let i = 0; i < native_select.length; i++) {
           
            if(native_select[i]>=0&&native_select[i]<=9)
            { 
                console.log(native_select[i])
                hobbyFk=hobbyFk.concat( native_select[i]);
            }
            else {
                hh.push(parseInt(hobbyFk))
            console.log(hobbyFk)
            hobbyFk ="";
            }
           
        }
        hh.push(parseInt(hobbyFk));
        console.log(hh);
        for(let i=0;i<hh.length;i++)
        {
            pool.query(`INSERT INTO userhobbies (userFk,hobbyFk)
            VALUES (?,?)`, [userId, hh[i]], (error, result) => {
                   if (error) {
   
                       return reject(error)
                   }
                   return resolve("ok");
               });
        }
    });
};

// life time

db.getLSearches = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM libraries WHERE userFk= ?', [id], (error, lib) => {
            if (error) {
                return reject(error);
            }
            return resolve(lib);
        });
    });
};
db.getLink = (libId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM links WHERE libraryFk= ?', [libId], (error, l) => {
            if (error) {
                return reject(error);
            }
            return resolve(l);
        });
    });
};
db.getEdu = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM jobedues WHERE userFk= ?', [userId], (error, l) => {
            if (error) {
                return reject(error);
            }
            return resolve(l);
        });
    });
}
/// delete
db.deleteUserCityById = (userCityId) => {
    return new Promise((resolve, reject) => {

        pool.query(`DELETE FROM usercities WHERE userCityId  = ?`
            , [userCityId], (error, result) => {
                if (error) {
                    console.error('Error deleting user city:', error);
                    return reject(error);
                }
                return resolve(result);
            });
    });
};
db.deleteLibById = (libraryId) => {
    return new Promise((resolve, reject) => {

        pool.query(`DELETE FROM libraries WHERE libraryId   = ?`
            , [libraryId], (error, result) => {
                if (error) {
                    console.error('Error deleting user city:', error);
                    return reject(error);
                }
                return resolve(result);
            });
    });
};
db.deleteEduById = (jobEduId) => {
    return new Promise((resolve, reject) => {

        pool.query(`DELETE FROM jobedues WHERE jobEduId    = ?`
            , [jobEduId], (error, result) => {
                if (error) {
                    console.error('Error deleting user city:', error);
                    return reject(error);
                }
                return resolve(result);
            });
    });
};
db.deleteRelation = (relativeId) => {
    return new Promise((resolve, reject) => {

        pool.query(`DELETE FROM relatives WHERE relativeId     = ?`
            , [relativeId], (error, result) => {
                if (error) {
                    console.error('Error deleting user city:', error);
                    return reject(error);
                }
                return resolve(result);
            });
    });
};
/// update
db.updateUserCity = (cityName, dateStart, details, userCityId) => {

    return new Promise((resolve, reject) => {

        const query = `
                UPDATE usercities
                INNER JOIN cities ON usercities.cityFk = cities.cityId
                SET cities.cityName = ?, usercities.dateStart = ?, usercities.details = ?
                 WHERE usercities.userCityId = ?`;

        pool.query(query, [cityName, dateStart, details, userCityId], (error, results) => {
            if (error) {
                console.log('there are error');
                console.error(error);
                return reject(error);
                // Handle the error
            } else {
                // Handle the success
                console.log('Record updated successfully');
                return resolve("K");
            }
        });
    });
}
db.insertEventCity=(cityId,userId)=>{
    return new Promise((resolve, reject) => {

    pool.query(`INSERT INTO eventCities (eventFk,cityFk)
            VALUES (?,?)`, [userId,cityId], (error, result) => {
                   if (error) {
   
                       return reject(error)
                   }
                   return resolve("ok");
               });
            });
}
db.updateLib = (libDate, libName, libDetails, link, libraryId) => {

    return new Promise((resolve, reject) => {

        const query = `
                UPDATE libraries
                INNER JOIN links ON libraries.libraryId  = links.libraryFk
                SET libraries.libDate = ?, libraries.libName = ?, libraries.libDetails = ?, links.file_src = ?
                 WHERE libraries.libraryId = ?`;

        pool.query(query, [libDate, libName, libDetails, link, libraryId], (error, results) => {
            if (error) {
                console.log('there are error');
                console.error(error);
                return reject(error);
                // Handle the error
            } else {
                // Handle the success
                console.log('Record updated successfully');
                return resolve("K");
            }
        });
    });
}
db.updateEdu = (jobEduDateStart, jobEduEndDate, jobEduName, city, jobEduDetails, jobEduId) => {
console.log(jobEduEndDate)
    return new Promise((resolve, reject) => {

        const query = `
                UPDATE jobedues
                INNER JOIN cities ON jobedues.cityFk  = cities.cityId
                SET jobedues.jobEduDateStart = ?, jobedues.jobEduEndDate = ?, jobedues.jobEduName = ?,
                cities.cityName = ?  , jobedues.jobEduDetails = ?
                 WHERE jobedues.jobEduId = ?`;

        pool.query(query, [jobEduDateStart, jobEduEndDate,
            jobEduName, city, jobEduDetails, jobEduId], (error, results) => {
                if (error) {
                    console.log('there are error');
                    console.error(error);
                    return reject(error);
                    // Handle the error
                } else {
                    // Handle the success
                    console.log(results);
                    return resolve("K");
                }
            });
    });
}

// db.getRelationsFromTwoTables = (id) => {
//     return new Promise((resolve, reject) => {

//         pool.query(`SELECT * FROM relatives r JOIN users u ON (u.userId =
//          r.userOneFk OR u.userId = r.userTwoFk) WHERE u.userId = ?`, [id]
//             , (error, result) => {

//                 if (error) {
//                     return reject(error);
//                 }
//                 return resolve(result);
//             });
//     });
// };

db.updateRelation = (relationDate, firstName, lastName, partnerDetails, relationType, relativeId) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE relatives r JOIN users u ON (u.userId = r.userOneFk OR u.userId = r.userTwoFk)
            SET r.relationDate = ?, r.partnerDetails = ?, r.relationType = ?
            WHERE r.relativeId = ?`;
        pool.query(query, [relationDate, partnerDetails, relationType, relativeId], (error, results) => {
            if (error) {
                return reject(error);
            } else {
                console.log('Record updated successfully');
                return resolve("K");
            }
        });
    });
};

///family


class Queue {
    constructor() {
        this.items = [];
    }

    _push(element) {
        this.items.push(element);
    }

    _pop() {
        if (this.isEmpty()) {
            return "Queue is empty";
        }
        return this.items.shift();
    }

    front() {
        if (this.isEmpty()) {
            return "Queue is empty";
        }
        return this.items[0];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    print() {
        console.log(this.items);
    }
}
let Rusers=[];
var treeMp=new Map();

        var mp=new Map();
db.getTree=async()=>{
    for(let i=0;i<Rusers.length;i++)
    {
        let oo=await db.getRTree(Rusers[i])
    }
    return new Promise((resolve, reject) => {
       resolve({mp,treeMp})
    });
}
db.getRTree = (userFk) => {

    return new Promise((resolve, reject) => {
        let q = new Queue();
        let x = { userId: userFk };
        q._push(x);
        function processQueue() {
            if (q.isEmpty()) {
                resolve(mp);
                return;
            }

            let {userId } = q._pop();
            let query = 'SELECT * FROM restf WHERE userFk = ?';
            pool.query(query, [userId], async (error, user) => {
                if (error) {
                    reject(error);
                    return;
                }
                let x=null,y=null;
                if(user[0])
                {
                let { rest_id,node_number,userFk,name} = user[0];
                    if (rest_id){
                        
                treeMp.set(rest_id+10000,name );
        let x = { userId: rest_id+10000 };
                    q._push(x);
                    }
                    if(node_number%2===0)
                    x=rest_id+10000
                else y=rest_id+10000
                }
                if(user[1])
                {
                    let { rest_id,node_number,userFk,name} = user[1];
                    if (rest_id){
                        treeMp.set(rest_id+10000,name );
                        let x = { userId: rest_id+10000 };
                        q._push(x);
                    }
                    if(node_number%2===0)
                    x=rest_id+10000
                else y=rest_id+10000
                }
                console.log(x,y);
                mp.set(userId,[x,y]);
                
                
                processQueue(); 
            });
        }
        processQueue(); 
    });
};



db.getFamilyTree = (userId) => {
    return new Promise((resolve, reject) => {
        let q = new Queue();
        let x = { level: 0, place:1,userId: userId };
        q._push(x);
        let tree = [];
         mp=new Map();

        function processQueue() {
            if (q.isEmpty()) {
                resolve(mp);
                return;
            }

            let { level,place, userId } = q._pop();
            let query = 'SELECT * FROM Users WHERE userId = ?';
            pool.query(query, [userId], async (error, user) => {
                if (error) {
                    reject(error);
                    return;
                }

                let { motherFk, fatherFk, gender, firstName, lastName } = user[0];
                treeMp.set(userId,firstName+" "+lastName );
                let x = { level: level + 1,place:place*2, userId: motherFk };
                let y = { level: level + 1,place:place*2+1, userId: fatherFk };
                let node = { firstName: firstName, lastName: lastName, gender: gender, level: level ,place:place};
                tree.push(node);
                var Rmother;
                var Rfather;
                mp.set(userId,[motherFk,fatherFk]);
                if (motherFk){
                    q._push(x);
                }
                else{
                    let io=await db.check(userId,place*2);
                    if(io.length>=1)
                    Rusers.push(io[0].userFk);
                }
                if (fatherFk){
                    q._push(y);
                }
                else{
                    
                    let io=await db.check(userId,place*2+1);
                    if(io.length>=1)
                    Rusers.push(io[0].userFk);
                }
                processQueue(); 
            });
        }
        processQueue(); 
        
    });
    
};
db.check=(userId,place)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM restf WHERE userfk= ? and node_number=?', [userId,place], (error, user)=>{
            if(error){
                return reject(error);
            }
            
            return resolve(user);
        });
    });
}
db.insertRelation=(root,nodeNumber,name)=>
{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO restf (node_number, userFk, name) VALUES (?, ?, ?)', [nodeNumber,root,name], (error, result)=>{
            if(error){
                
              return resolve(error);
            }
              return resolve(result);
        });
    });
}






db.getAllAuth=()=>{
    return new Promise((resolve, reject)=>{
        pool.query('select * from authority', (error, ev)=>{
            if(error){
                return reject(error);
            }
            return resolve(ev)
        });
    });
}
db.insertauth=(userId,userFk,authFk)=>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO user_authority (user1,user2,authFk) VALUES(?,?,?)', [userId,userFk,authFk], (err, result) => {
                if(err){
                    console.log(err);
                }
                  return resolve(result);
            })
        });
}
db.insertauthmem=(userId,userFk,authFk,id)=>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO user_authority (user1,user2,authFk,memFk) VALUES(?,?,?,?)', [userId,userFk,authFk,id], (err, result) => {
                if(err){
                    console.log(err);
                }
                  return resolve(result);
            })
        });
}
db.checkauth=(user1,user2,u)=>{
    return new Promise((resolve, reject)=>{
        pool.query('select * from user_authority where user1=? and user2=? and authFk=?', [user1,user2,u], (err, result) => {
                if(err){
                    console.log(err);
                }
                if(result.length>0)
                {
                    return resolve(1);
                }
                else return resolve(0);
            })
        });
}
db.checkauth2=(user1,user2,u,id)=>{
    return new Promise((resolve, reject)=>{
        pool.query('select * from user_authority where user1=? and user2=? and authFk=? and memFk=?', [user1,user2,u,id], (err, result) => {
                if(err){
                    console.log(err);
                }
                if(result.length>0)
                {
                    return resolve(1);
                }
                else return resolve(0);
            })
        });
}
db.givenauth=(userId)=>{
    return new Promise((resolve, reject)=>{
        pool.query('select * from user_authority where user1!=? and user2=? ', [400,userId], (err, result) => {
                if(err){
                    console.log(err);
                }
                resolve(result)
            })
        });
}
db.getgiven=(user1,user2)=>{
    return new Promise((resolve, reject)=>{
        pool.query('select * from user_authority where user1=? and user2=? ', [user1,user2], (err, result) => {
                if(err){
                    console.log(err);
                }
                resolve(result)
            })
        });
}
db.deleteauth=(userId)=>{

    return new Promise((resolve, reject)=>{
        pool.query('delete from user_authority where user1=? and user2=? and authFk=? ', [400,userId,2], (err, result) => {
                if(err){
                    console.log(err);
                }
                return resolve(0);
            })
        });
}
db.deleteauth2=(u1,u2,u,id)=>{

    return new Promise((resolve, reject)=>{
        pool.query('delete from user_authority where user1=? and user2=? and authFk=? and memFk=?', [u1,u2,u,id], (err, result) => {
                if(err){
                    console.log(err);
                }
                return resolve(0);
            })
        });
}
////profile

db.UpdateProfile = (userFirstName, userSecondName, birthSelect, deathSelect, deathDate, birthDate, deathReason, gender, userId,password) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE Users set firstName=?,lastName=?,userPassword=?, birthDate=?,deathDate=?,birthPlace=?,deathPlace=?, gender=?,deathReason=? where userId=? `
            , [userFirstName, userSecondName,password, birthDate,deathDate,birthSelect,deathSelect,gender,deathReason,userId], (error, result) => {
                if (error) {
                    console.log(error);
                    return resolve("error");
                }
                return resolve(result);
            });
    });
}

db.insertChild = (userId, partnerId, childrName, childrDate, childrDetails, isUser) => {
    return new Promise((resolve, reject) => {
        let type = 3;
        if (isUser) {
            const query = `INSERT INTO relatives (userOneFk ,userTwoFk,  relationType ,relationDate,partnerDetails,isUser)
            VALUES (?, ?, ?, ?,?,?)`         ;
            pool.query(query, [userId, partnerId, type, childrDate, childrDetails, isUser], (error, result) => {
                if (error) {

                    return reject(error)
                }
                return resolve('ok');
            });
        }
        else {
            const query = `INSERT INTO relatives (userOneFk ,userTwoFk,
                relationType ,relationDate,partnerDetails,isUser,ChildName)
            VALUES (?, ?, ?, ?,?,?,?)`;
            pool.query(query, [userId, partnerId, type, childrDate, childrDetails, isUser, childrName], (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve('ok');
            });
        }
    });
}

db.getMemPre=(id,gu)=>{
    return new Promise((resolve, reject)=>{
        pool.query('select * from user_authority where user1=? and user2=? and authFk=?', [id,gu,5], (err, result) => {
                if(err){
                    console.log(err);
                }
                resolve(result)
            })
        });
}
db.getCitiesHis=()=>{
    return new Promise((resolve, reject)=>{
        pool.query('select * from cityhistory', (err, result) => {
                if(err){
                    console.log(err);
                }
                resolve(result)
            })
        });
}

db.insertCHL=(i,k)=>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO links (historyfk,file_src) VALUES (?,?)', [i,k], (err, result) => {
                if(err){
                    console.log(err);
                }
                console.log(result)
                resolve(result)
            })
        });
}

db.insertCity=(name)=>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO cities (cityName) VALUES (?)', [name], (err, result) => {
                if(err){
                    console.log(err);
                }
                resolve(result)
            })
        });
}

db.insertCH=(o,k,j,h)=>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO cityhistory (historyName,historyDetailes,cityFk,historyDate) VALUES (?,?,?,?)', [o,k,j,h], (err, result) => {
                if(err){
                    console.log(err);
                }
                resolve(result)
            })
        });
}
module.exports = db;



