function findCenterAndRadius(allPoints, initialLowerBound, initialUpperBound, pointEvaluator, pointOnTheCircle, condition, callbacks) {
    const FIXED_POINT_ON_THE_CIRCLE = pointOnTheCircle
    const RETURN_VALUE = {}

    var outsideTheCircle, onTheCircle;
    var ic, on, out;

    var dx, dy

    var lowerBound = initialLowerBound
    var upperBound = initialUpperBound
    var movingCenter = new Point(-1000000, -1000000);
    var breakTheLoop = false;
    var oldMidPoint = null

    var index, eachPoint, flag, radius
    outsideTheCircle = allPoints;
    onTheCircle = []

    if (callbacks && callbacks.initialCallback) {
        callbacks.initialCallback(lowerBound, upperBound)
    }

    const lineEquation = createSlopePointEquationFromPoints(lowerBound, upperBound)

    do {
        ic = []
        on = []
        out = []
        //console.log("[" + lowerBound + "," + upperBound + "]")
        oldMidPoint = movingCenter
        //console.log("New Midpoint (Using Division):" + getMidPointOf(lowerBound, upperBound))
        dx = (lowerBound.x + upperBound.x) * 0.5
        dy = lineEquation.getYAtX(dx)
        movingCenter = new Point(dx, dy)
        //movingCenter = getMidPointOf(lowerBound, upperBound)
        //console.log("New Midpoint (Using Line equation):" + movingCenter)
        //console.log("[" + lowerBound + "-" + movingCenter + "- " + upperBound + "]")
        radius = getDistanceBetweenPoints(movingCenter, FIXED_POINT_ON_THE_CIRCLE)

        if (callbacks && callbacks.circleUpdateCallback) {
            callbacks.circleUpdateCallback(lowerBound, movingCenter, upperBound, radius, FIXED_POINT_ON_THE_CIRCLE)
        }

        for (index in onTheCircle) {
            eachPoint = onTheCircle[index]
            if (callbacks && callbacks.beforeTestCallback) {
                callbacks.beforeTestCallback(eachPoint)
            }
            flag = pointEvaluator(movingCenter, radius, eachPoint)
            if (flag == 0) {
                //on the circle
                on.push(eachPoint)
                if (callbacks && callbacks.onCallback) {
                    callbacks.onCallback(eachPoint)
                }
            } else if (flag == 1) {
                //outside the circle
                out.push(eachPoint)
                if (callbacks && callbacks.outCallback) {
                    callbacks.outCallback(eachPoint)
                }
            } else {
                if (callbacks && callbacks.inCallback) {
                    callbacks.inCallback(eachPoint)
                }
            }
        }

        for (index in outsideTheCircle) {
            eachPoint = outsideTheCircle[index]
            if (callbacks && callbacks.beforeTestCallback) {
                callbacks.beforeTestCallback(eachPoint)
            }
            flag = pointEvaluator(movingCenter, radius, eachPoint)
            if (flag == 0) {
                //on the circle
                on.push(eachPoint)
                if (callbacks && callbacks.onCallback) {
                    callbacks.onCallback(eachPoint)
                }
            } else if (flag == 1) {
                //outside the circle
                out.push(eachPoint)
                if (callbacks && callbacks.outCallback) {
                    callbacks.outCallback(eachPoint)
                }
            } else {
                if (callbacks && callbacks.inCallback) {
                    callbacks.inCallback(eachPoint)
                }
            }
        }
        //if no point lies outside the circle
        if (out.length == 0) {
            //We have no points outside the circle and,
            //if  no point lies on the circle
            if (on.length > 1) {
                //all points are either inside the circle or on the circle.
                //This is a good place to test the condition necessary to break the loop
                //TODO: Determine what parameters need to be passed
                if (condition(on, lowerBound, upperBound, initialUpperBound, radius)) {
                    breakTheLoop = true;
                    RETURN_VALUE.center = movingCenter
                    RETURN_VALUE.radius = radius
                    RETURN_VALUE.points = on
                    if (callbacks && callbacks.finalCallback) {
                        callbacks.finalCallback(eachPoint)
                    }
                } else {
                    // we can reduce the lowerBound
                    lowerBound = movingCenter
                    onTheCircle = on
                    outsideTheCircle = out
                    if (lowerBound.x == movingCenter.x && lowerBound.y == movingCenter.y) {
                        console.log(lineEquation.getYAtX(lowerBound.x) + "  " + lowerBound.y)
                    }
                }
            }
            else {
                //all points are either inside the circle or on the circle.
                //This is a good place to test the condition necessary to break the loop
                //TODO: Determine what parameters need to be passed

                //if (condition(on, lowerBound, upperBound, center, radius)) {
                //    breakTheLoop = true
                //    RETURN_VALUE.center = movingCenter
                //    RETURN_VALUE.radius = radius
                //    RETURN_VALUE.points = on
                //    if (callbacks && callbacks.finalCallback) {
                //        callbacks.finalCallback(eachPoint)
                //    }
                //} else {
                onTheCircle = []
                dx = getDistanceBetweenPoints(lowerBound, upperBound)
                if (dx <= 2) {
                    console.log("[" + lowerBound + "-" + movingCenter + "-" + upperBound + "]")
                    dy = lineEquation.getYAtX(lowerBound.x)
                    console.log("All points lie inside with distance : " + dx + " bound : " + dy + "  " + lowerBound.y)
                    //lowerBound.y = dy
                }
                upperBound = movingCenter
                outsideTheCircle = allPoints
                if (callbacks && callbacks.pointResetCallback) {
                    callbacks.pointResetCallback(lowerBound, allPoints, upperBound)
                }
                //}
            }
        } else {
            //we have atleast one point lying outside the circle
            dx = getDistanceBetweenPoints(lowerBound, upperBound)
            if (dx <= 2) {
                console.log("[" + lowerBound + "-" + movingCenter + "-" + upperBound + "]")
                dy = lineEquation.getYAtX(lowerBound.x)
                console.log("Some point lies outside the circle with distance : " + dx + " bound : " + dy + "  " + lowerBound.y)
                //movingCenter.y = dy
            }
            lowerBound = movingCenter
            onTheCircle = on
            outsideTheCircle = out
            onTheCircle = [FIXED_POINT_ON_THE_CIRCLE]

        }
    } while (!breakTheLoop)

    return RETURN_VALUE
}

