
import React from 'react'
import RatingStars1 from './RatingStars1'
import { AiOutlineEdit } from 'react-icons/ai'


const Reviews = (props) => {

  const reviews = [
    {
      id: 1,
      postDate: "March, 15, 2022",
      author: "Laetitia Estelle",
      title: "Great stuff",
      review: "In rem ex sint numquam dolorum nobis officiis voluptatibus fugiat possimus non! Quasi molestias tempora deserunt laudantium voluptatum neque impedit, quae earum?",
      rating: 4,
    },
    
  ]

  const averageRating = reviews.reduce((total, currentReview) => total + currentReview.rating, 0) / reviews.length

  return (
    <div className="mx-auto py-8 px-4 w-5/6 max-w-7xl bg-white">
      
      {/* :HEADER */}
      <div className="pb-5 w-full border-b-2 border-gray-200">
        <h3 className="text-xl text-gray-700 font-semibold">Reviews</h3>
        <p className="mt-1.5 flex items-center">
          <span className="mr-2 text-gray-700 font-semibold">{`${averageRating.toFixed(1)}/5`}</span>
          <RatingStars1 rating={averageRating} spacing="spacing-x-0.5" />
        </p>
        <p onClick={()=>props.open()} className='my-3 w-fit  p-3 border rounded cursor-pointer text-grey-400 text-lg flex gap-1' >Write a review <AiOutlineEdit  size="25px" /> </p>
      </div>


      {/* :REVIEWS CONTAINER */}
      <div className="mt-2 border-b-2 border-gray-100">
        {reviews.map((review, index) => (
          <article key={review.id} className={`py-5 grid grid-cols-2 md:grid-cols-4 gap-4 ${index !== 0 && "border-t-2 border-gray-100"}`}>

            {/* ::Author & Date */}
            <div className="order-first col-span-full sm:col-span-1">
              <p className="mb-0.5 text-xs text-gray-500 font-medium">{review.postDate}</p>
              <p className="text-base text-black font-semibold">{review.author}</p>
            </div>

            {/* ::Rating */}
            <div className="order-last sm:order-2 col-span-full sm:col-span-1 space-y-1.5">
              <p className="text-sm text-gray-700 font-semibold">{`Rated: ${review.rating}/5`}</p>
              <RatingStars1 rating={review.rating} spacing="space-x-0.5" />
            </div>

            {/* ::Review */}
            <div className="order-2 sm:order-last col-span-2 sm:pl-4">
              {/* :::title */}
              <p className="text-base text-gray-700 font-semibold">{review.title}</p>
              {/* :::text */}
              <p className="mt-2 text-sm text-gray-500">{review.review}</p>
            </div>

          </article>
        ))
        }
      </div>

    </div>
  )
}

export default Reviews
