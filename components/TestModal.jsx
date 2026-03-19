"use client"
import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom';

const TestModal = ({ isOpen, onClose, children }) => {
    const dialogRef = useRef(null)

    useEffect(() => {
        const modalElement = dialogRef.current;
        if(!modalElement) return;

        if(isOpen){
            document.body.style.overflow = "hidden";

            modalElement.showModal();

        }else{
            document.body.style.overflow = "unset";
            modalElement.close();
        }

        return () => {
            document.body.style.overflow = "unset";
      
        }
  
    }, [isOpen])
          const handleClose = () => {
            onClose();

            if (document.activeElement instanceof HTMLElement){

                document.activeElement.blur();
            }
        }
        if (isOpen) {
            return null;
        }
  return createPortal(
    <dialog
    ref={dialogRef}
    onClose={handleClose}
    className='modal'
       style={{
        padding: '2rem',
        border: 'none',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%',
        // Remove default margin that dialog elements have
        margin: 'auto'
      }}

    >
         <div className="modal-content">
        {children} {/* Render whatever content was passed in */}
        
        {/* Close button - triggers handleClose when clicked */}
        <button 
          onClick={handleClose}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
        </div>
        document.body

    </dialog>


)
}

export default TestModal