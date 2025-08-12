import React, { useEffect, useRef } from "react";

/**
 * FluidCanvas (Lovable-safe, TypeScript/TSX)
 * - Guards against React Strict Mode double-mount
 * - Rebuilds FBOs on resize (no stale textures)
 * - Binds textures per pass to avoid FBO<->sampler feedback loops
 * - Skips rendering until canvas has a real size
 * - Cleans up GL resources and rAF on unmount
 */

interface FluidCanvasProps {
  width?: string;
  height?: string;
  showMask?: boolean;
}

type GL = WebGL2RenderingContext | WebGLRenderingContext;

interface UniformMap {
  [name: string]: WebGLUniformLocation | null;
}

interface FBO {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  w: number;
  h: number;
}

interface DoubleFBO {
  read: FBO;
  write: FBO;
  swap: () => void;
}

interface Extensions {
  formatRGBA: { internalFormat: number; format: number };
  formatRG: { internalFormat: number; format: number };
  formatR: { internalFormat: number; format: number };
  halfFloatTexType: number;
  supportLinearFiltering: boolean;
}

export default function FluidCanvas({ width = "100%", height = "100%", showMask = false }: FluidCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Prevent double init under Strict Mode
  const startedRef = useRef<boolean>(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (startedRef.current) return; // StrictMode double-mount guard
    startedRef.current = true;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // === Size helpers ===
    let lastW = 0,
      lastH = 0;
    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(0, Math.floor(rect.width));
      const h = Math.max(0, Math.floor(rect.height));
      if (w === lastW && h === lastH) return false;
      lastW = w;
      lastH = h;
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.style.backgroundColor = "#000";
      return true;
    };

    // Initial sizing; if zero, wait a tick
    const sized = updateCanvasSize();

    // Create WebGL context
    const ctx = getWebGLContext(canvas);
    const gl = ctx.gl;
    if (!gl) return;
    const { ext, isWebGL2 } = ctx;

    // ======= State & Config =======
    const config = {
      TEXTURE_DOWNSAMPLE: 1,
      DENSITY_DISSIPATION: 0.98,
      VELOCITY_DISSIPATION: 0.99,
      PRESSURE_DISSIPATION: 0.8,
      PRESSURE_ITERATIONS: 25,
      CURL: 28,
      SPLAT_RADIUS: 0.004,
      SPLAT_FORCE: 6000,
      PAUSED: false,
    };

    class GLProgram {
      program: WebGLProgram;
      uniforms: UniformMap = {};
      constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        const program = gl.createProgram();
        if (!program) throw new Error("Failed to create program");
        this.program = program;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.bindAttribLocation(program, 0, "aPosition");
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          // eslint-disable-next-line no-console
          console.trace(gl.getProgramInfoLog(program));
        }
        const uniformCount = (gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number) || 0;
        for (let i = 0; i < uniformCount; i++) {
          const info = gl.getActiveUniform(program, i);
          if (!info) continue;
          this.uniforms[info.name] = gl.getUniformLocation(program, info.name);
        }
      }
      bind() {
        gl.useProgram(this.program);
      }
      dispose() {
        gl.deleteProgram(this.program);
      }
    }

    function getWebGLContext(canvas: HTMLCanvasElement): { gl: GL | null; ext: Extensions; isWebGL2: boolean } {
      const params: WebGLContextAttributes = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
      };
      // Try WebGL2 first
      let gl = (canvas.getContext("webgl2", params) as WebGL2RenderingContext | null) as GL | null;
      const isWebGL2 = !!gl && (gl as WebGL2RenderingContext).TEXTURE_BINDING_3D !== undefined;
      if (!isWebGL2) {
        gl = (canvas.getContext("webgl", params) || canvas.getContext("experimental-webgl", params)) as GL | null;
      }
      if (!gl) return { gl: null, ext: defaultExt(), isWebGL2: false };

      let halfFloat: any = null;
      let supportLinearFiltering = false;
      if (isWebGL2) {
        (gl as WebGL2RenderingContext).getExtension("EXT_color_buffer_float");
        supportLinearFiltering = !!gl.getExtension("OES_texture_float_linear");
      } else {
        halfFloat = gl.getExtension("OES_texture_half_float");
        supportLinearFiltering = !!gl.getExtension("OES_texture_half_float_linear");
      }

      const ext: Extensions = {
        formatRGBA: getSupportedFormat(gl, isWebGL2 ? (gl as WebGL2RenderingContext).RGBA16F : gl.RGBA, gl.RGBA, isWebGL2 ? (gl as WebGL2RenderingContext).HALF_FLOAT : (halfFloat?.HALF_FLOAT_OES ?? gl.UNSIGNED_BYTE), supportLinearFiltering),
        formatRG: getSupportedFormat(gl, isWebGL2 ? (gl as WebGL2RenderingContext).RG16F : gl.RGBA, isWebGL2 ? (gl as WebGL2RenderingContext).RG : gl.RGBA, isWebGL2 ? (gl as WebGL2RenderingContext).HALF_FLOAT : (halfFloat?.HALF_FLOAT_OES ?? gl.UNSIGNED_BYTE), supportLinearFiltering),
        formatR: getSupportedFormat(gl, isWebGL2 ? (gl as WebGL2RenderingContext).R16F : gl.RGBA, isWebGL2 ? (gl as WebGL2RenderingContext).RED : gl.RGBA, isWebGL2 ? (gl as WebGL2RenderingContext).HALF_FLOAT : (halfFloat?.HALF_FLOAT_OES ?? gl.UNSIGNED_BYTE), supportLinearFiltering),
        halfFloatTexType: isWebGL2 ? (gl as WebGL2RenderingContext).HALF_FLOAT : (halfFloat?.HALF_FLOAT_OES ?? gl.UNSIGNED_BYTE),
        supportLinearFiltering,
      };

      // In WebGL1, prefer RGBA for single-channel targets so we can reliably sample from .x
      if (!isWebGL2) {
        ext.formatR = { internalFormat: gl.RGBA, format: gl.RGBA } as any;
      }

      gl.clearColor(0, 0, 0, 1);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      return { gl, ext, isWebGL2 };
    }

    function defaultExt(): Extensions {
      return {
        formatRGBA: { internalFormat: 0x1908, format: 0x1908 }, // RGBA
        formatRG: { internalFormat: 0x1908, format: 0x1908 },
        formatR: { internalFormat: 0x1906, format: 0x1906 }, // ALPHA/RED fallback
        halfFloatTexType: 0x1401, // UNSIGNED_BYTE
        supportLinearFiltering: false,
      };
    }

    function getSupportedFormat(gl: GL, internalFormat: number, format: number, type: number, filtering: boolean) {
      if (!filtering) return { internalFormat: gl.RGBA, format: gl.RGBA };
      const tex = gl.createTexture() as WebGLTexture;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      // @ts-ignore - internalFormat is WebGL2 when available
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      const err = gl.getError();
      gl.deleteTexture(tex);
      if (err !== gl.NO_ERROR) return { internalFormat: gl.RGBA, format: gl.RGBA };
      return { internalFormat, format };
    }

    // Create a texture+FBO pair (no fixed texture unit assigned here)
    function createFBO(w: number, h: number, format: { internalFormat: number; format: number }, type: number, param: number): FBO {
      const texture = gl.createTexture();
      if (!texture) throw new Error("Failed to create texture");
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      // @ts-ignore - internalFormat is WebGL2 when available
      gl.texImage2D(gl.TEXTURE_2D, 0, format.internalFormat, w, h, 0, format.format, ext.halfFloatTexType, null);

      const fbo = gl.createFramebuffer();
      if (!fbo) throw new Error("Failed to create framebuffer");
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return { texture, fbo, w, h };
    }

    function createDoubleFBO(w: number, h: number, format: { internalFormat: number; format: number }, type: number, param: number): DoubleFBO {
      let fbo1 = createFBO(w, h, format, type, param);
      let fbo2 = createFBO(w, h, format, type, param);
      return {
        get read() {
          return fbo1;
        },
        get write() {
          return fbo2;
        },
        swap() {
          const t = fbo1;
          fbo1 = fbo2;
          fbo2 = t;
        },
      } as unknown as DoubleFBO;
    }

    // Fullscreen quad
    const blit = (() => {
      const vbo = gl.createBuffer() as WebGLBuffer;
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW
      );
      const ibo = gl.createBuffer() as WebGLBuffer;
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 2, 1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      return (destinationFBO: WebGLFramebuffer | null) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, destinationFBO);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    })();

    // ======= Shaders =======
    function compileShader(type: number, source: string): WebGLShader {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Failed to create shader");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        // eslint-disable-next-line no-console
        console.error("Shader compile error:\n", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        throw new Error("Shader compile failed");
      }
      return shader;
    }

    const baseVertexShader = compileShader(
      gl.VERTEX_SHADER,
      `precision highp float; attribute vec2 aPosition; varying vec2 vUv; void main(){ vUv = aPosition * 0.5 + 0.5; gl_Position = vec4(aPosition, 0.0, 1.0); }`
    );

    const displayShader = compileShader(
      gl.FRAGMENT_SHADER,
      `precision highp float; varying vec2 vUv; uniform sampler2D uTexture; void main(){ vec3 c = texture2D(uTexture, vUv).rgb; gl_FragColor = vec4(c, 1.0); }`
    );

    const clearShader = compileShader(
      gl.FRAGMENT_SHADER,
      `precision highp float; varying vec2 vUv; uniform sampler2D uTexture; uniform float value; void main(){ gl_FragColor = value * texture2D(uTexture, vUv); }`
    );

    const splatShader = compileShader(
      gl.FRAGMENT_SHADER,
      `precision highp float; varying vec2 vUv; uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius; void main(){ vec2 p = vUv - point; p.x *= aspectRatio; vec3 splat = exp(-dot(p,p) / radius) * color; vec3 base = texture2D(uTarget, vUv).xyz; gl_FragColor = vec4(base + splat, 1.0); }`
    );

    // ===================================================================================
    // FIXED ADVECTION SHADER
    // ===================================================================================
    const advectionShader = compileShader(
      gl.FRAGMENT_SHADER,
      `precision highp float;
       varying vec2 vUv;
       uniform sampler2D uVelocity;
       uniform sampler2D uSource;
       uniform vec2 texelSize;
       uniform float dt;
       uniform float dissipation;

       void main() {
         // Trace back in time to find the source coordinate
         vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy;
         
         // Sample the source texture at the new coordinate, relying on hardware filtering
         gl_FragColor = dissipation * texture2D(uSource, coord);
         gl_FragColor.a = 1.0;
       }`
    );

    const divergenceShader = compileShader(
      gl.FRAGMENT_SHADER,
      `precision highp float; varying vec2 vUv; uniform sampler2D uVelocity; uniform vec2 texelSize; void main(){ float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).x; float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).x; float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).y; float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).y; vec2 div = vec2(R - L, T - B); gl_FragColor = vec4(div, 0.0, 1.0); }`
    );

    const curlShader = compileShader(
      gl.FRAGMENT_SHADER,
      `precision highp float; varying vec2 vUv; uniform sampler2D uVelocity; uniform vec2 texelSize; void main(){ float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).y; float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).y; float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).x; float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).x; float vorticity = R - L - T + B; gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0); }`
    );

    const vorticityShader = compileShader(
      gl.FRAGMENT_SHADER,
      `precision highp float; varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt; uniform vec2 texelSize; void main(){ float L = texture2D(uCurl, vUv - vec2(texelSize.x, 0.0)).x; float R = texture2D(uCurl, vUv + vec2(texelSize.x, 0.0)).x; float B = texture2D(uCurl, vUv - vec2(0.0, texelSize.y)).x; float T = texture2D(uCurl, vUv + vec2(0.0, texelSize.y)).x; float C = texture2D(uCurl, vUv).x; vec2 force = vec2(abs(T) - abs(B), abs(R) - abs(L)); force /= length(force) + 0.0001; force *= curl * C; vec2 vel = texture2D(uVelocity, vUv).xy; gl_FragColor = vec4(vel + force * dt, 0.0, 1.0); }`
    );

    const pressureShader = compileShader(
      gl.FRAGMENT_SHADER,
      `precision highp float; varying vec2 vUv; uniform sampler2D uPressure; uniform sampler2D uDivergence; uniform vec2 texelSize; void main(){ float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x; float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x; float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x; float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x; float divergence = texture2D(uDivergence, vUv).x; float pressure = (L + R + B + T - divergence) * 0.25; gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0); }`
    );

    const gradientSubtractShader = compileShader(
      gl.FRAGMENT_SHADER,
      `precision highp float; varying vec2 vUv; uniform sampler2D uPressure; uniform sampler2D uVelocity; uniform vec2 texelSize; void main(){ float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x; float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x; float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x; float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x; vec2 V = texture2D(uVelocity, vUv).xy; vec2 grad = vec2(R - L, T - B); gl_FragColor = vec4(V - grad, 0.0, 1.0); }`
    );

    const displayProgram = new GLProgram(baseVertexShader, displayShader);
    const clearProgram = new GLProgram(baseVertexShader, clearShader);
    const splatProgram = new GLProgram(baseVertexShader, splatShader);
    const advectionProgram = new GLProgram(baseVertexShader, advectionShader);
    const divergenceProgram = new GLProgram(baseVertexShader, divergenceShader);
    const curlProgram = new GLProgram(baseVertexShader, curlShader);
    const vorticityProgram = new GLProgram(baseVertexShader, vorticityShader);
    const pressureProgram = new GLProgram(baseVertexShader, pressureShader);
    const gradSubtractProgram = new GLProgram(baseVertexShader, gradientSubtractShader);

    // Helper to bind a sampler to a given unit and texture (per draw call)
    function bindSampler(program: GLProgram, uniformName: string, unit: number, texture: WebGLTexture) {
      const loc = program.uniforms[uniformName];
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      if (loc) gl.uniform1i(loc, unit);
    }

    // ======= Framebuffers =======
    let density: DoubleFBO | null = null,
      velocity: DoubleFBO | null = null,
      divergence: FBO | null = null,
      curl: FBO | null = null,
      pressure: DoubleFBO | null = null,
      texWidth = 2,
      texHeight = 2;

    function initFramebuffers() {
      texWidth = Math.max(2, (canvas.width >> (config.TEXTURE_DOWNSAMPLE as number)));
      texHeight = Math.max(2, (canvas.height >> (config.TEXTURE_DOWNSAMPLE as number)));

      density = createDoubleFBO(
        texWidth,
        texHeight,
        ext.formatRGBA,
        ext.halfFloatTexType,
        ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST
      );
      velocity = createDoubleFBO(
        texWidth,
        texHeight,
        ext.formatRG,
        ext.halfFloatTexType,
        ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST
      );
      divergence = createFBO(texWidth, texHeight, ext.formatR, ext.halfFloatTexType, gl.NEAREST);
      curl = createFBO(texWidth, texHeight, ext.formatR, ext.halfFloatTexType, gl.NEAREST);
      pressure = createDoubleFBO(texWidth, texHeight, ext.formatR, ext.halfFloatTexType, gl.NEAREST);
    }

    function disposeFramebuffers() {
      const del = (pair: any) => {
        if (!pair) return;
        if (pair.read && pair.write) {
          gl.deleteTexture(pair.read.texture);
          gl.deleteFramebuffer(pair.read.fbo);
          gl.deleteTexture(pair.write.texture);
          gl.deleteFramebuffer(pair.write.fbo);
        } else if (pair.texture && pair.fbo) {
          gl.deleteTexture(pair.texture);
          gl.deleteFramebuffer(pair.fbo);
        }
      };
      del(density);
      del(velocity);
      del(divergence);
      del(curl);
      del(pressure);
      density = velocity = divergence = curl = pressure = null as any;
    }

    if (lastW >= 2 && lastH >= 2) {
      initFramebuffers();
    }

    // ======= Sim steps =======
    function step(dt: number) {
      if (!density || !velocity || !divergence || !curl || !pressure) return;
      if (canvas.width < 2 || canvas.height < 2) return; // zero-size guard
      gl.viewport(0, 0, texWidth, texHeight);

      // 1) Curl
      curlProgram.bind();
      const curlTexelSize = curlProgram.uniforms["texelSize"];
      if (curlTexelSize) gl.uniform2f(curlTexelSize, 1.0 / texWidth, 1.0 / texHeight);
      bindSampler(curlProgram, "uVelocity", 0, velocity.read.texture);
      blit(curl.fbo);

      // 2) Vorticity (adds curl force to velocity)
      vorticityProgram.bind();
      const vortTexelSize = vorticityProgram.uniforms["texelSize"];
      if (vortTexelSize) gl.uniform2f(vortTexelSize, 1.0 / texWidth, 1.0 / texHeight);
      const vortCurl = vorticityProgram.uniforms["curl"];
      const vortDt = vorticityProgram.uniforms["dt"];
      if (vortCurl) gl.uniform1f(vortCurl, config.CURL);
      if (vortDt) gl.uniform1f(vortDt, dt);
      bindSampler(vorticityProgram, "uVelocity", 0, velocity.read.texture);
      bindSampler(vorticityProgram, "uCurl", 1, curl.texture);
      blit(velocity.write.fbo);
      velocity.swap();

      // 3) Divergence
      divergenceProgram.bind();
      const divTexelSize = divergenceProgram.uniforms["texelSize"];
      if (divTexelSize) gl.uniform2f(divTexelSize, 1.0 / texWidth, 1.0 / texHeight);
      bindSampler(divergenceProgram, "uVelocity", 0, velocity.read.texture);
      blit(divergence.fbo);

      // 4) Clear pressure
      clearProgram.bind();
      const clearValue = clearProgram.uniforms["value"];
      if (clearValue) gl.uniform1f(clearValue, config.PRESSURE_DISSIPATION);
      bindSampler(clearProgram, "uTexture", 0, pressure.read.texture);
      blit(pressure.write.fbo);
      pressure.swap();

      // 5) Pressure solve
      pressureProgram.bind();
      const pTexelSize = pressureProgram.uniforms["texelSize"];
      if (pTexelSize) gl.uniform2f(pTexelSize, 1.0 / texWidth, 1.0 / texHeight);
      bindSampler(pressureProgram, "uDivergence", 0, divergence.texture);
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        bindSampler(pressureProgram, "uPressure", 1, pressure.read.texture);
        blit(pressure.write.fbo);
        pressure.swap();
      }

      // 6) Subtract gradient from velocity
      gradSubtractProgram.bind();
      const gTexelSize = gradSubtractProgram.uniforms["texelSize"];
      if (gTexelSize) gl.uniform2f(gTexelSize, 1.0 / texWidth, 1.0 / texHeight);
      bindSampler(gradSubtractProgram, "uPressure", 0, pressure.read.texture);
      bindSampler(gradSubtractProgram, "uVelocity", 1, velocity.read.texture);
      blit(velocity.write.fbo);
      velocity.swap();

      // 7) Advect velocity
      advectionProgram.bind();
      const aTexelSize = advectionProgram.uniforms["texelSize"];
      const aDt = advectionProgram.uniforms["dt"];
      const aDiss = advectionProgram.uniforms["dissipation"];
      if (aTexelSize) gl.uniform2f(aTexelSize, 1.0 / texWidth, 1.0 / texHeight);
      if (aDt) gl.uniform1f(aDt, dt);
      if (aDiss) gl.uniform1f(aDiss, config.VELOCITY_DISSIPATION);
      bindSampler(advectionProgram, "uVelocity", 0, velocity.read.texture);
      bindSampler(advectionProgram, "uSource", 1, velocity.read.texture);
      blit(velocity.write.fbo);
      velocity.swap();

      // 8) Advect density
      if (aDiss) gl.uniform1f(aDiss, config.DENSITY_DISSIPATION);
      bindSampler(advectionProgram, "uVelocity", 0, velocity.read.texture);
      bindSampler(advectionProgram, "uSource", 1, density.read.texture);
      blit(density.write.fbo);
      density.swap();
    }

    function draw() {
      gl.viewport(0, 0, canvas.width, canvas.height);
      displayProgram.bind();
      bindSampler(displayProgram, "uTexture", 0, (density as DoubleFBO)?.read.texture);
      blit(null);
    }

    function correctRadius(aspectRatio: number) {
      return (aspectRatio > 1 ? 0.00035 : 0.00035 * aspectRatio) * (config.SPLAT_RADIUS / 0.004);
    }

    function splat(x: number, y: number, dx: number, dy: number, color: [number, number, number]) {
      if (!density || !velocity) return;
      gl.viewport(0, 0, texWidth, texHeight);
      splatProgram.bind();
      bindSampler(splatProgram, "uTarget", 0, velocity.read.texture);
      const aspectRatio = canvas.width / canvas.height;
      const uAspect = splatProgram.uniforms["aspectRatio"];
      if (uAspect) gl.uniform1f(uAspect, aspectRatio);
      const uPoint = splatProgram.uniforms["point"];
      if (uPoint) gl.uniform2f(uPoint, x / canvas.width, 1.0 - y / canvas.height);
      const uColor = splatProgram.uniforms["color"];
      if (uColor) gl.uniform3f(uColor, dx * config.SPLAT_FORCE, dy * config.SPLAT_FORCE, 1.0);
      const uRadius = splatProgram.uniforms["radius"];
      if (uRadius) gl.uniform1f(uRadius, correctRadius(aspectRatio) * config.SPLAT_RADIUS);
      blit(velocity.write.fbo);
      velocity.swap();

      // Density
      bindSampler(splatProgram, "uTarget", 0, density.read.texture);
      if (uColor) gl.uniform3f(uColor, color[0], color[1], color[2]);
      blit(density.write.fbo);
      density.swap();
    }

    function multipleSplats(n: number) {
      for (let i = 0; i < n; i++) {
        const c: [number, number, number] = [Math.random(), Math.random(), Math.random()];
        const x = canvas.width * Math.random();
        const y = canvas.height * Math.random();
        const dx = 1000 * (Math.random() - 0.5);
        const dy = 1000 * (Math.random() - 0.5);
        splat(x, y, dx, dy, c);
      }
    }

    // ======= Interaction =======
    const onMouseDown = (e: MouseEvent) => {
      (e.currentTarget as any) // TS appeasement for offsetX/Y on canvas
      const target = e.target as HTMLCanvasElement;
      const rect = target.getBoundingClientRect();
      (window as any)._mouseDown = true;
      (window as any)._lastX = e.clientX - rect.left;
      (window as any)._lastY = e.clientY - rect.top;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!(window as any)._mouseDown) return;
      const target = e.target as HTMLCanvasElement;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dx = (x - (window as any)._lastX) * 5.0;
      const dy = (y - (window as any)._lastY) * 5.0;
      (window as any)._lastX = x;
      (window as any)._lastY = y;
      splat(x, y, dx, dy, [0.9, 0.7, 1.2]);
    };

    const onMouseUp = () => {
      (window as any)._mouseDown = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.targetTouches[0];
      if (!t) return;
      (window as any)._mouseDown = true;
      (window as any)._lastX = t.pageX;
      (window as any)._lastY = t.pageY;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.targetTouches[0];
      if (!t) return;
      const x = t.pageX;
      const y = t.pageY;
      const dx = (x - (window as any)._lastX) * 10.0;
      const dy = (y - (window as any)._lastY) * 10.0;
      (window as any)._lastX = x;
      (window as any)._lastY = y;
      // Map page coords -> canvas coords
      const rect = canvas.getBoundingClientRect();
      splat(x - rect.left, y - rect.top, dx, dy, [0.7, 0.8, 1.1]);
    };

    // Attach listeners
    canvas.addEventListener("mousedown", onMouseDown as any, false);
    window.addEventListener("mousemove", onMouseMove as any, false);
    window.addEventListener("mouseup", onMouseUp as any, false);
    canvas.addEventListener("touchstart", onTouchStart as any, { passive: false } as any);
    window.addEventListener("touchmove", onTouchMove as any, { passive: false } as any);
    window.addEventListener("touchend", onMouseUp as any, false);

    // ======= Resize handling =======
    const resizeObserver = new ResizeObserver(() => {
      const changed = updateCanvasSize();
      if (!changed) return;
      if (canvas.width < 2 || canvas.height < 2) return;
      disposeFramebuffers();
      initFramebuffers();
    });
    resizeObserver.observe(container);

    // ======= Main loop =======
    let lastTime = performance.now();
    function frame(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.016);
      lastTime = now;
      if (!config.PAUSED && canvas.width >= 2 && canvas.height >= 2 && density && velocity) {
        step(dt);
      }
      draw();
      rafRef.current = requestAnimationFrame(frame);
    }

    // Kick off once we have a real size & buffers
    const startLoopWhenReady = () => {
      if (canvas.width < 2 || canvas.height < 2 || !density) {
        rafRef.current = requestAnimationFrame(startLoopWhenReady);
        return;
      }
      multipleSplats(10);
      rafRef.current = requestAnimationFrame(frame);
    };
    if (!sized) {
      requestAnimationFrame(() => {
        updateCanvasSize();
        disposeFramebuffers();
        if (canvas.width >= 2 && canvas.height >= 2) initFramebuffers();
        startLoopWhenReady();
      });
    } else {
      startLoopWhenReady();
    }

    // ======= Cleanup =======
    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      canvas.removeEventListener("mousedown", onMouseDown as any);
      window.removeEventListener("mousemove", onMouseMove as any);
      window.removeEventListener("mouseup", onMouseUp as any);
      canvas.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchmove", onTouchMove as any);
      window.removeEventListener("touchend", onMouseUp as any);
      disposeFramebuffers();
      try {
        const lose = gl.getExtension("WEBGL_lose_context") as any;
        lose?.loseContext?.();
      } catch {}
      startedRef.current = false;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width, height, position: "relative", overflow: "hidden", background: "#000" }}
    >
      {/* SVG overlay with text outline and cutout mask */}
      <svg
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        aria-hidden="true"
      >
        <defs>
          <symbol id="text-shape" viewBox="0 0 1200 400">
            <g>
              <path d="M66.85,278.92l31.49-37.92c14.78,11.89,33.42,20.24,48.84,20.24,16.71,0,23.78-5.46,23.78-14.78,0-9.96-10.6-13.17-28.28-20.24l-26.03-10.93c-22.49-9-42.1-27.96-42.1-58.16,0-35.67,32.13-64.91,77.76-64.91,23.78,0,50.13,9,69.41,27.96l-27.63,34.7c-14.14-9.96-26.35-15.1-41.77-15.1-13.5,0-21.85,4.82-21.85,14.14,0,9.96,11.89,13.5,30.85,20.89l25.39,9.96c26.03,10.28,40.81,28.28,40.81,57.2,0,35.35-29.56,66.84-81.62,66.84-26.35,0-56.55-9.64-79.05-29.88Z" />
              <path d="M251.94,199.55c0-68.77,39.2-107.33,97.04-107.33s97.04,38.88,97.04,107.33-39.2,109.25-97.04,109.25-97.04-40.49-97.04-109.25ZM389.48,199.55c0-37.92-15.42-59.77-40.49-59.77s-40.49,21.85-40.49,59.77,15.42,61.7,40.49,61.7,40.49-23.78,40.49-61.7Z" />
              <path d="M483.31,96.08h55.27v162.59h79.05v46.27h-134.32V96.08Z" />
              <path d="M601.56,96.08h58.48l21.85,91.26c5.78,22.17,9.64,43.7,15.42,66.19h1.29c5.78-22.49,9.96-44.02,15.42-66.19l21.21-91.26h56.55l-61.7,208.87h-66.84l-61.7-208.87Z" />
              <path d="M808.5,96.08h134.96v46.27h-79.69v32.78h68.12v46.27h-68.12v37.27h82.91v46.27h-138.17V96.08Z" />
              <path d="M987.17,96.08h61.7c63.62,0,107.33,29.56,107.33,103.47s-43.7,105.4-104.11,105.4h-64.91V96.08ZM1045.65,260.6c30.21,0,53.98-12.21,53.98-61.05s-23.78-59.13-53.98-59.13h-3.21v120.18h3.21Z" />
            </g>
          </symbol>

          {/* Solid mask (letters = visible) */}
          <mask id="text-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="400">
            <use href="#text-shape" fill="#fff" />
          </mask>

          {/* Cutout mask to peek the canvas through the letters */}
          <mask id="text-cutout-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="400">
            <rect x="0" y="0" width="1200" height="400" fill="#fff" />
            <use href="#text-shape" fill="#000" />
          </mask>
        </defs>

        {/* Outside dimmer with letter cutout */}
        <rect x="0" y="0" width="1200" height="400" fill="#000" opacity="0.5" mask="url(#text-cutout-mask)" />

        {/* Outline of the letters */}
        <use href="#text-shape" fill="none" stroke="#ffffff" strokeWidth={8} vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Canvas under the overlay */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "#000" }}
      />
    </div>
  );
}
