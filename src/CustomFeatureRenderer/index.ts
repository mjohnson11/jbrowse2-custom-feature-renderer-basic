import PluginManager from '@jbrowse/core/PluginManager'
import ReactComponent from './CustomFeatureRendering'
import configSchema from './configSchema'
import CustomFeatureRenderer from './CustomFeatureRenderer'

// This is the renderer factory, loads the renderer
export default (pluginManager: PluginManager) => {
    pluginManager.addRendererType(
      () =>
        new CustomFeatureRenderer({
          name: 'CustomFeatureRenderer',
          ReactComponent,
          configSchema,
          pluginManager,
        }),
    )
  }