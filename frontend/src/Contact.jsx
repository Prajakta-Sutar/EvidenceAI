import './Contact.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';

function Contact({className}){
    return (
        <div className={className}>
            <Form className='form_panel'>
                 <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label style={{fontSize:"small"}}>First name</Form.Label>
                            <Form.Control type="text" className='form_control'/>
                            <hr className='form_line'/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                           <Form.Label style={{fontSize:"small"}}>Last name</Form.Label>
                            <Form.Control type="text" className='form_control'/>
                            <hr className='form_line'/>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label style={{fontSize:"small"}}>Email address</Form.Label>
                        <Form.Control type="email" className='form_control'/>
                        <hr className='form_line'/>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label style={{fontSize:"small"}}>Message</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={1}  
                            className='form_control message_control'
                             onInput={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}/>
                        <hr className='form_line'/>
                    </Form.Group>
                </Row>
            </Form>
            <Button className='submit_button'> Send message </Button>
        </div>
    )
}

export default Contact;