import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import { MobilePDFReader, PDFReader } from 'react-read-pdf';

import { SpecialZoomLevel, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { ScrollMode } from '@react-pdf-viewer/scroll-mode';

const PDFViewer = () => {

    const file_name = document.getElementById('pdf-url').value;
    const [url, setURL] = useState('');

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        toolbarPlugin: {
            fullScreenPlugin: {
                onEnterFullScreen: (zoom) => {
                    zoom(SpecialZoomLevel.PageFit);
                    defaultLayoutPluginInstance.toolbarPluginInstance.scrollModePluginInstance.switchScrollMode(
                        ScrollMode.Wrapped
                    );
                },
                onExitFullScreen: (zoom) => {
                    zoom(SpecialZoomLevel.PageWidth);
                    defaultLayoutPluginInstance.toolbarPluginInstance.scrollModePluginInstance.switchScrollMode(
                        ScrollMode.Horizontal
                    );
                },
            },
        },
    });


    useEffect(()=>{
        if(file_name == 'default.pdf')
            setURL('/assets/default/'+file_name);
        else setURL('/files/'+file_name);
    }, []);

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.11.338/build/pdf.worker.js">
            <div
                style={{
                    height: '100vh',
                }}
            >
                { 
                    url && 
                        <Viewer fileUrl={url} 
                            plugins={[defaultLayoutPluginInstance]} 
                        /> 
                }
            </div>
        </Worker>
    );
}

if(document.getElementById('pdf-preview')){
	ReactDOM.render(
		<PDFViewer />,
		document.getElementById('pdf-preview')
	)
}