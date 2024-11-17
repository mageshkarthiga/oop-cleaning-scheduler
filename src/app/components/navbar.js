'use client'
import { useState } from 'react'
import { PopoverGroup } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="bg-white mb-10">
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img
                            alt=""
                            src="https://i0.wp.com/homecleaningsg.com/wp-content/uploads/2022/12/header-logo.webp?fit=249%2C47&ssl=1"
                            className="h-10 w-auto"
                        />
                    </a>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                    </button>
                </div>
                <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                    <Link href="/contract/summary" className="font-semibold leading-6 text-gray-900">Contracts</Link>
                    <Link href="/calendar/admin" className="font-semibold leading-6 text-gray-900">Calendar</Link>
                    <Link href="/client/summary" className="font-semibold leading-6 text-gray-900">Clients</Link>
                    <Link href="/leave/worker/form" className="font-semibold leading-6 text-gray-900">Leave Application</Link>
                    <Link href="/leave/admin" className="font-semibold leading-6 text-gray-900">Leave Approval</Link>
                </PopoverGroup>
            </nav>
        </header>
    )
}