import ContentWrapper from "../components/ContentWrapper"

const MemberCard = ({ name, linkedin, description }) => {
    return <div className="flex flex-col rounded-sm border-2 border-secondary gap-4 bg-white font-sans p-2">
        <h2 className="text-2xl text-center font-bold">{name}</h2>
        <a href={`https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {linkedin}
        </a>
        <p>{description}</p>
    </div>
}

const About = () => {
    // Example members
    const members = [
        {
            order: 0,
            name: "Jack Woline",
            linkedin: "linkedin.com/in/jonathan-woline", 
            description: "Director for the research project and leader of the development of this wonderfully secure website!"
        },
        {
            order: 1,
            name: "Theoden Melgar",
            linkedin: "linkedin.com/in/theoden-melgar", 
            description: "Hi! I was the backend lead for this project. Have fun learning about some common web vulnerabilities and do your best to break our site :) "
        },
        {
            order: 2,
            name: "Member3",
            linkedin: "linkedin.com/in/member3", 
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, doloribus!"
        }
    ]

    return <ContentWrapper>
        <div className="flex flex-col items-center align-middle gap-4 p-4">
            <div className="flex flex-col w-full p-4 gap-2 bg-primary">
                <h1 className="text-4xl font-bold text-center text-black p-2">About Us</h1>
                <div className="bg-white font-sans border-2 border-secondary rounded-sm p-1 text-black text-center *:p-2">The “official” website for CPP Farm Store, allowing people to shop online for drive up orders with ease. This website is built using only the highest quality of AI slop, so security is sure to not be an issue!</div>
            </div>
            
            <a href="/" className="bg-primary-light text-2xl p-3 text-white w-max transition hover:scale-110 duration-200 ease-in-out cursor-pointer">Start Shopping!</a>

            <div className="flex flex-col p-4 w-full gap-2 bg-primary">
                <h1 className="w-full text-center text-4xl">Credits</h1>
                <div className="flex flex-col md:grid gap-2 grid-cols-2">{members.map((member, index) => {
                    return <MemberCard key={member.order} name={member.name} linkedin={member.linkedin} description={member.description}/>
                })}</div>
            </div>
        </div>
        </ContentWrapper>
}

export default About