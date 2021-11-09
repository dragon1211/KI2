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
                <DialogTitle style={{padding:'20px 10px',textAlign:'center', borderBottom:'1px solid #e0e0e0'}}>
                    <span className="ft-20 ft-xs-18 text-center">メモ</span>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description" style={{minHeight:'200px'}} className="pt-4">
                        <span className="ft-20 ft-xs-16">{content}</span>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}><span className="text-black ft-18 ft-xs-16">閉じる</span></Button>
                </DialogActions>
            </Dialog>
	)
}

