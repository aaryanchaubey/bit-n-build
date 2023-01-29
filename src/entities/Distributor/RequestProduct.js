import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {NavLink, withRouter, BrowserRouter as Router, Route} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function RequestProductDistributor(props) {
  const [account] = useState(props.account);
  const [web3, setWeb3] = useState(props.web3);
  const [supplyChain] = useState(props.supplyChain);
  const [loading, isLoading] = useState(false);
  const [medicineAddress, setmedicineAddress] = useState("");
  const [wholesalerAddress, setwholesalerAddress] = useState("");
  const [signature, setSignature] = useState("");

  const classes = useStyles();

  const handleInputChange = (e) => {
    if (e.target.id === 'medicineAddress') {
        setmedicineAddress(e.target.value);     
    } else if(e.target.id === 'wholesalerAddress') {
        setwholesalerAddress(e.target.value);     
    } else if(e.target.id === 'signature') {
        setSignature(e.target.value);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    isLoading(true);
    supplyChain.methods.requestProduct(account, wholesalerAddress, medicineAddress, signature).send({ from: account })
    .once('receipt', async (receipt) => {
        alert('Request Made to Wholesaler!');
        console.log(receipt);
        isLoading(false);
    })
  }

  return (
    <Grid container style={{ backgroundColor: "white", display: "center", alignItems: "center", maxWidth: 400, justify: "center"}}>
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          
          <Typography component="h1" variant="h5">Enter Package To be Requested</Typography>
          <form className={classes.form} noValidate>
          <Grid container spacing={2}>

            <Grid item xs={12}>
                <TextField variant="outlined" onChange={ handleInputChange } required fullWidth  id="medicineAddress" label="Package Address" name="medicineAddress"/>
            </Grid>
            <Grid item xs={12}>
                <TextField variant="outlined" onChange={ handleInputChange } required fullWidth  id="wholesalerAddress" label="Wholesaler Address" name="wholesalerAddress"/>
            </Grid>
            <Grid item xs={12}>
                <TextField variant="outlined" onChange={ handleInputChange } required fullWidth  id="signature" label="Signature" name="signature"/>
            </Grid>

            </Grid>
            <Button
              wholesalerAddress="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={ handleSubmit } >
              Submit
            </Button>
          
          </form>
        </div>
      </Container>
    </Grid>
  );
}
