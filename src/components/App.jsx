import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import { passportInstance } from "../immutable";
import "./App.css"
import Transaction from './Transaction';

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
        Boolean(user) && Object.keys(user).map((key, i) => 
          <div className="text-box-wrapper" key={i}>
            <div className="text-box disable">
              <input type="text" defaultValue={user[key] ?? ''} placeholder="No nickname set"/>
              <label>{key}</label>
            </div>
            {Boolean(key === "accessToken" || key === "idToken") && 
              <a onClick={() => {
                const txt = user[key] ?? ''
                navigator.clipboard.writeText(txt)
                console.log(txt)
              }}>Copy</a>
            }
          </div>
        )
      }
      <Transaction/>
    </div>
   )
}
