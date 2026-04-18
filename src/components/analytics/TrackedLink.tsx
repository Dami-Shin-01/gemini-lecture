"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track } from "@/lib/analytics";

type Params = Record<string, string | number | boolean>;

type Props = Omit<ComponentProps<typeof Link>, "onClick"> & {
  event: string;
  eventParams?: Params;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export default function TrackedLink({ event, eventParams, onClick, ...linkProps }: Props) {
  return (
    <Link
      {...linkProps}
      onClick={(e) => {
        track(event, eventParams);
        onClick?.(e);
      }}
    />
  );
}
