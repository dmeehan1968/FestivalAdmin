import * as knownValidations from './knownValidations'

export default class ModelValidationParser {

  constructor() {
    this.models = {}
  }

  define(modelName, attributes = {}, options = {}) {
    const model = {
      attributes: Object.keys(attributes).reduce((acc, attributeKey) => {
        return {
          ...acc,
          [attributeKey]: value => {
            Object.keys(attributes[attributeKey].validate || {}).forEach(validationKey => {
              let props = attributes[attributeKey].validate[validationKey]
              let func
              let args
              let msg
              if (typeof props === 'function') {
                func = props
                props = undefined
              } else {
                if (knownValidations[validationKey] !== undefined) {
                  func = knownValidations[validationKey]
                  if (typeof props === 'object' && !Array.isArray(props)) {
                    msg = props.msg
                    args = props.args
                  } else {
                    args = props
                  }
                } else {
                  throw new Error(`Unknown validation '${validationKey}'`)
                }
              }

              try {
                if (!func) {
                  throw new Error(`Validation Error: invalid validator specified for ${attributeKey}`)
                }
                if (!func(value, args)) {
                  throw new Error(msg || func.message || '${attribute} fails validation ${validation}, got \'${value}\'')
                }
              } catch (error) {
                throw new Error(
                  (msg || error.message)
                  .replace('${attribute}', attributeKey)
                  .replace('${validation}', validationKey)
                  .replace('${value}',JSON.stringify(value))
                )
              }
            })
          }
        }
      }, {}),
      validate: options.validate || {},
      name: options.name && options.name.singular || modelName.toLowerCase()
    }

    this.models[model.name] = model
    return {}
  }

  static DataTypes = {
    INTEGER() {
      return {}
    },
    STRING() {
      return {}
    },
  }
}
