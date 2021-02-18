const MongoClient = require('mongodb').MongoClient
const express = require('express')

const app = express()
const url = 'mongodb+srv://Superadmin:thanakorn62++@cluster0.ybhli.mongodb.net/sample_weatherdata?retryWrites=true&w=majority'
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })

async function connect(){
    await client.connect()
}
connect()

app.get('/data', async (req, res) => {
    try {
        const position = req.query.position
        const callLetters = req.query.callLetters
        const airTemperature = req.query.airTemperature
        const ts = req.query.ts
        const db = client.db('sample_weatherdata')
        const collection = db.collection('data')
        let query = {}
        if (callLetters) {
            query.callLetters = callLetters
        }

        if (airTemperature) {
            query.airTemperature = airTemperature
        }

        if (position) {
            query.position = position
        }

        if (ts) {
            query.ts = ts
        }

        const cursor = collection.find(query).limit(1)
        let data = []
        await cursor.forEach(doc => data.push({'callLetters':doc.callLetters}))
        await cursor.forEach(doc => data.push({'airTemperature':doc.airTemperature}))
        await cursor.forEach(doc => data.push({'position':doc.position}))
        await cursor.forEach(doc => data.push({'ts':doc.ts}))

        res.send(data)
    }catch(e){
        console.log(e)
    }
})

app.listen(3000, console.log('Start application at port 3000'))