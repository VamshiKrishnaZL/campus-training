/*======================================================================================
 Global Constants
 ========================================================================================*/

const ALL_POINTS = {}
const INSIDE_POINT_TOLERANCE = 0.3
const OUTSIDE_POINT_TOLERANCE = 0.3
const s = Snap("#svg")
const RADIUS = 5
const ENCLOSING_CIRCLE = s.circle(0, 0, 0).attr({
    stroke: "#7E36C7",
    strokeWidth: 1,
    fill: "transparent"
})

/*======================================================================================
 Global variables
 ========================================================================================*/

var centerOfTheSmallestCircle = null;
var numberOfPoints = 0
var perpendicularBisector = null
var radiusAndCenter = {}

function getPointsPassingThroughTheCircle(center, radius, points) {
    var dx, dy, point, key, calculatedDistance
    var x = center.getX(), y = center.getY()
    var pointsOnTheCircle = []
    for (key in points) {
        point = points[key]
        dx = point.getX() - x
        dy = point.getY() - y
        calculatedDistance = Math.sqrt(dx * dx + dy * dy)
        // Should we use tolerance or float comparison ?
        if ((radius - calculatedDistance) <= INSIDE_POINT_TOLERANCE) {
            pointsOnTheCircle.push(point)
        } else {
            // point lies inside the circle
        }
    }
    return pointsOnTheCircle
}
function extractInformation(approximateCenter, obj, pointsPassingThroughTheCircle, noOfPointsPassingThroughTheCircle) {
    centerOfTheSmallestCircle = approximateCenter = obj.center
    centerOfTheSmallestCircle = obj.center
    ENCLOSING_CIRCLE.attr({
        cx: centerOfTheSmallestCircle.getX(),
        cy: centerOfTheSmallestCircle.getY(),
        r: obj.radius
    })
    pointsPassingThroughTheCircle = obj.points
    noOfPointsPassingThroughTheCircle = pointsPassingThroughTheCircle.length

    //can cause memory leak; let's remove the property
    delete obj[pointsPassingThroughTheCircle]
    return {
        approximateCenter: approximateCenter,
        pointsPassingThroughTheCircle: pointsPassingThroughTheCircle,
        noOfPointsPassingThroughTheCircle: noOfPointsPassingThroughTheCircle,
        radius: obj.radius
    };
}
function updateEnclosingCircleWhenAdded(newPoint) {

    var x, y, radius, eachPoint
    x = y = radius = 0

    switch (numberOfPoints) {
        case 1:
            var firstPoint
            for (var tupleString in ALL_POINTS) {
                eachPoint = ALL_POINTS[tupleString]
                if (firstPoint == null) {
                    firstPoint = eachPoint
                }
                y = eachPoint.y;
                x = eachPoint.x;
            }
            radius = RADIUS
            ENCLOSING_CIRCLE.attr({
                x: -10,
                y: -10
            })
            REFERENCE_FOR_NEW_CENTER.attr({
                x: -10,
                y: -10
            })
            MOVING_CIRCLE.attr({
                cx: x
                , cy: y
                , r: radius
            })
            MOVING_CENTER.attr({
                cx: x, cy: y
            })
            break;
        case 2:
            var firstPoint = null, secondPoint = null
            for (var tupleString in ALL_POINTS) {
                eachPoint = ALL_POINTS[tupleString]
                if (firstPoint == null) {
                    firstPoint = eachPoint
                } else if (secondPoint == null) {
                    secondPoint = eachPoint
                }

            }
            x = (firstPoint.getX() + secondPoint.getX()) * 0.5
            y = (firstPoint.getY() + secondPoint.getY()) * 0.5
            radius = getDistanceBetweenPoints(firstPoint, secondPoint) * 0.5
            MOVING_CIRCLE.attr({
                cx: x
                , cy: y
                , r: radius
            })
            MOVING_CENTER.attr({
                cx: x, cy: y
            })
            ENCLOSING_CIRCLE.attr({
                x: -10,
                y: -10
            })
            REFERENCE_FOR_NEW_CENTER.attr({
                x: -10,
                y: -10
            })
            break;
        case 3:
            /*todo : if the triangle forms an isosceles triangle
             we should  find the circumcenter  and make it the center of the
             enclosing circle. */
            var firstPoint = null, secondPoint = null, thirdPoint = null
            for (var tupleString in ALL_POINTS) {
                eachPoint = ALL_POINTS[tupleString]
                if (firstPoint == null) {
                    firstPoint = eachPoint
                } else if (secondPoint == null) {
                    secondPoint = eachPoint
                } else if (thirdPoint == null) {
                    thirdPoint = eachPoint
                }
            }
            //if (areThreePointsCollinear(firstPoint, secondPoint, thirdPoint)) {
            //    // distant points become the end points of the diameter
            //    //TODO:Find the maximum distant points
            //
            //}
            //else
            if (isTriangleIsosceles(firstPoint, secondPoint, thirdPoint)) {

            } else {
                //TODO:Find the maximum distant points
                // and make the line joining them as the diameter of the circle
                var a = getDistanceBetweenPoints(firstPoint, secondPoint)
                var b = getDistanceBetweenPoints(secondPoint, thirdPoint)
                var c = getDistanceBetweenPoints(thirdPoint, firstPoint)

                var shouldFindOrthocenter = false;

                if (Math.abs(a - b) <= INSIDE_POINT_TOLERANCE ||
                    Math.abs(a - b) <= INSIDE_POINT_TOLERANCE ||
                    Math.abs(a - b) <= INSIDE_POINT_TOLERANCE) {
                    shouldFindOrthocenter = true
                } else {

                    var leftPoint, rightPoint
                    var otherPoint

                    if (a > b) {
                        //it must be a or c
                        if (a > c) {
                            //a
                            leftPoint = firstPoint
                            rightPoint = secondPoint
                            otherPoint = thirdPoint
                            radius = a
                        } else {
                            // c
                            leftPoint = firstPoint
                            rightPoint = thirdPoint
                            otherPoint = secondPoint
                            radius = c
                        }
                    } else {
                        // it must be b or c
                        if (b > c) {
                            //b
                            leftPoint = secondPoint
                            rightPoint = thirdPoint
                            otherPoint = firstPoint
                            radius = b
                        } else {
                            //c
                            leftPoint = firstPoint
                            rightPoint = thirdPoint
                            otherPoint = secondPoint
                            radius = c
                        }
                    }
                    x = (leftPoint.x + rightPoint.x) >> 1
                    y = (leftPoint.y + rightPoint.y) >> 1
                    radius = radius >> 1
                    if (pointEvaluator(new Point(x, y), radius, otherPoint) == 1) {
                        shouldFindOrthocenter = true
                    }
                }
                if (shouldFindOrthocenter) {
                    var orthoCenter = findOrthoCenter(firstPoint, secondPoint, thirdPoint)
                    x = orthoCenter.x
                    y = orthoCenter.y
                    radius = getDistanceBetweenPoints(orthoCenter, firstPoint)
                }
            }
            MOVING_CIRCLE.attr({
                cx: x,
                cy: y,
                r: radius
            })
            MOVING_CENTER.attr({
                cx: x, cy: y
            })
            ENCLOSING_CIRCLE.attr({
                x: -10,
                y: -10
            })
            REFERENCE_FOR_NEW_CENTER.attr({
                x: -10,
                y: -10
            })
            break;
        default :
            //Based on the rectangle enclosing the points
            var approximateCircle = getEstimatedEnclosingCircle(ALL_POINTS);
            //Center of the rectangle
            var approximateCenter = new Point(approximateCircle.cx, approximateCircle.cy)

            // Find the distant point from this center
            var distantPoint = getDistantPoint(approximateCenter, ALL_POINTS)

            var initialCenter = getMidPointOf(distantPoint, approximateCenter)

            // and let's use this distance from the center to the distant point
            // as the new radius of the circle
            // Now we have atleast one point lying on the circle
            var radiusOfTheFirstCircle = getDistanceBetweenPoints(approximateCenter, distantPoint)

            REFERENCE_FOR_NEW_CENTER.attr({
                cx: approximateCircle.cx,
                cy: approximateCircle.cy
            })

            ENCLOSING_CIRCLE.attr({
                cx: approximateCircle.cx
                , cy: approximateCircle.cy
                , r: radiusOfTheFirstCircle
            })

            //ENCLOSING_CIRCLE.attr(approximateCircle)

            MOVING_CENTER.attr({
                cx: initialCenter.getX(),
                cy: initialCenter.getY(),
                r: 2
            })


            MOVING_CIRCLE.attr({
                cx: initialCenter.getX(),
                cy: initialCenter.getY(),
                r: radiusOfTheFirstCircle * 0.5
            })

            var pointsPassingThroughTheCircle
                = getPointsPassingThroughTheCircle(approximateCenter, radiusOfTheFirstCircle, ALL_POINTS)

            // this must be at least 1 as said earlier
            var noOfPointsPassingThroughTheCircle = pointsPassingThroughTheCircle.length

            var obj

            var D, E, info

            // if we have one point on the circle , we should move
            // the center of the circle along the radius touching this distant point
            if (noOfPointsPassingThroughTheCircle == 1) {
                // move along the line joining radius and the point passing through the circle
                D = pointsPassingThroughTheCircle[0]
                obj = findCenterAndRadius(ALL_POINTS, distantPoint, approximateCenter,
                    pointEvaluator, distantPoint, atleastTwoPoints, CALLBACKS)
                info = extractInformation(approximateCenter, obj, pointsPassingThroughTheCircle,
                    noOfPointsPassingThroughTheCircle);
                approximateCenter = info.approximateCenter;
                pointsPassingThroughTheCircle = info.pointsPassingThroughTheCircle;
                noOfPointsPassingThroughTheCircle = info.noOfPointsPassingThroughTheCircle;
            }

            if (noOfPointsPassingThroughTheCircle == 2) {
                const oneEndPoint = D = pointsPassingThroughTheCircle[0];
                const otherEndPoint = E = pointsPassingThroughTheCircle[1];
                var diameterEquation =
                    createSlopePointEquationFromPoints(
                        oneEndPoint,
                        otherEndPoint);
                if (diameterEquation.isPointOnTheLine(approximateCenter)) {
                    //TODO: Check whether everything reflects the current state
                    radiusAndCenter.center = centerOfTheSmallestCircle =
                        approximateCenter
                    radiusAndCenter.radius = getDistanceBetweenPoints(oneEndPoint, otherEndPoint) * 0.5
                    ENCLOSING_CIRCLE.attr(obj)
                    return
                }
            }
            while (noOfPointsPassingThroughTheCircle >= 2) {
                //check for the segment of the arc with length greater than the
                // half of the circumfrence of the circle with no point on it
                if (hasMajorArcWithNoPointOnIt2(approximateCenter, pointsPassingThroughTheCircle)) {
                    var i, eachPointOnTheCircle, maximumDistant = 0, calculatedDistance = 0
                    for (i in pointsPassingThroughTheCircle) {
                        eachPointOnTheCircle = pointsPassingThroughTheCircle[i]
                        calculatedDistance = getDistanceBetweenPoints(D, eachPointOnTheCircle)
                        if (maximumDistant < calculatedDistance) {
                            maximumDistant = calculatedDistance
                            E = eachPointOnTheCircle
                        }
                    }
                    diameter.attr({x1: D.x, y1: D.y, x2: E.x, y2: E.y})
                    obj = reduceRadius(ALL_POINTS, getMidPointOf(D, E), approximateCenter,
                        pointEvaluator, D, E, terminatingCondition2, CALLBACKS)
                    info = extractInformation(approximateCenter, obj, pointsPassingThroughTheCircle,
                        noOfPointsPassingThroughTheCircle);
                    radiusAndCenter.center = centerOfTheSmallestCircle = approximateCenter = info.approximateCenter;
                    pointsPassingThroughTheCircle = info.pointsPassingThroughTheCircle;
                    noOfPointsPassingThroughTheCircle = info.noOfPointsPassingThroughTheCircle;
                    radiusAndCenter.radius = radius = info.radius
                    if (terminatingCondition2(pointsPassingThroughTheCircle, null, null, approximateCenter, info.radius)) {
                        break;
                    }
                } else {
                    break;
                }
            }
            REFERENCE_FOR_NEW_CENTER.attr({
                cx: -10,
                cy: -10
            })

            ENCLOSING_CIRCLE.attr({
                cx: -10
                , cy: -10
                , r: 0
            })

            line.attr({x1: 0, y1: 0, x2: 0, y2: 0})
            diameter.attr({x1: 0, y1: 0, x2: 0, y2: 0})
    }

}
function updateEnclosingCircleWhenRemoved(removedPoint) {
    updateEnclosingCircleWhenAdded(null)
}


