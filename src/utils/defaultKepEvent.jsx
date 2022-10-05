

export const enterEvent = (func)=>{
  return (event)=>{
    if (event.keyCode == 13) {
      func();
    }
  }
}