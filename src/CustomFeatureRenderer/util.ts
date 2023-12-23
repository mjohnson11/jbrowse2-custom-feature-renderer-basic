
// part of SvgFeatureRenderer/components/util.ts
import { Feature } from '@jbrowse/core/util'

type LayoutRecord = [number, number, number, number]

export interface DisplayModel {
    getFeatureByID?: (arg0: string, arg1: string) => LayoutRecord
    getFeatureOverlapping?: (
      blockKey: string,
      bp: number,
      y: number,
    ) => string | undefined
    selectedFeatureId?: string
    featureIdUnderMouse?: string
    contextMenuFeature?: Feature
  }