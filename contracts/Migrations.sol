pragma solidity ^0.5.0;

contract Migrations{
    address public owner;
    uint public last_completed_migration;

    constructor() public {
        owner=msg.sender;
    }
    modifier restricted(){
        if(msg.sender==owner) _;
    }
    function setCompleted(uint completed) public restricted{
        last_completed_migration=completed;
    }
    function upgrade(address new_address) public restricted{
        Migrations upgraded=Migrations(new_address);
        upgraded.setCompleted(last_completed_migration);
    }

}

//함수를 set_completed 이런식으로 정하면 truffle이전할때 해당함수를 찾지 못함. 낙타표기법으로 지어야함.