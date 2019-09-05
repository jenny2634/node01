var express = require('express');
var router = express.Router();


// npm install mongodb --save
var MongoClient = require("mongodb").MongoClient;

var web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction

var w3 = new web3(new web3.providers.HttpProvider("http://localhost:7545"));

// 127.0.0.1:3000/customer/insert
router.get('/insert', function (req, res, next) {
  MongoClient.connect('mongodb://localhost:27017/item', function (err, dbconn) {
    if (err) {
      console.log('error', err);
    }
    else {
      var collection = dbconn.db("item").collection('abi');
      collection.find({}).toArray(function (err, docs) {
         CA = docs[0].CA;
        res.render("insert_customer", { CA: 'CA',CA:docs[0].CA });

      });
    }
  });

});

router.post('/insert', function (req, res, next) {
  var a = req.body.id;
  var b = req.body.na;
  var c = req.body.ag;

  var arr = { "id": a, "name": b, "age": c };
  console.log(arr);

  MongoClient.connect('mongodb://localhost:27017/item', function (err, dbconn) {
    if (err) {
      console.log('error', err);
    }
    else {

      var collection = dbconn.db("item").collection('abi');
      collection.find({}).toArray(function (err, docs) {
        //console.log('ca:', docs[0].CA);
        //console.log('abi:', docs[0].ABI);
        ABI = docs[0].ABI;
        CA = docs[0].CA;

        const Contract = new w3.eth.Contract(ABI, CA)

        var EOA1 = '0x87dE62AE9322c1d98939848a74426e15b73AFeB1';
        var PRIVATE_KEY = '8dd52bd0dd57067573ecf3088b61e3ce6283c5633ff3a5749af8e4d049f3c56c';

        var setStringExec = Contract.methods.setJoin(a, b, c);
        var setStringByteCode = setStringExec.encodeABI();

        const Gwei = 9;
        const unit = 10 ** Gwei;
        const gasLimit = 221000;
        const gasPrice = 21 * unit;

        w3.eth.getTransactionCount(EOA1, "pending", (err, nonce) => {
          var rawTx = {
            nonce: nonce,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
            data: setStringByteCode,
            from: EOA1,
            to: CA
          }
          let privateKey = new Buffer.from(PRIVATE_KEY, "hex");
          let tx = new Tx(rawTx);
          tx.sign(privateKey);

          let serializedTx = tx.serialize();
          w3.eth.sendSignedTransaction('0x' + serializedTx.toString("hex"),
            (err, txHash) => {
              console.log('txHash', txHash);
            })
        });

      });

      var collection = dbconn.db("item").collection('customer');
      collection.insertOne(arr).then(function (result) {
        console.log(result);
        res.redirect("/customer/select");
      })
    }
    dbconn.close(); //연결 닫기
  });
});

//127.0.0.1:3000/customer/select
router.get('/select', function (req, res, next) {
  MongoClient.connect('mongodb://localhost:27017/item', function (err, dbconn) {
    if (err) {
      console.log('error', err);
    }
    else {
      var collection = dbconn.db("item").collection('customer');
      //SELECT * FROM table1;
      //collection.find({}).toArr~~

      //SELECT id, pw FROM table1;
      //collection.find({}, {'projection':{id:1, pw:1}}).toArr~~

      //SELECT * FROM table1 LIMIT 5;
      //collection.find({}).limit(5).toArr~~

      //SELECT * FROM table1 ORDER BY id DESC LIMIT 3
      //collection.find({}).sort({id:-1}).limit(3).toArr~~

      //SELECT * FROM table1 WHERE age > 10
      //collection.find({ age : {$gt : 10} }).toArr~~
      collection.find({}).toArray(function (err, docs) {
        res.render("select_customer", { list: docs });
      })
    }
    dbconn.close(); //연결 닫기
  });
});

//127.0.0.1:3000/customer/delete?no=1
router.get('/delete', function (req, res, next) {
  var arr = { id: req.query.id };
  MongoClient.connect('mongodb://localhost:27017/item', function (err, dbconn) {
    if (err) {
      console.log('error', err);
    }
    else {
      var collection = dbconn.db("item").collection('customer');
      collection.deleteOne(arr).then(function (result) {
        console.log('delete : ', result);
        res.redirect("/customer/select");
      })
    }
    //dbconn.close();
  });
});


router.get('/update', function (req, res, next) {
  var id = req.query.id;
  var arr = { id: id };
  MongoClient.connect('mongodb://localhost:27017/item', function (err, dbconn) {
    if (err) {
      console.log('error', err);
    }
    else {
      var collection = dbconn.db("item").collection('customer');
      collection.find(arr).toArray(function (err, docs) {
        res.render("update_customer", { list: docs });
      });
    }
    dbconn.close();
  });

});

router.post('/update', function (req, res, next) {
  var a = req.body.id;
  var b = req.body.na;
  var c = req.body.ag;

  var arr = { id: a }; //조건
  MongoClient.connect('mongodb://localhost:27017/item', function (err, dbconn) {
    if (err) {
      console.log('error', err);
    }
    else {
      var collection = dbconn.db("item").collection('customer');
      collection.updateMany(arr,
        { $set: { name: b, age: c } }).then(function (result) {
          res.redirect("/customer/select");
        });
    }
    dbconn.close();
  });
});

module.exports = router;