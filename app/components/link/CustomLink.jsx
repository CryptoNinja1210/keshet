"use client"
import Link from "next/link";

export const CustomLink = ({children, href}) => {
    return (
        <Link
         className="-mx-3 block rounded-lg px-3 py-2.5 text-base leading-7 text-gray-900 hover:font-semibold"
          href={href}>{children}</Link>
    )
}