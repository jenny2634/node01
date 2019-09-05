pragma solidity >=0.4.22 < 0.6.0;

contract customer{
    
    string public id = "customer id";
    string public na = "customer name";
    uint256 ag = 26;
    
    constructor(string memory _id, string memory _na, uint256 _ag) public {
        id = _id;
        na = _na;
        ag = _ag;
    }
    
    function setId(string memory _id) public{
        id = _id;
    }

    
    function getId() public view returns(string memory){
        return id;
    }
    
      function setName(string memory _na) public{
        na = _na;
       
    }
   
    
    function getName() public view returns(string memory){
        return na;
    }
    
      function setAge(uint256 _ag) public{
        ag = _ag;
    }
    
    function getAge() public view returns(uint256){
        return ag;
    }
    
    function setJoin(string memory _id, string memory _na, uint256 _ag) public{
        id = _id;
        na = _na;
        ag = _ag;
    }

}