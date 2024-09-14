import React from 'react';
import pfp from './1724534476637 (1).jpeg';
class MyComponent extends React.Component {
  render(){
    return (
      <div className='bg-brown-10 w-screen h-screen'>
        <div className='banner'>
            <div className='banner2 bg-brown-80'>

            </div>
            <div className='messages'>

            </div>
            <div className="search-view">
                <div className='header'>

                </div>
                <div className='divider'>
                    <hr></hr>
                </div>
                <div className='list'>
                    
                </div>
            </div>

            <div className='greeting'>
            {/* <img src={pfp} alt="Pfp" /> */}
                <div className='grouping'>
                    <h4>Hi, Fiona!</h4>
                    <div className='grouping2'>
                        <div className='logoo'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 8C12.2091 8 14 6.20914 14 4C14 1.79086 12.2091 0 10 0C7.79086 0 6 1.79086 6 4C6 6.20914 7.79086 8 10 8Z" fill="#ED7E1C"/>
                                <path d="M10 20C12.2091 20 14 18.2091 14 16C14 13.7909 12.2091 12 10 12C7.79086 12 6 13.7909 6 16C6 18.2091 7.79086 20 10 20Z" fill="#ED7E1C"/>
                                <path d="M16 14C13.7909 14 12 12.2091 12 10C12 7.79086 13.7909 6 16 6C18.2091 6 20 7.79086 20 10C20 12.2091 18.2091 14 16 14Z" fill="#ED7E1C"/>
                                <path d="M0 10C0 12.2091 1.79086 14 4 14C6.20914 14 8 12.2091 8 10C8 7.79086 6.20914 6 4 6C1.79086 6 0 7.79086 0 10Z" fill="#ED7E1C"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }
}

export default MyComponent;