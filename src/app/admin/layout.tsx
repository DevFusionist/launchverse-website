"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import ThemeToggle from "@/components/theme/ThemeToggle";

const adminNavigation = [
  { name: "Dashboard", href: "/admin" },
  { name: "Students", href: "/admin/students" },
  { name: "Courses", href: "/admin/courses" },
  { name: "Certificates", href: "/admin/certificates" },
];

const superAdminNavigation = [
  { name: "Dashboard", href: "/admin" },
  { name: "Admins", href: "/admin/admins" },
  { name: "Students", href: "/admin/students" },
  { name: "Courses", href: "/admin/courses" },
  { name: "Certificates", href: "/admin/certificates" },
  { name: "Settings", href: "/admin/settings" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session && pathname !== "/admin/login") {
    return null;
  }

  if (pathname === "/admin/login") {
    return (
      <div
        className="min-h-screen bg-neon-background-light dark:bg-neon-background-dark transition-colors duration-200"
        suppressHydrationWarning
      >
        {children}
      </div>
    );
  }

  const navigation =
    session?.user?.role === "super_admin"
      ? superAdminNavigation
      : adminNavigation;

  return (
    <div
      className="min-h-full bg-neon-background-light dark:bg-neon-background-dark transition-colors duration-200"
      suppressHydrationWarning
    >
      <Disclosure
        as="nav"
        className="bg-neon-card-light/80 dark:bg-neon-card-dark/80 backdrop-blur-sm shadow-neon-sm transition-colors duration-200"
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link
                      href="/admin"
                      className="text-xl font-bold text-neon-text-light dark:text-neon-text-dark transition-colors duration-200"
                    >
                      Launch Verse Academy
                      {session?.user?.role === "super_admin" && (
                        <span className="ml-2 text-sm text-neon-primary dark:text-neon-primary-dark">
                          (Super Admin)
                        </span>
                      )}
                    </Link>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            pathname === item.href
                              ? "bg-neon-primary/10 dark:bg-neon-primary-dark/10 text-neon-primary dark:text-neon-primary-dark"
                              : "text-neon-text-light dark:text-neon-text-dark hover:bg-neon-primary/5 dark:hover:bg-neon-primary-dark/5 hover:text-neon-primary dark:hover:text-neon-primary-dark",
                            "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <ThemeToggle />
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="flex max-w-xs items-center rounded-full bg-neon-card-light dark:bg-neon-card-dark text-sm focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark focus:ring-offset-2 focus:ring-offset-neon-background-light dark:focus:ring-offset-neon-background-dark">
                            <span className="sr-only">Open user menu</span>
                            <UserCircleIcon
                              className="h-8 w-8 text-neon-text-light/80 dark:text-neon-text-dark/80"
                              aria-hidden="true"
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-neon-card-light dark:bg-neon-card-dark py-1 shadow-neon-sm ring-1 ring-neon-primary/10 dark:ring-neon-primary-dark/10 focus:outline-none">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => signOut()}
                                  className={classNames(
                                    active
                                      ? "bg-neon-primary/5 dark:bg-neon-primary-dark/5"
                                      : "",
                                    "block w-full px-4 py-2 text-left text-sm text-neon-text-light dark:text-neon-text-dark"
                                  )}
                                >
                                  Sign out
                                </button>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-neon-card-light dark:bg-neon-card-dark p-2 text-neon-text-light/80 dark:text-neon-text-dark/80 hover:bg-neon-primary/5 dark:hover:bg-neon-primary-dark/5 hover:text-neon-primary dark:hover:text-neon-primary-dark focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark focus:ring-offset-2 focus:ring-offset-neon-background-light dark:focus:ring-offset-neon-background-dark">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? "bg-neon-primary/10 dark:bg-neon-primary-dark/10 text-neon-primary dark:text-neon-primary-dark"
                        : "text-neon-text-light/80 dark:text-neon-text-dark/80 hover:bg-neon-primary/5 dark:hover:bg-neon-primary-dark/5 hover:text-neon-primary dark:hover:text-neon-primary-dark",
                      "block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200"
                    )}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="border-t border-neon-primary/10 dark:border-neon-primary-dark/10 pb-3 pt-4">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <UserCircleIcon
                      className="h-8 w-8 text-neon-text-light/80 dark:text-neon-text-dark/80"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-neon-text-light dark:text-neon-text-dark">
                      {session?.user?.name}
                    </div>
                    <div className="text-sm font-medium text-neon-text-light/60 dark:text-neon-text-dark/60">
                      {session?.user?.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <Disclosure.Button
                    as="button"
                    onClick={() => signOut()}
                    className="block w-full rounded-md px-3 py-2 text-base font-medium text-neon-text-light/80 dark:text-neon-text-dark/80 hover:bg-neon-primary/5 dark:hover:bg-neon-primary-dark/5 hover:text-neon-primary dark:hover:text-neon-primary-dark transition-colors duration-200"
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 text-neon-text-light dark:text-neon-text-dark">
          {children}
        </div>
      </main>
    </div>
  );
}
