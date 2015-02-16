const CALLBACKS = {}

const IN_POINT_COLOR = {
    fill: "#357EC7"
}

const OUT_POINT_COLOR = {
    fill: "red"
}

const ON_POINT_COLOR = {
    fill: "green"
}

const BEING_TESTED_COLOR = {
    fill: "gray"
}

/*======================================================================================
 For visual debugging
 ========================================================================================*/

const VARYING_COLOR = "green"

const MOVING_CENTER = s.circle(-10, -10, 2).attr({
    strokeWidth: 0,
    fill: VARYING_COLOR
})
const REFERENCE_FOR_NEW_CENTER = s.circle(-10, -10, 2).attr({
    strokeWidth: 0,
    fill: "black"
})

const MOVING_CIRCLE = s.circle(0, 0, 0).attr({
    stroke: VARYING_COLOR,
    strokeWidth: 1,
    fill: "transparent"
})


const line = s.line(0, 0, 0, 0).attr({
    stroke: "yellow"
    , strokeWidth: 2
})
//
const diameter = s.line(0, 0, 0, 0).attr({
    stroke: "#7EC736", strokeWidth: 2
})

const LOWER_BOUND = s.circle(-10, -10, 2).attr({
    strokeWidth: 0,
    fill: "indigo"
})
const UPPER_BOUND = s.circle(-10, -10, 2).attr({
    strokeWidth: 0,
    fill: "darkgreen"
})


/*======================================================================================
 @end of visual cue constants
 ========================================================================================*/

CALLBACKS.initialCallback = function (lowerBound, upperBound) {

    line.attr({
        x1: lowerBound.getX(), y1: lowerBound.getY(),
        x2: upperBound.getX(), y2: upperBound.getY()
    })

}

CALLBACKS.finalCallback = function (circleAndPointOnIt) {
    /*
     circleAndPointOnIt.center
     circleAndPointOnIt.radius
     circleAndPointOnIt.points
     */
    LOWER_BOUND.attr({
        cx: -10, cy: -10
    })
    UPPER_BOUND.attr({
        cx: -10, cy: -10
    })

    line.attr({
        x1: 0, y1: 0, x2: 0, y2: 0
    })

}

CALLBACKS.onCallback = function (onTheCircle) {
    onTheCircle.svgElement.attr(ON_POINT_COLOR)
}
CALLBACKS.inCallback = function (onTheCircle) {
    onTheCircle.svgElement.attr(IN_POINT_COLOR)
}
CALLBACKS.outCallback = function (onTheCircle) {
    onTheCircle.svgElement.attr(OUT_POINT_COLOR)
}
CALLBACKS.beforeTestCallback = function (onTheCircle) {
    onTheCircle.svgElement.attr(BEING_TESTED_COLOR)
}

CALLBACKS.circleUpdateCallback = function (lowerBound, center, upperBound, radius, fixedPointOnTheCircle) {
    var newCenter = {
        cx: center.getX(),
        cy: center.getY()
    }
    MOVING_CENTER.attr(newCenter)
    newCenter.r = radius
    MOVING_CIRCLE.attr(newCenter)
    LOWER_BOUND.attr({
        cx: lowerBound.getX(),
        cy: lowerBound.getY()
    })
    UPPER_BOUND.attr({
        cx: upperBound.getX(),
        cy: upperBound.getY()
    })
}

CALLBACKS.pointResetCallback = function (lowerBound, allPoints, upperBound) {
    var i, eachPoint
    for (i in allPoints) {
        eachPoint = allPoints[i]
        eachPoint.svgElement.attr(OUT_POINT_COLOR)
    }
}
