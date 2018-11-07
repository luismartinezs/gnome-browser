import React from 'react';
import './index.css';

class Detail extends React.Component {
    render() {
        return (
            <div className='detail-container'>
                <Profile />
            </div>
        );
    }
}

class Profile extends React.Component {
    render() {
        return (
            <div className='d-flex d-col'>

                <div className='gnome-data-wrapper'>
                    <div className='gnome-data-container d-flex align-start'>
                        <div className='detail-img-wrapper'>
                            <img className='profile-img' src='http://www.publicdomainpictures.net/pictures/10000/nahled/thinking-monkey-11282237747K8xB.jpg' alt='profile' />
                        </div>
                        <div className='gnome-name-container d-flex d-col'>
                            <div className='detail-firstName'>Tobus</div>
                            <div className='detail-lastName'>Quickwhistle</div>
                            <div className='age'>Age: 306</div>
                            <div className='id'>Gnome ID: 0001</div>
                        </div>
                    </div>
                </div>

                <div className='gnome-appearance-wrapper'>
                    <div className='gnome-appearance-container'>
                        <div>
                            <h1>Appearance</h1>
                        </div>
                        <div className='d-flex justify-evenly'>
                            <div className='appearance-content-row'>
                                <div>Weight: 39.07 lbs. </div>
                                <div>Height: 107.76 ft.</div>
                            </div>
                            <div className='appearance-content-row'>
                                <span>Hair color: <span className='hair-color'>Pink</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='gnome-professions-wrapper'>
                    <div className='gnome-professions-container'>
                        <div>
                            <h1>Professions</h1>
                        </div>
                        <div className='d-flex justify-evenly'>
                            <p className='professions detail-professions'>
                                <span className='metalworker'>Metalworker </span>
                                <span className='woodcarver'>Woodcarver </span>
                                <span className='stonecarver'>Stonecarver </span>
                                <span className='tinker'>Tinker </span>
                                <span className='tailor'>Tailor </span>
                                <span className='potter'>Potter </span></p>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default Detail; 