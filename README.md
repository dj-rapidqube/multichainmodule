# multichainmodule
# multichainmodule
1.This node module is created only for stream transactions.
steps you need to follow:
a:in a given node module config file is already provided where you can set your multichain credentials
for eg :
{
"config":
    {
    "port" : "0000",
    "host" : "127.0.0.1",
    "user" : "multichainrpc",
    "pass" : "abdsdsisf237sdkfj"
    },
"stream":{
    "streamName":"example"
    }
}

this multichain.json file you need to modify

b:for adding Data into multichain we have provided addData function where you have to pass two arguments like
key & value (*note:do not change the variable name use key and value)

c: to readData from stream you have to pass 1.key , 2.lastCOunt , 3.startCount so this function will provide you recotds present on that key.

d:to readAlldata present in stream you have to pass startCount and Lastcount in number .

e: to delete Data you have to pass key 

f : to getkeys present in your stream you have to pass lastcount and startCount 

