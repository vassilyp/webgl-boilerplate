import * as twgl from './twgl-full.module.js'

function main(vs, fs) {
  const gl = document.getElementById('c').getContext('webgl2')
  const programInfo = twgl.createProgramInfo(gl, [vs, fs])
  twgl.setDefaults({ attribPrefix: 'a_' })

  // -------- DO INIT TIME THINGS HERE --------------
  const arrays = {
    position: {
      numComponents: 2,
      data: [0, 0, 0, 0.5, 0.7, 0],
    },
  }

  // -------------------------

  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays)

  // Render time.
  function render(time) {
    // Resize based on display size. Keeps webgl in sync with css.
    twgl.resizeCanvasToDisplaySize(gl.canvas)
    // Sync clip space to canvas dimensions
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    // -------- DO RENDER TIME THINGS HERE -----------

    // Update uniforms
    const uniforms = {
      u_time: time * 0.001,
      u_resolution: [gl.canvas.width, gl.canvas.height],
    }

    // -----------------

    gl.useProgram(programInfo.program)
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo)
    twgl.setUniforms(programInfo, uniforms)
    twgl.drawBufferInfo(gl, bufferInfo)

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

const readShaderFiles = async () => {
  const vertexShaderSource = await fetch('src/glsl/vert.glsl')
    .then((res) => res.text())
    .catch((error) => console.error(error))

  const fragmentShaderSource = await fetch('src/glsl/frag.glsl')
    .then((res) => res.text())
    .catch((error) => console.error(error))

  return [vertexShaderSource, fragmentShaderSource]
}

// Read in the shader files, and use them to run the webgl code
await readShaderFiles().then(([vert, frag]) => {
  main(vert, frag)
})
