import PluginManager from '@jbrowse/core/PluginManager'
import { DisplayType } from '@jbrowse/core/pluggableElementTypes'
import { stateModelFactory } from './model'
import { configSchemaFactory } from './configSchema'

// This is the display type factory
export default (pluginManager: PluginManager) => {
  // We import from the pluginManager here because plugins are not included in the 
  // rollup for the template plugin, so importing from '@jbrowse/plugin-linear-genome-view' won't work
  const { BaseLinearDisplayComponent } = pluginManager.getPlugin('LinearGenomeViewPlugin').exports
  pluginManager.addDisplayType(() => {
    const configSchema = configSchemaFactory(pluginManager)
    return new DisplayType({
      name: 'CustomFeatureDisplay',
      displayName: 'Custom feature display',
      configSchema,
      stateModel: stateModelFactory(configSchema, pluginManager),
      trackType: 'FeatureTrack',
      viewType: 'LinearGenomeView',
      ReactComponent: BaseLinearDisplayComponent,
    })
  })
}