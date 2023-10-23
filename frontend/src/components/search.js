import React, { useState } from 'react';

const Search = () => {

    const [query, setQuery] = useState("")

    function search(e){
        e.preventDefault()
        setQuery(e.target.value)
    }

    return (
        <div >
            <input
                type="text"
                placeholder="Search"
                onChange={search}
                value={query}
            />
            <button className="bg-white p-4">🔍</button>
        </div>
    );
};

export default Search;