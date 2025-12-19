import { addProduct } from "../api/products.mjs";

const Admin = () => {
    const handleNewProduct = (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData();
        const fileInput = form.image;

        formData.append("file", fileInput.files[0]);
        formData.append("name", form.productname.value);
        formData.append("price", form.productprice.value);
        formData.append("visible", form.productvisibility.checked);

        addProduct(formData);
    }

    return <div className="flex flex-col gap-4 bg-primary-light mt-8 p-4">
        <h1 className="text-4xl font-bold text-center text-black p-2">Admin Dashboard</h1>
        <form onSubmit={handleNewProduct} className="sm:flex sm:flex-col md:grid md:grid-cols-2">
            <fieldset className="flex flex-col gap-2">
                <legend>Add Product</legend>
                <label>Product Name</label>
                <input type="text" id="productname" className="border rounded-sm"></input>
                <label>Product Price</label>
                <input type="text" id="productprice" className="border rounded-sm"></input>
                <div className="flex flex-row gap-2 items-center">
                    <label>Visible</label>
                    <input type="checkbox" id="productvisibility" className="border rounded-sm"></input>
                </div>
                <label>Upload Image</label>
                <input type="file" name="image" accept="image/*" required></input>
                <button className="hover:bg-white rounded-sm border" type="submit">Submit</button>
            </fieldset>
            <fieldset>
                <legend>Manage Products</legend>
            </fieldset>
        </form>
    </div>
}

export default Admin