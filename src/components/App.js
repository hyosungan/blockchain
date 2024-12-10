import React,{Component} from 'react'
import './App.css'
import Navbar from './Navbar';
import Main from './Main.js';
import Web3 from 'web3';
import Tether from '../contracts/Tether.json';
import RWD from '../contracts/RWD.json';
import DecentralBank from '../contracts/DecentralBank.json';


class App extends Component {

    async UNSAFE_componentWillMount(){  //렌더링하기전에 최우선으로 불러오게함
        await this.loadWeb3()   //메타마스크 연결
        await this.loadBlockchainData() //계좌 데이터 연결
    }

    async loadWeb3(){
        if(window.ethereum){//윈도우 창에서 이더리움이 감지되었을때
            window.web3=new Web3(window.ethereum)
            await window.ethereum.enable() //이더리움 활성화
    } else if(window.web3){
        window.web3=new Web3(window.web3.currentProvider)
    } else{
        window.alert('No ethereum browser detected! check out Metamask!')
    }
}
    async loadBlockchainData(){
        const web3=window.web3
        const account=await web3.eth.getAccounts()  //블록체인 데이터에서 계좌불러옴
        this.setState({account: account[0]})
        const networkId=await web3.eth.net.getId()  //네트워크 ID 가져옴

        //테더 계약 불러오기
        const tetherData= Tether.networks[networkId]
        if(tetherData){
            const tether=new web3.eth.Contract(Tether.abi, tetherData.address)//abi, 주소 가져옴
            this.setState({tether})//상태 업데이트
            let tetherBalance=await tether.methods.balanceOf(this.state.account).call()//잔액 정보 가져옴
            this.setState({tetherBalance: tetherBalance.toString()})

        }else{
            window.alert('Error! Tether token not deployed to the nework!')
        }

        //리워드 계약 불러오기
        const rwdData= RWD.networks[networkId]
        if(rwdData){
            const rwd=new web3.eth.Contract(RWD.abi, rwdData.address)//abi, 주소 가져옴
            this.setState({rwd})//상태 업데이트
            let rwdBalance=await rwd.methods.balanceOf(this.state.account).call()//잔액 정보 가져옴
            this.setState({rwdBalance: rwdBalance.toString()})

        }else{
            window.alert('Error! RWD token not deployed to the nework!')
        }

        //decentralbank 계약 불러오기
        const decentralBankData= DecentralBank.networks[networkId]
        if(decentralBankData){
            const decentralBank=new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)//abi, 주소 가져옴
            this.setState({decentralBank})//상태 업데이트
            let stakingBalance=await decentralBank.methods.stakingBalance(this.state.account).call()//잔액 정보 가져옴
            this.setState({stakingBalance: stakingBalance.toString()})

        }else{
            window.alert('Error! Decentral Bank token not deployed to the nework!')
        }


        this.setState({loading: false}) //로딩 다했으면 false로 바꿈
    }

    //Decentralbank.sol의 deposit 함수와 unstaking함수 쓰기 위함
    //아래는 staking을 위한 것
    //staking함수는 decentralbank.depositTokens함수에 트랜잭션 해시를 보내야함
    //depositTokens의 transferFrom을 호출..
    //이를 위해 승인을 받아야함(approve)

    //staking function
    stakeTokens=(amount)=>{
        this.setState({loading: true})
        this.state.tether.methods.approve(this.state.decentralBank._address,amount).send({from: this.state.account}).on('transactionHash',(hash)=>{})
        this.state.decentralBank.methods.depositToken(amount).send({from: this.state.account}).on('transactionHash',(hash)=>{
            this.setState({loading: false})

        })
        // console.log(this.state.decentralBank.address.toString())
    }

    //unstaking function
    unstakeTokens=()=>{
        this.setState({loading: true})
        
        this.state.decentralBank.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash',(hash)=>{
            this.setState({loading: false})

        })
    }

    constructor(props) {
        super(props)
        this.state = {
            account: '0x0', //default
            tether: {},
            rwd: {},
            decentralBank:{},
            tetherBalance: '0',
            rwdBalance:'0',
            stakingBalance:'0',
            loading: true//로딩창용

        }
    }
    
    //리액트 코드 작성
    //main role은 메인에 액세스 한다는 뜻-이것을 통해 메인 파라미터 사용 가능
    render(){
        let content
        {this.state.loading ? content=
        <p id='loader' className='text-center' style={{margin: '30px'}}>
        LOADING PLEASE...</p> :content=
        <Main
        tetherBalance={this.state.tetherBalance}
        rwdBalance={this.state.rwdBalance}
        stakingBalance={this.state.stakingBalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
        />}
        return (
            <div>
                <Navbar account={this.state.account}/>
                <div className='container-fluid mt-5'>
                    <div className='row'>
                        <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth:'600px',minHeight:'100vm'}}>
                            <div>
                                {content}
                            </div>
                        </main>
                    </div>
                    
                </div>
            </div>
        )    
    }
}

export default App;