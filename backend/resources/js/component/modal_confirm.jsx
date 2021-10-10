import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    show: {
        display: 'block',
    },
    hide: {
        display: 'none',
    },
}));

export default function ModalConfirm({ show, message, handleClose, handleAccept }){
    const classes = useStyles();
	return (
        <div className={`modal-area modal-01 ${show ? classes.show : classes.hide}`} >
            <div className="modal-bg"></div>
            <div className="modal-wrap">
            <p className="modal-ttl" style={{ whiteSpace: 'pre-wrap' }}>{message}</p>
            <ul className="modal-answer">
                <li>
                    <a className="close-modal" onClick={handleClose} >いいえ</a>
                </li>
                <li>
                    <a onClick={handleAccept} >はい</a>
                </li>
            </ul>
            </div>
        </div>
	)
}

