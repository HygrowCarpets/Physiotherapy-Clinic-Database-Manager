//Variables that you need to change for your database

const uri = ""; //This is your database connect uri
const databaseName = "";

//CONNECTING TO THE DATABASE AND ALL OF THE CRUD METHODS WORK, SOME ISSUES WITH IMPLEMENTING RETRIEVE CRUD METHODS IN HTML

const {MongoClient} = require("mongodb"); //MongoDB module

const http = require('http');
const fs = require('fs');

const { parse } = require('querystring'); //for parsing request data

//Connecting to a mongodb database reference - https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb--how-to-get-connected-to-your-database
async function main() {

    //uri string for connecting to the mongodb database

    //instance of mongo client
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    //try connecting to database
    try {
        await client.connect();
        console.log("CONNECTED SUCCESSFULLY!");
        console.log("Running on port 8000 \n");

    } catch (e) { //else catch the errors
        console.log("CONNECTION FAILED \n");
        console.error(e);
    }

    //Reference for serving HTML - https://flaviocopes.com/node-serve-html-page/
    const server = http.createServer(async function(req, res) {
        res.writeHead(200, { 'content-type': 'text/html' })
        fs.createReadStream('index.html').pipe(res);
    
        //REQUESTS
        if(req.url == "/") {


            req.on("end", () => {
                res.end("ok");
            });
        }

        //CREATE REQUESTS

        //SENDING PHYSIOTHERAPIST DATA TO PHYSIOTHERAPIST COLLECTION
        if(req.method === "POST" && req.url == "/physiotherapist") {
            
            //Reference - https://itnext.io/how-to-handle-the-post-request-body-in-node-js-without-using-a-framework-cd2038b93190
            let body = "";
            req.on("data", chunk => {
                body += chunk.toString(); // convert Buffer to string
                createDocument(client, databaseName, "Physiotherapists", parse(body));
            });
        }

        //SENDING CLIENT DATA TO CLIENT COLLECTION
        if(req.method === "POST" && req.url == "/clients") {
            
            //Reference - https://itnext.io/how-to-handle-the-post-request-body-in-node-js-without-using-a-framework-cd2038b93190
            let body = "";
            req.on("data", chunk => {
                body += chunk.toString(); // convert Buffer to string
                createDocument(client, databaseName, "Clients", parse(body));
            });
        }

        //SENDING SESSION DATA TO SESSION COLLECTION
        if(req.method === "POST" && req.url == "/sessions") {
            
            //Reference - https://itnext.io/how-to-handle-the-post-request-body-in-node-js-without-using-a-framework-cd2038b93190
            let body = "";
            req.on("data", chunk => {
                body += chunk.toString(); // convert Buffer to string
                createDocument(client, databaseName, "Sessions", parse(body));
            });
        }


        //READ REQUESTS
    
        //OUTPUTTING LIST OF DATABASES
        if(req.method === "POST" && req.url == "/listDatabases") {
            await listDatabases(client);
            console.log("\n");
    
            req.on("end", () => {
                res.end("ok");
            });
        }

        //UPDATE REQUESTS

        //UPDATE PHYSIOTHERAPIST
        if(req.method === "POST" && req.url == "/physiotherapist/update") {
            
            //Reference - https://itnext.io/how-to-handle-the-post-request-body-in-node-js-without-using-a-framework-cd2038b93190
            let body = "";
            req.on("data", chunk => {
                body += chunk.toString(); // convert Buffer to string

                updateDocumentbyName(client, databaseName, "Physiotherapists", parse(body).nameToFind, 
                    {title: parse(body).title,
                    firstnames: parse(body).firstnames,
                    surname: parse(body).surname,
                    mobilephone: parse(body).mobilephone,
                    homephone: parse(body).homephone,
                    emailaddress: parse(body).emailaddress,
                    addressline1: parse(body).firstnames,
                    addressline2: parse(body).addressline2,
                    town: parse(body).town,
                    countycity: parse(body).countycity,
                    eircode: parse(body).eircode}
                );
            });
        }

        //UPDATE CLIENT
        if(req.method === "POST" && req.url == "/client/update") {
            
            //Reference - https://itnext.io/how-to-handle-the-post-request-body-in-node-js-without-using-a-framework-cd2038b93190
            let body = "";
            req.on("data", chunk => {
                body += chunk.toString(); // convert Buffer to string

                updateDocumentbyName(client, databaseName, "Clients", parse(body).nameToFind, 
                    {title: parse(body).title,
                    firstnames: parse(body).firstnames,
                    surname: parse(body).surname,
                    mobilephone: parse(body).mobilephone,
                    homephone: parse(body).homephone,
                    emailaddress: parse(body).emailaddress,
                    addressline1: parse(body).firstnames,
                    addressline2: parse(body).addressline2,
                    town: parse(body).town,
                    countycity: parse(body).countycity,
                    eircode: parse(body).eircode,
                    dateofbirth: parse(body).dateofbirth,
                    under18: parse(body).under18,
                    parentguardian: parse(body).parentguardian,
                    permission: parse(body).permission,
                    date: parse(body).date,
                    doctor: parse(body).doctor,
                    referred: parse(body).referred}
                );
            });
        }

        //UPDATE SESSION
        if(req.method === "POST" && req.url == "/sessions/update") {
    
            //Reference - https://itnext.io/how-to-handle-the-post-request-body-in-node-js-without-using-a-framework-cd2038b93190
            let body = "";
            req.on("data", chunk => {
                body += chunk.toString(); // convert Buffer to string

                updateDocumentbySessionNumber(client, databaseName, "Sessions", parse(body).sessionToFind, 
                    {sessiondate: parse(body).sessiondate,
                    sessiontime: parse(body).sessiontime,
                    client: parse(body).client,
                    physiotherapist: parse(body).physiotherapist,
                    fee: parse(body).fee,
                    sessionnumber: parse(body).sessionnumber,
                    sessionduration: parse(body).sessionduration,
                    sessiontype: parse(body).sessiontype,
                    sessionnotes: parse(body).sessionnotes}
                );
            });
        }


        //DELETE REQUESTS

        //PHYSIOTHERAPIST DELETE
        if(req.method === "POST" && req.url == "/physiotherapist/delete") {
    
            //Reference - https://itnext.io/how-to-handle-the-post-request-body-in-node-js-without-using-a-framework-cd2038b93190
            let body = "";
            req.on("data", chunk => {
                body += chunk.toString(); // convert Buffer to string

                deleteDocumentbyName(client, databaseName, "Physiotherapists", parse(body).nameToFind);
            });
        }

        //CLIENT DELETE
        if(req.method === "POST" && req.url == "/client/delete") {

            //Reference - https://itnext.io/how-to-handle-the-post-request-body-in-node-js-without-using-a-framework-cd2038b93190
            let body = "";
            req.on("data", chunk => {
                body += chunk.toString(); // convert Buffer to string

                deleteDocumentbyName(client, databaseName, "Clients", parse(body).nameToFind);
            });
        }

         //SESSION DELETE
         if(req.method === "POST" && req.url == "/session/delete") {

            //Reference - https://itnext.io/how-to-handle-the-post-request-body-in-node-js-without-using-a-framework-cd2038b93190
            let body = "";
            req.on("data", chunk => {
                body += chunk.toString(); // convert Buffer to string

                deleteDocumentbySessionNumber(client, databaseName, "Sessions", parse(body).sessionToFind);
            });
        }
    
        }) 
        server.listen(process.env.PORT || 8000);
    
} main().catch(console.error);

