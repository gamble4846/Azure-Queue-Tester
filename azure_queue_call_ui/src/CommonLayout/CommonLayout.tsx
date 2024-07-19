import React from 'react'
import Header from './Header/Header'
import { Outlet } from 'react-router-dom'

type Props = {}

const CommonLayout = (props: Props) => {
    return (
        <div className="App">
            <div className="top">
                <Header />
            </div>
            <div className="main">
                <Outlet />
            </div>
        </div>
    )
}

export default CommonLayout