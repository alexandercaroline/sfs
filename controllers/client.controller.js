let home = (req,res) => {
    let sql = "SELECT * FROM crops"
 
    db.query(sql,(err,results)=>{
       if(err){
           console.log(err)
           res.render('clienthome',{
               crops : []
           })
           return
       }
 
       if(results.length > 0){
           let crops = []
           results.forEach((row) =>{
               crops.push(row.name)
           })
           
           res.render('clienthome',{
             crops : crops
           })
           global.cropsBackup = crops
          return
       }
 
        res.render('client',{
            crops : []
        })

        global.cropsBackup = []
    })
 }

 exports.clienthome = home

 exports.getOnSale = (req,res) => {
    let sql = 'SELECT * FROM farmer_uploads JOIN farmer ON farmer_uploads.farmerID = farmer.farmerID'

    db.query(sql,(err,results) => {
         if(err){
            home(req,res)
            return
         }

         res.render('onsale',{
             crops : results
         })
    })

 
 }