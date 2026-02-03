const ContentWrapper = ({ children }) => {
    return <div className="flex flex-col gap-4 bg-primary-light mt-8 p-4">
        { children }
    </div>
}

export default ContentWrapper