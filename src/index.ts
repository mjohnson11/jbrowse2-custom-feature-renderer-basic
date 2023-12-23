import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'
import { version } from '../package.json'
import CustomFeatureRendererF from './CustomFeatureRenderer'
import CustomDisplayF from './CustomDisplay'

export default class CustomFeaturePlugin extends Plugin {
  name = 'CustomFeaturePlugin'
  version = version
  install(pluginManager: PluginManager) {
    CustomFeatureRendererF(pluginManager)
    CustomDisplayF(pluginManager)
  }

  configure(pluginManager: PluginManager) {}
}