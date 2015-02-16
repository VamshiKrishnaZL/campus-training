/*======================================================================================
 Point
 ========================================================================================*/
function Point(x, y) {
    this.x = x
    this.y = y
}
/*======================================================================================
 Point prototype
 ========================================================================================*/
Point.prototype.getX = function () {
    return this.x
}

Point.prototype.getY = function () {
    return this.y
}

Point.prototype.toString = function () {
    return "(" + this.x + "," + this.y + ")"
}

Point.prototype.getDistanceTo = function (anotherPoint) {
    var dx = this.x - anotherPoint.x
    var dy = this.y - anotherPoint.y
    return Math.sqrt(dx * dx + dy * dy)
}
/*======================================================================================
 Slope Point Equation
 ========================================================================================*/

function SlopePointEquation(slope, point) {
    this.slope = slope;
    this.point = point;
    if (slope !== Infinity) {
        this.yIntercept = point.y - slope * point.x
    } else {
        this.yIntercept = Infinity
    }
}
/*======================================================================================
 SlopePointEquation prototype methods
 ========================================================================================*/

SlopePointEquation.prototype.getSlope = function () {
    return this.slope;
}

SlopePointEquation.prototype.getPerpendicularSlope = function () {
    return 1 / this.slope;
}

SlopePointEquation.prototype.getPoint = function () {
    return this.point;
}

SlopePointEquation.prototype.getYIntercept = function () {
    return this.yIntercept;
}

SlopePointEquation.prototype.isParallelToXAxis = function () {
    return this.slope === 0;
}

SlopePointEquation.prototype.isParallelToYAxis = function () {
    return this.slope === Infinity;
}

SlopePointEquation.prototype.getX = function () {
    return this.point.x;
}

SlopePointEquation.prototype.getY = function () {
    return this.point.y;
}
SlopePointEquation.prototype.getYAtX = function (x) {
    if (this.slope === Infinity) {
        return this.point.y
    } else {
        return this.slope * x + this.yIntercept
    }
}

SlopePointEquation.prototype.getXAtY = function (y) {
    if (this.slope === 0) {
        return this.point.y
    } else {
        return (y - this.yIntercept) / this.slope
    }
}

SlopePointEquation.prototype.getYIntercept = function () {
    return this.yIntercept
}

SlopePointEquation.prototype.TOLERANCE = 0.2

SlopePointEquation.prototype.isPointOnTheLine = function (point) {
    if (this.isParallelToXAxis()) {
        return Math.abs(this.getY() - point.getY()) <= 0.05
    } else if (this.isParallelToYAxis()) {
        return Math.abs(this.getX() - point.getX()) <= 0.05
    } else {
        const delta = Math.abs(point.getY() - ( this.slope * point.getX() + this.yIntercept));
        return delta <= this.TOLERANCE
    }
}


/*======================================================================================
 @end of  SlopePointEquation prototype methods
 ========================================================================================*/

/*======================================================================================
 Utility methods
 ========================================================================================*/
function areThreePointsCollinear(firstPoint, secondPoint, thirdPoint) {
    var areaOfTheTriangle = 0;
    areaOfTheTriangle += (firstPoint.x * secondPoint.y - secondPoint.x * firstPoint.y)
    areaOfTheTriangle += (secondPoint.x * thirdPoint.y - thirdPoint.x * secondPoint.y)
    areaOfTheTriangle += (thirdPoint.x * firstPoint.y - firstPoint.x * thirdPoint.y)
    areaOfTheTriangle *= 0.5
    return areaOfTheTriangle == 0
}

function areThreePointsCollinear2(firstPoint, secondPoint, thirdPoint) {
    var areaOfTheTriangle = 0;
    //areaOfTheTriangle += (firstPoint.x * secondPoint.y - secondPoint.x * firstPoint.y)
    //areaOfTheTriangle += (secondPoint.x * thirdPoint.y - thirdPoint.x * secondPoint.y)
    //areaOfTheTriangle += (thirdPoint.x * firstPoint.y - firstPoint.x * thirdPoint.y)

    var x1 = secondPoint.x - firstPoint.x
    var y1 = secondPoint.y - firstPoint.y
    var x2 = thirdPoint.x - firstPoint.y
    var y2 = thirdPoint.y - firstPoint.y

    areaOfTheTriangle = x1 * y2 - y1 * x2
    //areaOfTheTriangle *= 0.5
    return areaOfTheTriangle == 0
}

function createSlopePointEquationFromCoordinates(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var slope = getSlope(dx, dy);
    return new SlopePointEquation(slope, new Point(dx * 0.5 + x1, dy * 0.5 + y1))
}

