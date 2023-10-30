import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import { passportInstance } from "../immutable";
import "./App.css"

export default function App () {
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate()

  const fetchUser = async () => {
    try {
      const userProfile = await passportInstance.getUserInfo();
      const accessToken = await passportInstance.getAccessToken();
      const idToken = await passportInstance.getIdToken();

      Boolean(userProfile === undefined) && navigate("/")

      setUser({
        Nickname: userProfile?.nickname,
        Email: userProfile?.email,
        accessToken: accessToken,
        idToken: idToken,
        sub: userProfile?.sub,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
    console.log(user)
  }, []);

  return(
    <div className='card'>
      <div className='hi-header'>
        <h1>Hello {user?.nickname ?? 'there'} 👋 </h1>
        <a onClick={() => {
          passportInstance.logout()
          navigate("/")
        }}>Logout</a> 
      </div>
      {
        Boolean(user) && Object.keys(user).map(key => 
          <div className="text-box-wrapper">
            <div className="text-box disable">
              <input type="text" name="" value={user[key] ?? ''} placeholder="No nickname set"/>
              <label>{key}</label>
            </div>
            {Boolean(key === "accessToken" || key === "idToken") && <a>Copy</a>}
          </div>
        )
      }
      <div className="text-box-wrapper">
        <div className="text-box">
          <input type="text" name="" placeholder="Type your message here"/>
          <label>Save any message to blockchain 🚀🚀🚀</label>
        </div>
      </div>
      <button onClick={() => {}}>
        Initiate transaction
      </button>
    </div>
   )
}
