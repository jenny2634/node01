var express = require('express');
var router = express.Router();


// npm install web3 --save
const Web3 = require('web3');

// npm install ethereumjs-tx --save
const Tx = require('ethereumjs-tx').Transaction;

var w3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

// 보냄
var EOA1 = '0x4D468a5384b8D09D153FB6be8E4b086eAC8B0438';
var EOA1_PRIVATE_KEY = 'aba592a1703fecf2971623d318ed3d41cde93094eff11cc43909902220b92005';

// 받음
var EOA2 = '0xD7d5F0222765cF9B92f5D62a3daAf4a16c581669';

const Gwei = 9;
const unit = 10 ** Gwei;
const gasLimit = 21000;
const gasPrice = 21 * unit;

// 미해결, 계류 중인 것이 있는지 확인
w3.eth.getTransactionCount(EOA1, "pending", (err,nonce) => {
   let allEth = 50000000000;

   let rawTx = {
      nonce : nonce, /* 채굴 난이도 */
      gasPrice : gasPrice,
      gasLimit : gasLimit,
      value : allEth,
      from : EOA1,
      to : EOA2
   }

// 개인키 16진수로 변경함.
   var privateKey = new Buffer.from(EOA1_PRIVATE_KEY, "hex");

   var tx = new Tx(rawTx); // Tx 객체 생성
   tx.sign(privateKey); // 개인키로 서명

   let serializedTx = tx.serialize();

   w3.eth.sendSignedTransaction("0x" + serializedTx.toString("hex"),
      (err, txhash) => {
         if(!err) {
			console.log(txhash);
			w3.eth.getBalance(EOA1, (err, balanceOfEOA1) => {
				console.log("EOA1 balance :" , balanceOfEOA1);

			});
			w3.eth.getBalance(EOA2, (err, balanceOfEOA2) => {
				console.log("EOA2 balance :" , balanceOfEOA2);
			});
         }
         else {
            console.log(err);
         }
   })
});

module.exports = router;