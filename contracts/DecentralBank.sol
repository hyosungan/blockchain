pragma solidity ^0.5.0;
import './RWD.sol';
import './Tether.sol';
contract DecentralBank{
    string public name='Decentral Bank';
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers;
    //스테이킹 한 사람들의 주소를 저장하기 위한용도

    mapping(address=> uint) public stakingBalance;
    //계좌별로 얼마 예금했는지 저장하기 위한 것

    mapping(address=> bool) public hasStaked;
    //스테이킹 이력(한 적 있는지)

    mapping(address=> bool) public isStaking;
    //스테이킹 진행 여부(하고 있는지)
    
    constructor(RWD _rwd, Tether _tether) public{
        rwd= _rwd;
        tether= _tether;
        owner=msg.sender;
    }

    //staking 함수
    function depositToken(uint _amount) public {
        require(_amount > 0,'amount cannot be 0');

        //전송할 테더 토큰을 이 계약의 주소로 보냄(staking을 위해)
        tether.transferFrom(msg.sender, address(this), _amount);
        //from: 호출하는 사람 to:이 계약 주소, value: amount

        //예금액 업데이트
        stakingBalance[msg.sender]+= _amount;

        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }
        //업데이트
        isStaking[msg.sender]=true;
        hasStaked[msg.sender]=true;
    }

    //unstake tokens=>예금 출금 기능
    function unstakeTokens() public {
        uint balance=stakingBalance[msg.sender];
        require(balance>0,'staking balance can\'t be less than 0');
        //정해진 주소로 일정량의 토큰을 전송(지금은 전부 빼고록 코딩함)
        tether.transfer(msg.sender, balance);

        //출금한뒤 계좌 업데이트
        stakingBalance[msg.sender]=0;

        //staking status(상태) 업데이트
        isStaking[msg.sender]=false;
    }

    //issue reward 스테이킹 이자
    function issueTokens() public {
        //owner만 발행할 수 있음
        require(msg.sender==owner,'caller must be owner');

        for(uint i=0; i<stakers.length;i++){
            address recipient=stakers[i];
            uint balance=stakingBalance[recipient] / 9;
            if(balance>0){
            //스테이킹 한거에 9분의 1만큼 그 사람에게 리워드 전송
            rwd.transfer(recipient, balance);
            }
            
        }
    }
}