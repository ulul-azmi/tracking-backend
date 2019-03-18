module.exports = {
  incomeCalculation(income) {
    if (income.meta.charity) {
      const charityPercentage = 10
      const charityValue = charityPercentage / 100 * income.amount
      const minusCharity = income.amount - charityValue
      return {
        amount: minusCharity,
        charity: charityValue
      }
    } else {
      return {
        amount: income.amount,
        charity: 0
      }
    }
  }
}