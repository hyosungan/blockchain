const Tether=artifacts.require('Tether')
const RWD=artifacts.require('RWD')
const DecentralBank=artifacts.require('DecentralBank')

require('chai')
.use(require('chai-as-promised'))
.should

contract('DecentralBank',([owner,customer]) =>{
    let tether, rwd, decentralBank

    function tokens(number){
        return web3.utils.toWei(number,'ether')
    }

    before(async ()=>{
        //계약 가져옴
        tether=await Tether.new()
        rwd=await RWD.new()
        decentralBank=await DecentralBank.new(rwd.address, tether.address)

        //모든 토큰 은행에 옮기는거 테스트
        await rwd.transfer(decentralBank.address, tokens('1000000'))

        //100개 테더 투자자에게 전송하는거
        await tether.transfer(customer, tokens('100'),{from: owner})

    })//여기 넣은 것은 테스트 이전, describe이전에 실행됨


    //테스트에 돌릴 코드 입력하는 곳
    describe('Tether Deployment',async ()=>{
        it('matches name successfully', async ()=>{
            const name=await tether.name()
            assert.equal(name,'Tether')
        })
    })

    describe('Rewark Token Deployment',async ()=>{
        it('matches name successfully', async ()=>{
            const name=await rwd.name()
            assert.equal(name,'Reward Token')
        })
    })

    describe('Decentral Bank Deployment',async ()=>{
        it('matches name successfully', async ()=>{
            const name=await decentralBank.name()
            assert.equal(name,'Decentral Bank')
        })
        it('contract has tokens',async ()=>{
            let balance= await rwd.balanceOf(decentralBank.address)
            assert.equal(balance,tokens('1000000'))
        })
    })

    describe('Yield Farming', async ()=> {
        it('rewards tokens for staking', async ()=>{
            //투자자의 잔액 체크
            let result= await tether.balanceOf(customer)
            assert.equal(result.toString(), tokens('100'),'customer mock wallet balance before staking')
        
            //고객(2번째 계정)이 받았던 100개 토큰 전부 은행에 보내고 staking 체크
            await tether.approve(decentralBank.address,tokens('100'), {from:customer}) //승인먼저 받아야함
            await decentralBank.depositToken(tokens('100'),{from: customer})

            //남은 고객의 잔액 체크
            result= await tether.balanceOf(customer)
            assert.equal(result.toString(), tokens('0'),'customer mock wallet balance after staking 100 tokens')

            //은행에 있는 잔액 체크
            result= await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(), tokens('100'),'decentral bank mock wallet balance after staking from customer')

            //Isstaking 체크
            result= await decentralBank.isStaking(customer)
            assert.equal(result.toString(), 'true','customer isStaking status after staking')

            //issue tokens(토큰 발행 테스트))
            await decentralBank.issueTokens({from: owner})
            
            //소유자만 토큰 발행할 수 있다. 투자자는 안되!
            // 이 코드 안되서 아래로 바꿈. await decentralBank.issueTokens({from: customer}).should.be.rejected;
            try {
                await decentralBank.issueTokens({from: customer});
                assert.fail('Customer should not be able to issue tokens');
            } catch (error) {
                assert(error.message.includes('caller must be owner'), 'Expected revert error for unauthorized call');
            }

            //unstake tokens
            await decentralBank.unstakeTokens({from: customer})

            //언스테이킹 하고 난뒤 잔액 체킹
            result= await tether.balanceOf(customer)
            assert.equal(result.toString(), tokens('100'),'customer mock wallet balance after unstaking')

            //은행에 있는 잔액 체크
            result= await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(), tokens('0'),'decentral bank mock wallet balance after staking from customer')

            //is staking update
            result= await decentralBank.isStaking(customer)
            assert.equal(result.toString(), 'false','customer is no longer Staking status after unstaking')

            
    })
})

    
})