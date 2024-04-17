import { Button } from "../components/ui/button"
import type { MetaFunction } from "@remix-run/node";
import { ModeToggle } from "../components/mode-toggle";

export const meta: MetaFunction = () => {
  return [
    { title: "Alcoves" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div>


    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
     <Button>Click me</Button>
     <ModeToggle/>
    </div>
  );
}
