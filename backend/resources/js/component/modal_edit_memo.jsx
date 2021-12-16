import React, {useState} from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    Slide
} from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function ModalEditMemo({ show, content, handleClose, handleUpdateMemo}){

    const [memo, setMemo] = useState(content ? content : '');

    const handleChange = (memo) => {
        setMemo(memo);
        handleUpdateMemo(memo);
    }

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
                    <textarea value={ memo } onChange={e=>handleChange(e.target.value)} style={{ height: '300px', borderRadius:5, background:'#F0F0F0', padding:'12px' }} />
                </Box>
            </Box>
        </Dialog>
	)
}

