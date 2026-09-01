import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

import {
    Bot,
    MessageCircle,
    X,
    Paperclip,
    Send,
    FileText,
    LoaderCircle
} from "lucide-react";

import "./PCOSChatbot.css";


const API_URL = "http://localhost:8000";


function PCOSChatbot() {

    // ==================================================
    // Chat window state
    // ==================================================

    const [isOpen, setIsOpen] = useState(false);

    const [messages, setMessages] = useState([]);

    const [question, setQuestion] = useState("");

    const [loading, setLoading] = useState(false);

    const [uploading, setUploading] = useState(false);

    const [uploadedFiles, setUploadedFiles] = useState([]);


    // ==================================================
    // Dragging state
    // ==================================================

    const [position, setPosition] = useState({
        x: 0,
        y: 0
    });

    const [isDragging, setIsDragging] = useState(false);

    const dragOffset = useRef({
        x: 0,
        y: 0
    });


    // ==================================================
    // References
    // ==================================================

    const messagesEndRef = useRef(null);

    const fileInputRef = useRef(null);


    // ==================================================
    // Automatically scroll to newest message
    // ==================================================

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages, loading]);


    // ==================================================
    // Convert backend response into safe text
    // ==================================================
    //
    // This prevents React from crashing if the backend
    // accidentally returns an object instead of a string.
    //
    // ==================================================

    const getResponseText = (value) => {

        if (typeof value === "string") {
            return value;
        }

        if (value === null || value === undefined) {
            return "";
        }

        if (typeof value === "object") {

            if (typeof value.text === "string") {
                return value.text;
            }

            if (typeof value.content === "string") {
                return value.content;
            }

            if (typeof value.answer === "string") {
                return value.answer;
            }

            try {

                return JSON.stringify(
                    value,
                    null,
                    2
                );

            } catch {

                return String(value);

            }
        }

        return String(value);
    };


    // ==================================================
    // Ask question
    // ==================================================

    const askQuestion = async () => {

        const currentQuestion =
            question.trim();


        if (
            !currentQuestion ||
            loading
        ) {
            return;
        }


        // --------------------------------------------------
        // Add user's message immediately
        // --------------------------------------------------

        setMessages((previous) => [

            ...previous,

            {
                role: "user",
                content: currentQuestion
            }

        ]);


        setQuestion("");

        setLoading(true);


        try {

            const response =
                await axios.post(
                    `${API_URL}/chat`,
                    {
                        question:
                            currentQuestion
                    }
                );


            console.log(
                "Backend response:",
                response.data
            );


            const answer =
                getResponseText(
                    response.data?.answer
                );


            if (!answer.trim()) {

                throw new Error(
                    "Backend returned no answer."
                );

            }


            // --------------------------------------------------
            // Add AI response
            // --------------------------------------------------

            setMessages((previous) => [

                ...previous,

                {
                    role: "assistant",
                    content: answer
                }

            ]);

        }

        catch (error) {

            console.error(
                "Chat request failed:",
                error
            );


            setMessages((previous) => [

                ...previous,

                {
                    role: "assistant",
                    content:
                        "Sorry, I couldn't process your question. Please try again."
                }

            ]);

        }

        finally {

            setLoading(false);

        }

    };


    // ==================================================
    // Enter key
    // ==================================================

    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            askQuestion();

        }

    };


    // ==================================================
    // Open file picker
    // ==================================================

    const openFilePicker = () => {

        fileInputRef.current?.click();

    };


    // ==================================================
    // Upload PDF
    // ==================================================

    const uploadPDF = async (event) => {

        const file =
            event.target.files?.[0];


        if (!file) {
            return;
        }


        // --------------------------------------------------
        // Validate PDF
        // --------------------------------------------------

        if (
            file.type !== "application/pdf" &&
            !file.name
                .toLowerCase()
                .endsWith(".pdf")
        ) {

            alert(
                "Please select a PDF file."
            );

            event.target.value = "";

            return;

        }


        // --------------------------------------------------
        // Create form data
        // --------------------------------------------------

        const formData =
            new FormData();

        formData.append(
            "file",
            file
        );


        setUploading(true);


        try {

            const response =
                await axios.post(
                    `${API_URL}/upload`,
                    formData
                );


            console.log(
                "Upload response:",
                response.data
            );


            // --------------------------------------------------
            // Add uploaded PDF to list
            // --------------------------------------------------

            setUploadedFiles(
                (previous) => [

                    ...previous,

                    {
                        name: file.name,
                        size: file.size,
                        uploadedAt:
                            new Date()
                    }

                ]
            );


            // --------------------------------------------------
            // Add success message
            // --------------------------------------------------

            setMessages(
                (previous) => [

                    ...previous,

                    {
                        role: "system",
                        content:
                            `${file.name} was uploaded successfully and is now available to the chatbot.`
                    }

                ]
            );

        }

        catch (error) {

            console.error(
                "PDF upload failed:",
                error
            );


            // --------------------------------------------------
            // Get backend error if available
            // --------------------------------------------------

            const backendMessage =
                error.response?.data?.detail;


            setMessages(
                (previous) => [

                    ...previous,

                    {
                        role: "system",
                        content:
                            backendMessage ||
                            `Could not upload ${file.name}. Please make sure it is a valid text-based PDF.`
                    }

                ]
            );

        }

        finally {

            setUploading(false);


            // Allows the same file to be selected again

            event.target.value = "";

        }

    };


    // ==================================================
    // Dragging
    // ==================================================

    const handleMouseDown = (event) => {

        // Don't drag when clicking buttons

        if (
            event.target.closest(
                "button"
            )
        ) {

            return;

        }


        setIsDragging(true);


        dragOffset.current = {

            x:
                event.clientX -
                position.x,

            y:
                event.clientY -
                position.y

        };

    };


    useEffect(() => {

        const handleMouseMove = (event) => {

            if (!isDragging) {
                return;
            }


            setPosition({

                x:
                    event.clientX -
                    dragOffset.current.x,

                y:
                    event.clientY -
                    dragOffset.current.y

            });

        };


        const handleMouseUp = () => {

            setIsDragging(false);

        };


        window.addEventListener(
            "mousemove",
            handleMouseMove
        );

        window.addEventListener(
            "mouseup",
            handleMouseUp
        );


        return () => {

            window.removeEventListener(
                "mousemove",
                handleMouseMove
            );

            window.removeEventListener(
                "mouseup",
                handleMouseUp
            );

        };

    }, [
        isDragging,
        position
    ]);


    // ==================================================
    // Reset window position
    // ==================================================

    const resetPosition = () => {

        setPosition({
            x: 0,
            y: 0
        });

    };


    // ==================================================
    // Closed state
    // ==================================================

    if (!isOpen) {

        return (

            <button
                className="pcos-chatbot-launcher"
                onClick={() => {

                    resetPosition();

                    setIsOpen(true);

                }}
                aria-label="Open PCOS chatbot"
                type="button"
            >

                <MessageCircle
                    size={28}
                    strokeWidth={2}
                />

            </button>

        );

    }


    // ==================================================
    // Open state
    // ==================================================

    return (

        <div
            className="pcos-chatbot-window"
            style={{
                transform:
                    `translate(${position.x}px, ${position.y}px)`
            }}
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <div
                className="pcos-chatbot-header"
                onMouseDown={handleMouseDown}
            >

                <div className="pcos-chatbot-title">

                    <div className="pcos-chatbot-icon">

                        <Bot
                            size={20}
                        />

                    </div>


                    <div>

                        <h3>
                            PCOS Assistant
                        </h3>

                        <span>
                            AI-powered PCOS assistant
                        </span>

                    </div>

                </div>


                <div className="pcos-chatbot-controls">

                    <button
                        type="button"
                        onClick={() =>
                            setIsOpen(false)
                        }
                        aria-label="Close chatbot"
                        title="Close"
                    >

                        <X
                            size={18}
                        />

                    </button>

                </div>

            </div>


            {/* ==================================================
                UPLOADED PDFS
            ================================================== */}

            {uploadedFiles.length > 0 && (

                <div className="pcos-uploaded-files">

                    <div className="pcos-uploaded-title">

                        <FileText
                            size={15}
                        />

                        <span>
                            Uploaded documents
                        </span>

                    </div>


                    <div className="pcos-file-list">

                        {uploadedFiles.map(
                            (file, index) => (

                                <div
                                    className="pcos-file-item"
                                    key={
                                        `${file.name}-${index}`
                                    }
                                >

                                    <FileText
                                        size={17}
                                    />


                                    <div className="pcos-file-info">

                                        <span className="pcos-file-name">
                                            {file.name}
                                        </span>

                                        <span className="pcos-file-size">

                                            {(
                                                file.size /
                                                1024 /
                                                1024
                                            ).toFixed(2)}

                                            {" MB"}

                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>

            )}


            {/* ==================================================
                MESSAGES
            ================================================== */}

            <div className="pcos-chat-messages">

                {/* Welcome screen */}

                {messages.length === 0 && (

                    <div className="pcos-welcome">

                        <div className="pcos-welcome-icon">

                            <Bot
                                size={32}
                            />

                        </div>


                        <h3>
                            How can I help?
                        </h3>


                        <p>
                            Ask me anything about PCOS.
                            I can answer using the
                            application's PCOS knowledge
                            base and your uploaded
                            documents.
                        </p>

                    </div>

                )}


                {/* Messages */}

                {messages.map(
                    (message, index) => (

                        <div
                            key={index}
                            className={
                                `pcos-message ${message.role}`
                            }
                        >

                            {/* AI avatar */}

                            {message.role ===
                                "assistant" && (

                                <div className="pcos-message-avatar">

                                    <Bot
                                        size={16}
                                    />

                                </div>

                            )}


                            <div className="pcos-message-content">

                                {/* ----------------------------------
                                    SYSTEM MESSAGE
                                ---------------------------------- */}

                                {message.role ===
                                    "system" ? (

                                    <div className="pcos-system-message">

                                        <FileText
                                            size={15}
                                        />

                                        <span>
                                            {
                                                getResponseText(
                                                    message.content
                                                )
                                            }
                                        </span>

                                    </div>

                                ) : (

                                    <>

                                        {/* ----------------------------------
                                            MESSAGE LABEL
                                        ---------------------------------- */}

                                        <span className="pcos-message-label">

                                            {message.role ===
                                                "user"
                                                ? "You"
                                                : "AI"}

                                        </span>


                                        {/* ----------------------------------
                                            MESSAGE BUBBLE
                                        ---------------------------------- */}

                                        <div className="pcos-message-bubble">

                                            {message.role ===
                                                "assistant" ? (

                                                <ReactMarkdown>
                                                    {
                                                        getResponseText(
                                                            message.content
                                                        )
                                                    }
                                                </ReactMarkdown>

                                            ) : (

                                                <p>
                                                    {
                                                        getResponseText(
                                                            message.content
                                                        )
                                                    }
                                                </p>

                                            )}

                                        </div>

                                    </>

                                )}

                            </div>

                        </div>

                    )
                )}


                {/* Loading */}

                {loading && (

                    <div className="pcos-message assistant">

                        <div className="pcos-message-avatar">

                            <Bot
                                size={16}
                            />

                        </div>


                        <div className="pcos-message-content">

                            <span className="pcos-message-label">
                                AI
                            </span>


                            <div className="pcos-message-bubble pcos-thinking">

                                <LoaderCircle
                                    size={16}
                                    className="pcos-spinner"
                                />

                                <span>
                                    Thinking...
                                </span>

                            </div>

                        </div>

                    </div>

                )}


                <div
                    ref={messagesEndRef}
                />

            </div>


            {/* ==================================================
                INPUT
            ================================================== */}

            <div className="pcos-chat-input-area">

                <div className="pcos-input-wrapper">

                    {/* Hidden PDF input */}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={uploadPDF}
                        className="pcos-hidden-file-input"
                    />


                    {/* Textarea */}

                    <textarea
                        value={question}
                        onChange={(event) =>
                            setQuestion(
                                event.target.value
                            )
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="Ask something about PCOS..."
                        rows={1}
                        disabled={
                            loading ||
                            uploading
                        }
                        aria-label="Ask a question"
                    />


                    {/* Upload button */}

                    <button
                        type="button"
                        className="pcos-input-button"
                        onClick={openFilePicker}
                        disabled={
                            uploading ||
                            loading
                        }
                        aria-label="Upload PDF"
                        title="Upload PDF"
                    >

                        {uploading ? (

                            <LoaderCircle
                                size={19}
                                className="pcos-spinner"
                            />

                        ) : (

                            <Paperclip
                                size={19}
                            />

                        )}

                    </button>


                    {/* Send button */}

                    <button
                        type="button"
                        className="pcos-send-button"
                        onClick={askQuestion}
                        disabled={
                            loading ||
                            uploading ||
                            !question.trim()
                        }
                        aria-label="Send message"
                        title="Send message"
                    >

                        {loading ? (

                            <LoaderCircle
                                size={19}
                                className="pcos-spinner"
                            />

                        ) : (

                            <Send
                                size={19}
                            />

                        )}

                    </button>

                </div>


                <div className="pcos-input-hint">

                    Press Enter to send · Shift + Enter for a new line

                </div>

            </div>

        </div>

    );
}


export default PCOSChatbot;