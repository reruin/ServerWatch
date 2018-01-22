
function range(type , tz){
  tz = tz || 8
  var now = new Date()
  var timestamp = now.getTime()

  now.setHours(now.getHours() + tz)
  let end = now.toISOString()

  now = new Date(timestamp)

  //非24小时模式 
  if(type != 'dt') {
    now.setHours(0+tz)
    now.setMinutes(0)
    now.setSeconds(0)
    now.setMilliseconds(0)
  }
  
  if(type == 'w'){
    now.setDate(now.getDate() - now.getDay() + 1)
  }
  else if(type == 'm') {
    now.setDate(1)
  }
  else if(type == 'dt') {
    now.setHours(now.getHours()+tz)
    now.setDate(now.getDate()-1)
  }
  // d
  else if(type == 'd'){

  }

  let start = now.toISOString()
  return {start , end}
}

export default range