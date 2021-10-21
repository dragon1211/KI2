import React, { useEffect, useState } from 'react';
import PDFViewer from "./pdf_page";
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    show: {
        display: 'block',
    },
    hide: {
        display: 'none',
    },
}));

export default function ModalPdf({ show, pdfPath, handleClose }){
    const classes = useStyles();
	return (
        <div className={`modal-area modal-pd ${show ? classes.show : classes.hide}`}>
            <div className="modal-bg"></div>
            <div className="modal-wrap" style={{ maxWidth:680 }}>
                <PDFViewer pdf={pdfPath} />
                <ul className="modal-answer">
                    <li>
                        <a className="close-modal"  onClick={handleClose} >閉じる</a>
                    </li>
                </ul>
                <br/>
            </div>
           
        </div>
	)
}

