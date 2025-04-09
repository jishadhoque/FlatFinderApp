import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import supabase from "../config/supabaseClient"
import { Trash2, Send, ArrowLeft } from "lucide-react"
import "../css/InboxPage.css"

function InboxPage() {
  const [messages, setMessages] = useState([])
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [replyText, setReplyText] = useState("")
  const [loading, setLoading] = useState(true)
  const [newMessageMode, setNewMessageMode] = useState(false)
  const [newMessage, setNewMessage] = useState({
    recipient: "",
    subject: "",
    content: "",
  })
  const navigate = useNavigate()

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)

      // Fetch messages where the current user is either the sender or receiver
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`receiver_id.eq.${currentUser.id},sender_id.eq.${currentUser.id}`)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Fetch user details for each message
      const messagesWithUsers = await Promise.all(
        data.map(async (message) => {
          // Fetch sender details
          const { data: senderData } = await supabase.from("login").select("email").eq("id", message.sender_id).single()

          // Fetch receiver details
          const { data: receiverData } = await supabase
            .from("login")
            .select("email")
            .eq("id", message.receiver_id)
            .single()

          return {
            ...message,
            sender_email: senderData?.email || "Unknown",
            receiver_email: receiverData?.email || "Unknown",
          }
        }),
      )

      setMessages(messagesWithUsers)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching messages:", error)
      setLoading(false)
    }
  }

  const markAsRead = async (messageId) => {
    try {
      const { error } = await supabase.from("messages").update({ read: true }).eq("id", messageId)

      if (error) throw error

      // Update local state
      setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg)))
    } catch (error) {
      console.error("Error marking message as read:", error)
    }
  }

  const handleMessageClick = async (message) => {
    setSelectedMessage(message)
    setNewMessageMode(false)

    // If message is unread and current user is the receiver, mark as read
    if (!message.read && message.receiver_id === currentUser.id) {
      await markAsRead(message.id)
    }
  }

  const handleDeleteMessage = async (messageId) => {
    try {
      const { error } = await supabase.from("messages").delete().eq("id", messageId)

      if (error) throw error

      // Update local state
      setMessages(messages.filter((msg) => msg.id !== messageId))
      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage(null)
      }
    } catch (error) {
      console.error("Error deleting message:", error)
    }
  }

  const handleSendReply = async () => {
    if (!replyText.trim()) return

    try {
      const newReply = {
        sender_id: currentUser.id,
        receiver_id: selectedMessage.sender_id,
        subject: `Re: ${selectedMessage.subject}`,
        content: replyText,
        read: false,
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("messages").insert([newReply]).select()

      if (error) throw error

      // Add user details to the new message
      const newMessageWithUsers = {
        ...data[0],
        sender_email: currentUser.email,
        receiver_email: selectedMessage.sender_email,
      }

      // Update local state
      setMessages([newMessageWithUsers, ...messages])
      setReplyText("")
      alert("Reply sent successfully!")
    } catch (error) {
      console.error("Error sending reply:", error)
    }
  }

  const handleNewMessage = async () => {
    if (!newMessage.recipient.trim() || !newMessage.subject.trim() || !newMessage.content.trim()) {
      alert("Please fill in all fields")
      return
    }

    try {
      // Find recipient user id from email
      const { data: recipientData, error: recipientError } = await supabase
        .from("login")
        .select("id")
        .eq("email", newMessage.recipient)
        .single()

      if (recipientError || !recipientData) {
        alert("Recipient not found. Please check the email address.")
        return
      }

      const newMessageData = {
        sender_id: currentUser.id,
        receiver_id: recipientData.id,
        subject: newMessage.subject,
        content: newMessage.content,
        read: false,
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("messages").insert([newMessageData]).select()

      if (error) throw error

      // Add user details to the new message
      const newMessageWithUsers = {
        ...data[0],
        sender_email: currentUser.email,
        receiver_email: newMessage.recipient,
      }

      // Update local state
      setMessages([newMessageWithUsers, ...messages])
      setNewMessage({ recipient: "", subject: "", content: "" })
      setNewMessageMode(false)
      alert("Message sent successfully!")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  return (
    <div className="top-layout">
      {/* Top Navigation Bar */}
      <header className="top-nav">
        <div className="logo" onClick={() => navigate("/homepage")}>
          🏠 FlatFinder
        </div>
        <nav>
          <ul>
            <li onClick={() => navigate("/homepage")}>Home</li>
            <li onClick={() => navigate("/listings")}>Search</li>
            <li onClick={() => navigate("/add-listing")}>Add Listings</li>
            <li className="active">Inbox</li>
            <li onClick={() => navigate("/")}>Logout</li>
          </ul>
        </nav>
      </header>

      <main className="inbox-container">
        <div className="inbox-header">
          <h2>Your Messages</h2>
          <button
            className="new-message-btn"
            onClick={() => {
              setNewMessageMode(true)
              setSelectedMessage(null)
            }}
          >
            New Message
          </button>
        </div>

        <div className="inbox-content">
          <div className="message-list">
            {loading ? (
              <p className="loading-text">Loading messages...</p>
            ) : messages.length === 0 ? (
              <p className="no-messages">No messages found</p>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`message-item ${!message.read && message.receiver_id === currentUser.id ? "unread" : ""}`}
                  onClick={() => handleMessageClick(message)}
                >
                  <div className="message-preview">
                    <p className="message-sender">
                      {message.sender_id === currentUser.id
                        ? `To: ${message.receiver_email}`
                        : `From: ${message.sender_email}`}
                    </p>
                    <p className="message-subject">{message.subject}</p>
                    <p className="message-date">{new Date(message.created_at).toLocaleDateString()}</p>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteMessage(message.id)
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="message-detail">
            {newMessageMode ? (
              <div className="new-message-form">
                <div className="message-detail-header">
                  <button className="back-btn" onClick={() => setNewMessageMode(false)}>
                    <ArrowLeft size={16} />
                  </button>
                  <h3>New Message</h3>
                </div>
                <div className="form-group">
                  <label>To:</label>
                  <input
                    type="email"
                    value={newMessage.recipient}
                    onChange={(e) => setNewMessage({ ...newMessage, recipient: e.target.value })}
                    placeholder="Recipient email"
                  />
                </div>
                <div className="form-group">
                  <label>Subject:</label>
                  <input
                    type="text"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                    placeholder="Message subject"
                  />
                </div>
                <div className="form-group">
                  <label>Message:</label>
                  <textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                    placeholder="Write your message here..."
                    rows={8}
                  />
                </div>
                <button className="send-btn" onClick={handleNewMessage}>
                  <Send size={16} />
                  Send Message
                </button>
              </div>
            ) : selectedMessage ? (
              <div className="message-content">
                <div className="message-detail-header">
                  <button className="back-btn" onClick={() => setSelectedMessage(null)}>
                    <ArrowLeft size={16} />
                  </button>
                  <h3>{selectedMessage.subject}</h3>
                </div>
                <div className="message-info">
                  <p>
                    <strong>From:</strong> {selectedMessage.sender_email}
                  </p>
                  <p>
                    <strong>To:</strong> {selectedMessage.receiver_email}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(selectedMessage.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="message-body">
                  <p>{selectedMessage.content}</p>
                </div>
                {selectedMessage.sender_id !== currentUser.id && (
                  <div className="reply-section">
                    <h4>Reply</h4>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply here..."
                      rows={4}
                    />
                    <button className="send-btn" onClick={handleSendReply}>
                      <Send size={16} />
                      Send Reply
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-message-selected">
                <p>Select a message to view its contents</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default InboxPage
