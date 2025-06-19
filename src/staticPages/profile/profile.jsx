import { useParams } from 'react-router-dom';
import { useTheme as useCustomTheme } from '../../store/ThemeContext';
import { getUserDetails } from '../../service/userApi';
import { useState,useEffect } from 'react';

function Profile() {
    const { userName } = useParams()
    const [user, setuser] = useState(null)
  const { darkMode } = useCustomTheme();
  const bgColor = darkMode ? '#121212' : '#ffffff';
  const textColor = darkMode ? '#ffffff' : '#000000';

  useEffect(() => {
    if(userName){
        getUserDetails(userName).then(setuser)
    }
  }, [userName])
  



  return (
   
  <div
    style={{
      background: bgColor,
      color: textColor,
      minHeight: '100vh',
      paddingLeft: '16px',
      paddingRight: '16px',
    }}
  >
    <h1>Profile Page</h1>
  </div>


  );
}

export default Profile;