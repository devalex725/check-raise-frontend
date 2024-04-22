import React from 'react';

import { Link } from 'react-router-dom';

const AnonymousList = (props) => {

    // let description = props.data.registered
    //     &&
    //     props.data.registered.data.filter(function (item) {

    //         return item.displayoption === 'anonymous';
    //     });
    // console.log(props)

    return (
        <>

            <ol className='players-list'>
                <h3 className="text-center mt-5">Anonymous Player</h3>
                {
                    props.data && props.data.map((element, index) => {
                        return (
                            <li>
                                <Link to="#"> {index + 1}. </Link>
                                <Link>{element.firstname} {element.lastname}</Link>
                            </li>
                        )
                    })
                }
                {/* {

                    props.data.map(
                        function (item, index) {
                            return (
                                // item.displayoption === "anonymous" ?
                                    <li>
                                        <Link to="#"> {index + 1}.</Link>
                                        <Link>{item.firstname} {item.lastname}</Link>
                                    </li>
                                    // :
                                    // <></>
                            )
                        })

                } */}

            </ol>

        </>
    );
};

export default AnonymousList;