import React, { useEffect } from 'react';

const Alert = (props) => {
    
    //props.type == 'success'  alert-success
    //props.type == 'danger'  alert-danger

    useEffect(() => {
        window.scrollTo(0, 0);
        const element = `<div class="alert-${props.type} ft-18 ft-xs-16" id="alert-wrapper">`+ 
                            props.children + 
                        '</div>';
        document.getElementById('alert').innerHTML = element;
        if(props.hide)  props.hide();
    },[]);

    return (
        <div className={`alert-${props.type} ft-18 ft-xs-16`}>
            {props.children}
        </div>
	)
}

export default Alert;