"use client"
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState, store } from '../../redux';
import { SignOutButton,SignInButton } from '../../firebase';
import {CustomLink} from '../link/CustomLink'
import './Navbar.css'

export const Navbar = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const handleGetState = () => {
    console.log(store.getState().auth)
 }

  return (
    <header className='sticky pb-10 inset-x-0 top-0 z-50 '>
    <nav className="flex items-center justify-between p-6 pd-20 lg:px-8" aria-label="Global">
        <Link className=' link text-2xl  font-bold text-green-500' href='/'>
          <img
              className="h-8 w-auto"
              src="/logo-black.svg"
              alt=""
          />
        </Link>
        <CustomLink href="/">click</CustomLink>
        <CustomLink href='/chat'>Genie</CustomLink>
        {isLoggedIn ? (
        <>
        <SignOutButton/>
        <CustomLink href="/subscription">subscribe</CustomLink>
        </>
        ) : <SignInButton/>}
    </nav>
    </header>
    
  );
};

