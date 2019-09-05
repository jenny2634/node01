var express = require('express');
var router = express.Router();

//npm install web3 --save
var web3 = require('web3');

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

//var CA = '0x5da06015e24338003b2bb7d1478c543e88c0c85e';

var ABI =[
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
		"name": "get_num",
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

// Contract.methods.run().call().then(data => {
//     console.log('var1의 값 : ', data);
// });

Contract.methods.get_num().call().then(data => {
    console.log("index의 값 : " , data);
})

module.exports = router;