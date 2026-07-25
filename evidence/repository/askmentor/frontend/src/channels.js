
import './channels.css';
import Button from 'react-bootstrap/Button';
import './homepage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import Overlay from 'react-bootstrap/Overlay';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Popover from 'react-bootstrap/Popover';
import Badge from 'react-bootstrap/Badge';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import {useLocation } from 'react-router-dom';

function Channels(){

    // Variables for navigation purpose
    const navigateTo = useNavigate();
    const location = useLocation();
    const { channelFromState, postFromState } = location?.state || {};

    // Variables for textarea reference used to refer textarea
    const topicTextAreaRef = useRef(null);
    const dataTextAreaRef = useRef(null);
    const replyTextAreaRef = useRef(null);

    // Variables for file popover open which shows included files 
    const replyFilePopoverTarget = useRef(null);
    const postFilePopoverTarget = useRef(null);
    const [showFilePopover, setShowFilePopover] = useState(false);
    const [showFileReplyPopover, setShowFileReplyPopover] =  useState(false);

    // Variables to store all channels information , selected channel's details as well
    // as user input for creating new channel
    const [allChannels, setAllChannels] = useState([]);
    const [channel, setChannel] = useState("Homepage");
    const [currChannelId, setCurrChannelId] = useState(0);
    const [currentChannelDetails, setCurrentChannelDetails] = useState([]);
    const [showChannelModal, setShowChannelModal] = useState(false);
    const [channelName, setChannelName] = useState('');
    const [channelError, setChannelError] = useState(false);
    const [channel401Error, setChannel401Error] = useState(false);
    const [channel500Error, setChannel500Error] = useState(false);

    // Variables to store user input for creating new post as well as opening post creating form
    const [showPostModal, setShowPostModal] = useState(false);
    const [topic, setTopic] = useState('');
    const [data, setData] = useState('');
    const [reply, setReply] =  useState('');
    const [files, setFiles] = useState([]);
    const [post500Error, setPost500Error] = useState(false);
    const [postError, setPostError] = useState(false);

    // Variables to store current user's details as well as current user's connections, 
    // and connected person's details
    const[currUserDetails, setCurrUserDetails] = useState([]);
    const [connections, setConnections] =  useState([]);
    const [showProfileCanvas, setShowProfileCanvas] = useState(false);
    const [selectedUserDetails, setselectedUserDetails ] = useState([]);

    // Variables to store user inputs to reply for post, as well as 
    // to open comment box for reply
    const [replyFiles, setReplyFiles] = useState([]);
    const fileReplyRef = useRef(null);
    const [showCommentInput, setShowCommentInput] = useState(0);
    

    // Variables to store information about channel, post or poeple deletion
    // Admin uses this functions to delete channel, post or poeple
    const[showWarning, setShowWarning] = useState(false);
    const [ itemToDelete, setItemToDelete] = useState('');
    const [ itemToDeleteId, setItemToDeleteId] = useState(0);
    const [fromChannel , setFromChannel] = useState("");
    const [fromChannelId , setFromChannelId] = useState(0);
    const [ itemToDeleteType, setItemToDeleteType] = useState('');


    // Open or close  warnings when admin wants to delete channel, post or poeple
    const openWarnings = (category, item, itemId) =>{
        if(category === "channel"){
            setItemToDelete(item);
            setItemToDeleteId(itemId);
        }
        else{
            setItemToDeleteId(itemId);
        }
      
        setItemToDeleteType(category);
        setShowWarning(true);
    }

    const closeWarnings = () =>{
        setItemToDelete("");
        setItemToDeleteId(0);
        setItemToDeleteType("");
        setFromChannel("");
        setFromChannelId(0);
        setShowWarning(false);
    }



    /**
     * Functionality to retrive all details about current logged in user
     * as well as retrieve all channels, or go to searched post 
     */
    useEffect(()=>{
        getCurrUserDertails();
        getAllChannels();
    },[]);


    useEffect(()=>{
        getAllChannels();  
    },[location.state]);
   
    
    // Functionality to retrive all channels
    const getAllChannels = async() =>{
        try {
            const response =  await axios.get(`${window.BASE_URL}/getAllChannels`);
            if (response.status === 200) {
                setAllChannels(response.data);
                if(channelFromState){
                    response.data.map((currChannel)=>{
                        if(channelFromState === currChannel.name){
                            handleChannelSelection(currChannel.id, currChannel.name)
                        }
                    })
                }
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during retriving all channels details: ",error);
        }
    }


    // Functionality to scroll to required post for search purpose
    useEffect(()=>{
        if(postFromState){
            const searchedPost = document.getElementById(postFromState);
            console.log("searchedPost",searchedPost);
            if(searchedPost){
                searchedPost.scrollIntoView({behavior:'smooth'});
            }
        }
        console.log("Successfully retrieved all channels details");
    },[currentChannelDetails]);


    // Functionality to retrieve logged in user's details
    const getCurrUserDertails = async() =>{
        const username  =  sessionStorage.getItem('session_user');
        const data = { username };
        try {
            const response =  await axios.post(`${window.BASE_URL}/getUserDetails`, data);
            if (response.status === 200) {
                setCurrUserDetails(response.data.userInfo);
                getAllConnections(response.data.userInfo.id);
                console.log("Successfully retrieved current user details");
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during retriving current user details: ",error);
        }
    }
   
    // Functionality to retrive all user's who are conncted to logged in user
    const getAllConnections = async(currUser) =>{
        try {
            const response =  await axios.get(`${window.BASE_URL}/getConnectedUsers`,{ params: {userId: currUser}});
            if (response.status === 200) {
                setConnections(response.data);
                console.log("Successfully retrieved all connections");
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during retriving all connections: ",error);
        }
    }

    // Functionality to retrive all posts for current channel
    const handleChannelSelection = async (channelId, channelName) =>{
        setChannel(channelName);
        setCurrChannelId(channelId);
        try {
            const response = await axios.get(`${window.BASE_URL}/getChannelPosts`,
            { params: {channel:channelId}});
            if (response.status === 200) {
                setCurrentChannelDetails(response.data);
                console.log(response.data);
            } 
            else if(response.status === 401){
                console.log(response.message)
            }
        } catch (error){
            console.error("Catched axios error during retriving channel post: ",error);
        }
    }

    // Functionality to open or close channel creation form
    const openChannelModal =()=>{
        setShowChannelModal(true);
    }

    const closeChannelModal = ()=>{
        closeChannelErrors();
        setShowChannelModal(false);
    }

    const closeChannelErrors= () =>{
        setChannel401Error(false);
        setChannel500Error(false);
        setChannelError(false);
    }


    // Functionality to add new channel 
    const addChannel= async()=>{
        if(!channelName){
            setChannelError(true);
            return;
        }
        const data = { channelName };
        try {
            const response =  await axios.post(`${window.BASE_URL}/addChannel`, data);
            if (response.status === 200) {
                setChannelName('');
                closeChannelModal();
                getAllChannels();
                console.log("Successfully added new channel");
            } 
            else if(response.status === 401){
                setChannel401Error(true);
            }
        } catch (error) {
            setChannel500Error(true);
            console.error("Catched axios error during adding new channel: ",error);
        }
    }


    // Functionality to open/close post creation form
    const openPostModal =()=>{
        setShowPostModal(true);
    }

    const closePostModal = ()=>{
        setTopic('');
        setData('');
        setFiles([]);
        setShowFilePopover(false);
        closePostErrors();
        setShowPostModal(false);
    }

    const closePostErrors = () =>{
        setPostError(false);
        setPost500Error(false);
    }


    // Functonality to open/close file popover which shows selected files
    const clickFilePopover = ()=>{
        setShowFilePopover(!showFilePopover);
    }

   
    // Functionality to include/remove file for post or reply to post
    const handleFileInput =(event, isPost, isReply)=>{
        const files = event.target.files;
        if (files) {
            if(isPost){
                setFiles(prev =>[...prev,...Array.from(files)]);
            }
            else if(isReply){
                setReplyFiles(prev =>[...prev,...Array.from(files)]);
            }
        }
    }

    const handleFileDelete =(fileName, isPost, isReply) =>{
         if (files) {
            if(isPost){
                setFiles((prev) => prev.filter((file) => file.name !== fileName));
                if(files.length === 0){
                    setShowFilePopover(false);
                }
            }
            else if(isReply){
               setReplyFiles((prev) => prev.filter((file) => file.name !== fileName));
                if(replyFiles.length === 0){
                    setShowFileReplyPopover(false);
                }
            }
            
        }
    }

    // Functionality to close textarea to input reply to post
    const closeCommentInput = () =>{
        setReply('');
        setReplyFiles([]);
        setShowFileReplyPopover(false);
        setShowCommentInput(0);
    }

    // Functionality to add new post, new reply to post and selected files for the post/reply
    const handleNewPost = async() =>{
        if(!topic || !data ){
            setPostError(true);
            return;
        }
        const userId = currUserDetails.id;
        const channelId = currChannelId;
        const replyTo = 0;
        const requestData = { userId,channelId, replyTo, topic, data };
        try {
            const response =  await axios.post(`${window.BASE_URL}/addPost`, requestData);
            if (response.status === 200) {
                closePostModal();
                handleFileUpload(response.data.postId,true,false);
                handleChannelSelection(channelId, channel);
                console.log("Successfully added new post");
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during adding new post: ",error);
        }
    }
    
    const handleNewReply = async(replyToPost) =>{
        if(!reply){
            return;
        }
        const userId = currUserDetails.id;
        const channelId = currChannelId;
        const replyTo = replyToPost;
        const data = reply;
        const requestData = { userId,channelId, replyTo, topic, data };
        try {
            const response =  await axios.post(`${window.BASE_URL}/addPost`, requestData);
            if (response.status === 200) {
                closeCommentInput();
                handleFileUpload(response.data.postId,false,true);
                handleChannelSelection(channelId, channel);
                console.log("Successfully added new reply");
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during adding new reply: ",error);
        }
    }

    const handleFileUpload = async (postId,isPost, isReply)=>{
        if (isPost && files.length === 0){
            return;
        }
        else if(isReply && replyFiles.length === 0){
            return;
        }

        const formData = new FormData();
        formData.append('postId',postId);
        if(isPost){
            files.forEach((file)=>{
                formData.append('allFiles',file)
            });
        }
        else{
            replyFiles.forEach((file)=>{
                formData.append('allFiles',file)
            });
        }
        try {
            const response = await axios.post(`${window.BASE_URL}/uploadFiles`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                setFiles([]);
                setReplyFiles([]);
                console.log("Files uploaded successfully");
            }
        } catch (error) {
            console.error("Error while uploading files:", error);
        }
    }


    // Functionality to like or dislike post/reply
    const handlePostLike = async(post) =>{
        const postId = post;
        const data = {postId};
        try {
            const response = await axios.post(`${window.BASE_URL}/likePost`, data);
            if (response.status === 200) {
                console.log("Liked post successfully");
                handleChannelSelection(response.data.channelId,response.data.channelName);
            }
        } catch (error) {
            console.error("Error liking post:", error);
        }
    }

    const handlePostDislike = async(post) =>{
        const postId = post;
        const data = {postId};
        try {
            const response = await axios.post(`${window.BASE_URL}/dislikePost`, data);
            if (response.status === 200) {
                console.log("Disliked post successfully");
                handleChannelSelection(response.data.channelId,response.data.channelName);
            }
        } catch (error) {
            console.error("Error disliking post:", error);
        }
    }


    // Functionallity to navigate to message page and open selected user's profile
    const goToSelectedUserPage = (currUsername)=>{
        const params = {
            userFromState: currUsername,
        }
        navigateTo('/messages',{state:params});
    }


    // Functionality to navigate to channel page and go to searched post
    const goToSearchedPost =(channel, postId) =>{
        closeProfileCanvas();
        const params = {
            channelFromState: channel,
            postFromState: postId
        }
        navigateTo('/channels',{state:params});
    }


    // Functionality to show preview of long post
    const showPreview =(text, num)=>{
        const words = text.split(' ');
        return words.slice(0, num).join(' ')+" . . . . . . . .";
    }
    

    // Funcationality to create URL for file
    const createURL = (fileData, fileType) =>{
        const file = new Uint8Array(fileData.data);
        const blob = new Blob([file], { type: fileType });
        return URL.createObjectURL(blob);
    }


    // Functionality to opne/close canvas to show selected user's details
    // and retrieve the selected user's details
    const openProfileCanvas =()=>{
        setShowProfileCanvas(true);
    }

    const closeProfileCanvas = ()=>{
        setShowProfileCanvas(false);
    }

    useEffect(()=>{
        console.log("connected users details is ", selectedUserDetails.userInfo);
    },[showProfileCanvas]);

    
    const getselectedUserDetails = async(user) =>{
        const username  =  user;
        const data = { username };
        try {
            const response =  await axios.post(`${window.BASE_URL}/getUserDetails`, data);
            if (response.status === 200) {
                setselectedUserDetails(response.data);
                console.log("Successfully retrieved connected  user details",selectedUserDetails);
                openProfileCanvas();
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during retriving connected user details: ",error);
        }
    }


    /**
     * Functionality to check whether current user is admin
     * and let admin delete post, people and channel
     */ 
    const[isAdmin, setIsAdmin] =  useState(false);
    useEffect(()=>{
        if(sessionStorage.getItem('isAdmin') === "true"){
            setIsAdmin(true);
            
        }
    });

    const handleAdminDelete = async() =>{
        if(itemToDeleteType === "channel"){
            const channel = itemToDeleteId;
            const data = {channel};
            try {
                const response =  await axios.post(`${window.BASE_URL}/deleteChannel`, data);
                if (response.status === 200) {
                    closeWarnings();
                    setChannel("Homepage");
                    getAllChannels();
                    console.log("Successfully deleted channel");
                } 
                else{
                    console.log(response.message)
                }
            } catch (error) {
                console.error("Catched axios error during deleting channel: ",error);
            }
        }
        else{
            const postId = itemToDeleteId;
            const data = {postId};
            try {
                const response =  await axios.post(`${window.BASE_URL}/deletePost`, data);
                if (response.status === 200) {
                    closeWarnings();
                    if(channel && currChannelId){
                        handleChannelSelection(currChannelId,channel);
                    }
                    console.log("Successfully deleted post");
                } 
                else{
                    console.log(response.message)
                }
            } catch (error) {
                console.error("Catched axios error during deleting post: ",error);
            }
        }
    }

    return(
       <div className="channel-page">
            <Modal
                show={showChannelModal} 
                onHide={closeChannelModal}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Form className='join-form'>
                    <Stack direction='horizontal' gap={2} className='title_stack'>
                        <span class="material-symbols-outlined icons" style={{fontSize:'2vw'}}>groups</span>
                        Create new Channel
                    </Stack>
                    {channelError ? <p style={{fontSize:'small', color:'red', margin:'0', padding:'0'}}> Please fill out Channel name field</p>:<></>}
                    {channel500Error ? <p style={{fontSize:'small', color:'red', margin:'0', padding:'0'}}> Server error occured : Try again !</p>:<></>}
                    {channel401Error ? <p style={{fontSize:'small', color:'red', margin:'0', padding:'0'}}> Channel with given name already exists</p>: <></>}
                    <Form.Group className='form-group'>
                        <Form.Label >Channel Name</Form.Label>
                        <Form.Control 
                            type='text'
                            style={{borderColor:'red'}}
                            onChange={(e)=>{setChannelName(e.target.value);closeChannelErrors();}}    
                        />
                    </Form.Group>
                    <Stack direction='horizontal' gap={4}>
                        <Button className='channel-form-button' onClick={closeChannelModal}>Cancel</Button>
                        <Button className='channel-form-button' onClick={addChannel}>Create</Button>
                    </Stack>
                </Form>
            </Modal>
            <div className='small-container'>
                <Button className='channel-button' onClick={openChannelModal}><span class="material-symbols-outlined"> add </span>  New Channel</Button>
                <ListGroup variant="flush" className='channel-list' >
                    <ListGroup.Item> # • All Channels</ListGroup.Item>
                    <ListGroup.Item className='channel-item'>
                            <Nav.Link onClick={()=>setChannel("Homepage")}># • Homepage</Nav.Link>
                    </ListGroup.Item>
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
                                {itemToDeleteType === "channel" ?`Want to delete Channel ${itemToDelete} ?`:`Want to delete post ? `} 
                            </Stack>
                            <p style={{color:'red'}}>Warning ! This step CANNOT be undone !</p>
                            <Stack direction='horizontal' gap={4}>
                                <Button className='warning-button' onClick={()=>setShowWarning(false)}>Cancel</Button>
                                <Button className='warning-button' onClick={()=>handleAdminDelete()}>Delete</Button>
                            </Stack>
                        </Form>
                    </Modal>
                    {allChannels.length > 0 && allChannels.map((channel)=>(
                         <ListGroup.Item className='channel-item'>
                            <Nav.Link  onClick={()=>handleChannelSelection(channel.id, channel.name)}> # • {channel.name}</Nav.Link>
                            {isAdmin && <Nav.Link className='ms-auto' onClick={()=>openWarnings("channel",channel.name,channel.id)}>
                                <span class="material-symbols-outlined icons" style={{fontSize:'small'}}>delete</span>
                                </Nav.Link>
                            }
                        </ListGroup.Item>
                    ))}      
                </ListGroup>
            </div>
            <div className='large-container'>
                <Modal
                    show={showPostModal} 
                    onHide={closePostModal}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    >
                    <Form className='join-form'>
                        {channel === "Homepage" ? 
                            <Stack direction='horizontal' gap={2} className='title_stack'>
                                <span class="material-symbols-outlined icons" style={{fontSize:'2vw'}}>groups</span>
                                How to Create New Post 
                            </Stack>
                        :
                            <>
                                <Stack direction='horizontal' gap={2} className='title_stack'>
                                    <span class="material-symbols-outlined icons" style={{fontSize:'2vw'}}>groups</span>
                                    Create new Post 
                                </Stack>
                                <p>Channel : <span style={{fontWeight:'bold'}}>{channel}</span></p>
                            </>
                        }
                        {postError ? <p style={{fontSize:'small', color:'red', margin:'0', padding:'0'}}> Please fill out all required field</p>:<></>}
                        {post500Error ? <p style={{fontSize:'small', color:'red', margin:'0', padding:'0'}}> Server error occured : Try again !</p>:<></>}
                        <Form.Group className='post-form-group'>
                            <Form.Label  >
                                Post Topic
                            </Form.Label>
                            <Form.Control 
                                type='text'
                                ref={topicTextAreaRef}
                                style={{borderColor:'red'}} 
                                onChange={(e)=>{setTopic(e.target.value);closePostErrors();}} 
                                value={topic}
                                placeholder={channel === "Homepage" && "Add post's topic here."}
                                readOnly = {channel === "Homepage" ? true :  false}
                            />
                        </Form.Group>
                        <Form.Group className='post-form-group'>
                            <Form.Label  >
                                Post Data
                            </Form.Label>
                            <Form.Control 
                                type='text'
                                ref={dataTextAreaRef}
                                as="textarea" 
                                rows={4} 
                                style={{borderColor:'blue'}}
                                onChange={(e)=>{setData(e.target.value); closePostErrors();}}
                                value={data}
                                placeholder={channel === "Homepage" && "Add post's data here."}
                                readOnly = {channel === "Homepage" ? true :  false}
                            />
                        </Form.Group>
                        <Form.Group className='post-form-group file-group'>
                            <Form.Control 
                                type="file" 
                                multiple 
                                style={{borderColor:'#dedb85', marginRight:'0.5vw'}} 
                                onChange={(e) => handleFileInput(e, true, false)}
                            />
                            <Nav.Link onClick={()=>{ if(files.length > 0) clickFilePopover();}} ref={postFilePopoverTarget}>
                                <Badge pill bg="success">
                                    <h6 style={{margin:'0', padding:'0', fontWeight:'bold'}}>{files.length}</h6>
                                </Badge>
                            </Nav.Link>
                            <Overlay target={postFilePopoverTarget} show={showFilePopover} placement='right'>
                                <Popover id="popover-basic"> 
                                    <ListGroup as="ol" numbered>
                                        {files.length > 0 && files.map((file)=>(
                                            <ListGroup.Item
                                            as="li"
                                            className="d-flex justify-content-between align-items-start"
                                            >                                        
                                                <div className="fw-bold">{file.name}</div>                                
                                                <Nav.Link style={{marginLeft:'2vw'}} onClick={()=>handleFileDelete(file.name, true, false)} >
                                                    <span class="material-symbols-outlined icons" style={{fontSize:'small'}}>close</span>
                                                </Nav.Link>
                                            </ListGroup.Item>
                                        ))}       
                                    </ListGroup>
                                </Popover>
                            </Overlay>
                        </Form.Group>
                        <Stack direction='horizontal' gap={4}>
                            { channel !== "Homepage" ? 
                                <>
                                    <Button className='channel-form-button' onClick={closePostModal}>Cancel</Button>
                                    <Button className='channel-form-button' onClick={handleNewPost}>Create</Button>
                                </>
                                :
                                <Button className='channel-form-button' onClick={closePostModal}>Close</Button>
                            }
                        </Stack>
                    </Form>
                </Modal>
                <div className='new-post-block'>
                    <h4 style={{fontWeight:'bold'}}># • {channel} </h4>
                    {channel === "Homepage" 
                        ?
                        <Button className='ms-auto new-post-button' onClick={openPostModal}>How to Create New Post?</Button>
                        :   
                        <Button className='ms-auto new-post-button' onClick={openPostModal}>What's on Your Mind?</Button> 
                    }
                    
                </div>
                {channel === "Homepage" ? 
                    <div className='homepage-channel'>
                        <span class="material-symbols-outlined icons" style={{fontSize:'2vw', margin:'0', padding:'0', color:'#f86714'}}>groups</span>
                        <h5 style={{fontWeight:'bold'}}>Welcome to AskMentor</h5>
                        <p>Start engaging with other members by creating channels, posting, replying, and now... messaging!</p>
                        <ul>
                            <li><strong>Create a new channel:</strong> Start a fresh topic!</li>
                            <li><strong>Add a new post:</strong> Share your thoughts in any of the channels.</li>
                            <li><strong>Reply to posts:</strong> Join in and keep the conversation alive!</li>
                            <li><strong>Send direct messages:</strong> Want to talk privately? Send a direct message.</li>
                        </ul>
                        <p style={{fontWeight:'bold'}}>Start Browsing Now</p>
                    </div>
                    :
                    <div className='channel-posts'>
                        {currentChannelDetails && currentChannelDetails.length > 0 && (()=>{
                            const postsStructure = [];
                            let i = 0;
                            while(i < currentChannelDetails.length){
                                const post = currentChannelDetails[i];
                                if(post.level === 0){
                                    postsStructure.push(
                                        <div  className="post-block" >
                                            <Stack direction='horizontal' style={{marginBottom:'2vw'}} >
                                                <img src={post.avatar} style={{width:'2vw'}}></img>
                                                <div className="ms-2 me-auto" style={{fontSize:'small'}}>
                                                    <div className="fw-bold">{post.name} </div>
                                                    {post.username}
                                                </div>
                                                <p className="ms-auto" style={{fontSize:'small', marginRight:'1vw'}}> posted on {new Date(post.datetime).toLocaleString()}</p>
                                                {isAdmin && <Nav.Link onClick={()=>openWarnings("post","",post.id)}> 
                                                    <span class="material-symbols-outlined icons"  style={{fontSize:'small'}}>delete</span>
                                                    </Nav.Link>
                                                }
                                            </Stack>
                                            <hr></hr>
                                            <p style={{fontWeight:'bold'}}>{post.topic}</p>
                                            <p id={post.id}> {post.data}</p>
                                            <Stack direction="horizontal" gap={3}>
                                                {post.files.map((file) => { 
                                                    return(                              
                                                        <a href={createURL(file.file, file.fileType)}
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            style={{ fontSize: 'small', textDecoration: 'none' }}>
                                                            {file.fileName}
                                                        </a>
                                                    );                                           
                                                })}
                                             </Stack>
                                            <Stack direction='horizontal' gap={3} style={{ alignItems:'center'}}>
                                                <Nav.Link  
                                                    style={{ margin:'0', padding:'0', display:'flex', flexDirection:'row',alignItems:'center' }}
                                                    onClick={()=>handlePostLike(post.id)}>
                                                    <span style={{color:'#f86714', fontWeight:'bold'}}> {post.likes ?  post.likes : 0}</span>
                                                    <span 
                                                        class="material-symbols-outlined icons" 
                                                        style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714', fill:'#f86714'}}>
                                                            thumb_up
                                                    </span>
                                                </Nav.Link>
                                                <Nav.Link  
                                                    style={{ margin:'0', padding:'0', display:'flex', flexDirection:'row',alignItems:'center' }}
                                                    onClick={()=>handlePostDislike(post.id)}>
                                                    <span style={{color:'#f86714', fontWeight:'bold'}}>  {post.dislikes ? post.dislikes : 0}</span>
                                                    <span 
                                                        class="material-symbols-outlined icons" 
                                                        style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                                            thumb_down
                                                    </span>
                                                </Nav.Link>
                                                <Nav.Link onClick={()=>setShowCommentInput(post.id)} style={{ margin:'0', padding:'0'}}>
                                                    <span 
                                                        class="material-symbols-outlined icons" 
                                                        style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                                            reply
                                                    </span>
                                                </Nav.Link>
                                                {showCommentInput === post.id && 
                                                    <>     
                                                        {replyFiles.length > 0 &&
                                                            <Nav.Link 
                                                                className='ms-auto' style={{fontSize:'small', color:'white'}} 
                                                                onClick={()=>setShowFileReplyPopover(!showFileReplyPopover)}
                                                                ref={replyFilePopoverTarget}>
                                                                <Badge bg="warning" text="dark">
                                                                    Attached files {replyFiles.length}
                                                                </Badge>
                                                            </Nav.Link>
                                                        }
                                                        <Overlay target={replyFilePopoverTarget} show={showFileReplyPopover} placement='top'>
                                                            <Popover id="popover-basic"> 
                                                                <ListGroup as="ol" numbered>
                                                                    {replyFiles.length > 0 && replyFiles.map((file)=>(
                                                                        <ListGroup.Item
                                                                        as="li"
                                                                        className="d-flex justify-content-between align-items-start"
                                                                        style={{fontSize:'small'}}
                                                                        >                                        
                                                                            <div className="fw-bold">{file.name}</div>                                
                                                                            <Nav.Link style={{marginLeft:'2vw'}} onClick={()=>handleFileDelete(file.name, false, true)} >
                                                                                <span class="material-symbols-outlined icons" style={{fontSize:'small'}}>close</span>
                                                                            </Nav.Link>
                                                                        </ListGroup.Item>
                                                                    ))}       
                                                                </ListGroup>
                                                            </Popover>
                                                        </Overlay>
                                                        <Nav.Link 
                                                            style={{fontSize:'small', color:'#f86714'}}
                                                            onClick={()=> fileReplyRef.current.click()}
                                                            className={replyFiles.length > 0 ? "" : "ms-auto"}>
                                                            <span 
                                                                class="material-symbols-outlined icons" 
                                                                style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                                                    note_add
                                                            </span>
                                                        </Nav.Link>
                                                        <input 
                                                            type='file' 
                                                            style={{ display: 'none' }}
                                                            ref={fileReplyRef}
                                                            onChange={(e)=> handleFileInput(e,false, true)}
                                                        />
                                                        <Nav.Link style={{fontSize:'small', color:'#f86714', fontWeight:'bold'}} onClick={closeCommentInput}>                          
                                                            Cancel
                                                        </Nav.Link>
                                                        <Nav.Link style={{fontSize:'small', color:'#f86714' , fontWeight:'bold'}} onClick={()=>handleNewReply(post.id)}>
                                                            Send
                                                        </Nav.Link>
                                                    </>
                                                }
                                            </Stack>
                                            {showCommentInput === post.id &&
                                                <FloatingLabel controlId="xyz" label="Comments" style={{marginTop:'0.5vw'}}>
                                                    <Form.Control
                                                        as="textarea"
                                                        style={{ height: '70px' }}
                                                        ref = {replyTextAreaRef}
                                                        onChange={(e)=>setReply(e.target.value)}
                                                        value={reply}
                                                    />
                                                </FloatingLabel> 
                                            }
                                            <hr></hr>
                                            <p style={{fontWeight:'bold', fontSize:'small'}}>All replies : </p>
                                            {(()=>{
                                                const nestedReplies = [];
                                                i = i + 1;
                                                while(i < currentChannelDetails.length && currentChannelDetails[i].level != 0){
                                                    const childPost = currentChannelDetails[i];
                                                    nestedReplies.push(
                                                        <div className="reply-block" style={{marginLeft:`${childPost.level * 3}vw`, marginTop:'2vw'}}>
                                                            <Stack direction='horizontal' style={{marginBottom:'0.5vw'}} id={childPost.id}>
                                                                <img src={childPost.avatar} style={{width:'1.5vw'}}></img>
                                                                <div className="ms-2 me-auto" style={{fontSize:'small'}}>
                                                                    <div className="fw-bold">{childPost.name} </div>
                                                                    {childPost.username}
                                                                </div>
                                                                <p className="ms-auto" style={{fontSize:'small', marginRight:'1vw'}}> posted on {new Date(childPost.datetime).toLocaleString()}</p>
                                                                {isAdmin && <Nav.Link onClick={()=>openWarnings("post","",childPost.id)} > <span class="material-symbols-outlined icons"  style={{fontSize:'small'}}>delete</span></Nav.Link>}
                                                            </Stack>
                                                            <p id={childPost.id}>{childPost.data}</p>
                                                            <Stack direction="horizontal" gap={3}>
                                                                {childPost.files.map(file => (
                                                                    
                                                                    <a href={createURL(file.file, file.fileType)}
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                        style={{ fontSize: 'small', textDecoration: 'none' }}>
                                                                        {file.fileName}
                                                                    </a>
                                                            
                                                                ))}
                                                            </Stack>
                                                                <Stack direction='horizontal' gap={3}>
                                                                    <Nav.Link  
                                                                        style={{ margin:'0', padding:'0', display:'flex', flexDirection:'row',alignItems:'center' }}
                                                                        onClick={()=>handlePostLike(childPost.id)}>
                                                                         <span style={{color:'#f86714', fontWeight:'bold'}}> {childPost.likes ?  childPost.likes : 0}</span>
                                                                          
                                                                        <span 
                                                                            class="material-symbols-outlined icons" 
                                                                            style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714', fill:'#f86714'}}>
                                                                                thumb_up
                                                                        </span>
                                                                    </Nav.Link>
                                                                    <Nav.Link  
                                                                        style={{ margin:'0', padding:'0', display:'flex', flexDirection:'row',alignItems:'center' }}
                                                                        onClick={()=>handlePostDislike(childPost.id)}>
                                                                       <span style={{color:'#f86714', fontWeight:'bold'}}> {childPost.dislikes ? childPost.dislikes : 0}</span>
                                                                          
                                                                        <span 
                                                                            class="material-symbols-outlined icons" 
                                                                            style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                                                                thumb_down
                                                                        </span>
                                                                    </Nav.Link>
                                                                    <Nav.Link style={{fontSize:'small', color:'#f86714'}} onClick={()=>setShowCommentInput(childPost.id)}>
                                                                        <span 
                                                                            class="material-symbols-outlined icons" 
                                                                            style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                                                                reply
                                                                        </span>
                                                                    </Nav.Link>
                                                                    {showCommentInput === childPost.id && 
                                                                        <>     
                                                                            {replyFiles.length > 0 &&
                                                                                <Nav.Link 
                                                                                    className='ms-auto' style={{fontSize:'small', color:'white'}} 
                                                                                    onClick={()=>setShowFileReplyPopover(!showFileReplyPopover)}
                                                                                    ref={replyFilePopoverTarget}>
                                                                                    <Badge bg="warning" text="dark">
                                                                                        Attached files {replyFiles.length}
                                                                                    </Badge>
                                                                                </Nav.Link>
                                                                            }
                                                                            <Overlay target={replyFilePopoverTarget} show={showFileReplyPopover} placement='top'>
                                                                                <Popover id="popover-basic"> 
                                                                                    <ListGroup as="ol" numbered>
                                                                                        {replyFiles.length > 0 && replyFiles.map((file)=>(
                                                                                            <ListGroup.Item
                                                                                            as="li"
                                                                                            className="d-flex justify-content-between align-items-start"
                                                                                            style={{fontSize:'small'}}
                                                                                            >                                        
                                                                                                <div className="fw-bold">{file.name}</div>                                
                                                                                                <Nav.Link style={{marginLeft:'2vw'}} onClick={()=>handleFileDelete(file.name, false, true)} >
                                                                                                    <span class="material-symbols-outlined icons" style={{fontSize:'small'}}>close</span>
                                                                                                </Nav.Link>
                                                                                            </ListGroup.Item>
                                                                                        ))}       
                                                                                    </ListGroup>
                                                                                </Popover>
                                                                            </Overlay>
                                                                            <Nav.Link 
                                                                                style={{fontSize:'small', color:'#f86714'}}
                                                                                onClick={()=> fileReplyRef.current.click()}
                                                                                className={replyFiles.length > 0 ? "" : "ms-auto"}>
                                                                                <span 
                                                                                    class="material-symbols-outlined icons" 
                                                                                    style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                                                                        note_add
                                                                                </span>
                                                                            </Nav.Link>
                                                                            <input 
                                                                                type='file' 
                                                                                style={{ display: 'none' }}
                                                                                ref={fileReplyRef}
                                                                                onChange={(e)=> handleFileInput(e,false, true)}
                                                                            />
                                                                            <Nav.Link style={{fontSize:'small', color:'#f86714', fontWeight:'bold'}} onClick={closeCommentInput}>                          
                                                                                Cancel
                                                                            </Nav.Link>
                                                                            <Nav.Link style={{fontSize:'small', color:'#f86714' , fontWeight:'bold'}} onClick={()=>handleNewReply(childPost.id)}>
                                                                                Send
                                                                            </Nav.Link>
                                                                        </>
                                                                    }
                                                                </Stack>
                                                                {showCommentInput === childPost.id &&
                                                                    <FloatingLabel controlId="xyz" label="Comments" style={{marginTop:'0.5vw'}}>
                                                                        <Form.Control
                                                                            as="textarea"
                                                                            style={{ height: '70px' }}
                                                                            ref = {replyTextAreaRef}
                                                                            onChange={(e)=>setReply(e.target.value)}
                                                                            value={reply}
                                                                        />
                                                                    </FloatingLabel> 
                                                                }   
                                                        </div>
                                                    )
                                                    i = i + 1;
                                                }
                                                return nestedReplies;
                                            })()}
                                        </div>
                                    )
                                }
                            }
                            return postsStructure; 
                        })()}
                        
                    </div>
                }
            </div>
            <div className='small-container'>
                {currUserDetails ? 
                    <div className='profile-block'>
                        <img src={currUserDetails.avatar} style={{width:'30%'}}></img>
                        <p style={{margin:'0'}}>{currUserDetails.username}</p>
                        <p style={{fontWeight:'bold'}}>{currUserDetails.name}</p>
                        <Stack direction="horizontal" className='info-stack'>
                            <Stack className='info-block'> 
                                <p style={{margin:'0', fontWeight:'bold'}}>{currUserDetails.totalPosts}</p>
                                <p>Posts</p>
                            </Stack>
                            <Stack className='info-block'>
                                <p style={{margin:'0', fontWeight:'bold'}}>{currUserDetails.connections}</p>
                                <p>Connections</p>
                            </Stack>
                            <Stack className='info-block'>
                                <p style={{margin:'0', fontWeight:'bold'}}>{currUserDetails.expertise}</p>
                                <p>Expertise</p>
                            </Stack>
                        </Stack>
                        <Button className='profile-button' onClick={()=> navigateTo('/profile')}>View Profile</Button>
                    </div> 
                    :<></>
                }
                <div className='message-list-block'>
                    <ListGroup variant="flush" >
                        <ListGroup.Item style={{fontWeight:'bold'}}># • Direct Messages For You</ListGroup.Item>
                        {connections && connections.length > 0 && connections.map((user)=>(
                             <ListGroup.Item className='message-item'>
                                <img src={user.avatar} style={{width:'2vw', marginRight:'0.5vw'}}></img>
                                <p style={{margin:'0'}}>{user.name}<p className="view-profile-button" onClick={()=>getselectedUserDetails(user.username)}>View Profile</p></p>
                                <p className='ms-auto view-profile-button'  onClick={()=>goToSelectedUserPage(user.username)} >Message</p>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <Offcanvas show={showProfileCanvas} onHide={closeProfileCanvas} placement='end'>
                        <Offcanvas.Header >
                        <Offcanvas.Title style={{fontWeight:'bold'}}># User's Profile</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className='profile-canvas-body'>
                            {selectedUserDetails.userInfo &&
                            <>
                                <img src={selectedUserDetails.userInfo.avatar} className='canvas-img'></img>
                                <p style={{fontWeight:'bold', margin:'0'}}>@{selectedUserDetails.userInfo.username}</p>
                                <p>{selectedUserDetails.userInfo.name}</p>
                                <p>Hello {currUserDetails.name}! 👋 Nice to meet you.I am {selectedUserDetails.userInfo.profession}! Lets connect and share our ideas.</p>
                                <Button className='send-message-button' onClick={()=>goToSelectedUserPage(selectedUserDetails.userInfo.username)}>Send Message</Button>
                                <hr style={{width:'90%'}}></hr>
                                <p style={{fontWeight:'bold'}}>Here are some details about me:</p>
                                <Stack direction="horizontal" className='info-stack'>
                                    <Stack className='info-block'> 
                                        <p style={{margin:'0', fontWeight:'bold'}}>{selectedUserDetails.userInfo.totalPosts}</p>
                                        <p>Posts</p>
                                    </Stack>
                                    <Stack className='info-block'>
                                        <p style={{margin:'0', fontWeight:'bold'}}>{selectedUserDetails.userInfo.connections}</p>
                                        <p>Connections</p>
                                    </Stack>
                                    <Stack className='info-block'>
                                        <p style={{margin:'0', fontWeight:'bold'}}>{selectedUserDetails.userInfo.expertise}</p>
                                        <p>Experties</p>
                                    </Stack>
                                </Stack>
                                {selectedUserDetails.media.length >  0 &&
                                    <>
                                        <p style={{fontWeight:'bold', marginTop:'1vw'}}>You can follow me on </p>
                                        <Stack direction='horizontal' gap={3} style={{marginBottom:'1vw', justifyContent:'center'}}>
                                            {selectedUserDetails.media.map((account)=>{
                                                return(
                                                    <Nav.Link >
                                                        <Image  src={account.image} className="social-media-img"  roundedCircle />
                                                    </Nav.Link>
                                                )
                                            })}
                                        </Stack>
                                    </>
                                }
                                <hr style={{width:'90%'}}></hr>
                                {selectedUserDetails.post.length >  0 && 
                                    <>
                                    <p style={{fontWeight:'bold', marginTop:'0.5vw'}}>Check Out My Journey</p>
                                    <ListGroup className='history-list'>
                                        {selectedUserDetails.post.map((post)=>{
                                            <ListGroup.Item as="li" className='activity-list-item' onClick={()=>goToSearchedPost(post.channel, post.id)}>
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
                </div>
            </div>
       </div>
    )
}
export default Channels;