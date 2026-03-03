import React from "react";
import { Modal } from "react-bootstrap";

function PopupModal({ show, message, onSave }) {
  return (
    <div>
      <Modal show={show} centered backdrop="static">
        <div className="py-3" style={{ textAlign: "center" }}>
          <h6 className="my-2">{message.promptTile}</h6>
          <div className="mt-3">{message.promptBody}</div>
          <button
            className="mt-3"
            style={{
              backgroundColor: "red",
              color: "white",
              border: "1px solid red",
              borderRadius: "10px",
              fontSize: "12px",
            }}
            variant="danger"
            onClick={onSave}
          >
            Done
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default PopupModal;
