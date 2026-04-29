import { useParams } from "react-router-dom" 
import { useState, useEffect, useContext } from "react"
import { getProductById } from "../api/products.mjs"
import LoadingSpinner from "../components/LoadingSpinner"
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import timeAgo from "../util/timeAgo";
import { AuthContext } from "../components/AuthContext";
import { postReview } from "../api/reviews.mjs";
import { useRef } from "react";

const RatingStars = ({ stars }) => {
  const rating = Number(stars)

  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center text-yellow-400 text-xl">
      {Array.from({ length: fullStars }).map((_, i) => (
        <IoIosStar key={`full-${i}`} />
      ))}

      {hasHalfStar && <IoIosStarHalf />}

      {Array.from({ length: emptyStars }).map((_, i) => (
        <IoIosStarOutline key={`empty-${i}`} />
      ))}
    </div>
  )
}

const StarRatingInput = ({ value = 0, onChange }) => {
  const [hoverValue, setHoverValue] = useState(null)

  const displayValue = hoverValue ?? value

  const fullStars = Math.floor(displayValue)
  const hasHalfStar = displayValue % 1 >= 0.5

  const handleSelect = (starValue) => {
    onChange(starValue)
  }

  return (
    <div className="flex items-center gap-1 text-xl">
      {Array.from({ length: 5 }).map((_, i) => {
        const starIndex = i + 1

        return (
          <div
            key={i}
            className="relative cursor-pointer"
            onMouseLeave={() => setHoverValue(null)}
          >
            {/* Left half (0.5) */}
            <div
              className="absolute left-0 top-0 h-full w-1/2 z-10"
              onMouseEnter={() => setHoverValue(starIndex - 0.5)}
              onClick={() => handleSelect(starIndex - 0.5)}
            />

            {/* Right half (1.0) */}
            <div
              className="absolute right-0 top-0 h-full w-1/2 z-10"
              onMouseEnter={() => setHoverValue(starIndex)}
              onClick={() => handleSelect(starIndex)}
            />

            {/* Star icon */}
            {starIndex <= fullStars ? (
              <IoIosStar className="text-yellow-400" />
            ) : starIndex - 0.5 === displayValue && hasHalfStar ? (
              <IoIosStarHalf className="text-yellow-400" />
            ) : (
              <IoIosStarOutline className="text-yellow-400" />
            )}
          </div>
        )
      })}

      {/* Numeric display */}
      <span className="ml-2 text-sm text-muted-foreground">
        {displayValue.toFixed(1)}
      </span>
    </div>
  )
}

const Reviews = ({ reviews }) => {

    if (!reviews || reviews.length == 0) {
        return (
            <div className="flex flex-col items-center gap-2 py-4">
                <h3 className="text-lg font-semibold text-gray-500"> No reviews yet. Be the first to review this product! </h3>
            </div>
        )
    }

    return (
        <ul className="flex flex-col max-h-full overflow-y-auto">
            {
                reviews.map(review => (
                    <li className="flex flex-col gap-y-2 border-b border-b-gray-400 py-4" key={review.id}>
                        <header className="flex flex-row items-center gap-x-2">
                            <span className="font-bold text-md"> {review.user.username } </span>
                            <RatingStars stars={review.stars} />
                            <span className="text-sm text-gray-300"> { timeAgo(review.createdAt) } </span>
                        </header>
                        <p className="text-sm text-gray-900" dangerouslySetInnerHTML={{__html: review.comment}}></p>
                    </li>
                ))
            }
        </ul>
    )
}

