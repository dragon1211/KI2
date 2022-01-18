import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs  } from "react-pdf";
import { makeStyles } from '@material-ui/styles';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

import IconButton from '@mui/material/IconButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Container from '@mui/material/Container';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function ModalPdf({ show, pdfPath, handleClose }){

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1); //default fisrt page

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

	return (
        <Dialog
        open={show}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        onClose={handleClose}>
            <DialogContent>
                <Container style={{fontSize:'20px', minHeight:'200px', padding:'20px'}}>
                    {show && 
                        <Container>
                            <Document  file={pdfPath} onLoadSuccess={onDocumentLoadSuccess}>
                                <Page pageNumber={pageNumber} />
                            </Document>
                            {/* <Worker workerUrl={pdfjsWorker}>
                            <Viewer fileUrl={pdf} />
                            </Worker> */}
                        </Container>
                    }
                </Container>
            </DialogContent>
            <DialogActions>
                <Container className="d-flex justify-content-center mb-2">
                    <IconButton disabled={pageNumber <= 1} onClick={previousPage} variant="contained">
                        <ArrowBackIosIcon/>
                    </IconButton>
                    {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
                    <IconButton disabled={pageNumber >= numPages} onClick={nextPage}>                                
                        <ArrowForwardIosIcon/>
                    </IconButton>
                    {/* <Button onClick={handleClose} size="small" color="primary" variant="contained">閉じる</Button> */}
                </Container>
            </DialogActions>
        </Dialog>
	)
}
