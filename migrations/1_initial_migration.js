// const Migrations=artifacts.require("Migrations")
const Migrations=artifacts.require("Migrations");
//Migrations.sol 파일의 계약인 Migrations
module.exports=function(deployer){
    deployer.deploy(Migrations);
};