//CRUD METHODS
//CRUD References - https://developer.mongodb.com/quickstart/node-crud-tutorial/
//MongoDB Query and Projection Operators - https://docs.mongodb.com/manual/reference/operator/query/
//Sorting in MongoDB - https://docs.mongodb.com/manual/reference/method/cursor.sort/
//Limiting results in MongoDB - https://docs.mongodb.com/manual/reference/method/cursor.limit/

//CREATE

//Function for printing out all the names of the databaeses
//Reference - https://docs.mongodb.com/manual/reference/command/listDatabases/
async function listDatabases(client) {
    let listOfDatabases = await client.db().admin().listDatabases();

    console.log("This is a list of the databases: ")
    
    //Print out the name of all databases
    listOfDatabases.databases.forEach(db => { 
        console.log(db.name)
    })
}
//Copy paste of how this function is used
// await listDatabases(client);


//Function for creating and adding document
//Reference - https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/
async function createDocument(client, database, collection, data) {
    await client.db(database).collection(collection).insertOne(data);

    console.log("New data inserted into " + collection);
    console.log(data);
}
//Copy paste of how this function is used
// await createDocument(client, "TestDatabase", "test", {
//     name: "this is a name"
// })


//Function for creating and adding multiple documents
//Reference - https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/
async function createMultipleDocuments(client, database, collection, data) {
    await client.db(database).collection(collection).insertMany(data);

    console.log("New data inserted into " + collection);
    console.log(data);
}
//Copy paste of how this function is used
// await createMultipleDocuments(client, "TestDatabase", "test", {
//     name: "this is a name",
//     number: "087 654 2345"
// },
// {
//     name: "this is a 2nd name",
//     number: "087 654 3526"
// })


