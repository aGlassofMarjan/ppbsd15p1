function reversedDate(date) {
  const data = new Date(date)
  const year = data.getFullYear()
  let month = data.getMonth() + 1
  let day = data.getDate()

  if (month < 10) {
    month = '0' + month;
  }

  if (day < 10) {
    day = '0' + day
  }
  
  return `${year}-${month}-${day}`
}

module.exports = reversedDate