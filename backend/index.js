require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
var bodyParser = require('body-parser');


// app config
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));

// DB Config
mongoose.connect('mongodb://localhost:27017/reminder', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log(`successfully connected`);
}).catch((e) => {
    console.log(`not connected`);
})

const reminderSchema = new mongoose.Schema({
    reminderMsg: String,
    remindAt: String,
    isReminded: Boolean
})
const Remider = new mongoose.model("reminder", reminderSchema)

// Whats app reminder 
setInterval(() => {
    Remider.find({}, (err, reminderList) => {
        if (err) {
            console.log(err);
        }
        if (reminderList) {
            reminderList.forEach(reminder => {
                if (!reminder.isReminded) {
                    const now = new Date()
                    if ((new Date(reminder.remindAt) - now) < 0) {
                        Remider
                        .findByIdAndUpdate(reminder._id, { isReminded: true }, (err, remindObj) => {
                            if (err) {
                                console.log(err);
                            }
                            const accountSid = process.env.Account_sid
                            const authToken = process.env.Auth_token
                            const client = require('twilio')(accountSid, authToken);
                            client.messages
                                .create({
                                    body: reminder.reminderMsg,
                                    from: 'whatsapp:+14155238886',
                                    to: 'whatsapp:+917902815286'
                                })
                                .then(message => console.log(message.sid))
                               //.done();
                        })
                    }
                }
            });
        }
    })
}, 1000)




// API routs  

app.get('/getAllReminder', (req, res) => {
    Remider.find({}, (err, reminderList) => {
        if (err) {
            console.log(err);
        }
        if (reminderList) {
            res.send(reminderList)
        }
    })
})
app.post("/addReminder", (req, res) => {
    const { reminderMsg, remindAt } = req.body
    const reminder = new Remider({
        reminderMsg,
        remindAt,
        isReminded: false
    })
    reminder.save(err => {
        if ("kannan", err) {
            console.log(err);
        }
        Remider.find({}, (err, reminderList) => {
            if (err) {
                console.log(err);
            }
            if (reminderList) {
                res.send(reminderList)
            }
        })
    })
})
app.post("/deleteReminder", (req, res) => {
    Remider.deleteOne({ _id: req.body.id }, () => {
        Remider.find({}, (err, reminderList) => {
            if (err) {
                console.log(err);
            }
            if (reminderList) {
                res.send(reminderList)
            }
        })
    })
})
app.listen(4000, () => console.log("Backend started")) 