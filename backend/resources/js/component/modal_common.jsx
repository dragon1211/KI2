import React, { useEffect, useState } from 'react';

export default function ModalCommon({children, hideModal}){
    
	return (
        <section className="modal-area modal-pd">
            <div className="modal-bg"></div>
            <div className="modal-wrap  ft-xs-15">
                <p className="modal-ttl">{children}</p>
                <p className="modal-close-btn" onClick={hideModal}>
                    <img src="/assets/img/icon/plus02.svg" alt="閉じるボタン" width="18" height="18"/>
                </p>
            </div>
        </section>
	)
}

