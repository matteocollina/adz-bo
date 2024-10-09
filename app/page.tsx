import {Button, NextUIProvider} from "@nextui-org/react";

export default function App({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NextUIProvider>
        {children}
    </NextUIProvider>
  )
}