pragma solidity >=0.4.22 < 0.6.0;

contract helloworld{
    
    string public var1 = "hello world";
    
    constructor(string memory _var1) public {
        var1 = _var1;
    }
    
    function setString(string memory _var1) public{
        var1 = _var1;
    }
    
    function getString() public view returns(string memory){
        return var1;
    }
}