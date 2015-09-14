# stats-inspector

The stats inspector is a node.js app that listens for incoming requests and parses requests for known stats endpoints into human-readable formats.

## Installation

1. Clone the repo locally on your machine
2. Run `install.sh` which will install the node dependancies and mongodb
3. In a shell instance, run `database.sh` to start the mongodb process
4. In a separate instance, run `webserver.sh` to start the node app. Note this runs as sudo as it requires root permissions to listen on port 80.

## Configuration

In order to see stats in the stats inspector, you will need to point traffic that usually goes to the stats endpoints to your localhost, or wherever the stats-inspector is running.

Edit your `/etc/hosts` file if on a Mac or Linux machine, and override these common hosts:

```
127.0.0.1   stats.bbc.co.uk
127.0.0.1   test.stats.bbc.co.uk
127.0.0.1   sa.bbc.co.uk
127.0.0.1   r.test.bbci.co.uk
127.0.0.1   r.bbci.co.uk
127.0.0.1   bbcdotcomtest.2cnt.net
127.0.0.1   bbcdotcom.2cnt.net
127.0.0.1   bbcandroidtest.2cnt.net
127.0.0.1   bbcandroid.2cnt.net
```

## Usage

In your browser, head to `http://localhost/stats-inspector`. Load and interact with an SMP. You should see your ip address listed. Click it to see the stats being sent from that IP.

## Using with heroku

There is an instance of stats-inspector at http://smp-stats.herokuapp.com/stats-inspector

To use it, please set up Charles Proxy to map remote.

In Charles Proxy, click Tools -> Map Remote ...

Enable Map Remote and add the following mappings:

| From | To |
|---|---|
| stats.bbc.co.uk | smp-stats.herokuapp.com |
| test.stats.bbc.co.uk | smp-stats.herokuapp.com |
| sa.bbc.co.uk | smp-stats.herokuapp.com |
| r.test.bbci.co.uk | smp-stats.herokuapp.com |
| r.bbci.co.uk | smp-stats.herokuapp.com |
| bbcdotcomtest.2cnt.net | smp-stats.herokuapp.com |
| bbcdotcom.2cnt.net | smp-stats.herokuapp.com |
| bbcandroidtest.2cnt.net | smp-stats.herokuapp.com |
| bbcandroid.2cnt.net | smp-stats.herokuapp.com |

Now go to Proxy -> SSL Proxying Settings

Enable SSL Proxying

Add smp-stats.herokuapp.com with port 80.

Now visit http://smp-stats.herokuapp.com/stats-inspector

Interact with an SMP somewhere, such that stats will be generated.

Look for your IP address to come up on stats-inspector.

## Using the database to query results

Everything that happens in the stats-inspector is also logged to a mongodb database.

You can query the database like this (example given for the instance on heroku)

All stats recorded for IP address 132.185.153.7
GET http://smp-stats.herokuapp.com/stats/ip/132.185.153.7

... with type DAx
GET http://smp-stats.herokuapp.com/stats/ip/132.185.153.7/type/DAx

... that are clicks on the call to action
GET http://smp-stats.herokuapp.com/stats/ip/132.185.153.7/type/DAx/action_type/click/control_id/call_to_action

... using SMPFlash
GET http://smp-stats.herokuapp.com/stats/ip/132.185.153.7/type/DAx/action_type/click/control_id/call_to_action/mediaplayer_name/SMPFlash

You can chain together as many keys and values as you wish to filter the results down and see how many times that call was made.

## Clearing out the database

Often, before testing, you want to clear out the database so that you know you're starting from a clean state.

To do this, send a DELETE request using Postman or similar for the IP address you're interested in clearing.

DELETE http://smp-stats.herokuapp.com/stats/ip/132.185.153.7