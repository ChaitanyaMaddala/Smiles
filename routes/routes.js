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
    if(!req.body.userId || !req.body.itemName 
      || !req.body.itemDescription){
      res.send({"status": "error", "message": "missing a parameter"});
    } 
    else{
      var donationRequest = {
        user_id: req.body.userId,
        item_name: req.body.itemName,
        item_description : req.body.itemDescription,
        status: "requested"
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

    if(!req.body.userId || !req.body.wishlistId 
      || !req.body.money ){
      res.send({"status": "error", "message": "missing a parameter"});
    } 
    else{
      var donation = {
        user_id: req.body.userId,
        wishlist_id: req.body.wishlistId,
        money : req.body.money,  
        reference_num : req.body.referenceNumber  
      };
    
        app.connection.query('INSERT INTO DONATION_MONEY SET ?', donation, function(err,result2){
            if(err) {
              console.log(err);
             
                if(err){
                  console.log(err);
                  next(err);
                }
                res.send({"status": "error", "message": "insertion problem in money"});
              }
            else {
                res.send({"status": "success"});
            }
            
          }); 
    }
});  
    
  app.get("/getComments", function(req, res, next) {
    console.log('requested for comments of an items'+req.query.itemId);
     if(!req.query.itemId){
      res.send({"status": "error", "message": "missing a parameter"});
    }   
      else {
      var sqlQuery = 'SELECT COMMENT_ID, USER_ID, COMMENT, TIME_STAMP FROM comment where item_id  = ' + req.query.itemId + ' order by TIME_STAMP';
      
      app.connection.query(sqlQuery, 
      function(err, rows, fields) {
        if (err){
          // console.log(err);
          return next(err);
        }else{
          res.send(rows);
        }
      });
      }
  }); 
    
   
    app.post("/addComments", function(req, res, next) {
    console.log('requested for comments of an items'+req.body);
     if(!req.body.itemId || !req.body.comment || !req.body.userId){
      res.send({"status": "error", "message": "missing a parameter"});
    }   
      else {
      var object = {
        ITEM_ID : req.body.itemId,
        USER_ID : req.body.userId,
        COMMENT : req.body.comment,
      };      
      
      app.connection.query('INSERT INTO COMMENT SET ?', object, 
      function(err, rows, fields) {
        if (err){
          // console.log(err);
          return next(err);
        }else{
          res.send(rows);
        }
      });
      }
  }); 
    
    
  app.get("/viewOrphanages", function(req, res, next) {
    console.log('Entering into View Orphanages with query param :'+req.query.orphanageId);
    
    var sqlQuery;  
    if(!req.query.orphanageId)
        sqlQuery = 'SELECT * FROM ORPHANAGE';
    else
        sqlQuery = 'SELECT * FROM ORPHANAGE where ORPHANAGE_ID = '+req.query.orphanageId;
      
    app.connection.query(sqlQuery, 
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
      
    var sqlQuery;
    
    if(!req.query.userId)
        sqlQuery = 'SELECT donor_user_id,donationTable.ITEM_ID, wishItems.ITEM_NAME , wishItems.ITEM_DESCRIPTION, QUANTITY, donationTable.WISHLIST_ID, STATUS FROM DONATION_ITEMS donationTable join wishlist_items wishItems on donationTable.item_id = wishItems.item_id where STATUS = "USER_CLAIMED"' ;
    else
        sqlQuery = 'SELECT donor_user_id,donationTable.ITEM_ID, wishItems.ITEM_NAME , wishItems.ITEM_DESCRIPTION, QUANTITY, donationTable.WISHLIST_ID, STATUS FROM DONATION_ITEMS donationTable join wishlist_items wishItems on donationTable.item_id = wishItems.item_id where STATUS != "DONATED" and DONOR_USER_ID = '+ req.query.userId;
      
    app.connection.query(sqlQuery, 
      function(err, rows, fields) {
        if (err){
          // console.log(err);
          return next(err);
        }else{
          res.send(rows);
        }
      });
  });     
    
     
  app.post("/changeTransactionState", function(req, res, next) {
        console.log('Entering into change transaction state');
        
        var status = req.body.status;
        var sqlQuery;
        if(status == "ARMY_CLAIMED"){
            sqlQuery = 'UPDATE donation_items set STATUS = "ARMY_CLAIMED" , RECEIVER_USER_ID = '+req.body.armyId+ ' where TRANSACTION_ID = '+req.body.transactionID; 
        }
        else if(status == "DONATED") {
            sqlQuery = 'UPDATE donation_items set STATUS = "DONATED" , RECEIVER_USER_ID = '+req.body.armyId+ ' where TRANSACTION_ID = '+req.body.transactionID;  
        }
    
        console.log('####'+sqlQuery);
    
        app.connection.query(sqlQuery , 
        function(err, rows, fields) {
            if (err){
            // console.log(err);
            return next(err);
            }else{
                res.send({"status": "update success"});
            }
      });
  });    
     
    
app.post("/createActivityandWishList", function(req, res, next){
    
        var object = {
            activity_name : req.body.activityName, 
            visit_date : req.body.visitDate,
            orphanage_id : req.body.orphanageId,
            image : req.body.image
        };
    
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
         
    
      app.connection.query('INSERT INTO ACTIVITY SET ?', object , 
          function(err, rows, fields) {
            if (err){
              // console.log(err);
              return next(err);
            }else{
                var wishlistId = rows.insertId;
            
                var wishlistItems = ObjToArray(req.body.Sheet1);
                
                for(var i =0; i < wishlistItems.length; i++){
                    wishlistItems[i].push(wishlistId);
                }
     
                app.connection.query('INSERT INTO WISHLIST_ITEMS(ITEM_NAME, ITEM_DESCRIPTION,ITEM_QTY,SINGLE_ITEM_PRICE, APPROXIMATE_PRICE, ITEMS_RECEIVED, WISHLIST_ID) VALUES ?', [wishlistItems] , 
                        function(err, rows, fields) {
                            if (err){
                                // console.log(err);
                                return next(err);
                            }else{
                                res.send(rows);
                            }
                        });
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
     
     for(var i =0; i < wishlistItems.length; i++){
     
         wishlistItems[i].push(3);
         /*
         wishListItemDB.ITEM_NAME = wishlistItems[i].Wish;
         wishListItemDB.ITEM_DESCRIPTION = wishlistItems[i].Description;
         wishListItemDB.WISHLIST_ID = wishlistItems[i].
         wishListItemDB.APPROXIMATE_PRICE = wishlistItems[i].ApproxValue;
         
         wishListItemsDB.push(wishListItemDB);
         console.log(wishListItemDB);
         */
     }
     
     console.log("Result :" + wishlistItems);
     
    app.connection.query('INSERT INTO WISHLIST_ITEMS(ITEM_NAME, ITEM_DESCRIPTION, APPROXIMATE_PRICE, WISHLIST_ID) VALUES ?', [wishlistItems] , 
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

     if(!req.query.wishlistId){
         res.send({"status": "error", "message": "missing a parameter"});
     }
     
    app.connection.query('SELECT ITEM_ID, ITEM_NAME, ITEM_DESCRIPTION, ITEM_QTY, APPROXIMATE_PRICE, ITEMS_RECEIVED FROM wishlist_items where WISHLIST_ID ='+req.query.wishlistId, 
      function(err, rows, fields) {
        if (err){
          // console.log(err);
          return next(err);  
        }else{
          res.send(rows);
        }
      });
  });         
    
 app.post("/Login", function(req, res, next) {
    console.log('Entering into Login');
     
    var email = req.body.userName;
    var password = req.body.password; 
    
    var sqlQuery = 'SELECT USER_ID,USER_NAME,USER_EMAIL,USER_ROLE,USER_PHONE,USER_ADDR,USER_PHOTO FROM users where USER_EMAIL = "'+ email +'" and USER_PASSWORD = "'+password+'"';
     
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
    
    
    app.post("/userClaimedtoDonate", function(req, res, next) {
    console.log('Entering into Login');
     
    var object = {
      item_id : req.body.itemId,
      donor_user_id : req.body.userId,
      status : "USER_CLAIMED",
      quantity : req.body.quantity,
      wishlist_id : req.body.wishlistId,
      need_pickup : req.body.needPickup,
      pickup_address : req.body.pickupAddress    
    };
    
     app.connection.query('INSERT INTO DONATION_ITEMS SET ?' , object, 
      function(err, rows, fields) {
        if (err){
          // console.log(err);
          return next(err);
        }else{
          res.send(rows);
        }
      });
        
      app.connection.query('SELECT ITEMS_RECEIVED FROM smiles_schema.wishlist_items where ITEM_ID = '+ req.body.itemId, 
      function(err, rows, fields) {
        if (err){
          // console.log(err);
          return next(err);
        }else{
            var total = rows[0].ITEMS_RECEIVED + req.body.quantity;
            console.log("Total:"+total);
            app.connection.query('UPDATE WISHLIST_ITEMS SET ITEMS_RECEIVED = '+total+ ' where item_id = '+req.body.itemId + ' and wishlist_id ='+req.body.wishlistId, 
                function(err, rows, fields) {
                    if (err){
                        // console.log(err);
                        return next(err);
                    }else{
                        res.send(rows);
                    }
            });
            
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
    
    
      app.get("/getArmyClaimedItemsforPickup", function(req, res, next) {
        console.log('Entering into Get Army Claimed Items for Pickup' + req.query.armyId);
        
        if(!req.query.armyId){
          res.send({"status": "error", "message": "missing a parameter"});   
        }
        var sqlQuery = 'SELECT dItems.TRANSACTION_ID, dItems.ITEM_ID, wItems.ITEM_NAME, wItems.ITEM_DESCRIPTION, dItems.QUANTITY,  dItems.DONOR_USER_ID, u.USER_NAME, u.USER_EMAIL, u.USER_PHONE, u.USER_ADDR, u.USER_PHOTO FROM donation_items dItems join wishlist_items wItems on dItems.ITEM_ID = wItems.ITEM_ID join users u on u.USER_ID = dItems.DONOR_USER_ID where IS_CLOSED = "N" and dItems.STATUS = "ARMY_CLAIMED" and NEED_PICKUP = "Y" and dItems.RECEIVER_USER_ID = '+req.query.armyId; 
        
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
    
    
   app.get("/getUserDonatedItemDetails", function(req, res, next) {
        console.log('Entering into Get User Donated Items' + req.query.userId);
        
        if(!req.query.userId){
          res.send({"status": "error", "message": "missing a parameter"});   
        }
        var sqlQuery = 'SELECT dItems.TRANSACTION_ID, dItems.ITEM_ID, wItems.ITEM_NAME, wItems.ITEM_DESCRIPTION, dItems.QUANTITY, dItems.WISHLIST_ID, a.ACTIVITY_NAME, a.VISIT_DATE FROM donation_items dItems join wishlist_items wItems on dItems.ITEM_ID = wItems.ITEM_ID join activity a on a.WISHLIST_ID = dItems.WISHLIST_ID where IS_CLOSED = "N" and dItems.STATUS = "DONATED" and dItems.DONOR_USER_ID = '+req.query.userId; 
        
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
    
    
    app.get("/getActivitiesList", function(req, res, next) {
    console.log('Entering into Get Activities List');
    
    var sqlQuery = 'SELECT WISHLIST_ID, ACTIVITY_NAME, a.ORPHANAGE_ID, o.ORPHANAGE_NAME, IMAGE,  VISIT_DATE, IS_VISIT_COMPLETED FROM activity a join orphanage o on a.ORPHANAGE_ID = o.ORPHANAGE_ID';
     
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
    
     app.get("/getWishListTotalValue", function(req, res, next) {
        console.log("wishListID :"+req.query.wishlistId); 
        app.connection.query('SELECT SUM(APPROXIMATE_PRICE) AS TOTAL_PRICE, WISHLIST_ID FROM wishlist_items where WISHLIST_ID='+req.query.wishlistId,
                            function(err, rows, fields) {
                                if (err) {
                                    // console.log(err);
                                    return next(err);
                                } else {
                                    res.send(rows);
                                }
        });
     });
    
     app.get("/getWishlistItemsReceivedCost", function(req,res,next){
         
        app.connection.query('SELECT ITEM_ID, SINGLE_ITEM_PRICE, ITEM_QTY, ITEMS_RECEIVED FROM WISHLIST_ITEMS where WISHLIST_ID ='+req.query.wishlistId,
                            function(err, rows2, fields) {
                                    if (err) {
                                        // console.log(err);
                                        return next(err);
                                    }
                                    else {
                                        var itemWorthReceived = 0;
                                            for(var j=0; j < rows2.length; j++) {
                                                var singleItemPrice = rows2[j].SINGLE_ITEM_PRICE;
                                                var totalItemsNeeded = rows2[j].ITEM_QTY;
                                                var itemsReceived = rows2[j].ITEMS_RECEIVED;
                                                console.log(singleItemPrice+" :"+totalItemsNeeded+" :"+itemsReceived);
                                                itemWorthReceived = (itemWorthReceived + (itemsReceived*singleItemPrice));
                                            }
                                                
                                        res.send({"wishlistId": req.query.wishlistId, "itemWorthReceived": itemWorthReceived});
                                    }
                                        
                            });
     });
                                        
    /*
     app.get("/test123", function(req, res, next) {
        console.log('');
        var sqlQuery = "";
        var wishList = [];
        app.connection.query('select WISHLIST_ID from activity where IS_VISIT_COMPLETED = "N"',
            function(err, rows, fields) {
                if (err) {
                    // console.log(err);
                    return next(err);
                } else {
                    console.log("result" + rows[0].WISHLIST_ID);
                    var wishlistCount = rows.length;
                    for (var i = 0; i < wishlistCount; i++) {
                        var wish = {};
                        var wishListID = rows[i].WISHLIST_ID;
                        app.connection.query('SELECT SUM(APPROXIMATE_PRICE) AS TOTAL_PRICE, WISHLIST_ID FROM wishlist_items where WISHLIST_ID ='+wishListID,
                            function(err, rows1, fields) {
                                if (err) {
                                    // console.log(err);
                                    return next(err);
                                } else {
                                    console.log("####"+rows1[0].WISHLIST_ID);
                                    wish['wishListID'] = rows1[0].WISHLIST_ID;
                                    wish['totalPrice'] = rows1[0].TOTAL_PRICE;
                                    console.log("aaaa"+JSON.stringify(wish));
                                    
                                    var itemWorthReceived = 0;
                                    app.connection.query('SELECT ITEM_ID, SINGLE_ITEM_PRICE, ITEM_QTY, ITEMS_RECEIVED FROM WISHLIST_ITEMS where WISHLIST_ID ='+wishListID,
                                    function(err, rows2, fields) {
                                        if (err) {
                                        // console.log(err);
                                        return next(err);
                                        } else {
                                            for(var j=0; j < rows2.length; j++) {
                                                var singleItemPrice = rows2[j].SINGLE_ITEM_PRICE;
                                                var totalItemsNeeded = rows2[j].ITEM_QTY;
                                                var itemsReceived = rows2[j].ITEMS_RECEIVED;
                                                console.log(singleItemPrice+" :"+totalItemsNeeded+" :"+itemsReceived);
                                                itemWorthReceived = (itemWorthReceived + ((totalItemsNeeded-itemsReceived)*singleItemPrice));
                                            }
                                             wish['receivedWorth'] = itemWorthReceived;
                                            console.log(itemWorthReceived);
                                        }
                                        wishList.push(wish);
                                        console.log(JSON.stringify(wish));
                                    });
                                        
                                        
                                }
                            });
                       
                    }
                    console.log(wishList);
                    res.send(wishList);
                }
          });
     });    
    
    */
}
 
module.exports = appRouter;