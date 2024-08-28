import React from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/common/Footer'

const Error = () => {
  return (
    <section className="p-[0px] bg-white pt-[10px] ">
      <div>
        <div>
          <div>
            <div className="text-center">
              <div className="h-[550px] bg-center bg-no-repeat bg-[url(https://media1.tenor.com/m/cXf2I0FVwhIAAAAC/qoobee-laptop.gif)] ">
                <h1 className="text-center text-6xl font-extrabold text-black ">404</h1>
              </div>

              <div className="-mt-12 ">
                <h3 className="text-4xl mb-1 ">
                  Oops...
                </h3>

                <p className='text-lg'>Sorry, page not found! Return to the Homepage</p>

                <Link to='/'
                  className=" py-[13px] px-10 text-lg bg-brown-50 hover:bg-yellow-25 my-5 inline-block rounded-md font-normal duration-300"
                >
                  Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


export default Error;