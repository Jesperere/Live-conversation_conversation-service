# Websocket protokoll

Syftet ar att kunna sarskilja klienterna fran varandra
och kunna kommunicera fran klient till server, och
fran server till klient. 

Klienten skall kunna skicka meddelanden och dom ska distrubireras till alla andra anvandare.

## Messages

Ett message ar en konversation fran en klient till andra klienter. 

En anvandare ska kunna identifiera sig sjalv med hjalp av alias och farg.

```
alias: string
color: string //should be hex values
message: string
```

## Interfaces

Due to all communication from client to server is via JSON,
we need to predetermine a root interface where all other interfaces will
extend from. 

### IConversationPackage

The conversation package is the core interface that allows us to route the message to different sections or actions. 

```
type: enum // this type will determine the body of the message
id: string // this should be the client id
```

### IConversationInit

This package is always sent from the server to the client
giving the client its id.

```
type: "INITIATE"
id: string // client id string
```

### IConversationMessage

This is the main package sent forward and back between
server and client

```
type: "CONVERSATION"
id: string
alias: string
color: string
message: string
```


## Krav

1. ID - The client/server connection identifier
2. All messages should be JSON 

