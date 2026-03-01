const ContentWrapper = ({ children }) => {
    return <div className="page-wrapper">
        <div className="flex flex-col gap-4 bg-bg p-4 relative w-full ml-auto mr-auto max-w-[75%] rounded-2xl shadow-lg overflow-y-auto">
            { children }
        </div>
    </div>
}

export default ContentWrapper