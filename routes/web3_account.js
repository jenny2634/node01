var express = require('express');
var router = express.Router();

var web3 = require('web3');

var w3 = new web3(new web3.providers.HttpProvider("http://localhost:7545"));
var ws3 = new web3(new web3.providers.WebsocketProvider("ws://localhost:7545"));

//account읽기
w3.eth.getAccounts(function(error, result){
    console.log("account list: ", result);
    
    for(var i=0; i<result.length ; i++){
        console.log(result[i]);
        w3.eth.getBalance(result[i],(err,balanceOf)=>{
            console.log("balance : ", balanceOf);
        });
    }
    // //0번에서 5번으로 10000전송함
    // w3.eth.sendTransaction({from:result[0], to:result[5], value:10000},(err, txHash)=>{
    //     console.log(txHash);
    // })
     //0번에서 10번으로 10000전송함
     w3.eth.sendTransaction({from:result[0], to:result[10], value:10000},(err, txHash)=>{
        console.log(txHash);
    })
    
});


// //account 생성/ 암호:p
// w3.eth.personal.newAccount('p', (err,createAddress)=>{
//     if(!err){
//         console.log("account address : ", createAddress);
//     }
// });


//계정 생성 - rpc 서버에 나타나지 않음
let{ address, privatekey } = w3.eth.accounts.create();


module.exports = router;