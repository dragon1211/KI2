
import React from 'react';
import { CircularProgress  } from '@material-ui/core';


const PageLoader = () => {
	return (
    <div className="css-loader-pane">
        <CircularProgress 
            className="css-loader"
            sx={{ 
                animationDuration: '500ms',
            }}
            thickness={1}
            value={50}
        />
    </div>
    )
}

export default PageLoader;