function createSlopePointEquationFromPoints(pointA, pointB) {
    var x1 = pointA.getX(), x2 = pointB.getX()
    var y1 = pointA.getY(), y2 = pointB.getY()
    var dx = x2 - x1;
    var dy = y2 - y1;
    var slope = getSlope(dx, dy);
    return new SlopePointEquation(slope, new Point(dx * 0.5 + x1, dy * 0.5 + y1))
}

function solveEquation(line1, line2) {

    var x = null, y = null
    var horizontalLine = null, verticalLine = null

    if (line1.isParallelToXAxis()) {
        horizontalLine = line1
    } else if (line1.isParallelToYAxis()) {
        verticalLine = line1
    }

    if (line2.isParallelToXAxis()) {
        horizontalLine = line2
    } else if (line2.isParallelToYAxis()) {
        verticalLine = line2
    }

    if (horizontalLine != null || verticalLine != null) {
        if (horizontalLine != null) {
            y = horizontalLine.getY()
            if (verticalLine == null) {
                if (horizontalLine === line1) {
                    x = (y - line2.getYIntercept()) / line2.getSlope()
                } else if (horizontalLine === line2) {
                    x = (y - line1.getYIntercept()) / line1.getSlope()
                }
            }
        }
        if (verticalLine != null) {
            x = verticalLine.getX()
            if (y == null) {
                if (verticalLine === line1) {
                    y = line2.getSlope() * x + line2.getYIntercept()
                } else if (verticalLine === line2) {
                    y = line1.getSlope() * x + line1.getYIntercept()
                }
            }
        }
    } else {
        var yIntercept1 = line1.getYIntercept();
        x = (line2.getYIntercept() - yIntercept1)
        var slope1 = line1.getSlope();
        x /= (slope1 - line2.getSlope())
        y = slope1 * x + yIntercept1
    }
    var intersectionPoint = new Point(x, y)
    return intersectionPoint
}

function getSlope(dx, dy) {
    var slope = null
    if (dx == 0) {
        slope = Infinity
    }
    else if (dy == 0) {
        slope = 0
    }
    else {
        slope = dy / dx;
    }
    return slope;
}

function getInverseSlope(dx, dy) {
    var slope = null
    if (dy == 0) {
        slope = Infinity
    }
    else if (dx == 0) {
        slope = 0
    }
    else {
        slope = -dx / dy;
    }
    return slope;
}

function createPerpendicularBisectorFromXYs(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var slope = getInverseSlope(dx, dy);
    return new SlopePointEquation(slope, new Point(dx * 0.5 + x1, dy * 0.5 + y1))
}

function createPerpendicularBisectorFromPoints(pointA, pointB) {
    var x1 = pointA.x, y1 = pointA.y
    var dx = pointB.x - x1;
    var dy = pointB.y - y1;
    var slope = getInverseSlope(dx, dy);
    return new SlopePointEquation(slope, new Point(dx * 0.5 + x1, dy * 0.5 + y1))
}

function splitPoints(collectionOfPoints, center, radius, inner, strictlyOuter) {
    var key, eachPoint
    var dx, dy, centerX = center.getX(), centerY = center.getY(), calculatedDistance
    for (key in collectionOfPoints) {
        eachPoint = collectionOfPoints[key]
        dx = eachPoint.getX() - centerX
        dy = eachPoint.getY() - centerY
        calculatedDistance = Math.sqrt(dx * dx + dy * dy)
        if (calculatedDistance > radius) {
            strictlyOuter.push(eachPoint)
        } else {
            inner.push(eachPoint)
        }
    }
}

