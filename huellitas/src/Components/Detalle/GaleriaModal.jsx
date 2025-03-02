import React from "react";
import {Modal} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Foto from "./Foto";

function GaleriaModal({ show, setShow, foto = []  }) {
  return (
    <Modal show={show} onHide={() => setShow(false)} fullscreen centered>
      <Modal.Header closeButton>
        <Modal.Title>Galería</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="grid_layout_modal">
        {foto.map((foto, index) => (
          <Foto key={index} imagen={foto} tipoFoto="imagen_modal"/>
        ))}
        </div>
</Modal.Body>
    </Modal>
  );
}

export default GaleriaModal;
