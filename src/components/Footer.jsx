import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className='bg-background border-t border-red-600 rounded-full px-4 py-4 md:px-6 flex items-center justify-between'>
            <p className='font-semibold text-white text-center mx-auto'>© 2024 {' '}
                <Link to={"/"}>
                    <span className='bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent font-bold'>AI Playground
                        </span> - {' '}
                </Link>
                Made with Love by {' '}
                <span className='bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent font-bold'>Krish Panchani</span>
            </p>
        </footer>
    )
}