function findOrthoCenter(firstPoint, secondPoint, thirdPoint) {

    // we translate the third point to origin

    var x1 = firstPoint.x - thirdPoint.x
    var y1 = firstPoint.y - thirdPoint.y

    var x2 = secondPoint.x - thirdPoint.x
    var y2 = secondPoint.y - thirdPoint.y

    // line1,line2,line3 represent the sides of the triangle
    var line1 = createSlopePointEquationFromCoordinates(x1, y1, 0, 0);
    var line2 = createSlopePointEquationFromCoordinates(x2, y2, 0, 0);
    var line3 = createSlopePointEquationFromCoordinates(x1, y1, x2, y2);

    var perpendicularBisector1 = null, perpendicularBisector2 = null
    var temp;

    if (line1.isParallelToXAxis()) {
        perpendicularBisector1 = new SlopePointEquation(undefined, new Point(x1 * 0.5, y1 * 0.5))
    } else if (line1.isParallelToYAxis()) {
        perpendicularBisector1 = new SlopePointEquation(0, new Point(x1 * 0.5, y1 * 0.5))
    } else {
        perpendicularBisector1 = new SlopePointEquation(-1 / line1.getSlope(), new Point(x1 * 0.5, y1 * 0.5))
    }
    if (line2.isParallelToXAxis()) {
        perpendicularBisector2 = new SlopePointEquation(undefined, new Point(x2 * 0.5, y2 * 0.5))
    } else if (line2.isParallelToYAxis()) {
        perpendicularBisector2 = new SlopePointEquation(0, new Point(x2 * 0.5, y2 * 0.5))
    } else {
        perpendicularBisector2 = new SlopePointEquation(-1 / line2.getSlope(), new Point(x2 * 0.5, y2 * 0.5))
    }
    if (line3.isParallelToXAxis()) {
        temp = new SlopePointEquation(undefined, new Point((x2 + x1) * 0.5, (y2 + y1) * 0.5))
    } else if (line3.isParallelToYAxis()) {
        temp = new SlopePointEquation(0, new Point((x2 + x1) * 0.5, (y2 + y1) * 0.5))
    }
    if (temp != null) {
        if (!perpendicularBisector1.isParallelToXAxis() && !perpendicularBisector1.isParallelToYAxis())
            perpendicularBisector1 = temp
        else if (!perpendicularBisector2.isParallelToXAxis() && !perpendicularBisector2.isParallelToYAxis())
            perpendicularBisector2 = temp
    }

    // Now two things are left
    // 1: Find the intersection of the perpendicular bisectors
    // 2: Translate the intersection by third point

    var x = null, y = null

    var horizontalLine = null, verticalLine = null

    if (perpendicularBisector1.isParallelToXAxis()) {
        horizontalLine = perpendicularBisector1
    } else if (perpendicularBisector1.isParallelToYAxis()) {
        verticalLine = perpendicularBisector1
    }

    if (perpendicularBisector2.isParallelToXAxis()) {
        horizontalLine = perpendicularBisector2
    } else if (perpendicularBisector2.isParallelToYAxis()) {
        verticalLine = perpendicularBisector2
    }

    if (horizontalLine != null || verticalLine != null) {
        if (horizontalLine != null) {
            y = horizontalLine.getY()
            if (verticalLine == null) {
                if (horizontalLine === perpendicularBisector1) {
                    x = perpendicularBisector2.getXAtY(y)
                } else if (horizontalLine === perpendicularBisector2) {
                    x = perpendicularBisector1.getXAtY(y)
                }
            }
        }
        if (verticalLine != null) {
            x = verticalLine.getX()
            if (y == null) {
                if (verticalLine === perpendicularBisector1) {
                    y = perpendicularBisector2.getYAtX(x)
                } else if (verticalLine === perpendicularBisector2) {
                    y = perpendicularBisector2.getXAtY(x)
                }
            }
        }
    } else {
        var yIntercept1 = perpendicularBisector1.getYIntercept();
        x = (perpendicularBisector2.getYIntercept() - yIntercept1)
        var slope1 = perpendicularBisector1.getSlope();
        x /= (slope1 - perpendicularBisector2.getSlope())
        y = slope1 * x + yIntercept1
    }
    var intersectionPoint = new Point(x + thirdPoint.x, y + thirdPoint.y)
    return intersectionPoint

}


