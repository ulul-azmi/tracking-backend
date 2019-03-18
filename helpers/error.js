module.exports = {
  generate(err) {
    if (err.errors) {
      return {
        status: 422,
        data: {
          errors: Object.entries(err.errors).reduce((carry, [key, value]) => {
            carry[key] = {
              message: value.message,
            };
            return carry;
          }, {}),
        },
      };
    }

    return {
      status: 500,
      data: {
        msg: err.message,
      },
    };
  },
};
