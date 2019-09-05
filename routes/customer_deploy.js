var express = require('express');
var router = express.Router();

// npm install web3 --save <= rpc 서버 접속
var Web3 = require('web3');

var MongoClient = require("mongodb").MongoClient;

// npm install solc --save <= 솔리디티 코드 컴파일
const solc = require('solc');

const path = require('path'); // 파일 경로 설정
const fs = require('fs'); // 파일의 내용읽기
const Tx = require('ethereumjs-tx').Transaction

const CONTRACT_FILE = "customer.sol";
const filepath = path.join(__dirname, '../sol', CONTRACT_FILE);
// console.log(filepath);
const content = fs.readFileSync(filepath, 'UTF-8').toString();

var input = {
	language: 'Solidity',
	sources: {
		[CONTRACT_FILE]: {
			content: content
		}
	},
	settings: {
		outputSelection: {
			'*': {
				'*': ['*']
			}
		}
	}
}

var complied = solc.compile(JSON.stringify(input));
var output = JSON.parse(complied);
//console.log(output);

var abi = output.contracts[CONTRACT_FILE]['customer'].abi;
var bytecode = output.contracts[CONTRACT_FILE]['customer'].evm.bytecode.object;

var w3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));


var contract = new w3.eth.Contract(abi);


contract.deploy({
	data: '0x' + bytecode,
	arguments: ['ID', 'NAME', 1004]
}).send({
	from: '0x87dE62AE9322c1d98939848a74426e15b73AFeB1',
	gas: 1500000,
	gasPrice: '3000000000'
}, function (err, txHash) {
	console.log(txHash);
}).on('receipt', function (receipt) {
	console.log('CA : ', receipt.contractAddress);
	var ABI = abi;
	var CA = receipt.contractAddress;
	var get_contract = new w3.eth.Contract(ABI, CA);


	get_contract.methods.getId().call().then(data => {
		console.log('id : ', data);
	});
	get_contract.methods.getName().call().then(data => {
		console.log('name : ', data);
	});
	get_contract.methods.getAge().call().then(data => {
		console.log('age : ', data);
	});

	var arr = {ABI :ABI, CA:CA};
	MongoClient.connect('mongodb://localhost:27017/item', function (err, dbconn) {
        if (err) {
          console('err', err)
        } else {
          var collection = dbconn.db("item").collection('abi');
          collection.insertOne(arr).then(function (err) {
            console.log('insert ABI, CA ok')
          });
        }
    })

});

module.exports = router;