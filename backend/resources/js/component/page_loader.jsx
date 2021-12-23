
import React from 'react';
import { CircularProgress  } from '@material-ui/core';


const PageLoader = () => {
	return (
        <CircularProgress 
            className="css-loader"
            sx={{ 
                animationDuration: '500ms',
            }}
            thickness={1}
            value={50}
        />
    )
}

export default PageLoader;