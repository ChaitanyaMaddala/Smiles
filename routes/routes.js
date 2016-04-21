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
  
  app.get("/getInventoryItems", function(req, res, next) {
    console.log('requested for all inventory items');

    app.connection.query('SELECT id,item_name, item_price FROM ITEMS.ITEMS_TABLE WHERE item_isdeleted = 0', 
      function(err, rows, fields) {
        if (err){
          // console.log(err);
          return next(err);
        }else{
          res.send(rows);
        }
      });
  });

  app.get('/deleteInventoryItem', function(req, res, next){
    console.log('requested for deleting inventory item with id: ' + req.query.item_id);

    if(req.query.item_id){
      console.log(app.connection);
      app.connection.query('UPDATE ITEMS.ITEMS_TABLE SET item_isdeleted=1 WHERE id=' + req.query.item_id,
        function(err, rows){
          if(err){
            console.log('error occured in deleting: code - ' + err.code + " ,isFatal - " + err.fatal);
            next(err);
          } else{
            res.send({"status": "success", 
              "message": "Item deleted with id - " + req.query.item_id });
          }
      });
    } else{
      res.send({"status": "error", "message": "missing a parameter"});
    }
  });

  app.get('/undoDeleteInventoryItem', function(req, res, next){
    console.log('requested for undo delete inventory item with id: ' + req.query.item_id);

    if(req.query.item_id){
      app.connection.query('UPDATE ITEMS.ITEMS_TABLE SET item_isdeleted=0 WHERE id=' + req.query.item_id,
        function(err, rows){
          if(err){
            console.log('error occured in undo delete: code - ' + err.code + " ,isFatal - " + err.fatal);
            next(err);
          }
          res.send({"status": "success", 
            "message": "Item recovered with id - " + req.query.item_id });
      });
    } else{
      res.send({"status": "error", "message": "missing a parameter"});
    }
  });

  app.get("/getBillingItems", function(req, res, next) {
    console.log('requested for all bills');

    app.connection.query('SELECT id as BILL_NO, bill_date as BILL_DATE, '+
      'total_cost as BILL_COST, customer_name as CUST_NAME, '+
      'vat_percentage as BILL_VAT, delivery as DELIVERY_CHARGES '+
      'FROM ITEMS.BILL_LIST WHERE item_isdeleted = 0', 
      function(err, rows, fields) {
        if (err){
          console.log(err);
          next(err);
        }
        else{
          res.send(rows);
        }
      });
  });

  app.get("/getItemsInBill", function(req, res, next) {
    console.log('requested for all items inside bill: ' + req.query.bill_no);

    if(req.query.bill_no) {
      app.connection.query('SELECT bill.id, items.item_name, bill.item_qty, bill.item_cst, bill.item_type' + 
        ' FROM ITEMS.BILL_ITEM_LIST as bill join items.ITEMS_TABLE as items' +
        ' where bill.item_no = items.id and bill.bill_no = ' +
        req.query.bill_no +';', 
      function(err, rows, fields) {
        if (err){
          console.log(err);
          return next(err);
        }else{
          res.send(rows);
        }
      });
    } else{
      res.send({"status": "error", "message": "missing a parameter"});
    }
  });

  app.post("/addInventoryItem", function(req, res, next) {
    console.log('requested for adding inventory item');

    if(!req.body.item_name){
      res.send({"status": "error", "message": "missing a parameter"});
    } else{
      app.connection.query('INSERT INTO ITEMS_TABLE SET ?', req.body, function(err,result){
        if(err) {
          console.log(err);
          next(err);
        } else{
          console.log('Last insert ID:', result.insertId);
          res.send(
            { "status": "success", 
              "response":{
                'message': 'New inventory item is saved in database with id : ' + result.insertId,
                'itemId': result.insertId
              }
            }
          );
        }
      });
    }

    // !req.body.username || !req.body.password || !req.body.twitter
  });

  app.post("/addBill", function(req, res, next) {
    console.log('requested for adding inventory item');

    if(!req.body.bill_date || !req.body.total_cost 
      || !req.body.items || !req.body.vat_percentage){
      res.send({"status": "error", "message": "missing a parameter"});
    } else{
      var bill = {
        bill_date: req.body.bill_date,
        total_cost: req.body.total_cost,
        vat_percentage : req.body.vat_percentage,
        delivery: req.body.delivery
      };
      if(req.body.cust_name){
        bill.customer_name = req.body.cust_name;
      }
      app.connection.query('START TRANSACTION', function(err,result1){
        if(err){
          console.log(err);
          next(err);
        }else{
          app.connection.query('INSERT INTO BILL_LIST SET ?', bill, function(err,result2){
            if(err) {
              console.log(err);
              app.connection.query('ROLLBACK', function(err,result3){
                if(err){
                  console.log(err);
                  next(err);
                }
                res.send({"status": "error", "message": "insertion problem in bill_list"});
              });
            }else{
              var items = JSON.parse(req.body.items);
              for(var i=0; i<items.length; i++){
                var item = items[i];
                item.bill_no = result2.insertId;
                app.connection.query('INSERT INTO BILL_ITEM_LIST SET ?', item, function(err, result4){
                  if(err) {
                    console.log(err);
                    app.connection.query('ROLLBACK', function(err,result5){
                      if(err){
                        console.log(err);
                        next(err);
                      }
                      res.send({"status": "error", "message": "insertion problem in bill item list"});
                    });
                  }

                  console.log('Bill item is inserted: ', result4.insertId);
                });
              }

              app.connection.query('COMMIT', function(err, result6){
                if(err){
                  console.log(err);
                  next(err);
                }else{
                  res.send(
                    { "status": "success",
                      "response":
                      { 
                        'message': "bill and its items are inserted",
                        'billId': result2.insertId
                      }
                    }
                  );
                }
              });

              console.log('Bill insertion id:', result2.insertId);
            }
          });
        }
      });
    }

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
    
      

    
}
 
module.exports = appRouter;