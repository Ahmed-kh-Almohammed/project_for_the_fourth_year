
const profileGet = (req, res) => {
    res.render('profile',{session:req.session});
}
const profilePost=(req,res)=>{
    res.render('profile',{session:req.session});
}


module.exports = {
    profileGet,
    profilePost
  }