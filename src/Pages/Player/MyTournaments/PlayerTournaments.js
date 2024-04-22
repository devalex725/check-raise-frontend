import React,{useEffect,useState} from 'react';
import MyProfileLeftNavPlayers from '../../../components/MyProfileLeftNav/MyProfileLeftNavPlayers';
import { Row, Col, Card, Table ,Image} from 'react-bootstrap';
import { Link,useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PlayerService from '../../../api/services/PlayerService';

import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';

const PlayerTournaments = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [playerList, SetPlayerList] = useState([])
    const [isLoading, setisloading] = useState(true);
   
    var imageUrl = process.env.REACT_APP_ROOM_IMAGE_URL
   const PlayerIndexApi = async() =>{
    try{
        let responseData = await PlayerService.mytournament().json()
        SetPlayerList(responseData.data);
       
        setisloading(false)
    }
    catch (error) {
        console.log(error);
    }
   }
   useEffect(()=>{
        if(localStorage.getItem('usertype')=== 'Player')
        {
            PlayerIndexApi();
        }
        else{
            navigate('/')
        }
   
   },[])

   const handleDeregister = async(e)=>{
    
    try{
        var userData={
            id: e
        }
        let responseData = await PlayerService.deregister(userData).json()
        if(responseData.status === true)
        {
            setisloading(true)
            PlayerIndexApi();
        }
       
    }
    catch (error) {
        console.log(error);
    }
   }
   const handleregister = async(e)=>{
    
    try{
        var userData={
            id: e
        }
        let responseData = await PlayerService.register(userData).json()
        if(responseData.status === true)
        {
            setisloading(true)
            PlayerIndexApi();
        }
       
    }
    catch (error) {
        console.log(error);
    }
   }
    return (
        <>
            <div className='wrapper my-profile-wrapper'>
                <Row className='my-5'>
                    <Col md={2}>
                        <MyProfileLeftNavPlayers />
                    </Col>
                     <Col md={10} lg={12}> 
                        <Card>
                            <Card.Header>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff" className='me-1'><path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" /></svg>
                                {t('page.myprofile.myprofilenav.All tournaments.Tournaments')}
                            </Card.Header>
                            <Card.Body className="table-container d-none d-md-block">
                               

                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th className="width-auto text-nowrap">Name</th>
                                            <th className="width-auto text-nowrap">Pocker Room</th>
                                            <th className="width-auto text-nowrap">Actions</th>
                                            
                                        </tr>
                                       
                                    </thead>
                                    <tbody>
                                   
                                {
                                       playerList.map((element, index) => {
                                            return(
                                        <tr>
                                            <td className="align-middle">
                                               {element.title}
                                            </td>
                                            <td className="align-middle">
                                                        
                                                        <Link
                                                        to={`/room/${element.room.slug}`}
                                                        className="align-middle text-truncate w-100 room-logo"
                                                        >
                                                        <Image
                                                            src={
                                                            element.room.detail.logo
                                                                ? imageUrl + element.room.detail.logo
                                                                : ''
                                                            }
                                                            fluid
                                                        />
                                                        </Link>
                                             </td>
                                            <td  className="align-middle">
                                                {
                                                    element.isuser === true 
                                                    ? 
                                                    <Link className='action-link red-link mb-1' onClick={()=>handleDeregister (element.id)}>Cancel Registration</Link>
                                                    :
                                                    <Link className='action-link green-link mb-1' onClick={()=> handleregister(element.id)}> Registration</Link>
                                                
                                                }
                                            </td>
                                        </tr>

                                            )
                                   
                                        }
                                        )
                                    } 
                                        
                                       
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
            </div>
            {isLoading && <LogoAnimationLoader/>}
        </>
    );
};

export default PlayerTournaments;