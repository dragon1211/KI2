import React, { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { LoadingButton } from '@material-ui/lab';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function ModalMemo({ show, message, handleClose, handleAccept, loading }){
	return (
        <Dialog
            open={show}
            TransitionComponent={Transition}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
            onClose={handleClose}
        >
            <DialogContent style={{padding:'35px 10px 10px'}}>
                <DialogContentText id="alert-dialog-slide-description" className="text-center">
                    <span className="ft-16 text-black" style={{ whiteSpace: 'pre-wrap' }}>{message}</span>
                </DialogContentText>
            </DialogContent>
            <DialogActions style={{justifyContent:'space-evenly', padding:'0 10px 30px 10px'}}>
                <Button onClick={handleClose} size="small">
                    <span className="ft-16 font-weight-bold text-black">いいえ</span>
                </Button>
                <LoadingButton variant="text"
                    onClick={handleAccept}
                    loading={loading}
                    size="small">
                    <span className={`ft-16 font-weight-bold ${!loading && 'text-black'}`}>はい</span>
                </LoadingButton>
            </DialogActions>
        </Dialog>
	)
}

