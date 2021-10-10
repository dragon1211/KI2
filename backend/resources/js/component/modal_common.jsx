import React, { useEffect, useState } from 'react';

export default function ModalCommon({children, hideModal}){
    
	return (
        <section class="modal-area modal-pd">
            <div class="modal-bg"></div>
            <div class="modal-wrap  ft-xs-15">
                <p class="modal-ttl">{children}</p>
                <p class="modal-close-btn" onClick={hideModal}>
                    <img src="/assets/img/icon/plus02.svg" alt="閉じるボタン" width="18" height="18"/>
                </p>
            </div>
        </section>
	)
}

