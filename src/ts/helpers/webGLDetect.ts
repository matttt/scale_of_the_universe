export function webgl_support ():boolean { 
  try {
   var canvas = document.createElement('canvas'); 
    !!window.WebGLRenderingContext &&
     !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch(e) {
    return false;
  }
};