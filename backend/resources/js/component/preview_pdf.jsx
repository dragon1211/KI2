import React, { useEffect, useState } from 'react';
import { Document, Page} from "react-pdf";

const PreviewPDF = ({pdf_url}) => {

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
    <div className="p-file-for" 
        style={{ 
            height: height, 
            marginTop:'15px', 
            display:'flex', 
            alignItems:'center', 
            justifyContent:'center', 
            position:'relative',
            overflow: 'hidden'
    }}>
        {
            pdf_url &&
            <Document file={pdf_url} loading={<></>}>
                <Page 
                    pageNumber={1} 
                    loading={<></>}
                    renderMode='svg'
                    height={height-3}
                />
            </Document>
        }
    </div>
    )
}

export default PreviewPDF;