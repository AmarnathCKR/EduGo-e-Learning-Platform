
import React from 'react'


const RatingStars1 = ({ rating, size = "w-4 h-4", color = "text-yellow-400", spacing = "space-x-1" }) => {

  const starsNumber = Math.floor(rating)
  const isHalfStar = !Number.isInteger(rating)
  const emptyStars = 5 - Math.ceil(rating)

  return (
    <span className={`flex items-center ${spacing}`}>
      {/* full stars */}
      {[...Array(starsNumber)].map((_, index) =>(
        <span key={index} className="flex-shrink-0">
          <svg className={`${size} ${color} fill-current`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
        </span>
      ))
      }
      {/* half star */}
      {isHalfStar &&
        <span className="flex-shrink-0">
          <svg className={`${size} ${color} fill-current`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 5.173l2.335 4.817 5.305.732-3.861 3.71.942 5.27-4.721-2.524v-12.005zm0-4.586l-3.668 7.568-8.332 1.151 6.064 5.828-1.48 8.279 7.416-3.967 7.416 3.966-1.48-8.279 6.064-5.827-8.332-1.15-3.668-7.569z"/></svg>
        </span>
      }
      {/* empty stars */}
      {[...Array(emptyStars)].map((_, index) =>(
        <span key={index} className="flex-shrink-0">
          <svg className={`${size} ${color} fill-current`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 5.173l2.335 4.817 5.305.732-3.861 3.71.942 5.27-4.721-2.524-4.721 2.525.942-5.27-3.861-3.71 5.305-.733 2.335-4.817zm0-4.586l-3.668 7.568-8.332 1.151 6.064 5.828-1.48 8.279 7.416-3.967 7.416 3.966-1.48-8.279 6.064-5.827-8.332-1.15-3.668-7.569z"/></svg>
        </span>
      ))
      }
    </span>
  )
}

export default RatingStars1