// 'use client';
// import Image from 'next/image';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';
// import Logo from "../../../public/wace.png"


// import {
//   NavigationMenu,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
//   navigationMenuTriggerStyle,
// } from '@/components/ui/navigation-menu';
// import { cn } from '@/lib/utils';
// import { Button } from '../ui/button';
// // import { signOut, useSession } from 'next-auth/react';
// import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';

// const routes = [
//   { title: 'How It Works', href: '/working-process' },
//   { title: 'Tell Us About Yourself', href: '/about-yourself' },
//   { title: 'Share Your Skills', href: '/your-skills' },
//   { title: 'Budget Interests', href: '/budget-interests' },
//   { title: 'Target Demographics', href: '/target-demographics' },

// ];

// const components: { title: string; href: string; description: string }[] = [
//   {
//     title: 'Alert Dialog',
//     href: '#',
//     description:
//       'A modal dialog that interrupts the user with important content and expects a response.',
//   },
//   {
//     title: 'Hover Card',
//     href: '#',
//     description:
//       'For sighted users to preview content available behind a link.',
//   },
//   {
//     title: 'Progress',
//     href: '#',
//     description:
//       'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
//   },
//   {
//     title: 'Scroll-area',
//     href: '#',
//     description: 'Visually or semantically separates content.',
//   },
//   {
//     title: 'Tabs',
//     href: '#',
//     description:
//       'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
//   },
//   {
//     title: 'Tooltip',
//     href: '#',
//     description:
//       'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
//   },
// ];

// const Header = () => {
//   // const { data: session } = useSession();
//   const [path, setPath] = useState('#products');
//   const { user:session } = useSupabaseUser();  
//   return (
//     <header
//       className="p-4
//       flex
//       justify-center
//       items-center
//   "
//     >
//       <Link
//         href={'/'}
//         className="w-full flex gap-2
//         justify-left items-center"
//       >
//         <Image
//           src={Logo}
//           alt="Logo"
//           width={80} height={100}
//         />
//         <span
//           className="font-semibold
//           dark:text-white text-3xl
//         "
//         >
//           Wace
//         </span>
//       </Link>


//       <NavigationMenu className="hidden md:block">
//         <NavigationMenuList className="gap-6">
//           <NavigationMenuItem>
//             <NavigationMenuTrigger
//               onClick={() => setPath('/working-process')}
//               className={cn({
//                 'dark:text-white': path === '#resources',
//                 'dark:text-white/40': path !== '#resources',
//                 'font-normal': true,
//                 'text-lg': true,
//               })}
//             >
//               How It Works
//             </NavigationMenuTrigger>

//           </NavigationMenuItem>
//           <NavigationMenuItem>
//             <NavigationMenuTrigger
//               onClick={() => setPath('/')}
//               className={cn({
//                 'dark:text-white': path === '/your-skills',
//                 'dark:text-white/40': path !== '/your-skills',
//                 'font-normal': true,
//                 'text-lg': true,
//               })}
//             >
//               Share Your Skills
//             </NavigationMenuTrigger>

//           </NavigationMenuItem>
//           <NavigationMenuItem>

//           </NavigationMenuItem>
//           <NavigationMenuItem>
//             <NavigationMenuLink
//               className={cn(navigationMenuTriggerStyle(), {
//                 'dark:text-white': path === '/budget-interests',
//                 'dark:text-white/40': path !== '/budget-interests',
//                 'font-normal': true,
//                 'text-lg': true,
//               })}
//             >
//               Budget Interest
//             </NavigationMenuLink>
//           </NavigationMenuItem>

//           <NavigationMenuItem>
//             <NavigationMenuLink
//               className={cn(navigationMenuTriggerStyle(), {
//                 'dark:text-white': path === '/target-demographics',
//                 'dark:text-white/40': path !== '/target-demographics',
//                 'font-normal': true,
//                 'text-lg': true,
//               })}
//             >
//               Target Demographics
//             </NavigationMenuLink>
//           </NavigationMenuItem>


//         </NavigationMenuList>
//       </NavigationMenu>

//       <aside
//         className="flex
//         w-full
//         gap-2
//         justify-end
//       "
//       >
//         {session === null ? <>
//           <Link href={'/login'}>
//             <Button
//               variant="btn-secondary"
//               className=" p-1 hidden sm:block"
//             >
//               Login
//             </Button>
//           </Link>
//           <Link href="/signup">
//             <Button
//               variant="btn-secondary"
//               className=" p-1 hidden sm:block"
//             >
//               Sign Up
//             </Button>
//           </Link>

//         </>
//           :
//           <>

//             <Button
//               onClick={() => {
//                 signOut();
//               }}
//               variant="btn-secondary"
//               className=" p-1 hidden sm:block"
//             >
//               Logout
//             </Button>

//           </>
//         }
//         <Link href="/chatbot">
//           <Button
//             variant="btn-secondary"
//             className=" p-1 hidden sm:block"
//           >
//             Dashboard
//           </Button>
//         </Link>
//       </aside>

//     </header>
//   );
// };

// export default Header;