function findOrthoCenter2(firstPoint, secondPoint, thirdPoint) {

    // we translate the third point to origin

    var x1 = firstPoint.x
    var y1 = firstPoint.y

    var x2 = secondPoint.x
    var y2 = secondPoint.y

    var x3 = thirdPoint.x
    var y3 = thirdPoint.y

    // line1,line2,line3 represent the sides of the triangle
    var line1 = createSlopePointEquationFromCoordinates(x1, y1, x3, y3);
    var line2 = createSlopePointEquationFromCoordinates(x2, y2, x3, y3);
    var line3 = createSlopePointEquationFromCoordinates(x1, y1, x2, y2);

    var perpendicularBisector1 = null, perpendicularBisector2 = null
    var temp;

    if (line1.isParallelToXAxis()) {
        perpendicularBisector1 = new SlopePointEquation(undefined, new Point((x1 + x3) * 0.5, (y1 + y3) * 0.5))
    } else if (line1.isParallelToYAxis()) {
        perpendicularBisector1 = new SlopePointEquation(0, new Point((x1 + x3) * 0.5, (y1 + y3) * 0.5))
    } else {
        perpendicularBisector1 = new SlopePointEquation(-1 / line1.getSlope(), new Point((x1 + x3) * 0.5, (y1 + y3) * 0.5))
    }
    if (line2.isParallelToXAxis()) {
        perpendicularBisector2 = new SlopePointEquation(undefined, new Point((x2 + x3) * 0.5, (y2 + y3) * 0.5))
    } else if (line2.isParallelToYAxis()) {
        perpendicularBisector2 = new SlopePointEquation(0, new Point((x2 + x3) * 0.5, (y2 + y3) * 0.5))
    } else {
        perpendicularBisector2 = new SlopePointEquation(-1 / line2.getSlope(), new Point((x2 + x3) * 0.5, (y2 + y3) * 0.5))
    }
    if (line3.isParallelToXAxis()) {
        temp = new SlopePointEquation(undefined, new Point((x2 + x1) * 0.5, (y2 + y1) * 0.5))
    } else if (line3.isParallelToYAxis()) {
        temp = new SlopePointEquation(0, new Point((x2 + x1) * 0.5, (y2 + y1) * 0.5))
    }
    if (temp != null) {
        if (!perpendicularBisector1.isParallelToXAxis() && !perpendicularBisector1.isParallelToYAxis())
            perpendicularBisector1 = temp
        else if (!perpendicularBisector2.isParallelToXAxis() && !perpendicularBisector2.isParallelToYAxis())
            perpendicularBisector2 = temp
    }

    // Now two things are left
    // 1: Find the intersection of the perpendicular bisectors
    // 2: Translate the intersection by third point

    var x = null, y = null

    var horizontalLine = null, verticalLine = null

    if (perpendicularBisector1.isParallelToXAxis()) {
        horizontalLine = perpendicularBisector1
    } else if (perpendicularBisector1.isParallelToYAxis()) {
        verticalLine = perpendicularBisector1
    }

    if (perpendicularBisector2.isParallelToXAxis()) {
        horizontalLine = perpendicularBisector2
    } else if (perpendicularBisector2.isParallelToYAxis()) {
        verticalLine = perpendicularBisector2
    }

    if (horizontalLine != null || verticalLine != null) {
        if (horizontalLine != null) {
            x = horizontalLine.getX()
            if (verticalLine == null) {
                if (horizontalLine === perpendicularBisector1) {
                    y = perpendicularBisector2.getSlope() * x + perpendicularBisector2.getYIntercept()
                } else if (horizontalLine === perpendicularBisector2) {
                    y = perpendicularBisector1.getSlope() * x + perpendicularBisector1.getYIntercept()

                }
            }
        }
        if (verticalLine != null) {
            y = verticalLine.getY()
            if (y == null) {
                if (verticalLine === perpendicularBisector1) {
                    x = (y - perpendicularBisector2.getYIntercept()) / perpendicularBisector2.getSlope()
                } else if (verticalLine === perpendicularBisector2) {
                    x = (y - perpendicularBisector1.getYIntercept()) / perpendicularBisector1.getSlope()
                }
            }
        }
    } else {
        var yIntercept1 = perpendicularBisector1.getYIntercept();
        x = (perpendicularBisector2.getYIntercept() - yIntercept1)
        var slope1 = perpendicularBisector1.getSlope();
        x /= (slope1 - perpendicularBisector2.getSlope())
        y = slope1 * x + yIntercept1
    }

    var intersectionPoint = new Point(x, y)
    return intersectionPoint

}

function getDistanceBetweenPoints(pointA, pointB, x2, y2) {
    var dx, dy
    switch (arguments.length) {
        case 4:
            // x & y co-ordinates of the points are passed
            dx = x2 - pointA
            dy = y2 - pointB
            break;
        case 2:
            //two points are passed
            dx = pointA.x - pointB.x
            dy = pointA.y - pointB.y
            break;
        default :
            break;
    }
    return Math.sqrt(dx * dx + dy * dy)
}


function getDistantPoint(fromPoint, allPoints) {
    var maxDistance = 0, calculatedDistance
    var dx, dy, eachPoint, distantPoint
    for (var key in allPoints) {
        eachPoint = allPoints[key]
        dx = fromPoint.getX() - eachPoint.getX()
        dy = fromPoint.getY() - eachPoint.getY()
        calculatedDistance = Math.sqrt(dx * dx + dy * dy)
        if (calculatedDistance > maxDistance) {
            maxDistance = calculatedDistance
            distantPoint = eachPoint
        }
    }
    return distantPoint
}


function getMidPointOf(point1, point2) {
    return new Point((point1.getX() + point2.getX()) >> 1, ( point1.getY() + point2.getY()) >> 1)
}


function isTriangleIsosceles(firstPoint, secondPoint, thirdPoint) {

    var x1 = secondPoint.x - firstPoint.x
    var y1 = secondPoint.y - firstPoint.y

    var x2 = thirdPoint.x - firstPoint.y
    var y2 = thirdPoint.y - firstPoint.y

    var a = Math.sqrt(x1 * x1 + y1 * y1)
    var b = Math.sqrt(x2 * x2 + y2 * y2)
    var c = 0

    if (Math.abs(a - b) <= INSIDE_POINT_TOLERANCE) {
        return true;
    } else {
        c = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
        if (Math.abs(c - a) <= INSIDE_POINT_TOLERANCE) {
            return true;
        } else if (Math.abs(c - b) <= INSIDE_POINT_TOLERANCE) {
            return true;
        }
    }
    return false
}
/*======================================================================================
 @end of  Utility methods
 ========================================================================================*/


/*======================================================================================
 Template
 ========================================================================================*/