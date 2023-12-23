import PluginManager from '@jbrowse/core/PluginManager'
import { types } from 'mobx-state-tree'
import { ConfigurationSchema } from '@jbrowse/core/configuration'

/**
 * #config CartoonDisplay
 */
export function configSchemaFactory(pluginManager: PluginManager) {
  // We import from the pluginManager here because plugins are not included in the 
  // rollup for the template plugin, so importing from '@jbrowse/plugin-linear-genome-view' won't work
  const { baseLinearDisplayConfigSchema } = pluginManager.getPlugin('LinearGenomeViewPlugin').exports
  return ConfigurationSchema(
    'CustomFeatureDisplay',
    {
      /**
       * #slot
       */
      renderer: types.optional(
        pluginManager.pluggableConfigSchemaType('renderer'),
        { type: 'CustomFeatureRenderer' },
      ),
    },
    {
      /**
       * #baseConfiguration
       */
      baseConfiguration: baseLinearDisplayConfigSchema,
      explicitlyTyped: true,
    },
  )
}