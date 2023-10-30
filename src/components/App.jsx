import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import { passportInstance } from "../immutable";

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
        sub: userProfile?.sub,
        email: userProfile?.email,
        nickname: userProfile?.nickname,
        accessToken: accessToken,
        idToken: idToken,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return(
    <>
      <div>Hello {user?.email}</div>
      <button onClick={() => {
        passportInstance.logout()
        navigate("/")
      }}>
        Logout
      </button>
    </>
   )
}
