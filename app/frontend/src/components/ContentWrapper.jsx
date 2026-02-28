const ContentWrapper = ({ children }) => {
    return <div className="flex flex-col gap-4 bg-primary-light p-4 relative
                            w-full max-w-5xl rounded-2xl shadow-md overflow-y-auto">
        { children }
    </div>
}

export default ContentWrapper