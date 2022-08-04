let canvas = document.querySelector('.statement-area').querySelector('.statement-at-front').querySelector('#scene')
let ctx = canvas.getContext('2d')

canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight

if(window.devicePixelRatio > 1) {
    canvas.width = canvas.clientWidth * 2
    canvas.height = canvas.clientHeight * 2

    ctx.scale(2, 2)
}

let width = canvas.width
let height = canvas.height

// let move it forward
// kk
function Pencil() {
    let that = this

    let queue = []
    let dict = {}

    that.remember = function (drawable) {
        dict[drawable] = drawable
        queue.push(drawable)
    }

    that.put = function (drawable, y, x, z) {
        if(dict[drawable]){
            dict[drawable].assignCoords(y, x, z)
        }
    }

    // let me see
    that.draw = function () {
        for(let i = 0; i < queue.length; i++) {
            queue[i].draw()
        }
    }
}

// kk
function Fabrick() {

    let that = this

    /* debth  */
    that.constructKnot = function (w, h, d, f) {
        return new RectangleOnPaper(w, h, d, f)
    }
}

let FIELD_OF_VIEW = width * 0.8

let PROJECTION_CENTER_Y = width * 0.5
let PROJECTION_CENTER_X = height * 0.5

/* class RectangleOnPaper - old style */
function RectangleOnPaper(w, profileRatio, debthRatio, frontRatio) {
    let that = this

    let frontRadius = w

    // let verticles = [[parseFloat('0'), parseFloat('0'), parseFloat('0')], [parseFloat('0'), 1, parseFloat('0')], [[1, '-'].reverse().join(''), 1, parseFloat('0')], [[1, '-'].reverse().join(''), parseFloat('0'), parseFloat('0')], [[1, '-'].reverse().join(''), parseFloat('0'), 1], [parseFloat('0'), parseFloat('0'), 1], [[1, '-'].reverse().join(''), 1, 1], [[1, '-'].reverse().join(''), parseFloat('0'), 1]]

    let verticles = [[parseFloat('0'), parseFloat('0'), parseFloat('0')], [parseFloat('0'), 1, parseFloat('0')], [[1, '-'].reverse().join(''), 1, parseFloat('0')], [[1, '-'].reverse().join(''), parseFloat('0'), parseFloat('0')], [[1, '-'].reverse().join(''), parseFloat('0'), 1], [parseFloat('0'), parseFloat('0'), 1], [[1, '-'].reverse().join(''), 1, 1], [[1, '-'].reverse().join(''), parseFloat('0'), 1]]
    // let lines = [[parseFloat('0'), 1], [1, 2] , [2, 3], [3, parseFloat('0')], [3, 4], [4, 5], [5, parseFloat('0')], [2, 6], [6, 7]]

    let lines = [[parseFloat('0'), 1], [1, 2] , [2, 3], [3, parseFloat('0')], [3, 4], [4, 5], [5, parseFloat('0')], [2, 6], [6, 7]]

    that.assignCoords = function (y, x, z) {
        that.y = y
        that.x = x
        that.z = z
    }

    that.project = function (x, y, z) {
        let sizeProjection = FIELD_OF_VIEW / (FIELD_OF_VIEW + z)

        return {
            sizeProjection: sizeProjection,
            y: (y * sizeProjection) + PROJECTION_CENTER_Y,
            x: (x * sizeProjection) + PROJECTION_CENTER_X,
        }
    }

    that.draw = function () {
        // let cachedPoints = {}

        for(let i = 0; i < lines.length; i++) {
            let radius = frontRadius

            let v1 = {
                y: that.y + (radius * verticles[lines[i][0]][0]),
                x: that.x + (radius * verticles[lines[i][0]][1]),
                z: that.z + (radius * verticles[lines[i][0]][2])
            }
            let v2 = {
                y: that.y + (radius * verticles[lines[i][1]][0]),
                x: that.x + (radius * verticles[lines[i][1]][1]),
                z: that.z + (radius * verticles[lines[i][1]][2])
            }

            let v1Project = that.project(v1.x, v1.y, v1.z)
            let v2Project = that.project(v2.x, v2.y, v2.z)

            let bouncedPoints = {}

            let y, x

            if([2].indexOf(i) !== -1) {
                bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                    y: (v2Project.y - PROJECTION_CENTER_Y) * profileRatio + PROJECTION_CENTER_Y,
                    x: (v2Project.x - PROJECTION_CENTER_X) * 1 + PROJECTION_CENTER_X
                }

                let y = bouncedPoints[[v2Project.y, v2Project.x].join('_')].y
                let x = bouncedPoints[[v2Project.y, v2Project.x].join('_')].x

                v2Project.y = y
                v2Project.x = x

                bouncedPoints[[v1Project.y, v1Project.x].join('_')] = {
                    y: (v1Project.y - PROJECTION_CENTER_Y) * profileRatio + PROJECTION_CENTER_Y,
                    x: (v1Project.x - PROJECTION_CENTER_X) * frontRatio + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v1Project.y, v1Project.x].join('_')].y
                x = bouncedPoints[[v1Project.y, v1Project.x].join('_')].x

                v1Project.y = y
                v1Project.x = x
            }
            if([0].indexOf(i) !== -1) {
                bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                    y: (v2Project.y - PROJECTION_CENTER_Y) * 1 + PROJECTION_CENTER_Y,
                    x: (v2Project.x - PROJECTION_CENTER_X) * frontRatio + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v2Project.y, v2Project.x].join('_')].y
                x = bouncedPoints[[v2Project.y, v2Project.x].join('_')].x

                v2Project.y = y
                v2Project.x = x
            }

            if([6].indexOf(i) !== -1) {
                bouncedPoints[[v1Project.y, v1Project.x].join('_')] = {
                    y: (v1Project.y - PROJECTION_CENTER_Y) * debthRatio + PROJECTION_CENTER_Y,
                    x: (v1Project.x - PROJECTION_CENTER_X) * debthRatio + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v1Project.y, v1Project.x].join('_')].y
                x = bouncedPoints[[v1Project.y, v1Project.x].join('_')].x

                v1Project.y = y
                v1Project.x = x

                bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                    y: (v2Project.y - PROJECTION_CENTER_Y) * 1 + PROJECTION_CENTER_Y,
                    x: (v2Project.x - PROJECTION_CENTER_X) * 1 + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v2Project.y, v2Project.x].join('_')].y
                x = bouncedPoints[[v2Project.y, v2Project.x].join('_')].x

                v2Project.y = y
                v2Project.x = x
            }
            if([4].indexOf(i) !== -1) {
                bouncedPoints[[v1Project.y, v1Project.x].join('_')] = {
                    y: (v1Project.y - PROJECTION_CENTER_Y) * profileRatio + PROJECTION_CENTER_Y,
                    x: (v1Project.x - PROJECTION_CENTER_X) * 1 + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v1Project.y, v1Project.x].join('_')].y
                x = bouncedPoints[[v1Project.y, v1Project.x].join('_')].x

                v1Project.y = y
                v1Project.x = x

                bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                    y: (v2Project.y - PROJECTION_CENTER_Y) * debthRatio + PROJECTION_CENTER_Y,
                    x: (v2Project.x - PROJECTION_CENTER_X) * debthRatio + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v2Project.y, v2Project.x].join('_')].y
                x = bouncedPoints[[v2Project.y, v2Project.x].join('_')].x

                v2Project.y = y
                v2Project.x = x
            }

            if([5].indexOf(i) !== -1) {
                bouncedPoints[[v1Project.y, v1Project.x].join('_')] = {
                    y: (v1Project.y - PROJECTION_CENTER_Y) * debthRatio + PROJECTION_CENTER_Y,
                    x: (v1Project.x - PROJECTION_CENTER_X) * debthRatio + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v1Project.y, v1Project.x].join('_')].y
                x = bouncedPoints[[v1Project.y, v1Project.x].join('_')].x

                v1Project.y = y
                v1Project.x = x

                bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                    y: (v2Project.y - PROJECTION_CENTER_Y) * debthRatio + PROJECTION_CENTER_Y,
                    x: (v2Project.x - PROJECTION_CENTER_X) * debthRatio + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v2Project.y, v2Project.x].join('_')].y
                x = bouncedPoints[[v2Project.y, v2Project.x].join('_')].x

                v2Project.y = y
                v2Project.x = x
            }
            if([3].indexOf(i) !== -1) {
                bouncedPoints[[v1Project.y, v1Project.x].join('_')] = {
                    y: (v1Project.y - PROJECTION_CENTER_Y) * profileRatio + PROJECTION_CENTER_Y,
                    x: (v1Project.x - PROJECTION_CENTER_X) * 1 + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v1Project.y, v1Project.x].join('_')].y
                x = bouncedPoints[[v1Project.y, v1Project.x].join('_')].x

                v1Project.y = y
                v1Project.x = x

                // keep
                bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                    y: (v2Project.y - PROJECTION_CENTER_Y) * 1 + PROJECTION_CENTER_Y,
                    x: (v2Project.x - PROJECTION_CENTER_X) * 1 + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v2Project.y, v2Project.x].join('_')].y
                x = bouncedPoints[[v2Project.y, v2Project.x].join('_')].x

                v2Project.y = y
                v2Project.x = x
            }
            if([1].indexOf(i) !== -1) {
                bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                    y: (v2Project.y - PROJECTION_CENTER_Y) * profileRatio + PROJECTION_CENTER_Y,
                    x: (v2Project.x - PROJECTION_CENTER_X) * frontRatio + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v2Project.y, v2Project.x].join('_')].y
                x = bouncedPoints[[v2Project.y, v2Project.x].join('_')].x

                v2Project.y = y
                v2Project.x = x

                bouncedPoints[[v1Project.y, v1Project.x].join('_')] = {
                    y: (v1Project.y - PROJECTION_CENTER_Y) + PROJECTION_CENTER_Y,
                    x: (v1Project.x - PROJECTION_CENTER_X) * frontRatio + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v1Project.y, v1Project.x].join('_')].y
                x = bouncedPoints[[v1Project.y, v1Project.x].join('_')].x

                v1Project.y = y
                v1Project.x = x
            }

            if([7].indexOf(i) !== -1) {
                bouncedPoints[[v1Project.y, v1Project.x].join('_')] = {
                    y: (v1Project.y - PROJECTION_CENTER_Y) * profileRatio + PROJECTION_CENTER_Y,
                    x: (v1Project.x - PROJECTION_CENTER_X) * frontRatio + PROJECTION_CENTER_X
                }

                let y = bouncedPoints[[v1Project.y, v1Project.x].join('_')].y
                let x = bouncedPoints[[v1Project.y, v1Project.x].join('_')].x

                v1Project.y = y
                v1Project.x = x

                bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                    y: (v2Project.y - PROJECTION_CENTER_Y) * debthRatio + PROJECTION_CENTER_Y,
                    x: (v2Project.x - PROJECTION_CENTER_X) * debthRatio + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v2Project.y, v2Project.x].join('_')].y
                x = bouncedPoints[[v2Project.y, v2Project.x].join('_')].x

                v2Project.y = y
                v2Project.x = x
            }
            if([8].indexOf(i) !== -1) {
                bouncedPoints[[v1Project.y, v1Project.x].join('_')] = {
                    y: (v1Project.y - PROJECTION_CENTER_Y) * debthRatio + PROJECTION_CENTER_Y,
                    x: (v1Project.x - PROJECTION_CENTER_X) * debthRatio + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v1Project.y, v1Project.x].join('_')].y
                x = bouncedPoints[[v1Project.y, v1Project.x].join('_')].x

                v1Project.y = y
                v1Project.x = x

                bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                    y: (v2Project.y - PROJECTION_CENTER_Y) * debthRatio + PROJECTION_CENTER_Y,
                    x: (v2Project.x - PROJECTION_CENTER_X) * debthRatio + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v2Project.y, v2Project.x].join('_')].y
                x = bouncedPoints[[v2Project.y, v2Project.x].join('_')].x

                v2Project.y = y
                v2Project.x = x
            }


            ctx.beginPath()
            ctx.moveTo(v1Project.x, v1Project.y)
            ctx.lineTo(v2Project.x, v2Project.y)

            ctx.stroke()
        }
    }
}

function constructDC1() {

}
function constructDC2() {

}
function constructDC3() {

}
function constructDC4() {

}
function constructDC5() {

}
function constructDC6() {

}

let radius = Math.floor(Math.random() * 12 /* 10 */ * 10)

let fabrick = new Fabrick()
let knot1 = fabrick.constructKnot(radius, 0.9, 0.4, 1)

let pencil = new Pencil()
pencil.remember(knot1)

let bottomPointer

// keep
// please keep.
let topLeftPointerBelongings

// see what is belongings
// vertical-bounce-handler-at-eye-in-relative-size
let topLeftPointerBelongingsAtFloorAtBottomProjection
let topLeftPointerBelongingsAtFloorAtRight

let topRightPointerBelongings

pencil.put(knot1, Math.random() * width * 0.5, Math.random() * width * 0.5, Math.random() * width * 0.2)

pencil.draw()

// see sticked-album-in-queued-sequence at picture
// to see what is required to construct at first sticked item