//RETRIEVE


//Function for finding a document by name
//Reference - https://docs.mongodb.com/manual/reference/method/db.collection.findOne/
async function findDocumentByName(client, database, collection, nameToFind) {
    let result = await client.db(database).collection(collection).findOne({name: nameToFind});

    if(result) {
        console.log("Found document with the name: " + nameToFind);
        console.log(result);
    }
    else{
        console.log("Could not find document with the name: " + nameToFind);
    }
}
//Copy paste of how this function is used
//await findDocumentByName(client, "TestDatabase", "test", "testDocumentName");


async function returnDocuments(client, database, collection) {
    let result = await client.db(database).collection(collection).find({}).toArray();

    if(result) {
        console.log("Found documents:");
        console.log(result);
    }
    else{
        console.log("Could not find document with the name: " + nameToFind);
    }
    
}


//Function for finding multiple documents by name
//Reference - https://docs.mongodb.com/manual/reference/method/db.collection.find/
async function findDocumentsWith(client, database, collection, nameToFind) {
    let result = await client.db(database).collection(collection).find({firstname: nameToFind});

    result = await result.toArray();

    if(result) {
        console.log("Found document with the name: " + nameToFind);
        console.log(result);
    }
    else{
        console.log("Could not find document with the name: " + nameToFind);
    }
}
//Copy paste of how this function is used
// await findDocumentsWith(client, "TestDatabase", "test", "testDocumentName");


//UPDATE


//Function for updating one document
//Reference - https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/
//            https://docs.mongodb.com/manual/reference/operator/update/set/
async function updateDocumentbyName(client, database, collection, nameToFind, updatedDocument) {
    let result = await client.db(database).collection(collection).updateOne({ firstnames: nameToFind}, {$set: updatedDocument});

    console.log(result.matchedCount + " document was updated");
}
//Copy paste of how this function is used
// await updateDocumentbyName(client, "TestDatabase", "test", "testDocumentName", "properDocumentName");

async function updateDocumentbySessionNumber(client, database, collection, nameToFind, updatedDocument) {
    let result = await client.db(database).collection(collection).updateOne({ sessionnumber: nameToFind}, {$set: updatedDocument});

    console.log(result.matchedCount + " document was updated");
}
//Copy paste of how this function is used
// await updateDocumentbySessionNumber(client, "TestDatabase", "test", "testDocumentName", "sessionNumber");


//DELETE


//Function for deleting document
//Reference - https://docs.mongodb.com/manual/reference/method/db.collection.deleteOne/
async function deleteDocumentbyName(client, database, collection, nameToFind) {
    let result = await client.db(database).collection(collection).deleteOne({firstnames: nameToFind});

    console.log(result + " was deleted");
}
//Copy paste of how this function is used
//await deleteDocumentbyName(client, "TestDatabase", "test", "name");


//Function for deleting document by session number
//Reference - https://docs.mongodb.com/manual/reference/method/db.collection.deleteOne/
async function deleteDocumentbySessionNumber(client, database, collection, sessionToFind) {
    let result = await client.db(database).collection(collection).deleteOne({sessionnumber: sessionToFind});

    console.log(result + " was deleted");
}
//Copy paste of how this function is used
//await deleteDocumentbyName(client, "TestDatabase", "test", "name");

