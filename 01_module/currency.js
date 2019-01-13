const canadianDollar = 0.91

function roundTwo(amount) {
  return Math.round(amount * 100) / 100
}

// * exports是module.exports的引用，node不允许直接修改exports,例如exports=xxx将报错
// * 所以建议一直用module.exports
// * 注意是exports不是export

// exports.canadianToUs = canadian => roundTwo(canadian * canadianDollar)
module.exports.canadianToUs = canadian => roundTwo(canadian * canadianDollar)

// exports.usToCanadian = us => roundTwo(us / canadianDollar)
module.exports.usToCanadian = us => roundTwo(us / canadianDollar)
