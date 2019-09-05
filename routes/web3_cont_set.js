var express = require('express');
var router = express.Router();

//npm install web3 --save
var web3 = require('web3');

//npm install ethereumjs-tx --save
const Tx = require('ethereumjs-tx').Transaction

var w3 = new web3(new web3.providers.HttpProvider("http://localhost:7545"));

// var ABI = [
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "var1",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "string"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "_var1",
//                 "type": "string"
//             }
//         ],
//         "name": "setString",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "run",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "string"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     }
// ]
var ABI= [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "set_num",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getnum",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]
var CA = '0xe708b11959b872314732ff12fa184593ced1a78b';

const Contract = new w3.eth.Contract(ABI, CA);

var EOA1 = '0x87dE62AE9322c1d98939848a74426e15b73AFeB1';
var PRIVATE_KEY = '8dd52bd0dd57067573ecf3088b61e3ce6283c5633ff3a5749af8e4d049f3c56c';

// var setStringExec = Contract.methods.setString("change hello world");
// var setStringByteCode = setStringExec.encodeABI();

var setNumExec = Contract.methods.set_num(30);
var setStringByteCode = setNumExec.encodeABI();

const Gwei = 9;
const unit = 10 ** Gwei;
const gasLimit = 221000;
const gasPrice = 21* unit;

w3.eth.getTransactionCount(EOA1, "pending", (err, nonce) => {
    var rawTx = {
        nonce : nonce,
        gasPrice : gasPrice,
        gasLimit : gasLimit,
        data : setStringByteCode,
        from : EOA1,
        to : CA
    }
    let privateKey = new Buffer.from(PRIVATE_KEY, "hex");
    let tx = new Tx(rawTx);
    tx.sign(privateKey);

    let serializedTx = tx.serialize();
    w3.eth.sendSignedTransaction('0x' + serializedTx.toString("hex"),
    (err,txHash)=>{
        console.log('txHash', txHash);
    })
});


module.exports = router;