function reduceRadius(allPoints, fixedLowerBound, upperBoundLimit, pointEvaluator, D, E, condition, callbacks) {
    const FIXED_POINT_ON_THE_CIRCLE = D
    const RETURN_VALUE = {}

    const lineEquation = createPerpendicularBisectorFromPoints(D, E)

    var outsideTheCircle;
    var ic, on, out;

    var dx, dy

    var lowerBound = fixedLowerBound
    var upperBound = new Point(upperBoundLimit.x, lineEquation.getYAtX(upperBoundLimit.x))
    var movingCenter = new Point(-1000000, -1000000);

    var breakTheLoop = false;
    var oldMidPoint = null

    var index, eachPoint, flag, radius
    var distantPoint, maxDistance, calculatedDistance, distFromLB, distFromUB
    outsideTheCircle = allPoints;

    if (callbacks && callbacks.initialCallback) {
        callbacks.initialCallback(fixedLowerBound, upperBoundLimit)
    }


    do {
        ic = []
        on = []
        out = []
        maxDistance = 0
        //console.log("[" + lowerBound + "," + upperBound + "]")
        oldMidPoint = movingCenter
        //console.log("New Midpoint (Using Division):" + getMidPointOf(lowerBound, upperBound))
        dx = (lowerBound.x + upperBound.x) * 0.5
        dy = lineEquation.getYAtX(dx)
        movingCenter = new Point(dx, dy)
        //movingCenter = getMidPointOf(lowerBound, upperBound)
        //console.log("New Midpoint (Using Line equation):" + movingCenter)
        //console.log("[" + lowerBound + "-" + movingCenter + "- " + upperBound + "]")
        radius = getDistanceBetweenPoints(movingCenter, FIXED_POINT_ON_THE_CIRCLE)

        if (callbacks && callbacks.circleUpdateCallback) {
            callbacks.circleUpdateCallback(lowerBound, movingCenter, upperBound, radius, FIXED_POINT_ON_THE_CIRCLE)
        }

        for (index in outsideTheCircle) {
            eachPoint = outsideTheCircle[index]
            if (callbacks && callbacks.beforeTestCallback) {
                callbacks.beforeTestCallback(eachPoint)
            }
            flag = pointEvaluator(movingCenter, radius, eachPoint)
            if (flag == 0) {
                //on the circle
                on.push(eachPoint)
                if (callbacks && callbacks.onCallback) {
                    callbacks.onCallback(eachPoint)
                }
            } else if (flag == 1) {
                //outside the circle
                out.push(eachPoint)
                if (callbacks && callbacks.outCallback) {
                    callbacks.outCallback(eachPoint)
                }
                break;
            } else {
                ic.push(eachPoint)
                calculatedDistance = getDistanceBetweenPoints(movingCenter, eachPoint)
                if (maxDistance < calculatedDistance) {
                    maxDistance = calculatedDistance
                    distantPoint = eachPoint
                }
                if (callbacks && callbacks.inCallback) {
                    callbacks.inCallback(eachPoint)
                }
            }
        }

        //if no point lies outside the circle
        if (out.length == 0) {
            //We have no points outside the circle and,
            //if  no point lies on the circle
            if (on.length > 1) {
                //all points are either inside the circle or on the circle.
                //This is a good place to test the condition necessary to break the loop
                //TODO: Determine what parameters need to be passed
                if (condition(on, lowerBound, upperBound, upperBoundLimit, radius)) {
                    breakTheLoop = true;
                    RETURN_VALUE.center = movingCenter
                    RETURN_VALUE.radius = radius
                    RETURN_VALUE.points = on
                    if (callbacks && callbacks.finalCallback) {
                        callbacks.finalCallback(eachPoint)
                    }
                } else {
                    // we can reduce the lowerBound

                    distFromLB = getDistanceBetweenPoints(lowerBound, distantPoint)
                    distFromUB = getDistanceBetweenPoints(upperBound, distantPoint)
                    movingCenter.y = lineEquation.getYAtX(movingCenter.x)
                    if (distFromLB < distFromUB) {
                        lowerBound = movingCenter
                    } else {
                        upperBound = movingCenter
                    }
                    outsideTheCircle = out
                    if (lowerBound.x == movingCenter.x && lowerBound.y == movingCenter.y) {
                        console.log(lineEquation.getYAtX(lowerBound.x) + "  " + lowerBound.y)
                    }
                }
            }
            else {
                //all points are either inside the circle or on the circle.
                //This is a good place to test the condition necessary to break the loop
                //TODO: Determine what parameters need to be passed
                //if (condition(on, lowerBound, upperBound, movingCenter, radius)) {
                //    breakTheLoop = true
                //    RETURN_VALUE.center = movingCenter
                //    RETURN_VALUE.radius = radius
                //    RETURN_VALUE.points = on
                //    if (callbacks && callbacks.finalCallback) {
                //        callbacks.finalCallback(eachPoint)
                //    }
                //}
                //else {
                //
                //}
                dx = getDistanceBetweenPoints(lowerBound, upperBound)
                if (dx <= 2) {
                    console.log("[" + lowerBound + "-" + movingCenter + "-" + upperBound + "]")
                    dy = lineEquation.getYAtX(lowerBound.x)
                    //console.log("All points lie inside with distance : " + dx + " bound : " + dy + "  " + lowerBound.y)
                    //lowerBound.y = dy
                    //lowerBound.x -= 2
                    //lowerBound.y = lineEquation.getYAtX(lowerBound.x)
                    dx = movingCenter.getX()
                    dy = movingCenter.getY()
                    console.log("Old Center: " + movingCenter)
                    movingCenter.x = lineEquation.getXAtY(dy)
                    movingCenter.y = lineEquation.getYAtX(dx)
                    console.log("New Center: " + movingCenter)
                    upperBound = new Point(movingCenter.x * 4 - 3 * fixedLowerBound.x, movingCenter.y * 4 - 3 * fixedLowerBound.y)
                    movingCenter = fixedLowerBound
                }
                outsideTheCircle = allPoints
                upperBound = movingCenter
                if (callbacks && callbacks.pointResetCallback) {
                    callbacks.pointResetCallback(lowerBound, allPoints, upperBound)
                }
                //}
            }
        } else {
            //we have atleast one point lying outside the circle
            dx = getDistanceBetweenPoints(lowerBound, upperBound)
            if (dx <= 2) {
                console.log("[" + lowerBound + "-" + movingCenter + "-" + upperBound + "]")
                dy = lineEquation.getYAtX(lowerBound.x)
                console.log("Some point lies outside the circle with distance : " + dx + " bound : " + dy + "  " + lowerBound.y)
                //movingCenter.y = dy
                dx = movingCenter.getX()
                dy = movingCenter.getY()
                console.log("Old Center: " + movingCenter)
                movingCenter.x = lineEquation.getXAtY(dy)
                movingCenter.y = lineEquation.getYAtX(dx)
                console.log("New Center: " + movingCenter)
                upperBound = new Point(movingCenter.x * 4 - 3 * fixedLowerBound.x, movingCenter.y * 4 - 3 * fixedLowerBound.y)
                movingCenter = fixedLowerBound
            }
            lowerBound = movingCenter
            //onTheCircle = on
            outsideTheCircle = allPoints
            //onTheCircle = [FIXED_POINT_ON_THE_CIRCLE]
        }
    } while (!breakTheLoop)

    return RETURN_VALUE
}

function pointEvaluator(center, radius, point) {
    const dx = center.getX() - point.getX()
    const dy = center.getY() - point.getY()
    var delta = radius - Math.sqrt(dx * dx + dy * dy)
    if (delta >= 0) {
        if (delta <= INSIDE_POINT_TOLERANCE) {
            return 0
        } else {
            return -1
        }
    } else if (-delta <= OUTSIDE_POINT_TOLERANCE) {
        return 0
    } else {
        return 1
    }
}