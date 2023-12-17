import React from "react";

const Body = () => {
    const body = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#93ACB5',
    };
    const loginStyle = {
        textAlign: 'center',
        padding: '20px',
        maxWidth: '400px',
        width: '100%',
    };
    const login = {
        marginBottom: '10px',
        fontWeight: 'bold',
    }
    const button = {
        width: '100px', 
    height: '50px', 
    borderRadius: '50%',
    backgroundColor: '#2B4141', 
    color: '#ffffff', 
    fontSize: '18px', 
    border: 'none', 
    cursor: 'pointer', 
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }

    return <body style={body}>
            <div style={loginStyle}>
                <h3 style={login}> Please Login </h3>
                <p> In order to search for Songs, Artists and Albums you must 
                    login to your spotify account</p>
                <button style={button}> Login </button>
            </div>
    </body>
}

export default Body;
