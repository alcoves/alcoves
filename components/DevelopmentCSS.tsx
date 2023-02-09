export default function DevelopmentCSS() {
  const devJsx =
    process.env.NODE_ENV === 'development'
      ? `
* {
  outline: 1px solid red;
}

*:hover {
  outline: 2px solid blue;
}
`
      : ''

  return (
    <style global jsx>
      {devJsx}
    </style>
  )
}
