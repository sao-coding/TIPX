const getCurrentYearSem = () => {
  // 判斷學年度
  let currentYear = ""
  let currentSem = ""
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  // console.log("year", year)
  // console.log("month", month)
  if (month >= 8) {
    // console.log("cookie_year", year - 1911)
    currentYear = String(year - 1911)
  } else {
    // console.log("cookie_year", year - 1912)
    currentYear = String(year - 1912)
  }
  // 判斷上下學期
  // year 8 ~ 12 || year+1 1 ~ 2
  // year 2 ~ 7
  if (month >= 8 || month <= 1) {
    // console.log("cookie_sem", 1)
    currentSem = "1"
  } else {
    // console.log("cookie_sem", 2)
    currentSem = "2"
  }

  return {
    currentYear,
    currentSem
  }
}

export default getCurrentYearSem