const AddReview = ({ productId, addReviewToList }) => {
    
    const [writingReview, setWritingReview] = useState(false)
    const [comment, setComment] = useState("")
    const [numberOfStars, setNumberOfStars] = useState(0.0)
    const [statusMessage, setStatusMessage] = useState("");
    const inputRef = useRef(null)

    async function handleSubmit(e) {
        e.preventDefault()

        // Sanitize review on the frontend
        const cleaned = comment.replace(/[<>"]/g, "");

        try {
            const res = await postReview(productId, cleaned, numberOfStars)
            console.log(res.data)
            addReviewToList(res.data)
            setWritingReview(false)
            setComment("")
        }
        catch(err) {
            setStatusMessage(err.response.data.error)
            console.error(err)
        }
    }

    useEffect(() => {
        setStatusMessage("")
        if (inputRef.current != null && writingReview)
        {
            inputRef.current.focus()
        }
    }, [writingReview])

    if (!writingReview) {
        return (
            <div className="flex flex-row items-center border-b border-b-gray-400 cursor-text" onClick={ () => setWritingReview(true) }>
                <p>Add Review</p>
            </div>
        )
    }

    return (
        <form className="flex flex-col items-stretch border-b border-b-gray-400 py-2" onSubmit={handleSubmit}>
            <textarea
                className="
                    w-full resize-none
                    text-md font-sans
                    border-b border-primary/40
                    bg-transparent
                    px-1 py-2 max-h-50 overflow-scroll
                    transition-all duration-200 ease-out
                    focus:border-b-2 focus:border-primary
                    focus:outline-none
                "
                rows={1}
                value={comment}
                onChange={(e) => {
                    const el = e.target
                    el.style.height = 'auto'
                    el.style.height = `${el.scrollHeight}px`
                    setComment(el.value)
                }}
                placeholder="Write your review..."
                ref={inputRef}
        />
            <nav className="flex flex-row justify-between items-center gap-2 py-2">
                <StarRatingInput value={numberOfStars} onChange={setNumberOfStars} />
                <div className="flex items-center gap-2">
                    <p className="text-red-500">{statusMessage}</p>
                    <button 
                        type="submit" 
                        className="bg-primary text-white px-4 py-2 rounded-full cursor-pointer"
                    >
                        Review
                    </button>
                    <button 
                        type="button" 
                        className="bg-text border-primary px-4 py-2 rounded-full cursor-pointer"
                        onClick={() => setWritingReview(false)}
                    >
                        Cancel
                    </button>
                </div>
            </nav>
        </form>
    )
}

export default function Product() {
    const { isAuthenticated } = useContext(AuthContext)
    const { productId } = useParams()
    const [product, setProduct] = useState(null)
    const [loadingProduct, setLoadingProduct] = useState(false)

    useEffect(() => {

        const fetchProduct = async () => {
            setLoadingProduct(true)
            try {
                const res = await getProductById(productId)
                setProduct(res.data)
            }
            catch (err) {
                console.error(err)
                alert("Oops! Something went wrong while fetching the product.")
            }
            finally {
                setLoadingProduct(false)
            }
        }

        fetchProduct()
        
    }, [productId])

    const addReviewToList = (review) => {
        setProduct(prev => ({
            ...prev,
            reviews: [review, ...prev.reviews],
        }))
    }

    return (
        <div className="page-wrapper flex flex-col items-center gap-4">
            <div className="flex flex-col items-stretch h-full w-full max-w-5xl p-4 bg-white shadow-xl rounded-lg">
                <div className="flex flex-col h-full justify-between gap-4">
                    {/* Product loaded properly */}
                    { !loadingProduct && product && <div>
                        <div className="flex flex-col gap-1 m-1">
                            <h2 className="text-2xl font-bold">{product.name}</h2>
                            <p>{product.description}</p>
                            <div>
                                <p className="text-2xl font-bold font-sans">{"$" + Number(product.price).toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex overflow-hidden w-full h-60 justify-center">
                            { product.image
                                ? <img src={p.image} className="flex-none w-[200px] h-[200px] max-w-none" alt="placeholder"></img>
                                : <img src="https://placehold.co/100" className="flex-none w-[200px] h-[200px] max-w-none" alt="placeholder"></img>
                            }
                        </div>
                    </div> } 
                    { !product && 
                        <div className="flex flex-col h-full justify-center items-center gap-4 m-1">
                            <h1> { loadingProduct ? "Loading Product..." : "Failed to load product" } </h1>
                            { loadingProduct && <LoadingSpinner /> }
                        </div> 
                    }
                </div>
            </div>
            { !loadingProduct && product &&
                <div className="flex flex-col items-stretch w-full max-w-5xl p-4 bg-white shadow-xl rounded-lg">
                    <div className="flex flex-col gap-y-4">
                        <h2 className="font-bold text-2xl"> Reviews </h2>
                        { isAuthenticated && <AddReview productId={productId} addReviewToList={addReviewToList} /> }
                        <Reviews reviews={product.reviews} />
                    </div>
                </div>
            }
        </div>
        
    )
}