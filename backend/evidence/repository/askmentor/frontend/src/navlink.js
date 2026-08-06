import { useLocation , useNavigate} from 'react-router-dom'; 
import './homepage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';

function Navlink({removeAccess}){

    // Variable used for navigation between pages 
    const location = useLocation();
    const navigateTo = useNavigate();
    const isLandingPage = location.pathname === "/";

    // Variables to store user inout for search as well as search results 
    const [searchType, setSearchType] = useState(0);
    const [searchData, setSearchData] = useState('');
    const[searchPostResult, setSearchPostResult] = useState([]);
    const[searchPeopleResult, setSearchPeopleResult] = useState([]);
    const[searchChannelResult, setSearchChannelResult] = useState([]);


    // Functionality to open / close search modal
    const [showSearchModal, setShowSearchModal] = useState(false);

    const openSearchModal =()=>{
        setShowSearchModal(true);
    }

    const closeSearchModal = ()=>{
        setShowSearchModal(false);
        setSearchType(0);
        setSearchData('');
        setSearchPostResult([]);
        setSearchPeopleResult([]);
        setSearchChannelResult([]);
    }


    // Functionality to search post, channel or people 
    useEffect(()=>{
        console.log("Searched channel result is ", searchChannelResult);
    },[searchChannelResult]);

    useEffect(()=>{
        console.log("Searched post result is ", searchPostResult);
    },[searchPostResult]);

    useEffect(()=>{
        console.log("Searched person result is ", searchPeopleResult);
    },[searchPeopleResult]);

    useEffect(()=>{
        handleSearch();
    },[searchData]);

    const handleSearch = ()=>{
        console.log("search data is ",searchData );
        console.log("search type is ",searchType ); 
        if(searchType === 1){
           handlePostSearch();
        }
        else if(searchType  === 2){
            handlePersonSearch();
        }
        else if(searchType === 3){
           handleChannelSearch();
        }
    }
   
    const handlePostSearch = async () =>{
        const post = searchData;
        const data = {post};
        try {
            const response =   await axios.post(`${window.BASE_URL}/searchPost`,data);
            if (response.status === 200) {
                setSearchPostResult(response.data);
                console.log("Successfully searched post");
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during searching post: ",error);
        }
    }

    const handlePersonSearch = async () =>{
        try {
            const response =  await  axios.get(`${window.BASE_URL}/searchPerson`,{
                params:{
                    person: searchData
                }
            });
            if (response.status === 200) {
                setSearchPeopleResult(response.data);
                console.log("Successfully searched person");
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during searching person: ",error);
        }
    }

    const handleChannelSearch = async () =>{
        try {
            const response =  await axios.get(`${window.BASE_URL}/searchChannel`,{
                params:{
                    channel: searchData
                }
            });
            if (response.status === 200) {
                setSearchChannelResult(response.data);
                console.log("Successfully searched channel", response.data);
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during searching channel: ",error);
        }
    }
    

    // Navigate to searched channel  
    const goToSearchedChannel =(channel) =>{
        closeSearchModal();
        const params = {
            channelFromState: channel,
        }
        navigateTo('/channels',{state:params});
    }

    // Navigate to searched user profile  
    const goToSearchedPerson =(person) =>{
        closeSearchModal();
        const params = {
            personFromState: person,
        }
        navigateTo('/messages',{state:params});
    }

    // Navigate to searched post  
    const goToSearchedPost =(channel, postId) =>{
        closeSearchModal();
        const params = {
            channelFromState: channel,
            postFromState: postId
        }
        navigateTo('/channels',{state:params});
    }


    // Functionality to show preview of post
    const showPreview =(text, num)=>{
        const words = text.split(' ');
        return words.slice(0, num).join(' ')+" . . . . . . . .";
    }

    return(
        <>
         {!isLandingPage ?  
            <Stack direction='horizontal' className='second-navbar' style={{alignItems:'center', height:'6vh'}}>
                <span class="material-symbols-outlined icons" style={{fontSize:'2vw', margin:'0', padding:'0', color:'#f86714'}}>groups</span>
                <Nav.Link style={{fontFamily:'Spicy Rice', fontSize:'1.4vw', margin:'0', paddingLeft:'0.3vw', color:'#fc0380'}}>AskMentor</Nav.Link >
                <Nav.Link  className='ms-auto' style={{ margin:'0',paddingLeft:'4vw', fontWeight:'bold'}} onClick={()=> navigateTo('/channels')}>Channels</Nav.Link >
                <Nav.Link  style={{ margin:'0',paddingLeft:'2vw', fontWeight:'bold'}} onClick={()=> navigateTo('/messages')}>Messages</Nav.Link >
                <Nav.Link  style={{ margin:'0', paddingLeft:'2vw', fontWeight:'bold'}} onClick={()=> navigateTo('/profile')}>Profile</Nav.Link >
                <Nav.Link  style={{ margin:'0', paddingLeft:'2vw',paddingRight:'2vw', fontWeight:'bold'}} onClick={openSearchModal}>Search</Nav.Link >
                <Modal
                    show={showSearchModal} 
                    onHide={closeSearchModal}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    >
                    <Form className='join-form'>
                        <Stack direction='horizontal' gap={2} className='title_stack' >
                            <span class="material-symbols-outlined icons" style={{fontSize:'2vw'}}>groups</span>
                            Search Post, Channel and People
                        </Stack>
                        <Form.Group className='form-group' style={{marginTop:'1vw'}}>
                            <Form.Label >Select Category</Form.Label>
                            <Form.Select aria-label="Default select example" style={{borderColor:'blue'}} onChange={(e)=>setSearchType(Number(e.target.value))}>
                                <option>Open this select menu</option>
                                <option value="1">Post</option>
                                <option value="2">People</option>
                                <option value="3">Channel</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className='form-group'>
                            <Form.Label >Put what you remember </Form.Label>
                            <Form.Control style={{borderColor:'red'}} value={searchData} onChange={(e)=>setSearchData(e.target.value)}/>
                        </Form.Group>
                        <div className='search-results'>
                            <p style={{fontWeight:'bold'}}># Search Results</p>
                            <hr style={{margin:'0'}}></hr>
                            <div className='search-result-block'>
                                <ListGroup className='history-list'>
                                {searchPostResult.length > 0 && searchType === 1 && searchPostResult.map((post)=>{
                                    return(
                                        <ListGroup.Item as="li" className='activity-list-item' onClick={()=>goToSearchedPost(post.channel, post.id)}>
                                            <div className="fw-bold" style={{color:'#d84434'}}>{post.channel}</div>
                                            <p style={{fontSize:'small'}} >{showPreview(post.data,10)}</p>
                                        </ListGroup.Item>
                                    )
                                })}
                                {searchChannelResult.length > 0 && searchType === 3 && searchChannelResult.map((channel)=>{
                                    return(
                                        <ListGroup.Item className='channel-item' style={{fontWeight:'bold'}} onClick={()=>goToSearchedChannel(channel.name)}># •{channel.name}</ListGroup.Item>
                                    );
                                })}
                                {searchPeopleResult.length > 0 && searchType === 2 && searchPeopleResult.map((person)=>{
                                    return(
                                        <ListGroup.Item className='nav-message-item' onClick={()=>goToSearchedPerson(person.username)}>
                                            <img src={person.avatar} style={{width:'2vw', marginRight:'0.5vw'}}></img>
                                            <p style={{margin:'0'}}>{person.name}<p className="view-profile-button">{person.username}</p></p>
                                        </ListGroup.Item>
                                    )
                                })}
                                </ListGroup>     
                            </div>
                        </div>
                    </Form>
                </Modal>
                <Button className='logout-button' onClick={()=>removeAccess()}>Log Out</Button>
            </Stack>    
            :<></>}
        </>
    )
}

    

export default Navlink;