import Web3 from 'web3';

const web3 = new Web3(window.web3.currentProvider);
// const web3 = new Web3('https://rinkeby.infura.io/v3/bb040abf2e0140bb9885ae3d83c37238');
// window.web3 is the instance of web3 injected by metamsk in browser
// currentProvider is rinkeby or any other network

export default web3;

