import React, { useState } from 'react'
import {
  AnyConfigurationModel,
  readConfObject,
} from '@jbrowse/core/configuration'
import { Feature, Region, bpSpanPx, measureText } from '@jbrowse/core/util'
import { DisplayModel } from './util'


// This is where the magic happens
export function OneFeature(props: {
    feature: Feature
    displayMode: string
    bpPerPx: number
    region: Region
    config: AnyConfigurationModel
    exportSVG?: unknown
    displayModel?: DisplayModel
    detectRerender?: () => void
    onClick?: () => void
    onFeatureClick?: (event: React.MouseEvent, featureId?: string) => void
    onFeatureContextMenu?: () => void
    onMouseMove?: (event: React.MouseEvent, featureId?: string) => void
    onMouseLeave?: (event: React.MouseEvent, featureId?: string) => void
    viewParams: {
      start: number
      end: number
      offsetPx: number
      offsetPx1: number
    }
    [key: string]: unknown
  }) {
    const {
      feature,
      detectRerender,
      bpPerPx,
      region,
      config,
      displayModel,
      displayMode,
      layout,
      extraGlyphs,
      onFeatureClick,
      onMouseMove,
      onMouseLeave
    } = props
  
    const [left, right] = bpSpanPx(
      feature.get('start'),
      feature.get('end'),
      region,
      bpPerPx,
    )

    // OK here is a react statement for opacity
    // Note this has this staticblocks issue
    const [opacity, setOpacity] = useState(1)
    
    //console.log(props)
    const featureId = feature.id()
    // this comes from the config
    const stroke = readConfObject(config, 'color', { feature })
    // These could all also be config options, they are just arbitrary for this example
    const textStroke = 'black'
    const strokeWidth = 1 
    const height = 30 
    const fontsize = 12
    const textBuf = 5

    // This is the remnant of me trying to use a higher level state variable (featureIdUnderMouse)
    // To change the display of a hovered feature across static blocks.
    //const { featureIdUnderMouse } = displayModel
    //console.log(featureIdUnderMouse)
    //const opacity2 = featureId == featureIdUnderMouse ? 0.8 : 1
    //console.log(opacity2)

    const label = feature.get('name')
    //console.log(label) // Logging everything we draw
    const labelsize = measureText(label, fontsize)
    const labelVisible = (labelsize+2*textBuf < right-left)
    

    return (
      <g
        // The functions passed through params
        // give us the basic tooltip and click to pull up the feature functionality
        // Here I am also adding code to change the opacity of the displayed feature on mouseover
        // Note that this doesn't work well with the staticBlocks - sometimes only part of a feature 
        // changes opacity. Something to work on
        onClick = {(e) => onFeatureClick?.(e, featureId)}
        onMouseMove = {function(e) {
            setOpacity(0.8)
            onMouseMove?.(e, featureId) 
          }
        }
        onMouseOut = {function(e) {
            setOpacity(1)
            onMouseLeave?.(e, featureId)
          }
        }
        opacity={opacity}
      >
        <rect
          x={left}
          width={right-left}
          y={0}
          height={height}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="#AAAAAA"
        />
         {labelVisible ? (
            <text
              x={left+textBuf}
              y={height-textBuf}
              fill={textStroke}
              fontSize={fontsize}
            >{label}
            </text>
          ) : null
        }
      </g>
    )
  }