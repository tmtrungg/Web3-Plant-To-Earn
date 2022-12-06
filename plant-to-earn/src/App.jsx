import web3 from './web3';
import './App.css';
import { useState, useEffect } from 'react';import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import AttendBoard from './components/attend/AttendBoard';
import OwnerView from './components/owner/OwnerView';
import Plant from './ultis/Plant';

const App = () => {
  
  const [owner,setOwner] = useState('');
  const [winner,setWinner] = useState('');
  const [account,setAccount] = useState('');
  const [message, setMessage] = useState('');
  const [ended,setEnded] = useState('');
  const [teamname0, setTeamname0] = useState('');
  const [teamname1, setTeamname1] = useState('');
  const [teamname2, setTeamname2] = useState('');
  const [teamslot0, setTeamnslot0] = useState('');
  const [teamslot1, setTeamnslot1] = useState('');
  const [teamslot2, setTeamnslot2] = useState('');

  useEffect(() => {
    async function asyncCalls() {
      await Plant.methods.owner().call().then(result => setOwner(result));
      console.log(owner);
      await web3.eth.getAccounts().then(result => setAccount(result));
      await Plant.methods.ended().call().then(result => setEnded(result));
      await Plant.methods.winner().call().then(result => setWinner(result));

      await Plant.methods.TeamsName(0).call().then(result => setTeamname0(result));
      await Plant.methods.TeamsName(1).call().then(result => setTeamname1(result));
      await Plant.methods.TeamsName(2).call().then(result => setTeamname2(result));
      await Plant.methods.ViewSlotLeft(0).call().then(result => setTeamnslot0(result));
      await Plant.methods.ViewSlotLeft(1).call().then(result => setTeamnslot1(result));
      await Plant.methods.ViewSlotLeft(2).call().then(result => setTeamnslot2(result));
      console.log(teamname2);
    }
    asyncCalls();
  }, [])
  const onAttend = async (value) => {
    const accounts = await web3.eth.getAccounts(); 
    setMessage('Waiting for the transaction to be mined...');
    await Plant.methods.Attend(value).send({from: accounts[0],value: 15});
  }

  const onEnd = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts(); 
    setMessage('Waiting for the transaction to be mined...');
    await Plant.methods.EndGame().send({from: accounts[0]});
    setMessage('The registration is closed');
  }

  const onWinner = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts(); 
    setMessage('Waiting for the transaction to be mined...');
    await Plant.methods.SelectWinner().send({from: accounts[0]});
    setMessage('You have been entered into planning at $');
  }

  const onWithdraw = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts(); 
    setMessage('Waiting for the transaction to be mined...');
    await Plant.methods.WithdrawFund().send({from: accounts[0]});
    setMessage('You have been entered into planning at $');
  }

  return (
    <div className='App'>
      <Header account = {account}/>
      <div className='title'>Plan to Earn</div>
      
    {/* If the donation is ended? */}
    {ended === true ? 
      <div>
        {/* If the winner is selected already, announce the winning team and let player withdraw */}
        {parseInt(winner) !== 99 ?
        <div>
          <div style={{margin:'auto',fontSize:'2rem'}}>Winner Team is team: {winner}. If you're in the winning team:</div> 
          <div className='btn btn-primary' onClick = {onWithdraw}>Withdraw reward</div>
        </div>
        :
        /* If the winner is not selected, and if the user is not owner, announce user to wait, if owner display normal owner screen */
        <div>{account[0] === owner ? 
          <OwnerView onEnd={onEnd} onWinner={onWinner}/>
            : 
            <div style={{margin:'auto',fontSize:'2rem'}}>The donation is over, please wait for the next announcement</div>}
        </div>
        }
      </div>
        :
        /* If the donation is not ended, display appropriate content based on user role (of owner or normal player) */
        <div>
          {account[0] === owner ? 
            <OwnerView onEnd={onEnd} onWinner={onWinner}/>
            :
            <AttendBoard onAttend={onAttend}/>
          }
          <div>Team 0 - {teamname0}: {teamslot0} slot(s) left</div>
          <div>Team 1 - {teamname1}: {teamslot1} slot(s) left</div>
          <div>Team 2 - {teamname2}: {teamslot2} slot(s) left</div>
        </div>
    }
      <Footer/>
    </div>
  );
}

export default App;
