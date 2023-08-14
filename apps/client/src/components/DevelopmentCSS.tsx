export default function DevelopmentCSS() {
  if (
    import.meta.env.VITE_DEV_CSS === 'true' ||
    import.meta.env.VITE_DEV_CSS === true
  ) {
    return (
      <style>
        {`
          * {
            outline: 1px solid red;
          }

          *:hover {
            outline: 2px solid blue;
          }
        `}
      </style>
    )
  }

  return null
}
