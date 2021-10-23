import React, { useEffect, useState } from 'react';
import PDFViewer from "./pdf_page_admin";
import { makeStyles } from '@material-ui/styles';

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
                <DialogTitle style={{fontSize:'22px', textAlign:'center', padding:'20px 10px', borderBottom:'1px solid #e0e0e0'}}>{"メモ"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description" style={{fontSize:'20px', minHeight:'200px', padding:'20px'}}>
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} style={{fontSize:'18px', color:'black'}}>閉じる</Button>
                </DialogActions>
            </Dialog>
	)
}

