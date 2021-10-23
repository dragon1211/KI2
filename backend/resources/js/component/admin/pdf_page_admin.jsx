import React, { useState } from "react";
import { Document, Page, pdfjs  } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

import IconButton from '@mui/material/IconButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Container from '@mui/material/Container';

export default function PDFViewer(props) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1); //default fisrt page

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  const { pdf } = props;

  return (
    <Container>
      <Document
        file={pdf}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <Container className="d-flex justify-content-center">
        <IconButton 
          type="button" 
          disabled={pageNumber <= 1} 
          onClick={previousPage}
          variant="contained"
        >
          <ArrowBackIosIcon/>
        </IconButton>
        {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
        <IconButton
          type="button"
          disabled={pageNumber >= numPages}
          onClick={nextPage}
        >
          <ArrowForwardIosIcon/>
        </IconButton>
      </Container>
    </Container>
  );
}
