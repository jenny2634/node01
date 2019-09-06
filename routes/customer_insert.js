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
        res.render("insert_customer", { CA: 'CA', CA: docs[0].CA });

      });
    }
  });

});

router.post('/insert', function (req, res, next) {
  var a = req.body.id;
  var b = req.body.na;
  var c = req.body.ag;

  

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

        var arr = { "id": a, "name": b, "age": c ,"CA":CA,"ABI":ABI};
        console.log(arr);

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

        var collection = dbconn.db("item").collection('customer');
      collection.insertOne(arr).then(function (result) {
        console.log(result);
        res.redirect("/customer/select");
        dbconn.close(); //연결 닫기
      })

      });

      
    }
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
      collection.updateMany(arr,
        { $set: { name: b, age: c } }).then(function (result) {
          res.redirect("/customer/select");
        });


    }
    dbconn.close();
  });
});

//127.0.0.1:3000/customer/send
router.get('/send', function (req, res, next) {
  // 보냄 1
  var EOA1 = '0x9d7081530BDcCE281e268462dED617a209e17De8';
  var EOA1_PRIVATE_KEY = 'd0fad395469f939946bfd6717e12839c04eb62be6b1b943ebf73644cbf87fc94';

  // 받음2
  var EOA2 = '0xB649F426cc60468a00Eb52C603a5D1d5Fee43468';

  const Gwei = 9;
  const unit = 10 ** Gwei;
  const gasLimit = 21000;
  const gasPrice = 21 * unit;

  // 미해결, 계류 중인 것이 있는지 확인
  w3.eth.getTransactionCount(EOA1, "pending", (err, nonce) => {
    let allEth = 50000000000;

    let rawTx = {
      nonce: nonce, /* 채굴 난이도 */
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      value: allEth,
      from: EOA1,
      to: EOA2
    }

    // 개인키 16진수로 변경함.
    var privateKey = new Buffer.from(EOA1_PRIVATE_KEY, "hex");

    var tx = new Tx(rawTx); // Tx 객체 생성
    tx.sign(privateKey); // 개인키로 서명

    let serializedTx = tx.serialize();

    w3.eth.sendSignedTransaction("0x" + serializedTx.toString("hex"),
      (err, txhash) => {
        if (!err) {
          console.log(txhash);
          w3.eth.getBalance(EOA1, (err, balanceOfEOA1) => {
            console.log("EOA1 balance :", balanceOfEOA1);

          });
          w3.eth.getBalance(EOA2, (err, balanceOfEOA2) => {
            console.log("EOA2 balance :", balanceOfEOA2);
          });
        }
        else {
          console.log(err);
        }
      })
  });
  res.redirect("/customer/select");
});

router.get('/admin', function (req, res, next) {
  MongoClient.connect('mongodb://localhost:27017/item', function (err, dbconn) {
    if (err) {
      console.log('error', err);
    }
    else {
      var collection = dbconn.db("item").collection('customer');
      collection.find({}).toArray(function (err, docs) {
        res.render("admin_list", { list: docs });
      })
    }
    dbconn.close(); //연결 닫기
  });
});

router.get('/info_list', function (req, res, next) {
  MongoClient.connect('mongodb://localhost:27017/item', function (err, dbconn) {
    if (err) {
      console.log('error', err);
    }
    else {

      var id = req.query.id;
  
      var collection = dbconn.db("item").collection('customer');
      collection.find({}).toArray(function (err, docs) {
       
        res.render("info_list", { list: docs, id:id});
            
      })

    }
    dbconn.close(); //연결 닫기
  });
});




module.exports = router;