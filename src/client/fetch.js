import 'whatwg-fetch';

export function getData(method, url, urlParams, successCB, failureCB) {
    fetch(url + "?latitude="+urlParams.latitudeValue + "&longitude="+urlParams.longitudeValue + "&color="+ urlParams.colorValue   , {
        method  : method,
        headers : {'Content-Type': 'application/json'}
    }).then(checkStatus).then(parseJSON).then((data) => {
        successCB(data)
    }).catch((error) => {
        failureCB(error)
    })
}

export function getrideCompleted(method, url, urlParams, successCB, failureCB) {
    var destLat = Number(urlParams.latitudeValue)+100;
    var destLong = Number(urlParams.longitudeValue)+100;
    fetch(url + "?latitude="+destLat+ "&longitude="+destLong+ "&taxiNo="+ urlParams.taxiNo   , {
        method  : method,
        headers : {'Content-Type': 'application/json'}
    }).then(checkStatus).then(parseJSON).then((data) => {
        successCB(data)
    }).catch((error) => {
        failureCB(error)
    })
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error
    }
}

function parseJSON(response) {
    return response.json()
}