import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import web3 from './web3';
// import web3 from 'web3';
import lottery from './lottery';
// import {abi,address} from './lottery';

// import Web3 from 'web3';
 
// class App extends Component {
//   componentWillMount() {
//     this.loadBlockchainData()
//   }
//   async loadBlockchainData() {
  
//     // this.setState({manager:manager});
//     const web3 = new Web3(Web3.givenProvider || "https://localhost:8545");
//     // const network = await web3.eth.net.getNetworkType()
//     const accounts = await web3.eth.getAccounts()
    
//     const lott = new web3.eth.Contract(abi,address)
//     const manager = await lott.methods.manager().call();

//     console.log("lottery conttract" , lott)
//     console.log(manager)
//     this.setState({account:accounts[0],manager:manager})
//   }

//   constructor(props) {
//     super(props)

//     this.state = {account : '',manager:''}
//   }

// // componentDidMount method is automatically called whenever(after) the component is rendered on screen
  

//   render(){
//     // console.log(web3.version);
//     // web3.eth.getAccounts().then(console.log);
//   return (
//     <div>
//       <h2>
//         Lottery Contract
//       </h2>
//       <p>this contract is managed by : {this.state.manager} </p> 
//     </div>
//   );
// }}


class App extends Component {

  constructor(props){
    super(props);
    this.state = {manager:'',players:[],value:'',message:'',balance:''};
  }

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players= await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({manager:manager,players:players,balance:balance});
  }
  // async loadBlockchainData() {
  
  //   // this.setState({manager:manager});
  //   const web3 = new Web3(Web3.givenProvider || "https://localhost:8545");
  //   // const network = await web3.eth.net.getNetworkType()
  //   const accounts = await web3.eth.getAccounts()
    
  //   const lott = new web3.eth.Contract(abi,address)
  //   const manager = await lott.methods.manager().call();

  //   console.log("lottery conttract" , lott)
  //   console.log(manager)
  //   this.setState({account:accounts[0],manager:manager})
  // }

  // constructor(props) {
  //   super(props)

  //   this.state = {account : '',manager:''}
  // }

// componentDidMount method is automatically called whenever(after) the component is rendered on screen
  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    this.setState({message:'waiting on transaction success....'});
    await lottery.methods.enter().send({
      from : accounts[0],
      value : web3.utils.toWei(this.state.value,'ether')
    });
    this.setState({message:'Your have been entered!'});
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({message:'Waiting on transaction success ....'})
    await lottery.methods.pickWinner().send({
      from:accounts[0]
    });
    this.setState({message:'a winner has been picked'});
  };

  render(){
    // console.log(web3.version);
    // web3.eth.getAccounts().then(console.log);
  return (
    <div>
      <h2>
        Lottery Contract
      </h2>
      <p>This contract is managed by {this.state.manager}.
        There are currently {this.state.players.length} people entered,
        competing to win {web3.utils.fromWei(this.state.balance,'ether')} ether!
       </p> 

       <hr />

       <form onSubmit={this.onSubmit}>
         <h4>Want to try your luck??</h4>
          <div>
            <label>Amount of ether to enter</label>
            
            <input value={this.state.value} onChange={event => this.setState({value:event.target.value})}/>
          </div>
          <button>Enter</button>
       </form>
       <hr />
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>
       <hr/>
       <h1>{this.state.message}</h1>
    </div>
  );
}}


 
export default App;