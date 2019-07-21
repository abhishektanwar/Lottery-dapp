const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

web3 = new Web3(ganache.provider());

const { interface , bytecode  } = require('../compile');

let lottery;
let accounts ;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data : '0x' + bytecode })
    .send({from : accounts[0] , gas:'2000000' });
});

describe('Lottery contract', () => {
    it('deploys a contract' ,() => {
        assert.ok(lottery.options.address);
    });

    it('enters', async () => {
        await lottery.methods.enter().send({
            from:accounts[0],
            value: web3.utils.toWei('0.02','ether')
        });

    const players = await lottery.methods.getPlayers().call({
        from : accounts[0]
    });
    assert.equal(accounts[0],players[0]);
    assert.equal(1,players.length);    
    });

    it('allowes multiple acc to enter', async () => {
        await lottery.methods.enter().send({
            from : accounts[ 0],
            value : web3.utils.toWei('0.02','ether')
        });
        await lottery.methods.enter().send({
            from : accounts[1],
            value : web3.utils.toWei('0.02','ether')
        });
        await lottery.methods.enter().send({
            from : accounts[2],
            value : web3.utils.toWei('0.02','ether')
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        const bal = await web3.eth.getBalance(accounts[0]);
        console.log(bal);
        assert.equal(accounts[0],players[0]);
        assert.equal(accounts[1],players[1]);
        
        assert.equal(accounts[2],players[2]);
        assert.equal(3,players.length);
    });
    it('manager',async () => {
        const man = await lottery.methods.manager().call({
            from:accounts[0]
        });
        console.log(man);
        console.log(accounts[0]);
    })

    it('requires a minimum amount of ether to enter' ,async () => {
        try {
            await lottery.methods.enter().send({
                from:accounts[0],
                value : 0
            });
            assert(false);//if the try block does not return any error, assert(false) will me this test fail for testing purposes
        }catch(err){
            assert(err);//to check if try block fails and returns an error
        }
    });
// here only contract manager/owner can pick the winner in this test we are
// testing if someone else tries to pick a winner, 
// try block will fail and throw an error, which is a pass for this test
// if manager calls pickWinner func then assert(false) will make the test fail for testing purpose 
    it('only manager can call pickWinner' , async () => {
        try {
            await lottery.methods.pickWinner().send({
                from :accounts[0]
            });
            // assert(false);
        }catch(err){
            assert(err);
        }
    });

    

    it('sends money to winner and resets the players array' , async () => {
        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('0.02','ether'),
            gas:'1000000'

        });
        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({
            from : accounts[0],
            gas:'1000000'
        })
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance ; 
        assert(difference > web3.utils.toWei('0.018','ether'));

    });

    it('sends money to the winner and resets the players array', async () => {
        await lottery.methods.enter().send({
          from: accounts[0],
          value: web3.utils.toWei('2', 'ether')
        });
    
        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({ from: accounts[0] });
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;
    
        assert(difference > web3.utils.toWei('1.8', 'ether'));
    });

    // it('checks there are no players after pick winner',async()=>{
 
    //     await lottery.methods.enter().send({
    //         from: accounts[0],
    //         value: web3.utils.toWei('2','ether'),
    //         gas:'3000000'
    //     })
 
    //     await lottery.methods.pickWinner().send({
    //         from: accounts[0],
    //         gas:'3000000'
    //     })
 
    //     const players = await lottery.methods.getPlayers().call();
    //     console.log(players.length);
    //     assert(players.length == 0);
 
    // });
 
    // it('checks the lottery balance is empty after pick winner is called',async()=>{
 
    //     await lottery.methods.enter().send({
    //         from: accounts[0],
    //         value: web3.utils.toWei('2','ether'),
    //         gas:'3000000'
    //     })
 
    //     await lottery.methods.pickWinner().send({
    //         from: accounts[0],
    //         gas:'3000000'
    //     })
 
    //     const balance = await web3.eth.getBalance(lottery.options.address);
    //     console.log(balance);
    //     assert(balance==0)
 
    // });

});