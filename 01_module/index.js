const currency = require('./currency.js')

const { canadianToUs, usToCanadian } = currency

console.log(canadianToUs(50))
console.log(usToCanadian(30))
