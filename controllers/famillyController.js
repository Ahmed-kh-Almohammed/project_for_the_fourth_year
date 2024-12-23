const db = require('../models/database.js');

const famillyGet = async (req, res) => {

    let userId=req.session.userId;;
     await db.getFamilyTree(userId);
    let {mp,treeMp}=await db.getTree();
    console.log(mp)
   // console.log(tree);
    res.render('familly', { levParam: req.body.level, session: req.session,mp,treeMp });

}
const famillyPost = async (req, res) => {
    if(req.body.add)
    {
        let add=req.body.add;
        let root="",nodeNumber="";
        var t=new Boolean(true);
        for(let i=0;i<add.length;i++)
        {
            if(t&&add[i]>='0'&&add[i]<='9')
            {
                root+=add[i];
            }
            else if(add[i]>='0'&&add[i]<='9')
            {
                nodeNumber+=add[i];
            }
            else t=false;
        }
        root=parseInt(root);
        nodeNumber=parseInt(nodeNumber);
        let ne=await db.insertRelation(root,nodeNumber,req.body.name);
        let userId=req.session.userId;;
       
     await db.getFamilyTree(userId);
    let {mp,treeMp}=await db.getTree();
        res.render('familly', { levParam: req.body.level, session: req.session,mp,treeMp });

    }
    else 
    {
        let userId=req.session.userId;;
        
     await db.getFamilyTree(userId);
     let {mp,treeMp}=await db.getTree();
        res.render('familly', { levParam: req.body.level, session: req.session,mp,treeMp });
    }
}
module.exports = {
    famillyGet,
    famillyPost
}