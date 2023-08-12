export default function DevelopmentCSS() {
  if (import.meta.env.VITE_DEV_CSS) {
    return (
      <style global jsx>
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
