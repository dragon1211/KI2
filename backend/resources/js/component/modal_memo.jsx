import React, { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function ModalMemo({ show, content, handleClose }){
	return (
        <Dialog
        open={show}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        onClose={handleClose}
        >
                <DialogTitle style={{padding:'20px 10px',textAlign:'center', borderBottom:'1px solid rgb(239 236 236)'}}>
                    <span className="ft-18 text-center font-weight-bold">メモ</span>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description" style={{minHeight:'200px', whiteSpace:'pre-wrap'}} className="ft-18 ft-xs-16 text-black pt-4">
                        {content}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
	)
}

