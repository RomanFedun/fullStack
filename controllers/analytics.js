const moment = require('moment')
const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

module.exports.overview = async (req, res) => {
  try{
      let allOrders = await Order.find({user: req.user.id}).sort({date: 1})
      let ordersMap = getOrdersMap(allOrders)
      let yesterdayOrders = ordersMap[moment()
          .add(-1, 'd')
          .format('DD.MM.YYYY')] || []

  //    number of yesterday orders
      let yesterdayOrdersNumber = yesterdayOrders.length

  //    number of orders
      let totalOrdersNumber = allOrders.length
  //    number of days
      let daysNumber = Object.keys(ordersMap).length
  //    orders per day
      let ordersPerDay = (totalOrdersNumber / daysNumber)
          .toFixed(0)
  //percent of number of orders
  //    (order from yesterday / orders per day) * 100
      let ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1)* 100)
          .toFixed(2)
  //    total gain
      let totalGain = calculatePrice(allOrders)
  //    gain per day
      let gainPerDay = totalGain / daysNumber
  //    gain of yesterday
      let yesterdayGain = calculatePrice(yesterdayOrders)
  //    percent of gain
      let gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100)
          .toFixed(2)
  //    compare of gain
      let gainCompare = (yesterdayGain - gainPerDay).toFixed(2)
  //    compare numbers of orders
      let compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2)
res.status(200).json({
    gain: {
        percent: Math.abs(+gainPercent),
        compared: Math.abs(+gainCompare),
        yesterday: +yesterdayGain,
        isHigher: +gainPercent > 0
    },
    orders: {
        percent: Math.abs(+ordersPercent),
        compared: Math.abs(+compareNumber),
        yesterday: +yesterdayOrdersNumber,
        isHigher: +ordersPercent > 0
    }
})

  } catch (e) {
     errorHandler(res, e)
  }
}

module.exports.analytics = async (req, res) => {
  try {

    let allOrders =  await Order.find(
        {user: req.user.id}
    ).sort({date: 1})

    let ordersMap = getOrdersMap(allOrders)

     let average = +(calculatePrice(allOrders) / Object.keys(ordersMap)
         .length).toFixed(2)

      let chart = Object.keys(ordersMap).map(label => {
      // label == 05.03.2021
          const order= ordersMap[label].length
          const gain = calculatePrice(ordersMap[label])

          return  { label, order, gain }

      })

      res.status(200).json({
         average, chart
      })

  } catch (e) {
      errorHandler(res, e)
  }
}
function getOrdersMap(orders = []) {
    const daysOrders = {}
    orders.forEach(order => {
      let date = moment(order.date).format('DD.MM.YYYY')

      if (date === moment().format('DD.MM.YYYY'))   {
          return
      }

      if (!daysOrders[date]) {
          daysOrders[date] = []
      }

      daysOrders[date].push(order)
    })
    return daysOrders
}

function calculatePrice(orders = []) {
    return orders.reduce((total, order) => {
       const orderPrice = order.list.reduce((orderTotal, item) => {
           return orderTotal + item.cost * item.quantity
       }, 0)
       return total + orderPrice
    },0)
}



