import React, { useEffect } from 'react';

const Alert = (props) => {
    
    //props.type == 'success'  alert-success
    //props.type == 'danger'  alert-danger

    useEffect(
        () => {
              let timer = setTimeout(()=>{
                clearTimeout(timer);
                if(props.hide)  props.hide();
            }, 4000)
        },[]);

	return (
        <div className={`alert-${props.type} ft-18 ft-xs-16`}>{props.children}</div>
	)
}

export default Alert;