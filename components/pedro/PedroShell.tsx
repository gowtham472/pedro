import clsx from "clsx";

export function PedroShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-8 sm:py-10", className)}>{children}</div>
  );
}
