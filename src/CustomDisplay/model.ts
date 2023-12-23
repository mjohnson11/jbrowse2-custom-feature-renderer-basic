import {
    AnyConfigurationSchemaType,
    ConfigurationReference,
    getConf,
  } from '@jbrowse/core/configuration'
import { types } from 'mobx-state-tree'
import { getEnv } from '@jbrowse/core/util'
import PluginManager from '@jbrowse/core/PluginManager'
import calculateStaticBlocks from '@jbrowse/core/util/calculateStaticBlocks'
import { BlockSet, BaseBlock } from '@jbrowse/core/util/blockTypes'


  
/**
 * #stateModel CustomDisplay
 * extends
 * - [BaseLinearDisplay](../baselineardisplay)
 */
export function stateModelFactory(configSchema: AnyConfigurationSchemaType, pluginManager: PluginManager) {
  const { BaseLinearDisplay } = pluginManager.getPlugin('LinearGenomeViewPlugin').exports
  return types
  .compose(
    'CustomFeatureDisplay',
    BaseLinearDisplay,
    types.model({
      /**
       * #property
       */
      type: types.literal('CustomFeatureDisplay'),
      /**
       * #property
       */
      configuration: ConfigurationReference(configSchema),
    }),
  )
  .views(self => ({
    /**
     * #getter
     */
    get blockType(): 'staticBlocks' | 'dynamicBlocks' {
      // If you do static blocks the display can be split into multiple 800px svgs
      // which is bad for my hacky hover effects... but dynamicBlocks works great
      // but when you click and drag to move around you get "Loading" with dynamicBlocks
      return 'staticBlocks'
    },
    /**
     * #getter
     */
    get rendererTypeName() {
      return self.configuration.renderer.type
    },
  }))
  .views(self => ({
    /**
     * #getter
     */
    get rendererConfig() {
      const configBlob = getConf(self, ['renderer']) || {}
      const config = configBlob as Omit<typeof configBlob, symbol>
      return self.rendererType.configSchema.create(
        {
          ...config,
          displayMode: self.displayModeSetting,
        },
        getEnv(self),
      )
    },
  }))
  .views(self => {
    const { renderProps: superRenderProps } = self
    return {
      /**
       * #method
       */
      renderProps() {
        return {
          ...superRenderProps(),
          rpcDriverName: self.rpcDriverName,
          config: self.rendererConfig,
          height: self.height,
        }
      },
    }
  })
}