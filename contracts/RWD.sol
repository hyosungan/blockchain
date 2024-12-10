pragma solidity ^0.5.0;

contract RWD{
    string public name='Reward Token';
    string public symbol='RWD';
    //1 million tokens, 18개의 0는 소수점을 의미하는 거라 빼고 생각
    uint256 public totalSupply=1000000000000000000000000;
    uint8 public decimals=18;
    //event는 발생시 블록체인 블록에 로그로 기록 남게 하는 친구임
    //indexed는 주소로 필터링해서 검색할 수 있음-인덱싱 할수있는 파라미터가 생기는 것
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint _value
    );
    //owner인 소유자가 승인하고 spender인 사용자에게 보냄
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint _value
    );
    //이 매핑은 각 계좌의 잔액 추적용-전송하거나 업데이트 할 때 꼭 필요한 부분
    mapping(address=> uint256) public balanceOf;

    //승인과 관련된 것(누가(A) 누구(B)에게 얼만큼의 A의 돈을 맘대로 써도 된다고 했는지 기록)
    mapping(address=>mapping(address=> uint256)) public allowance;

    constructor()public{
        balanceOf[msg.sender]=totalSupply; //처음 잔액은 총공급량과 같음
    }
    function transfer(address _to, uint256 _value) public returns (bool success){
        //보내는 사람 잔액이 보내려는 값보다 많이 있어야함.
        require(balanceOf[msg.sender]>= _value);
        balanceOf[msg.sender]-= _value; //메시지 발신자(본인잔액)은 전송할 값을 제외한 값이됨
        balanceOf[_to]+= _value; //받는 사람은 보내는 값이 더해짐
        emit Transfer(msg.sender,_to,_value); //Transfer event 함수 실행하는 곳
        return true;
    }

    //owner가 A에게 owner돈을 얼마나 지맘대로 해도 되는지 승인하는 거
    function approve(address _spender,uint256 _value)public returns (bool success){
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    //제 3자가 다른사람(짱구) 돈을 다른사람(철수)에게 전송하는 함수 
    function transferFrom(address _from,address _to, uint256 _value) public returns (bool success){
        require(_value <=balanceOf[_from]);
        require(_value <=allowance[_from][msg.sender]);
        balanceOf[_to]+= _value; //받는 사람은 보내는 값이 더해짐
        balanceOf[_from]-= _value;
        allowance[_from][msg.sender]-=_value; 
        emit Transfer(_from,_to,_value); //Transfer event 함수 실행하는 곳
        return true;
    }


}