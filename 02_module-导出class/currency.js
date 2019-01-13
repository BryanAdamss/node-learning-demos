class Currency {
  constructor(canadianDollar = 0.91) {
    this.canadianDollar = canadianDollar
  }

  roundTwo(amound) {
    return Math.round(amound * 100) / 100
  }

  canadianToUs(canadian) {
    return this.roundTwo(canadian * this.canadianDollar)
  }

  usToCanadian(us) {
    return this.roundTwo(us / this.canadianDollar)
  }
}

module.exports = Currency
