const Tether=artifacts.require('Tether')
const RWD=artifacts.require('RWD')
const DecentralBank=artifacts.require('DecentralBank')
//Migrations.sol 파일의 계약인 Migrations
module.exports=async function(deployer, network, accounts){
    //Tether계약 배포하기
    await deployer.deploy(Tether)
    const tether=await Tether.deployed()    //테더 계약 전부 가져와서 변수에 저장
    //RWD계약 배포하기
    await deployer.deploy(RWD)
    const rwd=await RWD.deployed()
    
    //DecentralBank 계약 배포하기
    await deployer.deploy(DecentralBank, rwd.address, tether.address)
    const decentralBank=await DecentralBank.deployed()
    //모든 리워드 토큰을 은행으로 보내기
    await rwd.transfer(decentralBank.address,'1000000000000000000000000')

    //테더를 처음 계약 만들어지자마자 나 이외에 첫번째 계정에게 100개 전송
    await tether.transfer(accounts[1],'100000000000000000000')
};