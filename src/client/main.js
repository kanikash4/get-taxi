'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import './main.scss';
import { getData } from './fetch';
import { getrideCompleted } from './fetch';
import { getCab as getCabs } from './urls';
import { completeRide as completeRides } from './urls';

class GetCab extends React.Component {
    constructor() {
        super();
        this.handleInputChange = this.handleInputChange.bind(this);
        this.completeRide = this.completeRide.bind(this);
        this.getCab = this.getCab.bind(this);
        this.state = {
            data: '',
            latitude:'',
            longitude:'',
            color:'',
            taxiNo:'',
            requestPending: false
        };
    }

    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    getCab() {
        this.setState({ requestPending: true }, () => {
            getData('GET', getCabs, { latitudeValue: this.state.latitude, longitudeValue: this.state.longitude, colorValue: this.state.color }, (resp) => {
                console.log("Success", resp)
                this.setState({ data: [resp], requestPending: false });
            }, (error) => {
                console.log("Failure", error);
                this.setState({ data: [], requestPending: false });
            });
        });
    }

    completeRide() {
        this.setState({ requestPending: true }, () => {
            getrideCompleted('GET', completeRides, { latitudeValue: this.state.latitude, longitudeValue: this.state.longitude, taxiNo: this.state.data[0].taxiNo }, (resp) => {
                console.log("Success", resp)
                resp.location       = this.state.data[0].location;
                resp.taxiNo         = this.state.data[0].taxiNo;
                resp.driverName     = this.state.data[0].driverName;
                resp.driverNumber   = this.state.data[0].driverNumber;
                resp.cabColor       = this.state.data[0].cabColor;
                this.setState({ data: [resp], requestPending: false });
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

                <div className="SubmitCompleteRideForm" disabled={this.state.disabled}>
                    <label> Latitude</label>
                    <input value={this.state.latitude} name="latitude" onChange={this.handleClick} />
                    <label> Longitude</label>
                    <input value={this.state.longitude} name="longitude" onChange={this.handleClick} />
                    <label> id</label>
                    <input value={this.state.taxiNo} name="taxiNo" onChange={this.handleClick} />
                    <button onClick={this.completeRide}>Complete Ride</button>
                </div>

                {this.state.data && <div className="resultContainer">
                    <table>
                        <tbody>
                            {
                                this.state.data.length > 0 && this.state.data.map((datum, key) => {
                                    {
                                        datum.message.length>0  
                                        return (
                                            <tr key={key}>
                                                {datum.errMessage.length>0 && <td>Error: {datum.errMessage}</td>}
                                                {
                                                    datum.errMessage.length === 0 && 
                                                    <td>
                                                        {datum.message}  
                                                        <br/>
                                                        {datum.driverName?  <td>Driver Name: {datum.driverName}</td> : null}

                                                         {datum.driverNameNumber? <td>Driver Number: {datum.driverNumber} </td>: null}
                                                       
                                                        {datum.taxiNo?  <td>Taxi Number: {datum.taxiNo}</td>: null}
                                                        {datum.location.latitude? <td>Source Latitude: {datum.location.latitude}</td>: null}
                                                        {datum.location.longitude? <td>Source Longitude: {datum.location.longitude}</td> : null}
                                                        {datum.cabColor? <td>Taxi Color: {datum.cabColor}</td>: mull}
                                                        {datum.distance? <td>Distance: {datum.distance}</td>: null}
                                                        {datum.price? <td>Price: {datum.price}</td>: null}


                                                        <br/>
                                                    <button id="btnCompleteRide" onClick={this.completeRide}> Complete ride </button>
                                                    </td>
                                                }
                                                <td>
                                                </td>
                                            </tr>
                                        );
                                    }
                                })
                            }
                        </tbody>
                    </table>
                </div>}
            </div>
        );
    }
}

ReactDOM.render(<GetCab />, document.getElementById('app'))