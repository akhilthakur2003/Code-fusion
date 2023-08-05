import React, { useEffect, useState } from "react";
import io from "socket.io-client";

import axios from "axios";
import Editor from "@monaco-editor/react";
import Spinner from "./components/Spinner";
import languages from "./constraints/Languages";
const socket = io.connect("http://localhost:3001");

function App() {

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState();
  const [language,setLanguage] = useState('cpp');
  const [input,setInput] = useState('');

  const handleClick = () => {

    setLoading("loading...");
    axios.post('http://localhost:3001/submissions', {
      code:code,
      input:input,
      lang:language
    })
      .then(function (response) {
        console.log(response);
        setOutput(response.data.output);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setOutput("Error in execution");
        setLoading(false);
      });
  };
  const handleChange = (e) => {
    
    setCode(e);
    socket.emit("send-message", e);
  };

  const handleLanguageChange = (option)=>{
    setLanguage(option.target.value);
    console.log(option.target.value)
  }

  const handleInput = (e)=>{
    setInput(e.target.value);
    console.log(e.target.value);
  }


  useEffect(() => {
    socket.on("receive-message", (data) => {
      setCode(data);
    });
  }, [socket]);

  socket.on("user-change", (data) => {
    setUsers(data);
  });

  socket.on("new-connection", (data) => {
    setCode(data);

  });

  return (
    <div className="bg-blue-300 h-full">
      
      <select name="myselect" id="selection" onChange={(e)=>{handleLanguageChange(e)}}>
        <option value="cpp">c++</option>
        <option value="java">java</option>
      </select>
      <div className="main grid grid-cols-4">
        <div className="editor col-span-3 m-2">
          <Editor
            className="text-xl"
            height='90vh'
            defaultLanguage="cpp"
            language={language}
            defaultValue=""
            value={code}
            theme="vs-dark"
            options={{ fontSize: 12 }}
            onChange={(e) => {handleChange(e)}}
          />
        </div>
        <div className="sidebar mt-2 mr-2 mb-2 rounded-md grid grid-rows-6">
          <div className="output bg-white rounded-md m-2 row-span-3 min-w-0 grid grid-rows-6">
            {output}
            <div className="row-span-1 row-start-6">
              {loading && <Spinner />}
            </div>
          </div>
          <textarea className="input bg-white rounded-md m-1 row-span-2 p-2 font-thin text-black text-sm" value={input} onChange={(e)=>{handleInput(e)}}></textarea>
          <button className="row-span-1 text-white bg-blue-600 rounded-md md:w-40 h-6 mt-4 ml-2 mr-2 text-sm font-semibold hover:bg-blue-700 hover:text-gray-neutral-300" onClick={handleClick}>Submit</button>
        </div>
      </div>
      <div>Active Users Connected: {users}</div>
    </div>
  );
}

export default App;
