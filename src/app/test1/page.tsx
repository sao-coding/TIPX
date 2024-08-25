'use client'

import React from 'react'
// http://localhost:3000/api/color-get?url=https://cdn.sao-x.com/cover/003.webp
const Test1Page = () => {
  const [url, setUrl] = React.useState('')
  const [color, setColor] = React.useState('')

  React.useEffect(() => {
    const fetchColor = async () => {
      const res = await fetch(`/api/color-get?url=${url}`)
      const data = await res.json()
      setColor(data.color)
    }
    fetchColor()
  }, [url])

  return (
    <div>
      <h1>Test1Page</h1>
      <input
        type='text'
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder='Enter image URL'
      />
      顯示主色:
      <div
        style={{
          width: '100px',
          height: '100px',
          backgroundColor: color
        }}
      ></div>
    </div>
  )
}

export default Test1Page
