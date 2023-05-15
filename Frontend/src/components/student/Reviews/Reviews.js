
import React, { useEffect, useState } from 'react'
import RatingStars1 from './RatingStars1'
import { AiOutlineEdit } from 'react-icons/ai'
import { getAnyDataStudentAPI } from '../../../api/studentAPI'
import { useSelector } from 'react-redux'


const Reviews = (props) => {
  const [reviews, setReview] = useState()
  const [averageRating, setAvg] = useState(null)
  const [own, setOwn] = useState()
  const auth = useSelector((state) => state.studentToken);
  const [trigger, setTrigger] = useState(false)

  useEffect(() => {
    if (!props?.browse) {
      getAnyDataStudentAPI(`get-my-review?reviewId=${props?.course}`, auth).then((result) => {
        setOwn(result.data)
      }).catch((err) => {
        console.log(err)
        setOwn()
      })
    }

    getAnyDataStudentAPI(`get-review?reviewId=${props?.course}`, auth)
      .then((res) => {
        setReview(res.data)
        const value = res.data.reduce((total, currentReview) => total + currentReview.rating, 0) / res.data.length;
        setAvg(value)
      }).catch((err) => {
        console.log(err)
        setReview()
        setAvg(null)
      })

  }, [props?.review, trigger])

  const handleDelete = () => {
    getAnyDataStudentAPI(`delete-review?reviewId=${own?._id}`, auth).then((res) => {

      setTrigger(!trigger)
    }).catch((err) => {
      console.log(err)

      setTrigger(!trigger)
    })
  }




  return (
    <>
      {
        reviews ? <div className={`mx-auto py-8 px-4 ${props?.browse ? "w-full" : "w-5/6"} max-w-7xl bg-white`}>

          {/* :HEADER */}
          < div className="pb-5 w-full border-b-2 border-gray-200">
            <h3 className="text-xl text-gray-700 font-semibold">Reviews</h3>
            <p className="mt-1.5 flex items-center">
              <span className="mr-2 text-gray-700 font-semibold">{`${averageRating?.toFixed(1)}/5`}</span>
              {averageRating && <RatingStars1 rating={averageRating} spacing="spacing-x-0.5" />}
            </p>
            {!props?.browse && <div className=' border-double bg-white flex justify-center'>
              {!own ? <p onClick={() => props.open()} className='my-3 w-fit  p-3 border rounded cursor-pointer text-grey-400 text-lg flex gap-1' >Write a review <AiOutlineEdit size="25px" /> </p> : <>
                <article key={own.id} className={`py-5 grid md:w-3/4 md:mx-0 mx-3 grid-cols-2 md:grid-cols-5 gap-4 border-gray-100`}>

                  {/* ::Author & Date */}
                  <div className="order-first col-span-full sm:col-span-1">
                    <p className="mb-0.5 text-xs text-gray-500 font-medium">{new Date(own?.createdAt).toLocaleDateString('en-GB')}</p>
                    <p className="text-base text-black font-semibold">Your Review</p>
                  </div>

                  {/* ::Rating */}
                  <div className="order-2 sm:order-2 col-span-full sm:col-span-1 space-y-1.5">
                    <p className="text-sm text-gray-700 font-semibold">{`Rated: ${own?.rating}/5`}</p>
                    <RatingStars1 rating={own?.rating} spacing="space-x-0.5" />
                  </div>

                  {/* ::own */}
                  <div className="order-3 sm:order-3 col-span-2 sm:pl-4">
                    {/* :::title */}
                    <p className="text-base text-gray-700 font-semibold">{own?.title}</p>
                    {/* :::text */}
                    <p className="mt-2 text-sm text-gray-500">{own?.review}</p>
                  </div>
                  <div className="order-4 sm:order-last col-span-1 sm:pl-4"><button onClick={handleDelete} className='bg-black p-2 rounded text-sm text-white'>Delete Review</button></div>

                </article>
              </>}
            </div>}
          </div >


          {/* :REVIEWS CONTAINER */}
          < div className="mt-2 border-b-2 w-full border-gray-100 bg-neutral-50" >
            {reviews?.map((review, index) => (
              <article key={review.id} className={`py-5 w-full grid grid-cols-2 md:grid-cols-4 gap-4 ${index !== 0 && "border-t-2 border-gray-100"}`}>

                {/* ::Author & Date */}
                <div className="order-first col-span-full sm:col-span-1">
                  <p className="mb-0.5 text-xs text-gray-500 font-medium">{new Date(review?.createdAt).toLocaleDateString('en-GB')}</p>
                  <p className="text-base text-black font-semibold">{review?.student?.name}</p>
                </div>

                {/* ::Rating */}
                <div className="order-last sm:order-2 col-span-full sm:col-span-1 space-y-1.5">
                  <p className="text-sm text-gray-700 font-semibold">{`Rated: ${review?.rating}/5`}</p>
                  <RatingStars1 rating={review?.rating} spacing="space-x-0.5" />
                </div>

                {/* ::Review */}
                <div className="order-2 sm:order-last col-span-2 sm:pl-4">
                  {/* :::title */}
                  <p className="text-base text-gray-700 font-semibold">{review?.title}</p>
                  {/* :::text */}
                  <p className="mt-2 text-sm text-gray-500">{review?.review}</p>
                </div>

              </article>
            ))
            }
          </div >

        </div >
          : <>{!props.browse && <><p className="text-center text-xl font-semibold mt-10 mb-5">No review Found</p>
          <div className="flex justify-center">
            <p onClick={() => props.open()} className='my-3 w-fit  p-3 border rounded cursor-pointer text-grey-400 text-lg flex gap-1' >Write a review <AiOutlineEdit size="25px" /> </p>

          </div></> }</>
      }
    </>

  )
}

export default Reviews
