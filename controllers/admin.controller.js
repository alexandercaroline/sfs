exports.login = (req,res) =>{
    req.session.userId = 1
    req.session.admin = true
    res.redirect('/admin')
}

exports.addcrop = (req,res) => {
   
    let sql = `INSERT INTO crops(name,varieties,post) VALUES('${req.body.name}','${req.body.varieties}','${req.body.post}')`

    db.query(sql,(err,results)=>{
        if(err)
        {
            console.log(err)
            return
        }

        console.log("YEAH")
        res.send("OK")
    })
}