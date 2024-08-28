import React, { useState, useEffect } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { NavbarLinks } from "../../data/navbar-links"
import codeBuddyLogo from '../../assets/Logo/buddyLogo.png'
import { categories } from '../../sevices/apis'
import { fetchCourseCategories } from '../../sevices/operations/courseDetailsAPI';

// import LargeProfileDropDown from '../core/Auth/LargeProfileDropDown'
// import SmallProfileDropDown from '../core/Auth/SmallProfileDropDown'

import { AiOutlineShoppingCart } from "react-icons/ai"
import { MdKeyboardArrowDown } from "react-icons/md"
// import { apiConnector } from '../../services/apiconnector'


const Navbar = () => {
    
    // required hooks
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart)
    const location = useLocation();

    const [subLinks, setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSublinks = async () => {
        try {
            setLoading(true)
            const res = await fetchCourseCategories();
            
            setSubLinks(res);

            // const result = await apiConnector("GET", categories.CATEGORIES_API);
            // setSubLinks(result.data.data);
        }
        catch (error) {
            console.log("Could not fetch the category list", error);
            console.log(error);
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchSublinks();
    }, [])

    // when user click Navbar link then it will hold yellow color
    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    }

    // when user scroll down , we will hide navbar , and if suddenly scroll up , we will show navbar 
    const [showNavbar, setShowNavbar] = useState('top');
    const [lastScrollY, setLastScrollY] = useState(0);
    useEffect(() => {
        window.addEventListener('scroll', controlNavbar);

        return () => {
            window.removeEventListener('scroll', controlNavbar);
        }
    },)

    // control Navbar
    const controlNavbar = () => {
        if (window.scrollY > 200) {
            if (window.scrollY > lastScrollY)
                setShowNavbar('hide')

            else setShowNavbar('show')
        }

        else setShowNavbar('top')

        setLastScrollY(window.scrollY);
    }

    return (
        <nav className={`z-[10] flex h-14 w-full items-center justify-center border-b-[1px] border-b-richblack-700 text-white translate-y-0 transition-all ${showNavbar} `}>
    
            <div className='flex w-11/12 max-w-maxContent items-center justify-between '>

                {/* logo */}
                <Link to="/">
                    <img 
                        src={codeBuddyLogo} 
                        width={160} 
                        height={60} 
                        loading="lazy"
                    />
                </Link>

                {/* NavLinks */}
                <ul className='hidden sm:flex gap-x-6 text-richblack-25'>
                    {
                        NavbarLinks.map((link, index) => (
                            <li key={index}>
                                {
                                    link.title === "Catalog" ? (
                                        <div
                                            className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/catalog/:catalogName")
                                                ? "bg-yellow-25 text-black rounded-xl p-1 px-3"
                                                : "text-richblack-25 rounded-xl p-1 px-3"
                                            }`}>
                                            <p>{link?.title}</p>

                                            <MdKeyboardArrowDown />

                                            {/* drop down menu */}
                                            <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] 
                                                flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible 
                                                group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                                    
                                                {/* curve part */}
                                                <div 
                                                    className="absolute left-[50%] top-0 z-[100] h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5">
                                                </div>

                                                {/* {
                                                    loading ? (<p className="text-center ">Loading...</p>)
                                                    : subLinks?.length 
                                                    ? (
                                                        <>
                                                            {
                                                                subLinks?.map((subLink, i) => (
                                                                    <Link
                                                                        to={`/catalog/${subLink?.name
                                                                            .split(" ")
                                                                            .join("-")
                                                                            .toLowerCase()}`}
                                                                        className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                                                        key={i}
                                                                    >
                                                                        <p>{subLink?.name}</p>
                                                                    </Link>
                                                                ))
                                                            }
                                                        </>
                                                    ) 
                                                    : (
                                                        <p className="text-center">No Courses Found</p>
                                                    )
                                                } */}


                                                {
                                                    loading ? (<p className="text-center ">Loading...</p>)
                                                    : subLinks.length ? (
                                                        subLinks.map( (subLink, index) => (
                                                            <Link className='rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50' to={`catalog/${subLink.name}`} key={index}>
                                                                <p>{subLink.name}</p>
                                                            </Link>
                                                        ) )
                                                    ) 
                                                    // : (<span className="loader"></span>)
                                                    : (
                                                        <p className="text-center">No Courses Found</p>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    ) 
                                    
                                    :(
                                        <Link to={link?.path}>
                                            <p className={`${matchRoute(link?.path) 
                                                ? "bg-yellow-25 text-black" 
                                                : "text-richblack-25"} rounded-md p-1 px-3 `} >
                                                {link.title}
                                            </p>
                                        </Link>
                                    )
                                }
                            </li>
                        ))
                    }
                </ul>

                {/* Login, SignUp, Dashboard */}
                <div className='flex gap-x-4 items-center'>
                    {
                        user && user?.accountType !== "Instructor" && (
                            <Link to="/dashboard/cart" className="relative">
                                
                                <AiOutlineShoppingCart className="text-[2.35rem] text-richblack-5 hover:bg-richblack-700 rounded-full p-2 duration-200" />
                                {
                                    totalItems > 0 && (
                                        <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                            {totalItems}
                                        </span>
                                    )
                                }
                            </Link>
                        )
                    }

                    {
                        token === null && (
                            <Link to="/login">

                                <button className={` px-[12px] py-[8px] text-richblack-100 rounded-md 
                                    ${matchRoute('/login') ? 'border-[2.5px] border-yellow-50' : 'border border-richblack-700 bg-richblack-800'} `}>
                                    Log in
                                </button>

                            </Link>
                        )
                    }
                    {
                        token === null && (
                            <Link to="/signup">
                            
                                <button className={` px-[12px] py-[8px] text-richblack-100 rounded-md 
                                 ${matchRoute('/signup') ? 'border-[2.5px] border-yellow-50' : 'border border-richblack-700 bg-richblack-800'} `}
                                >
                                    Sign Up
                                </button>
                            </Link>
                        )
                    }

                    {/* Large devices */}
                    {/* {token !== null && <LargeProfileDropDown />} */}

                    {/* Small devices */}
                    {/* {token !== null && <SmallProfileDropDown />} */}

                </div>
            </div>
        </nav>
    )
};

export default Navbar;














// import React, { useEffect } from 'react'
// import logo from "../../assets/Logo/Logo-Full-Light.png"
// import { Link, matchPath } from 'react-router-dom'
// import {NavbarLinks} from "../../data/navbar-links"
// import { useLocation } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import {AiOutlineShoppingCart} from "react-icons/ai"
// import ProfileDropDown from '../core/Auth/ProfileDropDown'
// import { apiConnector } from '../../services/apiconnector'
// import { categories } from '../../services/apis'
// import { useState } from 'react'
// import {IoIosArrowDown} from "react-icons/io"
// import {RxHamburgerMenu} from "react-icons/rx"
// import './loader.css'
// // Ḍemo temporary data
// // const subLinks = [
// //     {
// //         title: "Python",
// //         link:"/catalog/python"
// //     },
// //     {
// //         title: "Web Dev",
// //         link:"/catalog/web-development"
// //     },
// // ];

// const Navbar = () => {
//     // console.log("Printing base url: ",process.env.REACT_APP_BASE_URL);
    
//     const {token} = useSelector((state)=> state.auth);
//     // console.log("token in Navbar is",token)
//     const {user} = useSelector((state)=> state.profile);
//     // console.log("User in Navbar is",user)
//     const {cart} = useSelector((state)=> state.cart);
//     const {totalItems} = useSelector((state)=> state.cart);
//     const location = useLocation();

//     const [subLinks, setSubLinks]  = useState([]);

//     const fetchSublinks = async() => {
//         try{
//             const result = await apiConnector("GET", categories.CATEGORIES_API);
//             // console.log("Printing Sublinks result:" , result);
//             setSubLinks(result.data.data);
//         }
//         catch(error) {
//             console.log("Could not fetch the category list");
//         }
//     }

    
//     useEffect( () => {
//         fetchSublinks();
//     },[] )

//     const matchRoute = (route) => {
//         return matchPath({path:route}, location.pathname);
//     }
    
//   return (
//     <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
//       <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
//         {/* Image */}
//       <Link to="/">
//         <img src={logo} width={160} height={42} loading='lazy'/>
//       </Link>

//       {/* Nav Links */}
//       <nav>
//         <ul className=' hidden md:flex gap-x-6 text-richblack-25'>
//         {
//             NavbarLinks.map( (link, index) => (
//                  <li key={index}>
//                     {
//                         link.title === "Catalog" ? (
//                             <div className='relative flex items-center gap-2 group'>
//                                 <p>{link.title}</p>
//                                 <IoIosArrowDown/>

//                                 <div className={`invisible absolute left-[50%] 
//                                     translate-x-[-49%] ${subLinks.length ? "translate-y-[15%]" : "translate-y-[40%]"}
//                                  top-[50%] z-50 
//                                 flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
//                                 opacity-0 transition-all duration-200 group-hover:visible
//                                 group-hover:opacity-100 lg:w-[300px]`}>

//                                 <div className='absolute left-[50%] top-0
//                                 translate-x-[80%]
//                                 translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5'>
//                                 </div>

//                                 {
//                                     subLinks.length ? (
//                                             subLinks.map( (subLink, index) => (
//                                                 <Link className='rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50' to={`catalog/${subLink.name}`} key={index}>
//                                                     <p>{subLink.name}</p>
//                                                 </Link>
//                                             ) )
//                                     ) : (<span className="loader"></span>)
//                                 }

//                                 </div>


//                             </div>

//                         ) : (
//                             <Link to={link?.path}>
//                                 <p className={`${ matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
//                                     {link.title}
//                                 </p>
                                
//                             </Link>
//                         )
//                     }
//                 </li>
//              ) )
//         }

//         </ul>
//       </nav>

//         {/* Login/SignUp/Dashboard */}
//         <div className='hidden md:flex gap-x-4 items-center'>
//             {   
//                 user && user?.accountType != "Instructor" && (
//                     <Link to="/dashboard/cart" className='relative pr-2'>
//                         <AiOutlineShoppingCart className='text-2xl text-richblack-100 ' />
//                         {
//                             totalItems > 0 && (
//                                 <span className=' absolute -bottom-2 -right-0 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100'>
//                                     {totalItems}
//                                 </span>
//                             )
//                         }
//                     </Link>
//                 )
//             }
//             {
//                 token === null && (
//                     <Link to="/login">
//                         <button className='border  border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
//                             Log in
//                         </button>
//                     </Link>
//                 )
//             }
//             {
//                 token === null && (
//                     <Link to="/signup">
//                         <button  className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
//                             Sign Up
//                         </button>
//                     </Link>
//                 )
//             }
//             {
//                 token !== null && <ProfileDropDown />
//             }
            
//         </div>

//          <div className='mr-4 md:hidden text-[#AFB2BF] scale-150'>
//             <RxHamburgerMenu />  
//          </div>   
              
//       </div>
//     </div>
//   )
// }

// export default Navbar