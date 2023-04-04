export default function DevelopmentCSS() {
	if (process.env.NEXT_PUBLIC_DEV_CSS === "true") {
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
		);
	}

	return null;
}
