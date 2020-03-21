


exports.cropdetails = (req,res) =>{
      
    let sql = `SELECT * FROM crops WHERE name = '${req.params.crop}'`

    db.query(sql,(err,results)=>{
        if(err)
        {   
            console.log(err)
            res.redirect('/welcome')
            return
        }
        
        if(results.length > 0){
            res.render('cropdetails',{
                post : results[0].post,
                name : results[0].name,
                crops: global.cropsBackup,
                isFarmer : req.session.isFarmer
            })
            return
        }
        res.redirect('/welcome')
    })
}

