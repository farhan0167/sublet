import React,{useState} from 'react'
import {Modal,Button} from 'react-bootstrap'


function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
      <center>
        <p style={{'fontSize':'40px','fontWeight':'800','color':'#F28C0F'}}>
          Coming Soon
        </p>
        <p>{props.text}</p>
      </center>
      </Modal.Body>

    </Modal>
  );
}

const ComingSoon = (props) => {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)} style={{'width': props.width,'height':props.height,'marginLeft':'10px','marginRight':'10px'}} >
        {props.name}
      </Button>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        text = {props.text}
      />
    </>
  )
}

export default ComingSoon
