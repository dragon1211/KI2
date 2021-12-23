import React, { useState } from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    Slide,
    Typography
} from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function ModalMemo({ show, content, handleClose}){

	return (
        <Dialog
            open={show}
            TransitionComponent={Transition}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
            onClose={handleClose}
        >
            <DialogTitle sx={{padding:'20px 10px',textAlign:'center', borderBottom:'1px solid rgb(239 236 236)'}}>
                <span className="ft-18 text-center font-weight-bold">メモ</span>
            </DialogTitle>
            <Box sx={{ p:'15px', pb:'15px'}}>
                <Box id="alert-dialog-slide-description">
                    <Typography component='p' sx={{ minHeight:'175px', whiteSpace:'pre-wrap', bgcolor:'#F0F0F0', p:'15px' }} className="ft-16 text-black">
                        {content ? content : '未入力'}
                    </Typography>
                </Box>
            </Box>
        </Dialog>
	)
}

