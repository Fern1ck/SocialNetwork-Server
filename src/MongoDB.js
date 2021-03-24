const Mongoose = require("mongoose")

let MongoConnection

const ConnectToMongoDB = async uri => {
    if (MongoConnection) {
        return
    }
    Mongoose.connect(uri, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    MongoConnection = Mongoose.connection

    MongoConnection.on("error", () => {
        throw new Error("Error connecting to MongoDB")
    })

    console.log("Connected to MongoDB")
    return MongoConnection
}

const DisconnectFromMongoDB = () => {
    if (!MongoConnection) {
        return
    }
    Mongoose.disconnect()
}

module.exports = {
    ConnectToMongoDB,
    DisconnectFromMongoDB,
}
