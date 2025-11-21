import banner_image from '../assets/placeholder.jpg';
import product_image from '../assets/product_placeholder.png';

const ProductListing = ({ name, image, description, price }) => {
    return <div className="flex flex-row rounded-sm border-2 border-secondary gap-4 bg-white">
        <div className="flex flex-col font-sans p-2">
            <h2 className="text-2xl font-bold">{name}</h2>
            <p>{description}</p>
            <div>
                <p className="text-2xl font-bold">{price}</p>
            </div>
        </div>
        <img src={image} style={{height: 200, width: 200}} alt="placeholder"></img>
    </div>
}

const Home = () => {
    const products = [
        {
            name: "Product 1",
            image: product_image,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            price: "$0.00"
        },
        {
            name: "Product 2",
            image: product_image,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            price: "$0.00"
        },
        {
            name: "Product 3",
            image: product_image,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            price: "$0.00"
        },
        {
            name: "Product 4",
            image: product_image,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            price: "$0.00"
        }
    ]
    return <div>
        <img style={{height: 300}} src={banner_image} alt="placeholder"></img>
        <div className="flex flex-col gap-4 bg-primary-light mt-8 p-4">
        <h1 className="text-4xl text-center font-bold">Home Page</h1>
        <div className="flex flex-col md:grid gap-4 grid-cols-2">{products.map((product, index) => {
            return <ProductListing name={product.name} image={product.image} description={product.description} price={product.price}/>
        })}</div>
        </div>
        </div>
}

export default Home