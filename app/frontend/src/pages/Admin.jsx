import { addProduct } from "../api/products.mjs";
import ContentWrapper from "../components/ContentWrapper";

const Admin = () => {
    const handleNewProduct = (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData();
        const fileInput = form.image;

        formData.append("image", fileInput.files[0]);
        formData.append("name", form.name.value);
        formData.append("price", form.price.value);
        formData.append("visible", form.visible[0].checked);
        addProduct(formData);
    }

    return <ContentWrapper>
        <h1 className="text-4xl text-center border-b font-bold text-dark shadow-2xl">Administrator Dashboard</h1>
        <div className="flex flex-col bg-bg rounded-md">
            <div className="flex flex-col flex-1 gap-2 m-2">
                <h1>Manage Items</h1>
                <form className="flex flex-col gap-2 border-2 rounded-md p-2" onSubmit={handleNewProduct}>
                    <input name="name" className="border rounded-md p-1" placeholder="Name"></input>
                    <input name="price" className="border rounded-md p-1" placeholder="Price"></input>
                    <div className="border rounded-md p-1 flex flex-row justify-between">
                        <div className="flex w-full justify-center gap-1">
                            <input name="visible" type="radio" defaultChecked={true}></input>
                            <h1>Visible</h1>
                        </div>
                        <div className="flex w-full justify-center gap-1">
                            <input name="visible" type="radio"></input>
                            <h1>Not Visible</h1>
                        </div>
                    </div>
                    <input name="image" className="border rounded-md p-1" placeholder="Name" type="file"></input>
                    <button className="border rounded-md p-1 hover:bg-primary" id="submit">Create Item</button>
                </form>
            </div>
            <div className="flex flex-col flex-1 gap-2 m-2">
                <h1>Manage Users</h1>
                <div>Get and display users?</div>
            </div>
        </div>
    </ContentWrapper>
}

export default Admin