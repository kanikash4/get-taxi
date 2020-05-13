'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import './main.scss';
// import { postData } from './fetch';
import { getData } from './fetch';

import { getCab as getCabs } from './urls';

class GetCab extends React.Component {
    constructor() {
        super();
        this.handleInputChange = this.handleInputChange.bind(this);
        this.getCab = this.getCab.bind(this);
        this.state = {
            data: '',
            latitude:'',
            longitude:'',
            color:'',
            requestPending: false
        };
    }

    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    getCab() {
        this.setState({ requestPending: true }, () => {
            console.log("here>>>>>>>" , this.state)
            getData('GET', getCabs, { latitudeValue: this.state.latitude, longitudeValue: this.state.longitude, colorValue: this.state.color }, (resp) => {
                console.log("Success", resp)
                this.setState({ data: resp, requestPending: false });
            }, (error) => {
                console.log("Failure", error);
                this.setState({ data: [], requestPending: false });
            });
        });
    }

    render() {
        return (
            <div>
                {this.state.requestPending &&
                    <div className='spinnerContainer'>
                        <div className="spinner">
                            <div className="bounce1"></div>
                            <div className="bounce2"></div>
                            <div className="bounce3"></div>
                        </div>
                    </div>}
                <div className="header">
                    <a href="https://github.com/kanikash4/get-taxi">Source Code </a>
                </div>
                <div className="submitForm">
                    <label> Latitude</label>
                    <input value={this.state.latitude} name="latitude" onChange={this.handleInputChange} />
                    <label> Longitude</label>
                    <input value={this.state.longitude} name="longitude" onChange={this.handleInputChange} />
                    <label> Color</label>
                    <input value={this.state.color} name="color" onChange={this.handleInputChange} />
                    <button onClick={this.getCab}>Get Taxi</button>
                </div>
                {this.state.data && <div className="resultContainer">
                    <table>
                        <tbody>
                            {this.state.data.length > 0 && this.state.data.map((datum, key) => {
                                return (
                                     <tr>
                                        <td>Data Found: {this.state.number}.</td>
                                        <td>&nbsp;</td>
                                    </tr>

                                );
                            })}
                            {this.state.data.length === 0 &&
                                <tr>
                                    <td>No Data Found for latitude: {this.state.latitude}, longitude: {this.state.latitude}
                                     and taxi color: {this.state.color} <br/>Try searching again.</td>
                                    <td>&nbsp;</td>
                                </tr>}
                        </tbody>
                    </table>
                </div>}
            </div>
        );
    }
}

ReactDOM.render(<GetCab />, document.getElementById('app'))