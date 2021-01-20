import React, { useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline} from '@material-ui/core';

import useStyles from './styles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import { commerce } from '../../../lib/commerce';
import { Link } from 'react-router-dom';

const steps = ['Shipping address', 'Payment details'];

const Checkout = ( { cart, order, onCaptureCheckout, error }) => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});

    useEffect(()=> {
        const generateToken = async () => {
            try{
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart'});
                console.log(token);
                setCheckoutToken(token);
            } catch (error){
                
            }
        }

        generateToken();
    }, [cart]);

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)

    const next = (data) => {
        setShippingData(data);
        nextStep();
    }

    //Needs to be fixed. Reason for it not completing the order with commerce js due to not linking a credit card to the website (dont want to do)
    //Thus it cannot work with Stripe API to finish the 'purchase' so I just have it as a mock finish for now
    let Confirmation = () => (order.customer ? (
        <>
          <div>
            <Typography variant="h5">Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}!</Typography>
            <Divider className={classes.divider} />
            <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
          </div>
          <br />
          <Button component={Link} variant="outlined" type="button" to="/ecommerce">Back to home</Button>
        </>
      ) : (
        <div className={classes.spinner}>
          <CircularProgress />
        </div>
      ));
      
      if (error) {
        Confirmation = () => (
          <>
            <Typography variant="h5">Thank you for your purchase!</Typography>
            <br />
            <Button component={Link} variant="outlined" type="button" to="/ecommerce">Back to home</Button>
          </>
        );
      }

    const Form = () => activeStep === 0 ? <AddressForm checkoutToken={checkoutToken} next={next} /> : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} backStep={backStep} onCaptureCheckout={onCaptureCheckout} nextStep={nextStep}/> 


    return (
        <>
        <CssBaseline />
        <div className={classes.toolbar} />
        <main className={classes.layout}>
            <Paper className={classes.paper}>
            <Typography variant="h4" align="center">Checkout</Typography>
            <Stepper activeStep={activeStep} className={classes.stepper}>
                {steps.map((label) => (
                <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                </Step>
                ))}
            </Stepper>
            {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
            </Paper>
        </main>  
        </>
    )
}

export default Checkout
