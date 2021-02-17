import React from 'react';

const Loader = () => {

  return (
    <div className="loader-container">
      <div className="loader-wrap">
        <div className="loader"></div> 
      </div>
      <div className="loading-wrap">
        <h3 className="loading">Loading...</h3>
      </div>
    </div>
  )
}

export default Loader;