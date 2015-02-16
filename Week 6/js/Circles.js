function getEstimatedEnclosingCircle(allPoints) {
    var x1 = 1000000000, x2 = 0
    var y1 = 1000000000, y2 = 0
    var eachPoint, cx, cy;
    for (var key in allPoints) {
        eachPoint = allPoints[key]
        cx = eachPoint.getX()
        cy = eachPoint.getY()
        if (cx < x1) {
            x1 = cx
        }
        if (cx > x2) {
            x2 = cx
        }
        if (cy < y1) {
            y1 = cy
        }
        if (cy > y2) {
            y2 = cy
        }
    }

    var centerX = (x2 + x1) * 0.5
    var centerY = (y2 + y1) * 0.5
    var radius;
    if ((x2 - x1) > (y2 - y1)) {
        radius = (x2 - x1 ) * 0.717;
    } else {
        radius = (y2 - y1 ) * 0.717;
    }
    //radius += RADIUS

    const radiusAndCenter = {
        cx: centerX,
        cy: centerY,
        r: radius
    }
    return radiusAndCenter
}

function atleastTwoPoints(pointsOnTheCircle, lowerBound, upperBound, center, radius) {
    return pointsOnTheCircle.length >= 2
}

function terminatingCondition(pointsOnTheCircle, lowerBound, upperBound, center, radius) {
    var index, eachPoint, firstPoint = null, secondPoint = null, count = 0
    var distance
    for (index in pointsOnTheCircle) {
        eachPoint = pointsOnTheCircle[index]
        if (firstPoint == null) {
            firstPoint = eachPoint
        } else if (secondPoint == null) {
            secondPoint = eachPoint
        }
        ++count
    }
    if (count == 2) {
        distance = getDistanceBetweenPoints(firstPoint, secondPoint)
        if (Math.abs(distance * 0.5 - radius) <= 0.25) {
            return true
        }
    }
    return false;
}

function terminatingCondition2(pointsOnTheCircle, lowerBound, upperBound, center, radius) {
    var index, eachPoint, firstPoint = null, secondPoint = null, count = 0, isPointOnTheLine
    var distance
    var equation
    for (index in pointsOnTheCircle) {
        eachPoint = pointsOnTheCircle[index]
        if (firstPoint == null) {
            firstPoint = eachPoint
        } else if (secondPoint == null) {
            secondPoint = eachPoint
        }
        ++count
    }
    if (count == 2) {
        distance = getDistanceBetweenPoints(firstPoint, secondPoint)
        equation = createSlopePointEquationFromPoints(firstPoint, secondPoint)
        distance = Math.abs(distance * 0.5 - radius)
        isPointOnTheLine = equation.isPointOnTheLine(center)
        if (isPointOnTheLine) {
            return true
        } else if (distance <= 0.25) {
            return true
        }
    }
    return count >= 3
}


function pointMerger1(pointA, pointB) {
    var x = (pointA.getX() + pointB.getX()) >> 1
    var y = (pointA.getY() + pointB.getY()) >> 1
    return new Point(x, y)
}

function pointMerger2(pointA, pointB) {
    var x = (pointA.getX() + pointB.getX()) * 0.5
    var y = (pointA.getY() + pointB.getY()) * 0.5
    return new Point(x, y)
}

function hasMajorArcWithNoPointOnIt(center, pointsOnTheCircle) {

    var i, eachPoint
    var translatedPoints = []
    var dx = center.getX(), dy = center.getY()
    for (i in pointsOnTheCircle) {
        eachPoint = pointsOnTheCircle[i]
        translatedPoints.push(new Point(eachPoint.getX() - dx, eachPoint.getY() - dy))
    }

    var left = [], right = []

    for (i in translatedPoints) {
        eachPoint = translatedPoints[i]
        if (eachPoint.getX() < 0) {
            left.push(eachPoint)
        } else {
            right.push(eachPoint)
        }
    }
    if (left.length != 0 && right.length != 0)
        return false
    return true
}


function hasMajorArcWithNoPointOnIt2(center, pointsOnTheCircle) {
    var i, eachPoint
    var dx = center.getX(), dy = center.getY()
    var QI = 0, QII = 0, QIII = 0, QIV = 0
    for (i in pointsOnTheCircle) {
        eachPoint = pointsOnTheCircle[i]
        if ((eachPoint.getX() - dx) <= 0) {
            if ((eachPoint.getY() - dy) <= 0) {
                QII++
            } else {
                QIII++
            }
        } else {
            if ((eachPoint.getY() - dy) <= 0) {
                QI++
            } else {
                QIV++
            }
        }
    }

    if (QI > 0 && QII > 0) {
        if (QIII > 0 || QIV > 0) {
            return false;
        } else {
            return true;
        }
    }
    else if (QII > 0 && QIII > 0) {
        if (QIV > 0 || QI > 0) {
            return false;
        } else {
            return true;
        }
    }
    else if (QIII > 0 && QIV > 0) {
        if (QI > 0 || QII > 0) {
            return false;
        } else {
            return true;
        }
    }
    else if (QIV > 0 && QI > 0) {
        if (QIII > 0 || QII > 0) {
            return false;
        } else {
            return true;
        }
    }
    return true
}
