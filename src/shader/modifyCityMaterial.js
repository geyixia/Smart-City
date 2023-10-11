import * as THREE from "three"

// 使用着色器代码 - 修改城市默认细节
export function modifyCityDefaultMaterial(mesh, isCenter) {
  // 中心城市物体
  if (isCenter) {
    // 给现有材质追加着色器内代码
    // onBeforeCompile 基于材质对象的方法 可以修改内置材质
    mesh.material.onBeforeCompile = (shader) => {
      // 替换片元着色器内代码字符串
      // 对混色 dithering_fragment 部分准备改写
      // 注意：打印 shader.fragmentShader 发现是类 c 语法，引入了各种插件和实现过程代码（这里对 c 语法做出替换，从而让颜色改变）
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        `
          #include <dithering_fragment>
          //#end#
      `
      )
      // 给物体内着色器代码进行修改和替换，添加过渡颜色
      addGradColor(shader, mesh)
    }
  } else {
    // 周围建筑
    mesh.material.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        `
          #include <dithering_fragment>
          //#end#
      `
      )
      addLowGradColor(shader, mesh)
    }
  }
}
export function addGradColor(shader, mesh) {
  // 计算当前几何物体，边缘图形：链接：https://threejs.org/docs/index.html#api/zh/core/BufferGeometry.computeBoundingBox
  mesh.geometry.computeBoundingBox()

  // 就能拿到这个物体的坐标值
  let { min, max } = mesh.geometry.boundingBox
  let uHeight = max.z - min.z
  let uMaxX = max.x
  let uMinX = min.x

  // 向 shader 中传入全局参数
  shader.uniforms.uTopColor = {
    value: new THREE.Color("#1B2569")
  };
  shader.uniforms.uHeight = {
    value: uHeight
  };
  shader.uniforms.uMaxX = {
    value: uMaxX
  }
  shader.uniforms.uMinX = {
    value: uMinX
  }

  // 顶点着色器代码替换
  shader.vertexShader = shader.vertexShader.replace(
    // common 包含着色器公共模块(包含常用的数学工具函数以及一些常量定义什么的)
    "#include <common>",
    `
      #include <common>
      varying vec3 vPosition;
      `
  )
  shader.vertexShader = shader.vertexShader.replace(
    // 顶点着色器开始的位置
    "#include <begin_vertex>",
    `
      #include <begin_vertex>
      vPosition = position;
  `
  )

  // 片元着色器代码替换
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <common>",
    `
      #include <common>
      
      uniform vec3 uTopColor;
      uniform float uHeight;
      varying vec3 vPosition;
    `
  )
  shader.fragmentShader = shader.fragmentShader.replace(
    "//#end#",
    `
      vec4 distGradColor = gl_FragColor;
      // 设置渐变色比例
      float gradMix = (vPosition.z+uHeight/2.0)/uHeight;
      // 设置渐变效果 mix(a,b,r) = (1-r)*a + br
      vec3 gradMixColor = mix(distGradColor.xyz,uTopColor,gradMix);
      // 片元赋色
      gl_FragColor = vec4(gradMixColor,0.8);
        //#end#
      `
  )
}
export function addLowGradColor(shader, mesh) {
  mesh.geometry.computeBoundingBox()

  let { min, max } = mesh.geometry.boundingBox
  let uHeight = max.z - min.z
  let uMaxX = max.x
  let uMinX = min.x

  shader.uniforms.uTopColor = {
    value: new THREE.Color("#000"),
  }
  shader.uniforms.uHeight = {
    value: uHeight,
  }

  shader.uniforms.uMaxX = {
    value: uMaxX
  }

  shader.uniforms.uMinX = {
    value: uMinX
  }

  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `
      #include <common>
      varying vec3 vPosition;
      `
  );

  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
      #include <begin_vertex>
      vPosition = position;
  `
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <common>",
    `
      #include <common>
      
      uniform vec3 uTopColor;
      uniform float uHeight;
      varying vec3 vPosition;

        `
  )
  shader.fragmentShader = shader.fragmentShader.replace(
    "//#end#",
    `
      vec4 distGradColor = vec4(0.4,0.5,0.6,1.0);

      float gradMix = (vPosition.z+uHeight/2.0)/uHeight;
      vec3 gradMixColor = mix(distGradColor.xyz,uTopColor,gradMix);
      gl_FragColor = vec4(gradMixColor,0.8);
        //#end#

      `
  )
}

// 饼状图->点击选择城市效果
export function modifySelectCityMaterial(mesh) {
  mesh.material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      `
        #include <dithering_fragment>
        //#end#
    `
    );
    addGradColor(shader, mesh);
  };
}
