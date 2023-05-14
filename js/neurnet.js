const canvas = document.getElementById('canvas')

class Paint {
    constructor (width, height, pixelSize, color){
        canvas.width = width
        canvas.height = height
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.pixelSize = pixelSize
        this.color = color
        this.isMouseDown = false
    }

    drawCheckDot(x, y, diameter = this.pixelSize, color = this.color) {
        this.ctx.beginPath()
        this.ctx.fillStyle = color
        this.ctx.arc(x, y, diameter / 10, 0, Math.PI * 2)
        this.ctx.fill()
    }

    drawConLine(x, y, lineWidth = this.pixelSize, color = this.color) {
        this.ctx.lineTo(x, y)
        this.ctx.lineWidth = lineWidth / 5
        this.ctx.strokeStyle = color
        this.ctx.stroke()
    }

    storePosition(x, y) {
        this.ctx.beginPath()
        this.ctx.moveTo(x, y)
    }

    drawLine(x1, y1, x2, y2, LineWidth = 1, color = '#000') {
        this.ctx.beginPath()
        this.ctx.moveTo(x1, y1)
        this.ctx.LineWidth = LineWidth
        this.ctx.strokeStyle = color
        this.ctx.lineTo(x2, y2)
        this.ctx.stroke()
    }

    drawCell(x1, y1, size = this.pixelSize, color = '#000000') {
        this.ctx.beginPath()
        this.ctx.fillStyle = color
        this.ctx.rect(x1, y1, size, size)
        this.ctx.fill()
    }

    toNumRep(shouldBeDrawn) {
        const NumRep = []
        let cToDraw = []

        for (let x = 0; x < this.canvas.width; x += this.pixelSize) {
            for (let y = 0; y < this.canvas.width; y += this.pixelSize) {
                const cell = this.ctx.getImageData(x, y, this.pixelSize, this.pixelSize)
                let isFilled = false

                for (let i = 0; i < cell.data.length; i += 10) {
                    if (cell.data[i] != 0) {
                        isFilled = true
                        break
                    }
                }
                if (isFilled) {
                    NumRep.push(1)
                    cToDraw.push({ x, y })
                } else {
                    NumRep.push(0)
                }
            }
        }
        
        return NumRep
    }

    drawGrd() {
        for (let x = 0; x < this.canvas.width; x += this.pixelSize) {
            this.drawLine(x, 0, x, this.canvas.height)
        }

        for (let y = 0; y < this.canvas.width; y += this.pixelSize) {
            this.drawLine(0, y, this.canvas.width, y)
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    run() {
        this.canvas.addEventListener('mousedown', () => {
            this.isMouseDown = true
            this.ctx.beginPath()
        })

        this.canvas.addEventListener('mouseup', () => {
            this.isMouseDown = false
        })

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isMouseDown) {
                const x = e.offsetX
                const y = e.offsetY

                this.drawConLine(x, y)                
                this.drawCheckDot(x, y)
                this.storePosition(x, y)
            }
        })
    }
}

const paint = new Paint(canvas.width, canvas.height, canvas.width/10, '#292929');
paint.run()

const statistic = []

document.addEventListener('keypress', ({ code })=> {
    if (code == 'KeyC') {
        paint.clear()
    }

    if (code == 'KeyE') {
        const NumRep = paint.toNumRep(true)
        statistic.push({
            input: NumRep,
            output: {
                [prompt('Введите число...')]: 1
            }
        })
    }

    if (code == 'KeyR') {
        const neuralNetwork = new brain.NeuralNetwork()
        neuralNetwork.train(statistic,{ log: true })
        const NumRep = paint.toNumRep()
        const result = brain.likely(NumRep, neuralNetwork)
        alert(result)
    }
})