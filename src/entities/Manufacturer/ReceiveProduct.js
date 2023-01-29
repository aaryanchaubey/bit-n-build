import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Loader from '../../components/Loader';
import RawMaterial from '../../build/RawMaterial.json';
import Transactions from '../../build/Transactions.json';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export default function ReceiveProduct(props) {
  const classes = useStyles();
  const [account] = useState(props.account);
  const [web3, setWeb3] = useState(props.web3);
  const [address, setAddress] = useState("");
  const [supplyChain] = useState(props.supplyChain);
  const [loading, isLoading] = useState(false);

  const handleInputChange = (e) => {
    setAddress(e.target.value);
  }

  async function verifySignature(sellerAddress, signature) {
    let v = '0x' + signature.slice(130, 132).toString();
    let r = signature.slice(0, 66).toString();
    let s = '0x' + signature.slice(66, 130).toString();
    let messageHash = web3.eth.accounts.hashMessage(address);
    let verificationOutput = await supplyChain.methods.verify(sellerAddress, messageHash, v, r, s).call({from: account});
    
    return verificationOutput;
  }

  async function handleSubmit() {
    let rawMaterial = new web3.eth.Contract(RawMaterial.abi, address);
    let data = await rawMaterial.methods.getSuppliedRawMaterials().call({from: account});
    let events = await supplyChain.getPastEvents('sendEvent', {filter: {packageAddr: address}, fromBlock: 0, toBlock: 'latest'});
    events = events.filter((event) => {
      return event.returnValues.packageAddr == address;
    });

    console.log(events);
    let supplier = data[3];
    let signature = events[0]['returnValues'][3];
    let verificationOutput = await verifySignature(supplier, signature);
    if(verificationOutput) {
      alert('Signature verified');
      supplyChain.methods.manufacturerReceivedPackage(address, account, supplier, signature).send({from: account})
        .once('receipt', async (receipt) => {
          let txnContractAddress = data[6];
          let transporterAddress = data[4];
          let txnHash = receipt.transactionHash;
          const transactions = new web3.eth.Contract(Transactions.abi, txnContractAddress);
          let txns = await transactions.methods.getAllTransactions().call({from: account});
          let prevTxn = txns[txns.length - 1][0];
          transactions.methods.createTxnEntry(txnHash, transporterAddress, account, prevTxn, '10', '10').send({from: account});
        });
    }
  }

  if (loading) { 
    return (
      <div>
        <p>Package with address <b>{address}</b> received!</p>
      </div>
    );
  }

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField id="address" label="Package Address" variant="outlined" onChange={ handleInputChange }/><br></br>
      <Button variant="contained" color="primary" onClick={ handleSubmit } >
        Submit
      </Button>   
    </form>
  );
} 