import { useMemo } from 'react'

import ModelValidationParser from 'app/utils/ModelValidationParser'

export const useModelValidations = builders => {

  return useMemo(() => {

    const parser = new ModelValidationParser()

    Object.keys(builders).forEach(builderKey => {
      const builder = builders[builderKey]
      const model = builder(parser, ModelValidationParser.DataTypes)
    })

    return parser
  })

}

export default useModelValidations
