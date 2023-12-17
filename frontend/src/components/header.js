import React from "react";
import Search from "./search";

const Header = () => {
    const header = {
        backgroundColor: '#1DB954',
        height: '100px',
    }
  
return <header style={header}> 
 <Search />
 </header>

}

export default Header;