const yup = require('yup');

const registerUserSchema = yup
  .object().shape({
    name: yup.string().required().trim(),
    age: yup.number().required(),
    phone: yup.object({
        personal: yup.string().required().trim(),
        work: yup.string().required().trim(),
        ext: yup.string().required().trim()
    }),
    privileges: yup.string().required().trim(),
    favorites:yup.object({
      artist: yup.string().required().trim(),
      food: yup.string().required().trim()
    }),
    finished: yup.array().required(),
    badges: yup.array().required(),
    points: yup.array().required().of(yup.object(
      {
        points: yup.number().required(),
        bonus: yup.number().required()
      },
      {
        points: yup.number().required(),
        bonus: yup.number().required()
      })
    )
  })
  .required();

module.exports = registerUserSchema;