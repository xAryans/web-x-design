import { useState, useEffect, useContext, useRef } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { Send, User, Paperclip, Video } from 'lucide-react';

const Messaging = ({ onStartVideoCall }) => {
  const { user } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      if (user.role === 'patient') {
          // Patients can only message doctors with approved (confirmed or completed) appointments
          const res = await api.get('/patient/appointments');
          const approvedAppointments = res.data.filter(apt => apt.status === 'confirmed' || apt.status === 'completed');
          const uniqueDoctors = [];
          const map = new Map();
          approvedAppointments.forEach(apt => {
              if (apt.doctorId && !map.has(apt.doctorId._id)) {
                  map.set(apt.doctorId._id, true);
                  uniqueDoctors.push(apt.doctorId);
              }
          });
          setContacts(uniqueDoctors);
      } else {
          // Doctors fetch contacts they've interacted with, or we can fetch appointments
          const res = await api.get('/doctor/appointments');
          const uniquePatients = [];
          const map = new Map();
          res.data.forEach(apt => {
              if (apt.patientId && !map.has(apt.patientId._id)) {
                  map.set(apt.patientId._id, true);
                  uniquePatients.push(apt.patientId);
              }
          });
          setContacts(uniquePatients);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (contactId) => {
    try {
      const res = await api.get(`/messages/${contactId}`);
      setMessages(res.data);
      setTimeout(() => scrollToBottom(), 100);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectContact = (contact) => {
    setActiveContact(contact);
    fetchMessages(contact._id);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    try {
      const res = await api.post('/messages', {
        receiverId: activeContact._id,
        receiverModel: user.role === 'patient' ? 'Doctor' : 'Patient',
        content: newMessage
      });
      
      setMessages([...messages, res.data]);
      setNewMessage('');
      scrollToBottom();
    } catch (err) {
      console.error(err);
      alert('Failed to send message. Please restart your backend server (node index.js) to apply the new messaging routes.');
    }
  };

  return (
    <div className="flex h-[600px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Sidebar - Contacts */}
      <div className="w-1/3 border-r border-gray-100 bg-gray-50 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h3 className="font-bold text-gray-800">Messages</h3>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {contacts.length === 0 ? (
             <div className="p-6 text-center text-gray-400 text-sm">No contacts available.</div>
          ) : (
            contacts.map(contact => (
              <div 
                key={contact._id} 
                onClick={() => handleSelectContact(contact)}
                className={`p-4 cursor-pointer transition flex items-center gap-3 ${activeContact?._id === contact._id ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-100'}`}
              >
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full flex-shrink-0">
                    <User className="w-5 h-5"/>
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-semibold text-gray-900 truncate">{user.role === 'patient' ? `Dr. ${contact.name}` : contact.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{user.role === 'patient' ? contact.specialization : 'Patient'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50/50 relative">
        {activeContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full">
                        <User className="w-5 h-5"/>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{user.role === 'patient' ? `Dr. ${activeContact.name}` : activeContact.name}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> Online
                        </p>
                    </div>
                </div>
                
                {user.role === 'doctor' ? (
                    <button 
                        onClick={async () => {
                            // Trigger cross-tab communication for the hackathon demo
                            localStorage.setItem('incoming_call', JSON.stringify({
                                doctorName: user.name,
                                timestamp: Date.now()
                            }));
                            
                            if (onStartVideoCall) onStartVideoCall(activeContact);
                            try {
                              const res = await api.post('/messages', {
                                receiverId: activeContact._id,
                                receiverModel: 'Patient',
                                content: `🎥 I have started a video consultation.`
                              });
                              setMessages(prev => [...prev, res.data]);
                              scrollToBottom();
                            } catch (err) { console.error(err); }
                        }}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition flex items-center gap-2"
                    >
                        <Video className="w-4 h-4" /> Start Video Call
                    </button>
                ) : (
                    <button 
                        onClick={() => onStartVideoCall && onStartVideoCall(activeContact)}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition flex items-center gap-2"
                    >
                        <Video className="w-4 h-4" /> Join Video Call
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-10 text-sm">Say hello! This is a secure chat.</div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.senderId === user._id;
                  return (
                    <div key={msg._id} className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-blue-600 text-white self-end rounded-br-none shadow-sm' : 'bg-white border text-gray-800 self-start rounded-bl-none shadow-sm'}`}>
                      {msg.content}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-100 flex items-end gap-2">
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-full transition">
                  <Paperclip className="w-5 h-5"/>
              </button>
              <form onSubmit={handleSendMessage} className="flex-1 flex gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a secure message..."
                  className="flex-1 border bg-gray-50 border-gray-200 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-md"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
               <User className="w-8 h-8 text-gray-300"/>
            </div>
            <p>Select a contact to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messaging;
