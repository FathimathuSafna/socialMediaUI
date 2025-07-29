import React, { useEffect,useState } from "react";
import { getUserMessage } from "../service/userApi";
import { useParams } from "react-router-dom";
import { Grid2 } from "@mui/material";

function Messages() {
  const { userName } = useParams();
  const [UserMessage, setUserMessage] = useState(false);

  useEffect(() => {
    getUserMessage(userName).then((response) => {
        console.log(response)
      setUserMessage(response.data.getUser);
    }).catch((error) => console.error("Error during fetching user:",error) )
  },[userName]);

  return (
    <Grid2 container direction={'column'}>
       {UserMessage ? ( <Grid2 item >{UserMessage.name}</Grid2> ): (<Grid2>"No user found"</Grid2>)}
    </Grid2>
  );
}

export default Messages;
