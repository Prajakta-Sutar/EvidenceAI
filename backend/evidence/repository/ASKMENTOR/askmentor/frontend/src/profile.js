import './profile.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/esm/Stack';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import { useState, useRef, useEffect } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Image from 'react-bootstrap/Image';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';

function Profile(){

    // Variable used for navigation between pages 
    const navigateTo = useNavigate();

    // Variables used to open/ close different modals such as media/avatar modal or profile canvas
    const [avatarModal, setAvatarModal] = useState(false);
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [showProfileCanvas, setShowProfileCanvas] = useState(false);

    // Variables to store information about current user
    const [newName, setNewName] = useState('');
    const [newId, setNewId] = useState(0);
    const [newUsername, setNewUsername] = useState('');
    const [newProfession, setNewProfession] = useState('');
    const [newSkills, setNewSkills] = useState('');
    const [newAvatar, SetNewAvatar] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newExpertise, setNewExpertise] = useState('');
    const [newConnections, setNewConnections] = useState('');
    const [newPostCount, setNewPostCount] = useState('');
    const [gotMediaLimit,setGotMediaLimit] = useState(false);
    const[currUserDetails, setCurrUserDetails] = useState([]);

    // Variables to store information about pupolar users and channels
    const [popularUserDetails, setpopularUserDetails ] = useState([]);
    const [popularUsers, setPopularUsers] =  useState([]);
    const [allPopularChannels, setAllPopularChannels] = useState([]);

    // varible used to check whether user is editing profile or not
    const[isEditMode, setIsEditMode] = useState(false);

    // Variables to store new avatar for user
    const [selectedPic, setSelectedPic] = useState(-1);

    // Variables to store information about user's media 
    const [selectedMediaType, setSelectedMediaType] = useState(0);
    const [selectedMediaLink, setSelectedMediaLink] = useState('');
    const [selectedMediaImage, setSelectedMediaImage] = useState('');

    // variables to store information related ro admin's purpose 
    const[isAdmin, setIsAdmin] =  useState(false);
    const[showWarning, setShowWarning] = useState(false);
    const [ itemToDelete, setItemToDelete] = useState(0);
    const [userToDelete, setUserToDelete] = useState("");


    // Functionality to retrieve and store current user's details 
    useEffect(()=>{
        getCurrUserDertails();
    },[]);

    useEffect(()=>{
        if(currUserDetails.userInfo){
            setNewName(currUserDetails.userInfo.name);
            setNewUsername(currUserDetails.userInfo.username);
            setNewSkills(currUserDetails.userInfo.skills);
            setNewEmail(currUserDetails.userInfo.email);
            setNewProfession(currUserDetails.userInfo.profession);
            setNewExpertise(currUserDetails.userInfo.expertise);
            SetNewAvatar(currUserDetails.userInfo.avatar);
            setNewId(currUserDetails.userInfo.id);
            setNewConnections(currUserDetails.userInfo.connections);
            setNewPostCount(currUserDetails.userInfo.totalPosts);

        }
        if(currUserDetails.media && currUserDetails.media.length === 3){
            setGotMediaLimit(true);
        }
    },[currUserDetails]);
   
    const getCurrUserDertails = async() =>{
        const username  =  sessionStorage.getItem('session_user');
        const data = { username };
        try {
            const response =  await axios.post(`${window.BASE_URL}/getUserDetails`, data);
            if (response.status === 200) {
                setCurrUserDetails(response.data);
                console.log(response.data);
                console.log("Successfully retrieved current user details");
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during retriving current user details: ",error);
        }
    }


    // Functionality to open / close  different modals and offcanvas
    const openMediaModal =()=>{
        setShowMediaModal(true);
    }

    const closeMediaModal = ()=>{
        setShowMediaModal(false);
    }
  
    const openProfileCanvas =()=>{
        setShowProfileCanvas(true);
    }

    const closeProfileCanvas = ()=>{
        setShowProfileCanvas(false);
    }

    const closeAvatarModal = () =>{
        setAvatarModal(false);
        setSelectedPic(-1);
    }


    // Functionality to retrieve popular user's details as well as popular channels
    useEffect(()=>{
        console.log("connected users details is ", popularUserDetails.userInfo);
    },[showProfileCanvas]);

    useEffect(()=>{
        getAllPopularChannels();
        getAllPopularUsers();
    },[]);

    const getPopularUserDetails = async(user) =>{
        const username  =  user;
        const data = { username };
        try {
            const response =  await axios.post(`${window.BASE_URL}/getUserDetails`, data);
            if (response.status === 200) {
                setpopularUserDetails(response.data);
                console.log("Successfully retrieved connected  user details",popularUserDetails);
                openProfileCanvas();
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during retriving connected user details: ",error);
        }
    }

    const getAllPopularUsers = async() =>{
        const username  =  sessionStorage.getItem('session_user');
        if(username === "admin"){
            try {
                const response =  await axios.get(`${window.BASE_URL}/allUsers`, {
                    params:{
                        currUser : username
                    }
                });
                if (response.status === 200) {
                    setPopularUsers(response.data);
                    console.log("Successfully retrieved all popular users",response.data);
                } 
                else{
                    console.log(response.message)
                }
            } catch (error) {
                console.error("Catched axios error during retriving all popular users: ",error);
            }
        }
        else{
            try {
                const response =  await axios.get(`${window.BASE_URL}/activeUsers`, {
                    params:{
                        currUser : username
                    }
                });
                if (response.status === 200) {
                    setPopularUsers(response.data);
                    console.log("Successfully retrieved all popular users",response.data);
                } 
                else{
                    console.log(response.message)
                }
            } catch (error) {
                console.error("Catched axios error during retriving all popular users: ",error);
            }
        }
    }

    const getAllPopularChannels = async() =>{
        try {
            const response =  await axios.get(`${window.BASE_URL}/activeChannels`);
            if (response.status === 200) {
                setAllPopularChannels(response.data);
                console.log("Successfully retrieved all popular channels details");
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during retriving all popular channels details: ",error);
        }
    }


    // Functionality add or remove social media accounts from user's profile 
    const handleNewMedia = async() =>{
        if(!currUserDetails.userInfo){
            return;
        }
        const userId = currUserDetails.userInfo.id;
        const type =  selectedMediaType;
        const link = selectedMediaLink;
        const image = selectedMediaImage;

        const data = {userId, type, link, image};
        try {
            const response =  await axios.post(`${window.BASE_URL}/addMedia`, data);
            if (response.status === 200) {
                setSelectedMediaImage('');
                setSelectedMediaLink('');
                setSelectedMediaType(0);
                closeMediaModal();
                getCurrUserDertails();
                console.log("Successfully added new media");
            } 
        } catch (error) {
            console.error("Catched axios error during adding new media: ",error);
        }
    }

    const handleDeleteMedia = async(media, user) =>{
        const userId = user;
        const mediaId = media;
        const data = {userId, mediaId };
        try {
            const response =  await axios.post(`${window.BASE_URL}/removeMedia`, data);
            if (response.status === 200) {
                getCurrUserDertails();
                setGotMediaLimit(false);
                console.log("Successfully removed media");
            } 
        } catch (error) {
            console.error("Catched axios error during removing media: ",error);
        }
    }

    
    // Functionality to store new avatar for user
    const handleNewPic = () =>{
        SetNewAvatar(`/Group${selectedPic}.png`);
        closeAvatarModal();
    }


    // Functionality to save all the changes made to user's profile
    const handleSaveChanges = async() =>{
        const name = newName;
        const username =  newUsername;
        const skills = newSkills.split(',').map(item => item.trim()).join(',');
        const avatar = newAvatar;
        const profession =  newProfession;
        const id = newId;
        const data ={name, username, skills, avatar, profession, id};
        try {
            const response =  await axios.post(`${window.BASE_URL}/saveChanges`, data);
            if (response.status === 200) {
                getCurrUserDertails();
                console.log("Successfully saved changes");
            } 
        } catch (error) {
            console.error("Catched axios error during saving changes: ",error);
        }
    }


    // Functionality to navigate to selected post 
    const goToSearchedPost =(channel, postId) =>{
        closeProfileCanvas();
        const params = {
            channelFromState: channel,
            postFromState: postId
        }
        navigateTo('/channels',{state:params});
    }

    // Functionallity to navigate to message page and open selected user's profile
    const goToSelectedUserPage = (username)=>{
    closeProfileCanvas();
    const params = {
        personFromState: username,
    }
    navigateTo('/messages',{state:params});
    }

    // Functionality to navigate to selected channel 
    const openChannelOnOtherPage = (channel)=>{
        const params = {
            channelFromState: channel,
        }
        navigateTo('/channels',{state:params});
    }


    // functionality to show / close warnings when admin delete something
    useEffect(()=>{
        if(sessionStorage.getItem('isAdmin') === "true"){
            setIsAdmin(true);
        }
    });

    const openWarnings = (userId, username ) =>{ 
        setItemToDelete(userId);
        setUserToDelete(username);
        setShowWarning(true);
    }

    const closeWarnings = () =>{
        setItemToDelete(0);
        setUserToDelete("");
        setShowWarning(false);
    }


    // functionality to let admin remove users
    const handleAdminDelete = async() =>{
        const userId = itemToDelete;
        const data = {userId};
        try {
            const response =  await axios.post(`${window.BASE_URL}/deleteUser`, data);
            if (response.status === 200) {
                closeWarnings();
                closeProfileCanvas();
                getAllPopularUsers();
                console.log("Successfully deleted user");
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during deleting user: ",error);
        }
    }

    const showPreview =(text, num)=>{
        const words = text.split(' ');
        return words.slice(0, num).join(' ')+" . . . . . . . .";
    }

    return(
        <div className='profile-page'>
           <div className= {!isAdmin ? 'first-container' : 'admin-first-container'}  >
                {!isAdmin ?
                    <>
                        <h6 style={{fontWeight:'bold', marginLeft:'0.5vw'}}> # Suggested People for you</h6>
                        <p style={{margin:'0', fontSize:'small',marginLeft:'0.5vw'}}>Discover and connect with professionals who align with your interests.</p>
                    </>
                :
                    <h6 style={{fontWeight:'bold', marginLeft:'0.5vw'}}> # All Users</h6>
                }
                <ListGroup variant="flush" >
                    {popularUsers && popularUsers.length > 0 && popularUsers.map((user)=>(
                        <ListGroup.Item className='message-item'>
                            <img src={user.avatar} style={{width:'2vw', marginRight:'0.5vw'}}></img>
                            <p style={{margin:'0'}}>{user.name}<p className="view-profile-button" onClick={()=>getPopularUserDetails(user.username)}>View Profile</p></p>
                            <p className='ms-auto view-profile-button'  onClick={()=>goToSelectedUserPage(user.username)} >Message</p>
                        </ListGroup.Item>
                    ))} 
                    <Offcanvas show={showProfileCanvas} onHide={closeProfileCanvas} placement='end'>
                        <Offcanvas.Header >
                        <Offcanvas.Title style={{fontWeight:'bold'}}># User's Profile</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className='profile-canvas-body'>
                            {popularUserDetails.userInfo &&
                            <>
                                <img src={popularUserDetails.userInfo.avatar} className='canvas-img'></img>
                                <p style={{fontWeight:'bold', margin:'0'}}>@{popularUserDetails.userInfo.username}</p>
                                <p>{popularUserDetails.userInfo.name}</p>
                                <p>Hello {currUserDetails.userInfo.name}! 👋 Nice to meet you.I am {popularUserDetails.userInfo.profession}! Lets connect and share our ideas.</p>
                                {isAdmin ? <Button className='send-message-button' onClick={()=>openWarnings(popularUserDetails.userInfo.id,popularUserDetails.userInfo.username)}>Remove User</Button>:
                                    <Button className='send-message-button' onClick={()=>goToSelectedUserPage(popularUserDetails.userInfo.username)}>Send Message</Button>
                                }
                                <Modal
                                    show={showWarning} 
                                    onHide={()=>closeWarnings()}
                                    size="md"
                                    aria-labelledby="contained-modal-title-vcenter"
                                    centered
                                    >
                                    <Form className='join-form'>
                                        <Stack direction='horizontal' gap={2} className='title_stack'>
                                            <span class="material-symbols-outlined icons" style={{fontSize:'2vw'}}>groups</span>
                                            Want to Remove User {userToDelete} ? 
                                    </Stack>
                                        <p style={{color:'red'}}>Warning ! This step CANNOT be undone !</p>
                                        
                                        <Stack direction='horizontal' gap={4}>
                                            <Button className='warning-button' onClick={()=>setShowWarning(false)}>
                                                Cancel
                                            </Button>
                                            <Button className='warning-button' onClick={()=>handleAdminDelete()}>
                                                Delete
                                            </Button>
                                        </Stack>
                                    </Form>
                                </Modal>
                                <hr style={{width:'90%'}}></hr>
                                <p style={{fontWeight:'bold'}}>Here are some details about me:</p>
                                <Stack direction="horizontal" className='info-stack'>
                                    <Stack className='info-block'> 
                                        <p style={{margin:'0', fontWeight:'bold'}}>{popularUserDetails.userInfo.totalPosts}</p>
                                        <p>Posts</p>
                                    </Stack>
                                    <Stack className='info-block'>
                                        <p style={{margin:'0', fontWeight:'bold'}}>{popularUserDetails.userInfo.connections}</p>
                                        <p>Connections</p>
                                    </Stack>
                                    <Stack className='info-block'>
                                        <p style={{margin:'0', fontWeight:'bold'}}>{popularUserDetails.userInfo.expertise}</p>
                                        <p>Experties</p>
                                    </Stack>
                                </Stack>
                                {popularUserDetails.media.length >  0 &&
                                    <>
                                        <p style={{fontWeight:'bold', marginTop:'1vw'}}>You can follow me on </p>
                                        <Stack direction='horizontal'  gap={3} style={{marginBottom:'1vw', justifyContent:'center'}}>
                                            {popularUserDetails.media.map((account)=>{
                                                return(
                                                    <Nav.Link >
                                                        <Image  src={account.image}  className="social-media-img"  roundedCircle />
                                                    </Nav.Link>    
                                                );                   
                                            })}
                                        </Stack>
                                    </>
                                }
                                <hr style={{width:'90%'}}></hr>
                                {popularUserDetails.post.length >  0 && 
                                    <>
                                    <p style={{fontWeight:'bold', marginTop:'0.5vw'}}>Check Out My Journey</p>
                                    <ListGroup className='history-list'>
                                        {popularUserDetails.post.map((post)=>{
                                            <ListGroup.Item as="li" className='activity-list-item'  onClick={()=>goToSearchedPost(post.channel, post.id)}>
                                                <div className="fw-bold" style={{color:'#d84434'}}>{post.channel}</div>
                                                <p style={{fontSize:'small'}} >{showPreview(post.data,10)}</p>
                                            </ListGroup.Item>
                                        })}
                                    </ListGroup>
                                    </>
                                }
                            </>
                        }
                        </Offcanvas.Body>
                    </Offcanvas>
                </ListGroup>
                {!isAdmin && 
                    <>
                        <hr></hr>
                        <h6 style={{fontWeight:'bold', marginLeft:'0.5vw'}}> # Suggested Channels for you</h6>
                        <p style={{margin:'0', fontSize:'small',marginLeft:'0.5vw'}}>Discover content from channels you'll love and engage with.</p>
                        <ListGroup variant="flush" className='profile-channel-list'>
                            {allPopularChannels.length > 0 && allPopularChannels.map((channel)=>(
                                <ListGroup.Item className='channel-item' onClick={()=>openChannelOnOtherPage(channel.name)}># • {channel.name}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </>
                }
            </div>
            <div className='profile-div'>
                <img src={newAvatar} style={{width:'7vw', margin:'1vw'}}></img>
                {isEditMode ?
                    <>
                        <Button className='edit-profile-btn' style={{marginBottom:'1vw'}} onClick={()=>setAvatarModal(true)}> 
                            Change Profile Pic
                        </Button>
                        <Modal
                        show={avatarModal} 
                        onHide={closeAvatarModal}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        >
                        <Form className='join-form'>
                            <Stack direction='horizontal' gap={2} className='title_stack'>
                                <span class="material-symbols-outlined icons" style={{fontSize:'2vw'}}>groups</span>
                                Choose Your Profile Pic 
                            </Stack>
                            <Row style={{marginTop:'2vw', marginBottom:'2vw'}}>
                                {[301, 302, 303, 304, 306, 305].map((imgNum, index) => (
                                    <Col>
                                        <Nav.Link onClick={()=>setSelectedPic(imgNum)}>
                                            <Image 
                                                src={`/Group${imgNum}.png`} 
                                                className='profile-row-img' 
                                                style={{ width: '100%', 
                                                        height: 'auto', 
                                                        maxWidth: '4vw',
                                                        border: (selectedPic === imgNum ? "#fc0380 2px solid" : "")}}
                                                roundedCircle 
                                            />
                                        </Nav.Link>
                                    </Col>
                                ))}
                            </Row>
                            <Stack direction='horizontal' gap={4}>
                                <Button className='channel-form-button' onClick={closeAvatarModal}>
                                    Cancel
                                 </Button>
                                <Button className='channel-form-button' onClick={()=>handleNewPic()}>
                                    Select
                                </Button>
                            </Stack>
                        </Form>
                    </Modal>
                    <Button className='save-changes-btn' onClick={()=>{setIsEditMode(!isEditMode); handleSaveChanges();}}> 
                        Save Changes
                    </Button>
                 </>
                 :
                 <Button className='edit-profile-btn' onClick={()=>setIsEditMode(!isEditMode)}>Edit Profile</Button>
                }  
                <Stack direction="horizontal" className='info-stack' style={{marginTop:"2vw"}}>
                        <Stack className='info-block'> 
                            <p style={{margin:'0', fontWeight:'bold'}}>{newPostCount}</p>
                            <p>Posts</p>
                        </Stack>
                        <Stack className='info-block'>
                            <p style={{margin:'0', fontWeight:'bold'}}>{newConnections}</p>
                            <p>Connections</p>
                        </Stack>
                    </Stack>
                <div className='social-media-block'>
                    <Stack direction='horizontal'>
                        <p style={{fontWeight:'bold', margin:'0'}}># Add Social Media</p>
                        {!gotMediaLimit && <Nav.Link className='ms-auto' onClick={openMediaModal}><span class="material-symbols-outlined icons" >add</span></Nav.Link>}
                        <Modal
                            show={showMediaModal} 
                            onHide={closeMediaModal}
                            size="md"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                            >
                            <Form className='join-form'>
                                <Stack direction='horizontal' gap={2} className='title_stack'>
                                    <span class="material-symbols-outlined icons" style={{fontSize:'2vw'}}>groups</span>
                                    Add Social Media Account 
                                </Stack>
                                <Form.Group className='form-group'> 
                                    <Form.Label >
                                        Media 
                                    </Form.Label>
                                    <Form.Select aria-label="Default select example" style={{borderColor:'blue'}} 
                                        onChange={(e)=>{setSelectedMediaType(e.target.value); setSelectedMediaImage(`${e.target.value}.png`);}}> 
                                        <option>Select media</option>
                                        <option value="1">Instagram</option>
                                        <option value="2">facebook</option>
                                        <option value="3">LinkedIn</option>
                                        <option value="4">SnapChat</option>
                                        <option value="5">Reddit</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className='form-group'>
                                    <Form.Label >
                                        Account Link
                                    </Form.Label>
                                    <Form.Control style={{borderColor:'red'}} onChange={(e)=>setSelectedMediaLink(e.target.value)}/>
                                </Form.Group>
                                <Stack direction='horizontal' gap={4}>
                                    <Button className='channel-form-button' onClick={closeMediaModal}>
                                        Cancel
                                    </Button>
                                    <Button className='channel-form-button' onClick={()=>handleNewMedia()}>
                                        Add
                                    </Button>
                                </Stack>
                            </Form>
                        </Modal>
                    </Stack>
                    {gotMediaLimit ? 
                        <p style={{fontSize:'small', color:'red'}}>
                            You have reached Your Limit. You can link at most 3 Social media acccounts.
                        </p>:"" 
                    }
                    <hr></hr>
                    {currUserDetails.media && currUserDetails.userInfo  && currUserDetails.media.map((media)=>{
                        return(
                            <Stack direction='horizontal' className='media-item-stack'>
                                <img src={media.image} style={{width:'1.5vw', marginRight:'0.5vw'}}></img>
                                <p style={{margin:'0'}}>{media.link}</p>
                                <Nav.Link className=' ms-auto' onClick={()=>handleDeleteMedia(media.id, currUserDetails.userInfo.id)}>
                                    <span class="material-symbols-outlined icons" style={{fontSize:'1vw'}}>
                                        remove
                                    </span>
                                </Nav.Link>
                            </Stack>
                        );
                    })}
                </div>
            </div>
            <div className='editable-profile'>
                <Form>
                    <Row className='mb-3'>
                        <Form.Group md='6' as={Col}>
                            <Form.Label>Name</Form.Label>
                            <Form.Control  
                                type="text"
                                placeholder={newName}
                                value={newName}
                                onChange={(e)=>setNewName(e.target.value)}
                                readOnly ={isEditMode ? false : true}
                            />
                        </Form.Group>
                        <Form.Group md='4'  as={Col}>
                            <Form.Label>Username</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>@</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder={newUsername}
                                    value={newUsername}
                                    onChange={(e)=>setNewUsername(e.target.value)}
                                    readOnly ={isEditMode ? false : true}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    <Row className='mb-3'>
                        <Form.Group md='4' as={Col}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control  
                                type="text"
                                placeholder={newEmail}
                                value={newEmail}
                                readOnly 
                            />
                        </Form.Group>
                        <Form.Group md='4' as={Col}>
                            <Form.Label>Profession</Form.Label>
                            <Form.Control  
                                type="text"
                                placeholder={newProfession}
                                value={newProfession}
                                onChange={(e)=>setNewProfession(e.target.value)}
                                readOnly ={isEditMode ? false : true}
                            />
                        </Form.Group>
                        <Form.Group md='4' as={Col}>
                            <Form.Label>Experties</Form.Label>
                            <Form.Control  
                                type="text"
                                placeholder={newExpertise}
                            />
                        </Form.Group>
                    </Row>     
                    <Row className='mb-3'>
                        <Form.Group md='12' as={Col}>
                            <Form.Label>Skills</Form.Label>
                            <Form.Control  
                                type="text"
                                placeholder={newSkills}
                                value={newSkills}
                                onChange={(e)=>setNewSkills(e.target.value)}
                                readOnly ={isEditMode ? false : true}
                            />
                        </Form.Group>
                    </Row>     
                </Form>
                <hr style={{marginBottom:'1vw', marginTop:'2vw'}}></hr>
                <p style={{fontWeight:'bold'}}># Activity History</p>
                <ListGroup className='history-list'>
                    {currUserDetails.post && currUserDetails.post.map((currPost)=>{
                        return(
                            <ListGroup.Item as="li" className='activity-list-item' onClick={()=>goToSearchedPost(currPost.channel, currPost.id)}>
                                <div className="fw-bold" style={{color:'#d84434'}}>{currPost.channel}</div>
                                <p style={{fontSize:'small'}} >{showPreview(currPost.data,10)}</p>
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            </div>
        </div>
    )
}

export default Profile;