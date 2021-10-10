import React, { useEffect, useState } from 'react';

export default function ModalYesNo({children, hideModal}){
    

	return (
        <section className="modal-area">
            <div className="modal-bg"></div>
            <div className="modal-wrap ft-xs-15">
                <p className="modal-ttl">{children}</p>
                <ul className="modal-answer">
                    <li><a className="close-modal" onClick={hideModal}>いいえ</a></li>
                    <li><a href="">はい</a></li>
                </ul>
            </div>
        </section>
	)
}

