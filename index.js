const app = require('./app')

// creat variable "port"
const port = process.env.PORT || 5000


app.listen(port, () => {
    console.log (`server has been started on ${port}`)
})

