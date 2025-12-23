import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as FaIcons6 from 'react-icons/fa6';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as Io5Icons from 'react-icons/io5';
import * as BsIcons from 'react-icons/bs';
import * as MdIcons from 'react-icons/md';
export const SidebarData = [
  {
    title: 'Home',
    path: '/home',

    //icon: <AiIcons.AiFillHome style={{ color: 'black' }} />,
    cName: 'nav-text'
  },
  {
    title: 'Chats',
    path: '/chat',
    
    //icon: <IoIcons.IoMdChatbubbles style={{ color: 'black' }} />,
    cName: 'nav-text'
  },
  {
    title: 'Bookings',
    path: '/search',
    //icon: <BsIcons.BsCalendar2WeekFill style={{ color: 'black' }} />,
    cName: 'nav-text'
  },
  {
    title: 'Subscriptions',
    path: '/subscription',
    //icon: <FaIcons6.FaMoneyBillTransfer  style={{ color: 'black' }} />,
    cName: 'nav-text'
  },
  {
    title: 'Settings',
    path: '/setting',
    //icon: <Io5Icons.IoSettingsSharp style={{ color: 'black' }} />,
    cName: 'nav-text'
  },
  {
    title: 'Support',
    path: '/terms',
   
    //icon: <IoIcons.IoMdHelpCircle style={{ color: 'black' }} />,
    cName: 'nav-text'
  },
  {
    title: 'Profile',
    path: '/profile',
  
    //icon: <FaIcons6.FaCircleUser style={{ color: 'black' }} />,
    cName: 'nav-text'
  }
];