function createPoint(x, y) {
    //we should subtract RADIUS * 0.5 to make the center of the point added be at the tip of the mouse

    x -= RADIUS * 0.5
    y -= RADIUS * 0.5

    x = Math.round(x)
    y = Math.round(y)

    var newPoint
    if (x < 0 || y < 0) return;
    //console.log("Creating circle of radius : " + x + ", " + y)
    const key = "(" + x + "," + y + ")"
    var svgElement = s.circle(x, y, RADIUS)
    //console.log("Key of the circle : " + key)
    ALL_POINTS[key] = newPoint = new Point(x, y)
    newPoint.svgElement = svgElement;
    s.append(svgElement)
    ++numberOfPoints
    //assign a click handler to the point to remove itself when a click is observed
    svgElement.click(function (e) {
        if (e.target === e.currentTarget) {
            svgElement.remove();
            //console.log(key in ALL_CIRCLES_X)
            delete  ALL_POINTS[key]
            //console.log(key in ALL_CIRCLES_X)
            --numberOfPoints
            console.log("Removing point")
            updateEnclosingCircleWhenRemoved(newPoint)
            newPoint.svgElement = null
        }
    })
    //we should update the smallest enclosing circle
    updateEnclosingCircleWhenAdded(newPoint)
}


/*======================================================================================
 Startup code initialization
 ========================================================================================*/

s.data("enclosingCircle", true)
s.click(function (clickEvent) {
    //console.log(clickEvent.target)
    if (clickEvent.target === clickEvent.currentTarget) {
        // this is a click on the point
        createPoint(clickEvent.layerX, clickEvent.layerY)
    } else if (parseInt(clickEvent.target.attributes["r"]) != RADIUS) {
        // this is a click on the enclosing circle
        //console.log("Creating a click event")
        //createPoint(clickEvent.layerX, clickEvent.layerY)
        //console.log("Clicked on the enclosing circle")
    } else {
        console.log(clickEvent.target["enclosingCircle"])
    }
})

/*

 */

