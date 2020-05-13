import 'whatwg-fetch';

export function getData(method, url, urlParams, successCB, failureCB) {
    console.log(urlParams)
    fetch(url + "?latitude="+urlParams.latitudeValue + "&longitude="+urlParams.longitudeValue + "&color="+ urlParams.colorValue   , {

    // fetch(url + flattenURLParams(urlParams), {
        method  : method,
        headers : {'Content-Type': 'application/json'}
    }).then(checkStatus).then(parseJSON).then((data) => {
        successCB(data)
    }).catch((error) => {
        failureCB(error)
    })
}

export function postData(method, url, body, successCB, failureCB) {
    console.log(url)
    console.log(body)

    fetch(url, {
        method  : method,
        headers : {'Content-Type': 'application/json'},
        body    : JSON.stringify(body)
    }).then(checkStatus).then(parseJSON).then((data) => {
        console.log("./fetch.js success > ", data )
        successCB(data)
    }).catch((error) => {
        console.log("./fetch.js error> ", error )
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

function flattenURLParams(urlParams) {
    let paramsString = '';
    let iteratee = Object.getOwnPropertyNames(urlParams);
    if (iteratee.length > 0) {
        paramsString = '?';
        iteratee.map((param, key) => {
            paramsString = paramsString + urlParams[param];
            paramsString = key !== iteratee.length ? paramsString + '&' : paramsString;
        });
    }
    return paramsString;
}