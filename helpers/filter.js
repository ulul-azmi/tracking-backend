module.exports = {
  filter(model, data) {
    return Object.entries(data)
      .reduce((carry, [key, value]) => {
        if (model.fillable.includes(key)) {
          carry[key] = value
        }
        return carry
      }, {})
  }
}