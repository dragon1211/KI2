import React, { useEffect, useState } from 'react';

const Thumbnail = ({image}) => {

    const [height, setHeight] = useState(350);

    useEffect(() => {
        setHeight(document.querySelector('.p-file-for').clientWidth);
        const resizeListener = () => {
          setHeight(document.querySelector('.p-file-for').clientWidth);
        };
        window.addEventListener('resize', resizeListener);
        return () => {
            window.removeEventListener('resize', resizeListener);
        }
    }, [])

	return (
    <div className="p-file-for" style={{ height:  height}}>
        {  image &&  <img src={image} alt="thumbnail"/>  }
    </div>
    )
}

export default Thumbnail;