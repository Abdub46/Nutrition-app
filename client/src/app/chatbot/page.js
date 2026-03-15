"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatbotPage() {

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [chatId, setChatId] = useState(null);


  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };





  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  /* LOAD CHAT HISTORY */

useEffect(()=>{

fetch("/api/chat/history")
.then(res => res.json())
.then(data => {

if(Array.isArray(data)){
setHistory(data)
}else{
setHistory([])
}

})
.catch(()=>setHistory([]))


},[])




/* CLOSE SIDEBAR WHEN CLICKING OUTSIDE */

useEffect(()=>{

const handleClick = (e)=>{

if(!e.target.closest(".chat-sidebar") &&
   !e.target.closest(".hamburger")){

setSidebarOpen(false)

}

}

document.addEventListener("click",handleClick)

return ()=>document.removeEventListener("click",handleClick)

},[])



  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMessage = { role: "user", content: message };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: message,
          userId: 1,
          chatId: chatId
        })
      });


      const data = await res.json();

      if(data.chatId){
      setChatId(data.chatId)
      }

      const aiReply = { role: "assistant", content: data.reply };

      setMessages(prev => [...prev, aiReply]);





    } catch (error) {

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "⚠️ AI is currently unavailable." }
      ]);

    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const newChat = () => {

    if (messages.length > 0) {




      setHistory(prev => [
        { id: Date.now(), title: messages[0]?.content?.slice(0, 30) || "Conversation" },
        ...prev
      ]);
    }

    setMessages([]);
    setChatId(null);


  };





  /* LOAD MESSAGES OF A CHAT */

const loadChat = async(chatId)=>{

const res = await fetch("/api/chat/messages",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({chatId})
});

const data = await res.json();

setMessages(data);
setChatId(chatId);
setSidebarOpen(false);


}




const handleDelete = async(chatId)=>{

const confirmDelete = confirm("Delete this conversation?");

if(!confirmDelete) return;

try{

await fetch("/api/chat/delete",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({chatId})
});

setHistory(prev => prev.filter(chat => chat.id !== chatId));

}catch(err){

console.error("Delete failed",err);

}

};









  return (

    <div className="chat-wrapper">

      {/* SIDEBAR */}


      

      <aside className={`chat-sidebar ${sidebarOpen ? "" : "closed"}`}>

        <button className="new-chat-btn" onClick={newChat}>
          + New Chat
        </button>

        <h3 className="sidebar-title">History</h3>



        {Array.isArray(history) && history.map(item=>(

              
        <div
        key={item.id}
        className="history-item"
        onClick={()=>loadChat(item.id)}
        onContextMenu={(e)=>{
        e.preventDefault();
        handleDelete(item.id);
        }}
        >
        {item.title}
        </div>
        ))}





      </aside>


      {/* MAIN CHAT */}

      <div className="chat-main">

        <div className="chat-topbar">

          <button
            className={`hamburger ${sidebarOpen ? "active" : ""}`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <h2 className="chat-title">Nutrition AI Assistant</h2>

        </div>


        <div className="chat-box">

          {messages.map((msg, i) => (

            <div
              key={i}
              className={msg.role === "user" ? "user-bubble" : "ai-bubble"}
            >

              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>

            </div>

          ))}

          {loading && (
            <div className="ai-bubble typing">
              Thinking...
            </div>
          )}

          <div ref={chatEndRef} />

        </div>


        <div className="chat-input-area">

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about nutrition..."
            className="chat-input"
          />

          <button
            onClick={sendMessage}
            className="send-btn"
          >
            Send
          </button>

        </div>

      </div>

    </div>

  );

}
