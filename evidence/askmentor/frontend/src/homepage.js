import './homepage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Carousel from 'react-bootstrap/Carousel';
import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



function Homepage({giveAccess}){

    // Variable used for navigation between pages 
    const navigateTo = useNavigate();

    // Vraiable to display sign/login modals 
    const [showModal, setShowModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);

    // Variables to store user input for signin 
    const[signUsername, setSignUsername] = useState("");
    const[signName, setSignName] = useState("");
    const[signEmail, setSignEmail] = useState("");
    const[signPassword, setSignPassword] = useState("");
    const[signProfession, setSignProfession] = useState("");
    const[signSkills, setSignSkills] = useState("");

    // Variables to store errors during signin 
    const[sign500Error, setSign500Error] = useState(false);
    const[sign401Error, setSign401Error] = useState(false);
    const[signError, setSignError] =  useState(false);

    // Variables to store user input for login 
    const[logUsername, setLogUsername] = useState("");
    const[logEmail, setLogEmail] = useState("");
    const[logPassword, setLogPassword] = useState("");
 
    // Variables to store errors during login 
    const[log500Error, setLog500Error] = useState(false);
    const[log401Error, setLog401Error] = useState(false);
    const[logError, setLogError] =  useState(false);



    // Funcionality to display login modal
    const openModal =()=>{
        setShowModal(true);
    }

    const closeModal = ()=>{
        setLogEmail('');
        setLogPassword('');
        setLogUsername('');
        removeErrors();
        setShowModal(false);
    }

    const goToLogIn = () =>{
        closeSignupModal();
        openModal();
    }

   
    // Funcionality to display signin modal
    const openSignupModal =()=>{
        setShowSignupModal(true);
    }

    const closeSignupModal = ()=>{
        setSignEmail('');
        setSignName('');
        setSignPassword('');
        setSignProfession('');
        setSignSkills('');
        setSignUsername('');
        removeErrors();
        setShowSignupModal(false);
    }

    const goToSignIn = () => {
        closeModal();
        openSignupModal();
    }

     // Functionality to hide login/ signin  errors 
     const removeErrors = () =>{
        setLog401Error('');
        setLog500Error('');
        setLogError('');
        setSign401Error('');
        setSign500Error('');
        setSignError('');
    }

    // Variables to manipulate carousel slides 
    const carouselRef = useRef(null);
    const goToNext = () => {
        carouselRef.current.next();
    }
    
    const goToPrev = () => {
        carouselRef.current.prev();
    }


    // Sign in functionality 
    const handleSignUp=async()=>{
        const skillsArray = signSkills.split(',').map(item => item.trim()).join(',');
        if(skillsArray.length ==0 || !signUsername || !signEmail || !signPassword || !signName || !signProfession ){
            setSignError(true);
            return;
        }
        closeSignupModal();
        const signAvatar = '/Avatars.png';
        const data = {
            signUsername, signName, signPassword, signEmail, signProfession, signSkills: skillsArray, signAvatar
        }
        try {
            const response = await axios.post(`${window.BASE_URL}/signup`, data);
            if (response.status === 200) {  
                giveAccess(true,signUsername);
                navigateTo('/channels');
            }
            else if(response.status === 401){
                setSign401Error(true);
                return;
            }
        } catch (error) {
                setSign500Error(true);
                console.error("Catched axios error during SignUp: ",error);
        }
    }


    // log in functionality 
    const handleLogIn=async()=>{
        if( !logEmail || !logPassword || !logUsername ){
            setLogError(true);
            return;
        }
        closeModal();
        const data = {
            logEmail, logPassword, logUsername
        }
        try {
            const response = await axios.post(`${window.BASE_URL}/login`, data);
            if (response.status === 200) {  
                giveAccess(true,logUsername);
                if(logEmail === "admin@gmail.com" && logPassword === "zxcvbnm" && logUsername === "admin"){
                    sessionStorage.setItem('isAdmin', "true");
                }
                else{
                    sessionStorage.setItem('isAdmin', "false");
                }
                navigateTo('/channels');
            } 
            else if(response.status === 401){
                setLog401Error(true);
            }
        } catch (error) {
                setLog500Error(true);
                console.error("Catched axios error during login: ",error);
        }
    }

    return(
        <div>
             <Modal
                show={showModal} 
                onHide={closeModal}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className='connect-modal'
                >
                <Form className='join-form'>
                <span class="material-symbols-outlined icons" style={{fontSize:'2vw'}}>groups</span>
                    <h4 style={{fontWeight:'bold'}}>Welcome Back Friend !</h4>
                    {log500Error ? <p style={{fontSize:'small', color:'red', margin:'0', padding:'0'}}> Server error occured : Try again !</p>:<></>}
                    {log401Error ? <p style={{fontSize:'small', color:'red', margin:'0', padding:'0'}}> Account doesn't exists with given Email</p>: <></>}
                    {logError ?  <p style={{fontSize:'small', color:'red', margin:'0', padding:'0'}}>Please fill out all required fields</p>: <></> }
                    <Form.Group className='form-group'>
                        <Form.Label >Email</Form.Label>
                        <Form.Control 
                            type='text'
                            style={{borderColor:'red'}}
                            onChange={(e)=>{ setLogEmail(e.target.value); removeErrors();}}
                            
                            />
                    </Form.Group>
                    <Form.Group className='form-group'>
                        <Form.Label>Username</Form.Label>
                        <Form.Control 
                            type='text'
                            style={{borderColor:'#22b6a2'}}
                            onChange={(e)=>{ setLogUsername(e.target.value); removeErrors();}}
                        />
                    </Form.Group>
                    <Form.Group className='form-group'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password' 
                            style={{borderColor:'#ffcc00'}}
                            onChange={(e)=>{ setLogPassword(e.target.value); removeErrors();}}
                        />
                    </Form.Group>
                    <Stack direction='horizontal' gap={4}>
                        <Button className='login-button' onClick={closeModal}>Cancel</Button>
                        <Button className='login-button' onClick={handleLogIn}>Log In</Button>
                    </Stack>
                    <br></br>
                    <p>Don't have an Account ? <span className='go-to-signin' onClick={goToSignIn}>Sign In</span></p>
                </Form>  
            </Modal>
            <Modal
                show={showSignupModal} 
                onHide={closeSignupModal}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <span className='signin-modal'>
                    <span class="material-symbols-outlined icons" style={{fontSize:'2vw'}}>groups</span>
                    <h4 style={{fontWeight:'bold'}}>Welcome to Our Community !</h4>
                    {sign500Error ? <p style={{fontSize:'small', color:'red', margin:'0', padding:'0'}}> Server error occured : Try again !</p>:<></>}
                    {sign401Error ? <p style={{fontSize:'small', color:'red', margin:'0', padding:'0'}}> Account already exists with given Email</p>: <></>}
                    {signError ?  <p style={{fontSize:'small', color:'red', margin:'0', padding:'0'}}>Please fill out all required fields</p>: <></> }
                    <Carousel style={{width:'100%'}} interval={600000} ref={carouselRef}>
                        <Carousel.Item>
                            <Form className='join-form'>
                                <Form.Group className='form-group'>
                                    <Form.Label >Email</Form.Label>
                                    <Form.Control
                                        type='email' 
                                        style={{borderColor:'red'}}
                                        onChange={(e)=>{ setSignEmail(e.target.value); removeErrors();}}
                                    />
                                </Form.Group>
                                <Form.Group className='form-group'>
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control 
                                        type='text'
                                        style={{borderColor:'#22b6a2'}}
                                        onChange={(e)=>{ setSignUsername(e.target.value); removeErrors();}}
                                    />
                                </Form.Group>
                                <Form.Group className='form-group'>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control 
                                        type='password'
                                        style={{borderColor:'#ffcc00'}}
                                        onChange={(e)=>{ setSignPassword(e.target.value);removeErrors();}}    
                                    />
                                </Form.Group>
                                <Stack direction='horizontal' gap={4}>
                                    <Button className='login-button' onClick={closeSignupModal}>Cancel</Button>
                                    <Button className='login-button' onClick={goToNext}>Continue</Button>
                                </Stack>
                                <br></br>
                                <p>Already have an Account ? <span className='go-to-signin' onClick={goToLogIn}>Log In</span></p>  
                            </Form>
                        </Carousel.Item>
                        <Carousel.Item>
                            <Form className='join-form'>
                                <Form.Group className='form-group'>
                                    <Form.Label >Full name </Form.Label>
                                    <Form.Control 
                                        type='text'
                                        style={{borderColor:'red'}}
                                        onChange={(e)=>{ setSignName(e.target.value); removeErrors();}}   
                                    />
                                </Form.Group>
                                <Form.Group className='form-group'>
                                    <Form.Label>Occupation</Form.Label>
                                    <Form.Control 
                                        type='text'
                                        style={{borderColor:'#22b6a2'}}
                                        onChange={(e)=>{ setSignProfession(e.target.value); removeErrors();}}    
                                    />
                                </Form.Group>
                                <Form.Group className='form-group'>
                                    <Form.Label>Skills</Form.Label>
                                    <Form.Control 
                                        type='text'
                                        style={{borderColor:'#ffcc00'}}
                                        onChange={(e)=>{ setSignSkills(e.target.value); removeErrors();}}    
                                    />
                                </Form.Group>
                                <Stack direction='horizontal' gap={4}>
                                    <Button className='login-button' onClick={goToPrev}>Go Back</Button>
                                    <Button className='login-button' onClick={handleSignUp}>Sign In</Button>
                                </Stack>
                                <br></br>
                                <p>Already have an Account ? <span className='go-to-signin' onClick={goToLogIn}>Log In</span></p> 
                            </Form>
                        </Carousel.Item>
                    </Carousel>    
                </span>  
            </Modal>
            <Stack direction='horizontal' className='navbar'>
                <span class="material-symbols-outlined icons" style={{fontSize:'2vw'}}>groups</span>
                <Button className='ms-auto' onClick={openSignupModal}>Connect with Us</Button>
            </Stack>
            <div className='welcome-board'>
                <p style={{fontFamily:'Spicy Rice', fontSize:'5vw'}}>AskMentor</p>
                <h5> Feeling stuck and can't find solutions ?</h5>
                <h5>On AskMentor, anyone can be your mentor. Share your 
                    questions and receive guidance from a community of 
                    diverse experts ready to help you grow.
                </h5>
            </div>
            <div className='features'>
                <div className='feature-point point1'>
                    <span class="material-symbols-outlined icons">rocket_launch</span>
                    <p>
                        Step into the spotlight by launching your own channel, 
                        where you can share your unique viewpoint,
                        spark meaningful conversations, and connect with like-minded individuals
                    </p>
                </div>
                <div className='feature-point point2'>
                    <span class="material-symbols-outlined icons">location_searching</span>
                        <p>
                            Quickly discover exactly what you're looking for by searching 
                            for people, channels, or posts that match your interests, 
                            ensuring a seamless browsing experience
                        </p>
                </div>
                <div className='feature-point point3'>
                    <span class="material-symbols-outlined icons">description</span>
                    <p>
                        Make your posts more engaging by easily uploading images, files, and 
                        code snippets. Share your ideas in full detail and 
                        connect with others through rich, multimedia content.
                    </p>
                </div>
            </div>
            <div>
                <div className='specifics-block'> 
                    <div className='specifics-text'>
                        <h4 style={{color:'#FF5D00', fontWeight:'bold'}}>Direct Messages</h4>
                        <p>
                            With our new direct messaging feature, you can now 
                            connect with people one-on-one. Start conversations, 
                            exchange ideas, and build your network effortlessly.
                        </p>
                    </div>
                    <img src="Message.png" className='message-img'></img>
                </div>
                <div className='specifics-block'> 
                    <img src="Profile.png" className='message-img'></img>
                    <div className='specifics-text'>
                        <h4 style={{color:'#FF5D00', fontWeight:'bold'}}>Customized Profile</h4>
                        <p>
                            Personalize your profile to reflect your unique identity. 
                            Showcase your skills, interests, and experiences to make 
                            meaningful connections and stand out in your network.
                        </p>
                    </div>  
                </div>     
            </div>
            <div className='footbar'>
                <h5 style={{fontWeight:'bold'}}>Join Our Community</h5>
                <p style={{textWrap:'1'}}> Don’t miss out! Join others who are already 
                    engaging, learning, and growing. 
                    <br></br>
                    Get started now – 
                    it's free and easy!
                </p>
                <Button  className='join-button' onClick={openSignupModal}>
                    Join Us
                </Button>
            </div>
        </div>
    );
}

export default Homepage;