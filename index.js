/**
@author: dhananjay patil
@date: 16/04/2018
@Description: multichain Utility module
 **/
'use strict';

// node module to read file and path 
const fs = require('fs');
const path = require('path');
/* creating folder as well default package.json
 *  add your port 
 *  add host
 *  add username
 *  add password
 *  This all details will be available in multichain.conf and params.dat files
 */
var dir = './config';
var file = './config/multichain.json'
var content = {
  "config": {
    "port": "",
    "host": "",
    "user": "",
    "pass": ""
  },
  "stream": {
    "streamName": ""
  }
}

// condition will get execute if config folder is not present in folder
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
// condition will get execute if multichain.json file is not present in folder
if (!fs.existsSync(file)) {
  fs.writeFileSync(file, JSON.stringify(content))
}

var creds = require('./config/multichain.json')
// multichain module for nodejs
let multichain = require("multichain-node")(creds.config);
// will pick your stream name from multichain.json 
let stream = (creds.stream)
console.log(stream)
let asset = creds.assetName
console.log(asset)
// ====================================== Generic Methods For Stream =============================================

// addData : will addData for given Key and Stream
function addData(params) {
  console.log("val", params.value)
  return new Promise((resolve) => {
    var response;
    var key = params.key;
    var hexstring;
    var value = JSON.stringify(params.value);
    console.log(value)
    let bufStr = Buffer.from(value, 'utf8');
    hexstring = bufStr.toString('hex')

    multichain.publish({
      stream: stream.streamName,
      key: key,
      data: hexstring
    }, (err, res, key, data) => {
      if (err == null) {
        return resolve({
          response: res,
          key: key,
          data: data,
          message: "data is stored into Blockchain"
        });
      } else {
        console.log(err)
      }
    })
  })
}

// readAllData : will retrieve All records for given stream.
function readAllData(params) {
  return new Promise((resolve) => {
    var response;

    var hexstring = '';

    multichain.listStreamItems({
      stream: stream.streamName,
      "verbose": false,
      "count": lastCount,
      "start": startCount
    }, (err, res) => {
      var length = res.length;

      if (err == null) {
        if (length == 0) {
          return resolve({
            response: "Data is Not available into Blockchain!"
          });
        } else {
          console.log(res)
          return resolve({
            "response": res
          })
        }
      } else {
        return reject(err)
      }
    })
  })
}
// readKeys ::- retrieves All keys present in Blockchain.
function readKeys(params) {

  return new Promise((resolve) => {
    var keyStore = [];
    var response;
    multichain.listStreamKeys({
      stream: stream.streamName,
      "verbose": false,
      "count": params.lastCount,
      "start": params.startCount
    }, (err, res) => {
      console.log(res)
      if (err == null) {

        for (let i = 0; i < res.length; i++) {
          var string = '';
          var data = res[i].key;
          for (var j = 0; j < data.length; j += 2) {
            string += String.fromCharCode(parseInt(data.substr(j, 2), 16))
          }
          keyStore.push({
            "key": res[i].key
          });
        }
        return resolve({
          response: keyStore
        });
      } else {
        console.log(err)
      }
    })

  })

}

//  readData::- retrieve latest Data from Blockchain based On EHR-ID
function readData(params) {

  return new Promise((resolve) => {
    var key = params.key;
    var records = [];
    var response;
    multichain.listStreamKeyItems({
      stream: stream.streamName,
      "key": key,
      "verbose": false,
      "count": params.lastCount,
      "start": params.startCount
    }, (err, res) => {
      var length = res.length;

      if (err == null) {
        if (length == 0) {
          return resolve({
            response: "Data is Not available into Blockchain for Given Key!"
          });
        } else {
          var string = '';
          var data = res[length - 1].data;
          console.log(data)
          string = Buffer.from(data, 'hex').toString();
          records.push({
            "publishers": res[0].publishers[0],
            "key": res[0].key,
            "data": string,
            "confirmations": res[0].confirmations,
            "blocktime": res[0].blocktime,
            "txid": res[0].txid,
          });
          console.log(records)
          return resolve({
            response: records
          });
        }
      } else {
        return reject(err)
      }
    })

  })

}
// deleteData: will update the flag for given key and provided value that record has been deleted.
function deleteData(params) {
  return new Promise((resolve) => {
    var response;
    var key = params.key;
    var hexstring;
    var value = "For Given key record is deleted";
    let bufStr = Buffer.from(value, 'utf8');
    hexstring = bufStr.toString('hex')
    console.log(hexstring)
    multichain.publish({
      stream: stream.streamName,
      key: key,
      data: hexstring
    }, (err, res, key) => {
      if (err == null) {
        return resolve({
          response: res,
          key: key,
          message: "data is Archieved from Blockchain"
        });
      } else {
        return reject(err)
      }
    })
  })
}
//  =================================== Generalize assests functions ==================================

// to getNewAddress this function will return a new address for you.
function getAddress() {
  return new Promise((resolve) => {
    var response;
    multichain.getNewAddress({

    }, (err, res) => {
      if (err == null) {
        return resolve({
          response: res,
          message: "your asset has been created"
        });
      } else {
        return reject(err)
      }
    })
  })
}

// listAddresses will retrieve all the addresses which is present in multichain.
function listAddresses(params) {
  return new Promise((resolve) => {
    var response;
    var count = params.count;
    var start = params.startCount;
    multichain.listAddresses({
        "addresses": "*",
        "verbose": false,
        "count": count,
        "start": start
      },
      (err, res) => {
        if (err == null) {
          console.log("response", res)

          return resolve({
            response: res,
            message: "list of addresses...!"
          });

        } else {
          console.log(err)
        }
      })
  })
}

// issueToken will create a new assets for you.
function issueToken(params) {
  return new Promise((resolve) => {
    var response;
    var address = params.address;
    var asset = params.assetName;
    var quantity = params.quantity;
    multichain.issue({
        address: address,
        asset: asset,
        qty: quantity,
        open: true,
        units: 1
      },
      (err, res) => {
        if (err == null) {
          return resolve({
            response: res,
            message: "your asset has been created"
          });
        } else {
          return reject(err)
        }
      })
  })
}

// transfer function is to transfer an assets from one address to another address.
function transfer(params) {
  return new Promise((resolve) => {
    var response;

    multichain.sendAssetFrom({
      from: params.fromAddress,
      to: params.toAddress,
      asset: asset.asset,
      qty: params.quantity
    }, (err, res) => {
      if (err == null) {
        return resolve({
          response: res
        });
      } else {
        console.log(err)
      }
    })
  })
}

// balanceOf function will return balance of provided address
function balanceOf(params) {
  return new Promise((resolve) => {

    multichain.getAddressBalances({
      address: params.address

    }, (err, res) => {
      console.log(res)
      if (err == null && res.length != 0) {
        return resolve({
          balance: res[0].qty
        });
      } else if (err == null && res.length == 0) {
        var count = 0
        return resolve({
          balance: count
        });
      } else {
        console.log(err)
      }
    })

  })
}

module.exports = {
  // stream functions
  addData: addData,
  readAllData: readAllData,
  readKeys: readKeys,
  readData: readData,
  deleteData: deleteData,
  // asset function
  issueToken: issueToken,
  getAddress: getAddress,
  listAddresses: listAddresses,
  issueToken: issueToken,
  transfer: transfer,
  balanceOf: balanceOf
}