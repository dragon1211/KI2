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

export default function ModalMemo({ show, title, content, handleClose }){
    const classes = useStyles();
	return (
        <div className={`modal-area modal-pd ${show ? classes.show : classes.hide}`}>
            <div className="modal-bg"></div>
            <div className="modal-wrap">
                <h4 className="modal-ttl">{title}</h4>
                <br/>
                <p className="modal-ttl">{content}</p>
                <p className="modal-close-btn">
                    <img onClick={handleClose} src="/assets/img/icon/plus02.svg" alt="閉じるボタン" width="18" height="18" />
                </p>
            </div>
        </div>
	)
}

