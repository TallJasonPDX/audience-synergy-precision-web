import React, { useRef, useEffect } from "react";

interface FluidCanvasProps {
  width?: string;
  height?: string;
}

/**
 * FluidCanvas - A React component that renders an interactive fluid simulation
 * Based on WebGL fluid simulation
 */
export default function FluidCanvas({ width = "100%", height = "100%" }: FluidCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    const container = containerRef.current as HTMLDivElement | null;

    if (!canvas || !container) return;

    // Set canvas dimensions to match the container dimensions
    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      canvas.style.backgroundColor = "#000000";
    };

    // Initial size setup
    updateCanvasSize();

    // Create a ResizeObserver to handle container size changes
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    // Start observing the container
    resizeObserver.observe(container);

    let config = {
      TEXTURE_DOWNSAMPLE: 1,
      DENSITY_DISSIPATION: 0.98,
      VELOCITY_DISSIPATION: 0.99,
      PRESSURE_DISSIPATION: 0.8,
      PRESSURE_ITERATIONS: 25,
      CURL: 28,
      SPLAT_RADIUS: 0.004,
      SPLAT_FORCE: 6000,
      SHADING: true,
      COLORFUL: true,
      COLOR_UPDATE_SPEED: 2.0,
      PAUSED: false,
      BACK_COLOR: { r: 0, g: 0, b: 0 },
      TRANSPARENT: true,
      BLOOM: true,
      BLOOM_ITERATIONS: 8,
      BLOOM_RESOLUTION: 256,
      BLOOM_INTENSITY: 0.1,
      BLOOM_THRESHOLD: 0.3,
      BLOOM_SOFT_KNEE: 0.7,
      SUNRAYS: true,
      SUNRAYS_RESOLUTION: 196,
      SUNRAYS_WEIGHT: 1.0,
    };

    type Pointer = {
      id: number;
      x: number;
      y: number;
      dx: number;
      dy: number;
      down: boolean;
      moved: boolean;
      color: [number, number, number];
    };

    let pointers: Pointer[] = [];
    let splatStack: number[] = [];
    pointers.push(new pointerPrototype() as unknown as Pointer);

    const { gl, ext } = getWebGLContext(canvas);

    const isWebGL2Ctx = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
    const formatRGBA = ext.formatRGBA ?? { internalFormat: isWebGL2Ctx ? gl.RGBA16F : gl.RGBA, format: gl.RGBA };
    const formatRG = ext.formatRG ?? formatRGBA;
    const formatR = ext.formatR ?? formatRGBA;

    function pointerPrototype(this: any) {
      this.id = -1;
      this.x = 0;
      this.y = 0;
      this.dx = 0;
      this.dy = 0;
      this.down = false;
      this.moved = false;
      this.color = [30, 0, 300];
    }

    class GLProgram {
      uniforms: Record<string, WebGLUniformLocation | null> = {};
      program: WebGLProgram;
      constructor(vertexShader: WebGLShader | null, fragmentShader: WebGLShader | null) {
        this.program = gl.createProgram();
        if (!vertexShader || !fragmentShader) throw new Error("Shader creation failed");
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
          console.trace(gl.getProgramInfoLog(this.program));

        const uniformCount = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
          const uniformName = gl.getActiveUniform(this.program, i).name;
          this.uniforms[uniformName] = gl.getUniformLocation(this.program, uniformName);
        }
      }

      bind() {
        gl.useProgram(this.program);
      }
    }

    function getWebGLContext(canvas: HTMLCanvasElement) {
      const params: WebGLContextAttributes = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
      };

      let gl: any = canvas.getContext("webgl2", params);

      const isWebGL2 = !!gl;
      if (!isWebGL2)
        gl = canvas.getContext("webgl", params) || canvas.getContext("experimental-webgl", params);

      let halfFloat: any;
      let supportLinearFiltering: any;
      if (isWebGL2) {
        gl.getExtension("EXT_color_buffer_float");
        supportLinearFiltering = gl.getExtension("OES_texture_float_linear");
      } else {
        halfFloat = gl.getExtension("OES_texture_half_float");
        supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear");
      }

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      const ext = {
        formatRGBA: getSupportedFormat(
          gl,
          gl.RGBA16F,
          gl.RGBA,
          isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES,
          supportLinearFiltering
        ),
        formatRG: getSupportedFormat(
          gl,
          gl.RG16F,
          gl.RG,
          isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES,
          supportLinearFiltering
        ),
        formatR: getSupportedFormat(
          gl,
          gl.R16F,
          gl.RED,
          isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES,
          supportLinearFiltering
        ),
        halfFloatTexType: isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES,
        supportLinearFiltering,
      };

      return { gl, ext } as const;
    }

    function getSupportedFormat(gl: any, internalFormat: any, format: any, type: any, filtering: any) {
      if (!filtering) return null;
      let tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      if (gl.getError() !== gl.NO_ERROR) return null;
      return { internalFormat, format };
    }

    function createFBO(texId: number, w: number, h: number, format: any, type: any, param: any) {
      gl.activeTexture(gl.TEXTURE0 + texId);
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        format.internalFormat,
        w,
        h,
        0,
        format.format,
        type,
        null
      );

      let fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return [texture, fbo, texId] as const;
    }

    function createDoubleFBO(texId: number, w: number, h: number, format: any, type: any, param: any) {
      let fbo1 = createFBO(texId, w, h, format, type, param);
      let fbo2 = createFBO(texId + 1, w, h, format, type, param);

      return {
        get read() {
          return fbo1;
        },
        set read(value) {
          fbo1 = value as typeof fbo1;
        },
        get write() {
          return fbo2;
        },
        set write(value) {
          fbo2 = value as typeof fbo2;
        },
        swap() {
          let temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        },
      };
    }

    function compileShader(type: number, source: string) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile failed with: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const baseVertexShader = compileShader(
      gl.VERTEX_SHADER,
      `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        void main () {
            vUv = aPosition * 0.5 + 0.5;
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `
    );

    const clearShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;
        void main () {
            gl_FragColor = value * texture2D(uTexture, vUv);
        }
      `
    );

    const displayShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTexture;
        void main () {
            vec3 C = texture2D(uTexture, vUv).rgb;
            gl_FragColor = vec4(C, 1.0);
        }
      `
    );

    const splatShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;
        void main () {
            vec2 p = vUv - point;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
      `
    );

    const advectionShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform float dt;
        uniform float dissipation;
        vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
            vec2 st = uv / tsize - 0.5;
            vec2 iuv = floor(st);
            vec2 fuv = fract(st);
            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }
        void main () {
            vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy;
            gl_FragColor = dissipation * bilerp(uSource, coord, texelSize);
            gl_FragColor.a = 1.0;
        }
      `
    );

    const divergenceShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform vec2 texelSize;
        vec2 gradientSubtract (in sampler2D tex, in vec2 uv, in vec2 tsize) {
            float L = texture2D(tex, uv - vec2(tsize.x, 0.0)).x;
            float R = texture2D(tex, uv + vec2(tsize.x, 0.0)).x;
            float B = texture2D(tex, uv - vec2(0.0, tsize.y)).y;
            float T = texture2D(tex, uv + vec2(0.0, tsize.y)).y;
            return vec2(R - L, T - B);
        }
        void main () {
            float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).x;
            float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).x;
            float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).y;
            float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).y;
            vec2 C = texture2D(uVelocity, vUv).xy;
            vec2 div = vec2(R - L, T - B);
            gl_FragColor = vec4(div, 0.0, 1.0);
        }
      `
    );

    const curlShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform vec2 texelSize;
        void main () {
            float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).y;
            float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).y;
            float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).x;
            float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0);
        }
      `
    );

    const vorticityShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;
        uniform vec2 texelSize;
        void main () {
            float L = texture2D(uCurl, vUv - vec2(texelSize.x, 0.0)).x;
            float R = texture2D(uCurl, vUv + vec2(texelSize.x, 0.0)).x;
            float B = texture2D(uCurl, vUv - vec2(0.0, texelSize.y)).x;
            float T = texture2D(uCurl, vUv + vec2(0.0, texelSize.y)).x;
            float C = texture2D(uCurl, vUv).x;
            vec2 force = vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            vec2 vel = texture2D(uVelocity, vUv).xy;
            gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
        }
      `
    );

    const pressureShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;
        uniform vec2 texelSize;
        void main () {
            float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
            float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
            float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
            float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
            float C = texture2D(uPressure, vUv).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
      `
    );

    const gradientSubtractShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;
        uniform vec2 texelSize;
        void main () {
            float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
            float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
            float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
            float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
            vec2 C = texture2D(uVelocity, vUv).xy;
            vec2 grad = vec2(R - L, T - B);
            gl_FragColor = vec4(C - grad, 0.0, 1.0);
        }
      `
    );

    const blit = (() => {
      // Fullscreen quad
      let vao = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vao);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW
      );
      let vbo = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 2, 1, 3]), gl.STATIC_DRAW);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);
      return (destination: WebGLFramebuffer | null) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, destination);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    })();

    const baseProgram = new GLProgram(baseVertexShader, displayShader); // initial display

    const clearProgram = new GLProgram(baseVertexShader, clearShader);
    const displayProgram = new GLProgram(baseVertexShader, displayShader);
    const splatProgram = new GLProgram(baseVertexShader, splatShader);
    const advectionProgram = new GLProgram(baseVertexShader, advectionShader);
    const divergenceProgram = new GLProgram(baseVertexShader, divergenceShader);
    const curlProgram = new GLProgram(baseVertexShader, curlShader);
    const vorticityProgram = new GLProgram(baseVertexShader, vorticityShader);
    const pressureProgram = new GLProgram(baseVertexShader, pressureShader);
    const gradSubtractProgram = new GLProgram(baseVertexShader, gradientSubtractShader);

    function initFramebuffers() {
      let textureWidth = canvas.width >> config.TEXTURE_DOWNSAMPLE;
      let textureHeight = canvas.height >> config.TEXTURE_DOWNSAMPLE;

      const density = createDoubleFBO(
        0,
        textureWidth,
        textureHeight,
        formatRGBA,
        ext.halfFloatTexType,
        ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST
      );
      const velocity = createDoubleFBO(
        2,
        textureWidth,
        textureHeight,
        formatRG,
        ext.halfFloatTexType,
        ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST
      );
      const divergence = createFBO(4, textureWidth, textureHeight, formatR, ext.halfFloatTexType, gl.NEAREST);
      const curl = createFBO(5, textureWidth, textureHeight, formatR, ext.halfFloatTexType, gl.NEAREST);
      const pressure = createDoubleFBO(6, textureWidth, textureHeight, formatR, ext.halfFloatTexType, gl.NEAREST);

      return {
        density,
        velocity,
        divergence,
        curl,
        pressure,
        textureWidth,
        textureHeight,
      };
    }

    let { density, velocity, divergence, curl, pressure, textureWidth, textureHeight } = initFramebuffers();

    function update() {
      const dt = 0.016;

      gl.viewport(0, 0, textureWidth, textureHeight);

      gl.disable(gl.BLEND);
      curlProgram.bind();
      gl.uniform2f(curlProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(curlProgram.uniforms.uVelocity, (velocity.read as any)[2]);
      blit(curl[1]);

      vorticityProgram.bind();
      gl.uniform2f(vorticityProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, (velocity.read as any)[2]);
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl[2]);
      gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write[1]);
      velocity.swap();

      divergenceProgram.bind();
      gl.uniform2f(divergenceProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, (velocity.read as any)[2]);
      blit(divergence[1]);

      clearProgram.bind();
      gl.uniform1i(clearProgram.uniforms.uTexture, (pressure.read as any)[2]);
      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE_DISSIPATION);
      blit(pressure.write[1]);
      pressure.swap();

      pressureProgram.bind();
      gl.uniform2f(pressureProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence[2]);
      gl.uniform1i(pressureProgram.uniforms.uPressure, (pressure.read as any)[2]);
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        blit(pressure.write[1]);
        pressure.swap();
      }

      gradSubtractProgram.bind();
      gl.uniform2f(gradSubtractProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(gradSubtractProgram.uniforms.uPressure, (pressure.read as any)[2]);
      gl.uniform1i(gradSubtractProgram.uniforms.uVelocity, (velocity.read as any)[2]);
      blit(velocity.write[1]);
      velocity.swap();

      advectionProgram.bind();
      gl.uniform2f(advectionProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, (velocity.read as any)[2]);
      gl.uniform1i(advectionProgram.uniforms.uSource, (velocity.read as any)[2]);
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write[1]);
      velocity.swap();

      gl.uniform1i(advectionProgram.uniforms.uVelocity, (velocity.read as any)[2]);
      gl.uniform1i(advectionProgram.uniforms.uSource, (density.read as any)[2]);
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(density.write[1]);
      density.swap();
    }

    function multipleSplats(amount: number) {
      for (let i = 0; i < amount; i++) {
        const color: [number, number, number] = [
          Math.random() * 10,
          Math.random() * 10,
          Math.random() * 10,
        ];
        const x = canvas.width * Math.random();
        const y = canvas.height * Math.random();
        const dx = 1000 * (Math.random() - 0.5);
        const dy = 1000 * (Math.random() - 0.5);
        splat(x, y, dx, dy, color);
      }
    }

    function splat(x: number, y: number, dx: number, dy: number, color: [number, number, number]) {
      gl.viewport(0, 0, textureWidth, textureHeight);

      splatProgram.bind();
      gl.uniform1i(splatProgram.uniforms.uTarget, (velocity.read as any)[2]);
      gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProgram.uniforms.point, x / canvas.width, 1.0 - y / canvas.height);
      gl.uniform3f(splatProgram.uniforms.color, dx * config.SPLAT_FORCE, dy * config.SPLAT_FORCE, 1.0);
      gl.uniform1f(
        splatProgram.uniforms.radius,
        correctRadius(canvas.width / canvas.height) * config.SPLAT_RADIUS
      );
      blit(velocity.write[1]);
      velocity.swap();

      gl.uniform1i(splatProgram.uniforms.uTarget, (density.read as any)[2]);
      gl.uniform3f(splatProgram.uniforms.color, color[0], color[1], color[2]);
      blit(density.write[1]);
      density.swap();
    }

    function correctRadius(aspectRatio: number) {
      if (aspectRatio > 1) return 0.00035;
      else return 0.00035 * aspectRatio;
    }

    let lastTime = Date.now();
    function updateFrame() {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.016);
      if (!config.PAUSED) update();
      lastTime = now;

      // Random splats when idle
      if (splatStack.length > 0) multipleSplats(splatStack.pop() as number);

      drawDisplay();
      requestAnimationFrame(updateFrame);
    }

    function drawDisplay() {
      gl.viewport(0, 0, canvas.width, canvas.height);
      displayProgram.bind();
      gl.uniform1i(displayProgram.uniforms.uTexture, (density.read as any)[2]);
      blit(null);
    }

    // Mouse / touch interaction
    const primary = pointers[0] as any;
    primary.down = false;
    primary.moved = false;
    primary.color = [Math.random() + 0.2, Math.random() + 0.2, Math.random() + 0.2];

    canvas.addEventListener(
      "mousedown",
      (e: MouseEvent) => {
        primary.down = true;
        primary.moved = false;
        primary.x = (e as any).offsetX;
        primary.y = (e as any).offsetY;
        primary.dx = 0;
        primary.dy = 0;
      },
      false
    );

    window.addEventListener(
      "mousemove",
      (e: MouseEvent) => {
        if (!primary.down) return;
        primary.moved = true;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        primary.dx = (x - primary.x) * 5.0;
        primary.dy = (y - primary.y) * 5.0;
        primary.x = x;
        primary.y = y;
        splat(primary.x, primary.y, primary.dx, primary.dy, primary.color);
      },
      false
    );

    window.addEventListener(
      "mouseup",
      () => {
        primary.down = false;
      },
      false
    );

    canvas.addEventListener(
      "touchstart",
      (e: TouchEvent) => {
        e.preventDefault();
        const touches = e.targetTouches;
        while (touches.length >= pointers.length) pointers.push(new (pointerPrototype as any)());
        for (let i = 0; i < touches.length; i++) {
          const pointer: any = pointers[i];
          pointer.id = touches[i].identifier;
          pointer.down = true;
          pointer.x = touches[i].pageX;
          pointer.y = touches[i].pageY;
          pointer.color = [Math.random() + 0.2, Math.random() + 0.2, Math.random() + 0.2];
        }
      },
      { passive: false }
    );

    window.addEventListener(
      "touchmove",
      (e: TouchEvent) => {
        e.preventDefault();
        const touches = e.targetTouches;
        for (let i = 0; i < touches.length; i++) {
          let pointer: any = pointers[i];
          pointer.moved = true;
          pointer.dx = (touches[i].pageX - pointer.x) * 10.0;
          pointer.dy = (touches[i].pageY - pointer.y) * 10.0;
          pointer.x = touches[i].pageX;
          pointer.y = touches[i].pageY;
        }
      },
      { passive: false }
    );

    canvas.addEventListener("mousemove", () => {
      (pointers[0] as any).down = true;
      (pointers[0] as any).color = [Math.random() + 0.2, Math.random() + 0.2, Math.random() + 0.2];
    });

    // Kick things off
    multipleSplats(3);
    updateFrame();

    // Cleanup on unmount
    return () => {
      resizeObserver.disconnect();
      // Attempt to lose context gracefully
      try {
        (gl && gl.getExtension && gl.getExtension("WEBGL_lose_context")?.loseContext?.());
      } catch (_) {}
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: width,
        height: height,
        position: "relative",
        overflow: "hidden",
        background: "#000000",
      }}
    >
      {/* SVG overlay with text outline and cutout mask */}
      <svg
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <defs>
          <symbol id="text-shape" viewBox="0 0 1200 400">
            <g>
              <path d="M66.85,278.92l31.49-37.92c14.78,11.89,33.42,20.24,48.84,20.24,16.71,0,23.78-5.46,23.78-14.78,0-9.96-10.6-13.17-28.28-20.24l-26.03-10.93c-22.49-9-42.1-27.96-42.1-58.16,0-35.67,32.13-64.91,77.76-64.91,23.78,0,50.13,9,69.41,27.96l-27.63,34.7c-14.14-9.96-26.35-15.1-41.77-15.1-13.5,0-21.85,4.82-21.85,14.14,0,9.96,11.89,13.5,30.85,20.89l25.39,9.96c26.03,10.28,40.81,28.28,40.81,57.2,0,35.35-29.56,66.84-81.62,66.84-26.35,0-56.55-9.64-79.05-29.88Z"/>
              <path d="M251.94,199.55c0-68.77,39.2-107.33,97.04-107.33s97.04,38.88,97.04,107.33-39.2,109.25-97.04,109.25-97.04-40.49-97.04-109.25ZM389.48,199.55c0-37.92-15.42-59.77-40.49-59.77s-40.49,21.85-40.49,59.77,15.42,61.7,40.49,61.7,40.49-23.78,40.49-61.7Z"/>
              <path d="M483.31,96.08h55.27v162.59h79.05v46.27h-134.32V96.08Z"/>
              <path d="M601.56,96.08h58.48l21.85,91.26c5.78,22.17,9.64,43.7,15.42,66.19h1.29c5.78-22.49,9.96-44.02,15.42-66.19l21.21-91.26h56.55l-61.7,208.87h-66.84l-61.7-208.87Z"/>
              <path d="M808.5,96.08h134.96v46.27h-79.69v32.78h68.12v46.27h-68.12v37.27h82.91v46.27h-138.17V96.08Z"/>
              <path d="M987.17,96.08h61.7c63.62,0,107.33,29.56,107.33,103.47s-43.7,105.4-104.11,105.4h-64.91V96.08ZM1045.65,260.6c30.21,0,53.98-12.21,53.98-61.05s-23.78-59.13-53.98-59.13h-3.21v120.18h3.21Z"/>
            </g>
          </symbol>

          {/* Solid mask (letters = visible) */}
          <mask id="text-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="400">
            <use href="#text-shape" fill="#fff" />
          </mask>

          {/* Cutout mask for seeing the canvas through the letters */}
          <mask id="text-cutout-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="400">
            <rect x="0" y="0" width="1200" height="400" fill="#fff" />
            <use href="#text-shape" fill="#000" />
          </mask>
        </defs>

        {/* Outside dimmer with cutout showing fluid */}
        <rect x="0" y="0" width="1200" height="400" fill="#000" opacity="0.5" mask="url(#text-cutout-mask)" />

        {/* Outline of the letters */}
        <use href="#text-shape" fill="none" stroke="#ffffff" strokeWidth="8" vectorEffect="non-scaling-stroke" />
      </svg>

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "#000000",
        }}
      />
    </div>
  );
}
