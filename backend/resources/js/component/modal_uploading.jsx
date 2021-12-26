import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogContentText
} from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';


export default function UploadingProgress({ show }){

	return (
        <Dialog
            open={show}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogContent style={{padding:'35px 10px'}}>                
                <DialogContentText id="alert-dialog-slide-description" className="text-center">
                    <span className="ft-16 text-black" style={{ whiteSpace: 'pre-wrap' }}>{'アップロード中です。\nしばらくお待ちください。'}</span>
                </DialogContentText>
                <LinearProgress 
                    color="inherit" 
                    sx={{ 
                        margin:'15px 30px 0',  
                        animationDuration: '300ms' 
                    }}
                />
            </DialogContent>
        </Dialog>
	)
}

