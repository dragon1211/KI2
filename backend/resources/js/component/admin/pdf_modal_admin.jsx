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
import Container from '@mui/material/Container';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function ModalPdf({ show, pdfPath, handleClose }){

	return (
        <Dialog
        open={show}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        onClose={handleClose}
        >
            <DialogContent>
                <Container style={{fontSize:'20px', minHeight:'200px', padding:'20px'}}>
                    {show && <PDFViewer pdf={pdfPath} /> }
                </Container>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} style={{fontSize:'18px', color:'black'}}>閉じる</Button>
            </DialogActions>
        </Dialog>
	)
}

