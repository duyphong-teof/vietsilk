import React, { useState } from 'react';
import axios from 'axios';

const ChatWidget = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Xin chào! Tôi có thể giúp gì cho bạn?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        model: 'gpt-4.1-mini',
        messages: newMessages,
      });
      const reply = response.data.choices[0].message.content;
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: 'Lỗi khi gọi OpenAI API!' }]);
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-[55px] h-[50px] bg-white rounded-full shadow-md flex items-center justify-center hover:opacity-80"
        >
          <img
            src="/images/ChatBot.jpg"
            alt="Chat Icon"
            className="w-[40px] h-[40px] object-contain rounded-full bg-transparent"
          />
        </button>
      )}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-83 h-[500px] bg-white shadow-xl rounded-lg border flex flex-col z-50">
          <div className="flex justify-between items-center p-3 border-b">
            <div className="flex items-center gap-2">
              <img
                src="/images/ChatBot.jpg"
                alt="ChatBot Icon"
                className="w-9 h-9 object-contain rounded-full"/>
              <h4 className="text-sm font-semibold">trợ lý ảo VietSilk</h4>
            </div>
            <button onClick={() => setIsOpen(false)}className="text-gray-500 hover:text-black text-sm"> ✕ </button>
          </div>

          <div className="flex-1 overflow-auto p-3 space-y-2 flex flex-col">
            {messages.map((msg, idx) => (
              <div key={idx}className={`flex mb-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <div className="inline-block max-w-[80%] p-2 rounded-md text-sm whitespace-pre-wrap break-words"
                    style={{ backgroundColor: '#e8e8e8', color: '#000' }}>
                    {msg.content}
                  </div>
                ) : (
                  <div className="flex items-start max-w-[310px] p-2 rounded-md text-sm whitespace-pre-wrap break-words bg-gray-200 text-black">
                    <img src="/images/ChatBot.jpg"alt="Assistant"className="w-6 h-6 rounded-full mr-2 flex-shrink-0"/>
                    <div>{msg.content}</div>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="text-sm italic text-gray-500 self-start">
                trợ lý ảo đang soạn tin...
              </div>
            )}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 border px-2 py-1 text-sm"
              placeholder="Nhập nội dung cần hỗ trợ"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-black text-white px-3 py-1 text-sm"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
