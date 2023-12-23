// Largely based on SvgFeatureRendering.tsx
// I've gotten rid of references to layout and extra glyph validation
// Also doesn't have the complex mouseMove behavior (which requires layout)
// Or the svg overlay (I don't know what it does)

import React, { useRef, useState, useCallback } from 'react'
import {
  AnyConfigurationModel,
  readConfObject,
} from '@jbrowse/core/configuration'
import { Feature, Region, bpSpanPx} from '@jbrowse/core/util'
import { observer } from 'mobx-react'
import { DisplayModel } from './util'
import { OneFeature } from './RenderOneFeature'

const RenderedFeatures = observer(function RenderedFeatures(props: {
    features: Map<string, Feature>
    isFeatureDisplayed?: (f: Feature) => boolean
    bpPerPx: number
    config: AnyConfigurationModel
    displayMode: string
    displayModel?: DisplayModel
    region: Region
    exportSVG?: unknown
    viewParams: {
      start: number
      end: number
      offsetPx: number
      offsetPx1: number
    }
    [key: string]: unknown
  }) {
    // Could do more complex things here with the visible features and the other props
    // Here we are just calling OneFeature to get a react element for each
    const { features } = props
    return (
      <>
        {[...features.values()].map(function(f) {
          //console.log(f) // Log the features as we iterate through them here
          return (
            <OneFeature
              key={f.id()}
              feature={f}
              {...props}
            />
          )
        }
      )}
    </>
    )
  }
)


const CustomSvgRendering = observer(function CustomSvgRendering(props: {
  blockKey: string
  regions: Region[]
  bpPerPx: number
  detectRerender?: () => void
  config: AnyConfigurationModel
  features: Map<string, Feature>
  displayModel?: DisplayModel
  height: number
  exportSVG?: boolean
  viewParams: {
    start: number
    end: number
    offsetPx: number
    offsetPx1: number
  }
  featureDisplayHandler?: (f: Feature) => boolean
  onMouseOut?: React.MouseEventHandler
  onMouseDown?: React.MouseEventHandler
  onMouseLeave?: React.MouseEventHandler
  onMouseEnter?: React.MouseEventHandler
  onMouseOver?: React.MouseEventHandler
  onMouseMove?: (event: React.MouseEvent, featureId?: string) => void
  onMouseUp?: React.MouseEventHandler
  onClick?: React.MouseEventHandler
}) {
  const {
    blockKey,
    regions = [],
    bpPerPx,
    config,
    displayModel = {},
    exportSVG,
    featureDisplayHandler,
    onMouseOut,
    onMouseDown,
    onMouseLeave,
    onMouseEnter,
    onMouseOver,
    onMouseMove,
    onMouseUp,
    onClick,
  } = props
  console.log(onMouseMove)
  //console.log(props) // These are all the properties passed to your renderer
  const {features, height} = props
  const [region] = regions
  const width = (region.end - region.start) / bpPerPx
  const svgHeightPadding = 10

  // I don't have display modes, but leaving this here as an example
  // Could add a few modes and add them to the menus, for example see:
  // https://github.com/GMOD/jbrowse-components/blob/main/plugins/arc/src/ArcRenderer/configSchema.ts
  // https://github.com/GMOD/jbrowse-components/blob/main/plugins/arc/src/LinearArcDisplay/model.ts
  // and then use this variable here
  const displayMode = readConfObject(config, 'displayMode') as string

  const ref = useRef<SVGSVGElement>(null)
  const [mouseIsDown, setMouseIsDown] = useState(false)
  const [movedDuringLastMouseDown, setMovedDuringLastMouseDown] =
    useState(false)

  const mouseDown = useCallback(
    (event: React.MouseEvent) => {
      setMouseIsDown(true)
      setMovedDuringLastMouseDown(false)
      return onMouseDown?.(event)
    },
    [onMouseDown],
  )

  const mouseUp = useCallback(
    (event: React.MouseEvent) => {
      setMouseIsDown(false)
      return onMouseUp?.(event)
    },
    [onMouseUp],
  )

  // simplified version of mouseMove that doesn't use the displayModel and
  // doesn't look for the feature we're hovering over
  const mouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!ref.current) {
        return
      }
      if (mouseIsDown) {
        setMovedDuringLastMouseDown(true)
      }
    },
    [onMouseMove],
  )

  const click = useCallback(
    (event: React.MouseEvent) => {
      // don't select a feature if we are clicking and dragging
      if (movedDuringLastMouseDown) {
        return
      }
      onClick?.(event)
    },
    [movedDuringLastMouseDown, onClick],
  )

  return exportSVG ? (
    <RenderedFeatures
      isFeatureDisplayed={featureDisplayHandler}
      region={region}
      displayMode={displayMode}
      {...props}
    />
  ) : (
    <svg
      ref={ref}
      data-testid="svgfeatures"
      width={width}
      height={height + svgHeightPadding}
      onMouseDown={mouseDown}
      onMouseUp={mouseUp}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onMouseMove={mouseMove}
      onClick={click}
    >
      <RenderedFeatures
        region={region}
        displayMode={displayMode}
        movedDuringLastMouseDown={movedDuringLastMouseDown}
        isFeatureDisplayed={featureDisplayHandler}
        {...props}
      />
    </svg>
  )
})

export default CustomSvgRendering
