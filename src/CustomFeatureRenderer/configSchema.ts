import { ConfigurationSchema } from '@jbrowse/core/configuration'

// Note sometimes there is a dummy function here, which I deleted
// this has something to do with auto-generating documentation with args

// Here is the config shema for the renderer, to which we could add arguments/parameters
const CustomFeatureRenderer = ConfigurationSchema(
  'CustomFeatureRenderer',
  {
    /**
     * #slot
     */
    color: {
      type: 'color',
      description: 'the color of the rectangle stroke',
      defaultValue: 'darkblue',
      contextVariable: ['feature'],
    }
  },
  { explicitlyTyped: true }
)
export default CustomFeatureRenderer