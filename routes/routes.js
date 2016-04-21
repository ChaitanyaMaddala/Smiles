var appRouter = function(app) {
  app.all("/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    return next();
  });

  app.get("/", function(req, res) {
    res.send({'response': 'Hello World!'});
  });
  
 
    
  app.post("/addSelfRequest", function(req, res, next) {
    console.log('requested for donating item');
    console.log(req.body);
    console.log("after");  
    if(!req.body.user_id || !req.body.cat_id 
      || !req.body.subcat_id ){
      res.send({"status": "error", "message": "missing a parameter"});
    } 
    else{
      var donationRequest = {
        user_id: req.body.user_id,
        cat_id: req.body.cat_id,
        sub_cat_id : req.body.subcat_id,
        status: "request"
      };
    
        app.connection.query('INSERT INTO SELF_REQUEST SET ?', donationRequest, function(err,result2){
            if(err) {
              console.log(err);
             
                if(err){
                  console.log(err);
                  next(err);
                }
                res.send({"status": "error", "message": "insertion problem in SELF_REQUEST"});
              };
            
          }); 
    }
});  
    

    app.post("/moneyDonation", function(req, res, next) {
    console.log('Entering into Donating money service');
    console.log(req.body);

    if(!req.body.user_id || !req.body.wishlist_id 
      || !req.body.money ){
      res.send({"status": "error", "message": "missing a parameter"});
    } 
    else{
      var donation = {
        user_id: req.body.user_id,
        wishlist_id: req.body.wishlist_id,
        money : req.body.money,
        timestamp : 'NOW()'  
      };
    
        app.connection.query('INSERT INTO DONATION_MONEY SET ?', donation, function(err,result2){
            if(err) {
              console.log(err);
             
                if(err){
                  console.log(err);
                  next(err);
                }
                res.send({"status": "error", "message": "insertion problem in money"});
              };
            
          }); 
    }
});  
    
  app.get("/getComments", function(req, res, next) {
    console.log('requested for comments of an items');

    app.connection.query('SELECT comment_id,user_id, description FROM comment where item_id = '+ req.query.itemId, 
      function(err, rows, fields) {
        if (err){
          // console.log(err);
          return next(err);
        }else{
          res.send(rows);
        }
      });
  }); 
    
    
  app.get("/viewOrphanages", function(req, res, next) {
    console.log('Entering into View Orphanages');

    app.connection.query('SELECT * FROM ORPHANAGE', 
      function(err, rows, fields) {
        if (err){
          // console.log(err);
          return next(err);
        }else{
          res.send(rows);
        }
      });
  });     
    
    
  app.get("/viewClaimsofDonor", function(req, res, next) {
    console.log('Entering into get Claims of Donor');

    app.connection.query('SELECT donationTable.ITEM_ID, wishItems.ITEM_NAME , QTY_DONATED, STATUS FROM DONATION_ITEMS donationTable join wishlist_items wishItems where DONOR_USER_ID = 1', 
      function(err, rows, fields) {
        if (err){
          // console.log(err);
          return next(err);
        }else{
          res.send(rows);
        }
      });
  });     

 app.post("/createWishList", function(req, res, next) {
    console.log('Entering into create wish List');

     console.log(req.body);
     
     
     
   //  var wishListItemsDB = [];
     
     function ObjToArray(obj) {
        var arr = obj instanceof Array;

        return (arr ? obj : Object.keys(obj)).map(function(i) {
            var val = arr ? i : obj[i];
            if(typeof val === 'object')
                return ObjToArray(val);
            else
                return val;
        });
     }
     
     var wishlistItems = ObjToArray(req.body.Sheet1);
     console.log(wishlistItems);
     /*for(var i =0; i < wishlistItems.length; i++){
     
         var wishListItemDB = {};
         
         wishListItemDB.ITEM_NAME = wishlistItems[i].Wish;
         wishListItemDB.ITEM_DESCRIPTION = wishlistItems[i].Description;
         wishListItemDB.WISHLIST_ID = wishlistItems[i].
         wishListItemDB.APPROXIMATE_PRICE = wishlistItems[i].ApproxValue;
         
         wishListItemsDB.push(wishListItemDB);
         console.log(wishListItemDB);
     }*/
     
    // console.log("Result :" + wishListItemsDB);
     
    app.connection.query('INSERT INTO WISHLIST_ITEMS(ITEM_QTY, ITEM_NAME, ITEM_DESCRIPTION, APPROXIMATE_PRICE) VALUES ?', [wishlistItems] , 
      function(err, rows, fields) {
        if (err){
          // console.log(err);
          return next(err);
        }else{
          res.send(rows);
        }
      });
  });     
    
      
 app.get("/getWishList", function(req, res, next) {
    console.log('Entering into get wish list items');

    app.connection.query('SELECT ITEM_ID, ITEM_NAME, ITEM_DESCRIPTION, ITEM_QTY FROM wishlist_items', 
      function(err, rows, fields) {
        if (err){
          // console.log(err);
          return next(err);  
        }else{
          res.send(rows);
        }
      });
  });         
    
 app.get("/Login", function(req, res, next) {
    console.log('Entering into Login');
     
    var email = req.body.userName;
    var password = req.body.password; 
    
    var sqlQuery = 'SELECT USER_ID,USER_NAME,USER_EMAIL,USER_ROLE,USER_PHONE,USER_ADDR,USER_PHOTO FROM user where USER_EMAIL = "'+ email +'" and USER_PASSWORD = "'+password+'"';
     
    console.log('####'+sqlQuery);
    
     app.connection.query(sqlQuery , 
      function(err, rows, fields) {
        if (err){
          // console.log(err);
          return next(err);
        }else{
          res.send(rows);
        }
      });
  });
    

    app.post("/changeUserRole", function(req, res, next) {
    console.log('Entering into change user role');
    console.log(req.body.userId);
        
    if(!req.body.userId || !req.body.newRole){
      res.send({"status": "error", "message": "missing a parameter"});
    } 
    else{
        console.log("aaa");
        var sqlQuery = 'UPDATE USER SET USER_ROLE = "' + req.body.newRole + '" WHERE USER_ID = ' + req.body.userId;
        console.log("Query "+sqlQuery);
        app.connection.query(sqlQuery,  function(err,result2){
            if(err) {
              console.log(err);
             
                if(err){
                  console.log(err);
                  next(err);
                }
                res.send({"status": "error", "message": "user role update problem"});
              }
            
          }); 
        }
    }); 
    
  app.get("/getAllUserDetails", function(req, res, next) {
    console.log('Entering into Get all user Details');
    
    
    var sqlQuery = 'SELECT USER_ID,USER_NAME,USER_EMAIL,USER_ROLE,USER_PHONE,USER_ADDR,USER_PHOTO FROM USERS WHERE USER_ROLE != "SUPER_ADMIN" ';
     
    console.log('####'+sqlQuery);
    
     app.connection.query(sqlQuery , 
      function(err, rows, fields) {
        if (err){
          // console.log(err);
          return next(err);
        }else{
          res.send(rows);
        }
      });
  });

    
    app.get("/getClaimableItemsforPickup", function(req, res, next) {
        console.log('Entering into Get Claimable Items for Pickup');
    
    
        var sqlQuery = 'SELECT dItems.TRANSACTION_ID, dItems.ITEM_ID, wItems.ITEM_NAME, wItems.ITEM_DESCRIPTION, dItems.QUANTITY,  dItems.DONOR_USER_ID, u.USER_NAME, u.USER_EMAIL, u.USER_PHONE, u.USER_ADDR, u.USER_PHOTO FROM donation_items dItems join wishlist_items wItems on dItems.ITEM_ID = wItems.ITEM_ID join users u on u.USER_ID = dItems.DONOR_USER_ID where IS_CLOSED = "N" and dItems.STATUS = "USER_CLAIMED" and NEED_PICKUP = "Y"'; 
        
        console.log('####'+sqlQuery);
    
        app.connection.query(sqlQuery , 
        function(err, rows, fields) {
            if (err){
            // console.log(err);
            return next(err);
            }else{
                res.send(rows);
            }
      });
  });

    
}
 
module.exports = appRouter;