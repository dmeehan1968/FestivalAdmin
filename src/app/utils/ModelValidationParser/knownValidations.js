export const notEmpty = (value, args) => {
  return !(!value || value.length < 1)
}
notEmpty.message = '${attribute} should not be empty'

export const len = (value, args) => {
  const [ min, max ] = args
  if (value.length < min) {
    throw new Error(`\${attribute} must have length greater than or equal to ${min} characters, got ${value.length}`)
  }
  if (value.length > max) {
    throw new Error(`\${attribute} must have length less than or equal to ${max} characters, got ${value.length}`)
  }
  return true
}
