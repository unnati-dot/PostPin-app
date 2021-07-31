import React from "react";
import './App.css';

import ReactMapGL, {Marker,Popup} from 'react-map-gl';
import RoomIcon from '@material-ui/icons/Room';
import StarIcon from '@material-ui/icons/Star';
import axios from "axios";
import {format} from "timeago.js";
import Register from "./components/Register"
import Login from "./components/Login"

export default function App() {
  const myStorage = window.localStorage;
  const [currentUser,setcurrentUser]= React.useState(myStorage.getItem("user"));
  const [pins,setpins] = React.useState([]);
  const [currentPlaceId, setCurrentPlaceId] = React.useState(null);
  const [newplace,setnewplace] = React.useState(null);
  const [title,setTitle] = React.useState(null);
  const [desc,setDesc] = React.useState(null);
  const [Rating,setRating] = React.useState(0);
  const [star, setStar] = React.useState(0)
  const [viewport, setViewport] = React.useState({
    width: "100vw",
    height: "100vh",
    latitude: 28.207609,
    longitude: 79.826660,
    zoom: 8
  });
  const [showRegister, setShowRegister] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);

React.useEffect(()=>{

const getpins = async()=>{
  try{
const res = await axios.get("/pins");
setpins(res.data);
console.log(pins);
  }catch(err){
    console.log(err);
  }
}
getpins();
},[])

const handleMarkerClick = (id,lat,long)=>{
  setCurrentPlaceId(id);
  setViewport({...viewport,latitude:lat,longitude:long});
}

const handledoubleclick = (e)=>{
 const [long,lat] = e.lngLat;
 setnewplace({
  lat,long
 })
};

const handleSubmit = async(e)=>{
e.preventDefault();
const newPin = {
  username: currentUser,
  title,
  desc,
  rating:star,
  lat:newplace.lat,
  long: newplace.long
 }

try{
const res = await axios.post("/pins",newPin);
setpins([...pins,res.data]);
setnewplace(null);
}catch(err){
  console.log(err);
}
}
const handleLogout = () => {
    setcurrentUser(null);
    myStorage.removeItem("user");
  };

  return (
    <div>
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
       mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
      onViewportChange={(viewport) => setViewport(viewport)}
       onDblClick = {handledoubleclick}
       transitionDuration = "2000"
  >


  {pins.map(p=>(
<>
<Marker latitude={p.lat} longitude={p.long}  offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}>
        <RoomIcon style={{ fontSize: viewport.zoom * 7 , color:"slateblue" , cursor:"pointer",color:
                    currentUser === p.username ? "tomato" : "slateblue"}} onClick={()=>handleMarkerClick(p._id,p.lat,p.long)}/>
      </Marker>

      {p._id === currentPlaceId && (

<Popup
                    latitude={p.lat}
                    longitude={p.long}
                    closeButton={true}
                   closeOnClick={false}
                    anchor="left" 
                     onClose={()=>setCurrentPlaceId(null)}
                    >
                    <div className="card">
                     <label>Place</label>
                    <h4 className="place">{p.title}</h4>
                    <label>Review</label>
                    <p className="desc"> {p.desc}</p>
                    <label>Rating</label>
                     <div className="stars">
                    {Array(p.rating).fill(<StarIcon className="star" />)}
                  </div>
                   <label>Information</label>
                   <span className="username">Created by <b>{p.username}</b></span>
                   <span className="date">{format(p.createdAt)}</span>
                    </div>
                  </Popup>

        )}
{newplace && (
 <Popup
                    latitude={newplace.lat}
                    longitude={newplace.long}
                    closeButton={true}
                   closeOnClick={false}
                    anchor="left" 
                     onClose={()=>setnewplace(null)}
                    >
<div>                    
<form onSubmit={handleSubmit}>
<label>Title</label>
<input placeholder="Enter a title" onChange={(e)=>setTitle(e.target.value)}/>
<label>Review</label>
<textarea placeholder="say us something about this place" onChange={(e)=>setDesc(e.target.value)}/>
<label>Rating</label>
<select onChange={(e) => setStar(e.target.value)}>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>

</select>
<button className="submitButton" type="submit">Submit</button>
</form>

</div>



 </Popup>


  )}
       

</>
    ))}
   {currentUser ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setcurrentUser={setcurrentUser}
            myStorage={myStorage}
          />
        )}
      </ReactMapGL>
    </div>
  );
}